import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [GitHub],
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile.picture
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.id) {
        session.user.id = String(token.id)
        await checkOrCreateUser(session.user.id)
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})

async function checkOrCreateUser(userId: string) {
  try {
    // First, try to find the user
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If the user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Failed to check or create user:", error);
  }
}
