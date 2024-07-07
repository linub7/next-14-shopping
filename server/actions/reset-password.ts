'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

import { db } from '..';
import { passwordResetTokens, users } from '../schema';
import {
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
} from './tokens';
import { BCRYPT_SALT_ROUND } from '@/constants';
import { ResetPasswordSchema } from '@/types/schemas/reset-password';
import { sendPasswordResetEmail } from './email';

const actionClient = createSafeActionClient();

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existingUser) return { error: 'User not found' };

      const passwordResetToken = await generatePasswordResetToken(
        existingUser.email
      );
      if (!passwordResetToken) return { error: 'Token not generated' };
      await sendPasswordResetEmail(
        passwordResetToken[0]?.email,
        passwordResetToken[0]?.token
      );
      return { success: 'Reset Email sent' };
    } catch (error) {
      console.log({ error });

      throw error;
    }
  });
