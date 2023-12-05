import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrismaClientDbMain } from "@/server/prisma";
import { Redis } from "@upstash/redis";

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
          return null;
        }

        if (credentials.username) {
          const newUser = await prisma.user.upsert({
            where: {
              phoneNumber: credentials.phoneNumber,
            },
            update: {
              username: credentials.username,
            },
            create: {
              phoneNumber: credentials.phoneNumber,
              username: credentials.username,
            },
          });

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
        };
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser, trigger }) {
      console.log(user);
      if (user) {
        // @ts-ignore
        token.id = user.id;
        token.name = user.username;
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
