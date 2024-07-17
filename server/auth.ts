import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';

import { db } from '@/server';
import {
  AUTH_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  STRIPE_SECRET,
} from '@/utils/env';
import { LoginSchema } from '@/types/schemas/auth/login';
import { accounts, users } from './schema';

dotenv.config({
  path: '.env.local',
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: AUTH_SECRET!,
  session: { strategy: 'jwt' },
  events: {
    createUser: async ({ user }) => {
      console.log('events create user');
      const stripe = new Stripe(STRIPE_SECRET!, {
        apiVersion: '2024-04-10',
      });
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });
      console.log({ customer });
      await db
        .update(users)
        .set({
          customerID: customer.id,
        })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) session.user.id = token.sub;
      if (session.user && token.role) session.user.role = token.role as string;
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;

      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      return token;
    },
  },
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const {
            data: { email, password },
          } = validatedFields;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          if (!user || !user.password) return null;

          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatch) return user;
        }
        return null;
      },
    }),
  ],
});
