import NextAuth, { DefaultSession } from "next-auth";

// Extend the default session type to include token
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token?: string;
    } & DefaultSession["user"];
    token?: string;
  }
}
