import NextAuth from 'next-auth';
import type { NextAuthResult } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@ai-bos/database';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

/**
 * NextAuth.js v5 configuration.
 * Uses Prisma adapter for session/account persistence.
 *
 * Providers:
 *  - GitHub OAuth
 *  - Google OAuth
 *  - Credentials (email/password — for development)
 *
 * Add AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET,
 * AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET to your .env
 */
const nextAuth: NextAuthResult = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // In production, validate against hashed passwords.
        // For now, allow any email for development.
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (user) return user;

        // Auto-create user in development
        if (process.env.NODE_ENV === 'development') {
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: (credentials.email as string).split('@')[0],
            },
          });
          return newUser;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
// Explicit type annotation to fix TS2742 in pnpm monorepos
export const signIn: (
  provider?: string,
  options?: any,
  authorizationParams?: any
) => Promise<any> = nextAuth.signIn;
export const signOut = nextAuth.signOut;
