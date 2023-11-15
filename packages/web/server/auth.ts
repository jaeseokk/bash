import { getServerSession as _getServerSession } from "next-auth";

const authOptions: Parameters<typeof _getServerSession>[0] = {
  callbacks: {
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
  },
};

export const getServerSession = () => {
  return _getServerSession(authOptions);
};
