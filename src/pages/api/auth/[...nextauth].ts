import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Zod schema for credentials
        const CredentialsSchema = z.object({
          username: z.string().min(1),
          password: z.string().min(1)
        });
        const parseResult = CredentialsSchema.safeParse(credentials);
        if (!parseResult.success) {
          return null;
        }
        const { username, password } = parseResult.data;
        // Replace this with your own user lookup logic
        if (username === "admin" && password === "password") {
          // Zod schema for user object
          const UserSchema = z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email()
          });
          const user = { id: "1", name: "Admin", email: "admin@example.com" };
          const userParse = UserSchema.safeParse(user);
          if (userParse.success) {
            return userParse.data;
          }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Sign and attach the raw JWT string
        token.accessToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email
          },
          process.env.NEXTAUTH_SECRET || ""
        );
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      // Expose the raw JWT string for API usage
      session.accessToken = token.accessToken;
      return session;
    }
  }
};

export default NextAuth(authOptions);
