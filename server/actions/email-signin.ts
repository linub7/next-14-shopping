'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { AuthError } from 'next-auth';

import { LoginSchema } from '@/types/schemas/auth/login';
import { db } from '..';
import { users } from '../schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';
import { signIn } from '@/server/auth';

const actionClient = createSafeActionClient();

export const emailSignin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existingUser) return { error: 'invalid credentials' };
      if (existingUser?.email !== email) return { error: 'Email not found' };

      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser?.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: 'Confirmation email sent' };
      }
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      });
      return { success: 'User signed in.' };
    } catch (error) {
      console.log({ error });
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Invalid Credentials' };
          case 'AccessDenied':
            return { error: error?.message };
          case 'OAuthSignInError':
            return { error: error?.message };

          default:
            return { error: 'Something went wrong!' };
        }
      }
      throw error;
    }
  });
