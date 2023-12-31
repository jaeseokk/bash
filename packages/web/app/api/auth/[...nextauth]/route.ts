import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrismaClientDbMain } from "@/server/prisma";
import { Redis } from "@upstash/redis";
import { sendSlackMessage } from "@/server/message";
import { isDeployProd } from "@/utils";
import { createUser } from "@/server/users";

const prisma = getPrismaClientDbMain();
const oneDayInSeconds = 86400;

const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_URL}`,
  token: `${process.env.UPSTASH_REDIS_TOKEN}`,
});

const handler = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        code: { label: "Code", type: "text" },
        username: { label: "Node", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.phoneNumber || !credentials.code) {
          return null;
        }

        const code = await redis.get<string>(credentials.phoneNumber);

        if (!code || `${code}` !== credentials.code) {
          throw new Error("invalid code");
        }

        if (credentials.username) {
          const newUser = await createUser({
            phoneNumber: credentials.phoneNumber,
            username: credentials.username,
          });

          if (
            newUser.createdAt.getTime() === newUser.updatedAt.getTime() &&
            isDeployProd
          ) {
            sendSlackMessage(
              "신규 사용자",
              `전화번호: ${newUser.phoneNumber}\n이름: ${newUser.username}`,
            );
          }

          return newUser;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            phoneNumber: credentials.phoneNumber,
          },
        });

        if (!existingUser) {
          return {
            id: -1,
            needToRegister: true,
          };
        }

        return existingUser;
      },
    }),
  ],

  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: oneDayInSeconds * 30,
    updateAge: oneDayInSeconds, // 24 hours
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve(url.startsWith(baseUrl) ? url : baseUrl);
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (!user) {
        return false;
      }

      if (user?.needToRegister) {
        throw new Error("need to register");
      }

      return true;
    },
    async session({ session, token, user }) {
      if (user !== null) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          phoneNumber: token.phoneNumber,
          avatarFallback: token.avatarFallback,
        };
      }
      return session;
    },
    async jwt({ session, token, user, account, profile, isNewUser, trigger }) {
      if (trigger === "update" && session?.avatarFallback) {
        token.avatarFallback = session.avatarFallback;
      }

      if (user) {
        // @ts-ignore
        token.id = user.id;
        token.name = user.username;
        token.phoneNumber = user.phoneNumber;
        token.avatarFallback = user.avatarFallback;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    /*
     signOut: '/auth/signout',
     error: '/auth/error', // Error code passed in query string as ?error=
     verifyRequest: '/auth/verify-request', // (used for check email message)
     newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
    */
  },
});

export { handler as GET, handler as POST };
