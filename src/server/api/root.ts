
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { gameRouter } from "./routers/game";

export const appRouter = createTRPCRouter({
  game: gameRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
