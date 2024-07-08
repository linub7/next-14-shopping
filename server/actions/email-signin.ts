'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { AuthError } from 'next-auth';

import { LoginSchema } from '@/types/schemas/auth/login';
import { db } from '..';
import { twoFactorTokens, users } from '../schema';
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from './tokens';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from './email';
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
      // 2FA
      if (existingUser?.twoFactorEnabled && existingUser?.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser?.email
          );
          if (!twoFactorToken) return { error: 'Invalid Token' };
          if (twoFactorToken.token !== code) return { error: 'Invalid Token' };
          const isExpired = new Date(twoFactorToken.expires) < new Date();
          if (isExpired) return { error: 'Token is expired' };

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));

          // const existingConfirmation = await getTwoFactorTokenByEmail(
          //   existingUser?.email
          // );
          // if (existingConfirmation) {
          //   await db
          //     .delete(twoFactorTokens)
          //     .where(eq(twoFactorTokens.email, existingUser.email));
          // }
        } else {
          // generate twoFactorToken
          const newTwoFactorToken = await generateTwoFactorToken(
            existingUser?.email
          );
          if (!newTwoFactorToken)
            return { error: 'OOPS! Token not generated, try again later' };
          await sendTwoFactorTokenEmail(
            newTwoFactorToken[0].email,
            newTwoFactorToken[0].token
          );
          return { twoFactor: 'Two Factor Token sent.' };
        }
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
