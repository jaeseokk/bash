import NextAuth, { DefaultSession, DefaultUser, User } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type UserId = number;

declare module "next-auth/jwt" {
  interface JWT extends Record, DefaultJWT {
    id: UserId;
    phoneNumber?: string;
    avatarFallback?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: UserId;
      phoneNumber?: string;
      avatarFallback?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: UserId;
    phoneNumber?: string;
    username?: string;
    avatarFallback?: string | null;
    needToRegister?: boolean;
  }
}
