import NextAuth, { DefaultSession, DefaultUser, User } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type UserId = number;

declare module "next-auth/jwt" {
  interface JWT extends Record, DefaultJWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: UserId;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: UserId;
    username?: string;
    needToRegister?: boolean;
  }
}
