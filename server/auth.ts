import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

import { db } from '@/server';
import {
  AUTH_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '@/utils/env';
import { LoginSchema } from '@/types/schemas/login';
import { users } from './schema';

dotenv.config({
  path: '.env.local',
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: AUTH_SECRET!,
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
