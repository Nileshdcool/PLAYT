/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */


import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import jwt from "jsonwebtoken";
import { db } from "~/server/db";
import { log } from "~/server/logger";
import { AppError, AuthError, ValidationError } from "~/server/errors";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */


type CreateContextOptions = {
  session: any;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => ({
  db,
  session: opts.session,
});

export async function createTRPCContext(opts: { req: any; res: any }) {
  let session = null;
  const authHeader = opts.req.headers["authorization"] || opts.req.headers["Authorization"];
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      // Use your NextAuth secret here
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");
      // NextAuth JWT payload usually contains user info
      session = { user: decoded };
      console.log("JWT validated, session:", session);
    } catch (err) {
      console.warn("JWT validation failed:", err);
      session = null;
    }
  } else {
    session = await getServerSession(opts.req, opts.res, authOptions);
  }
  return createInnerTRPCContext({ session });
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Log error with structured context
    log('tRPC error', {
      error: error,
      path: shape.message,
      args: error?.stack,
    }, 'error');
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        appError:
          error instanceof AppError ? {
            code: error.code,
            status: error.status,
            details: error.details,
          } : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  // Write log to file for Promtail/Loki
  log(`[TRPC] ${path} took ${end - start}ms to execute`, {
    path,
    type: "query", // or "mutation"/"subscription" if available in this context
    session: undefined, // session is not available here, set to undefined or pass if available
  });

  return result;
});

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * Use this for any query/mutation that should require authentication.
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next, path, type }) => {
      log("[protectedProcedure] Details:", {
      path,
      type,
      session: ctx.session,
    });
    if (!ctx.session || !ctx.session.user) {
      throw new Error("Unauthorized");
    }
    return next({ ctx: { ...ctx, session: ctx.session } });
  });
