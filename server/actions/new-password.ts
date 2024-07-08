'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import { db } from '..';
import { passwordResetTokens, users } from '../schema';
import { getPasswordResetTokenByToken } from './tokens';
import { BCRYPT_SALT_ROUND } from '@/constants';
import { POSTGRES_URL } from '@/utils/env';
import { NewPasswordSchema } from '@/types/schemas/auth/new-password';

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    // because of using transaction -> we have to use Pool
    const pool = new Pool({ connectionString: POSTGRES_URL });
    const dbPool = drizzle(pool);
    try {
      // check exist token
      if (!token) return { error: 'Missing Token' };

      // check token validity
      const existingToken = await getPasswordResetTokenByToken(token);
      if (!existingToken) return { error: 'Token not found' };
      const isExpired = new Date(existingToken?.expires) < new Date();
      if (isExpired) return { error: 'Token is expired' };

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email),
      });
      if (!existingUser) return { error: 'Invalid credentials' };
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUND);

      // HTTP has not transactions -> use dbPool
      await dbPool.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            password: hashedPassword,
          })
          .where(eq(users.id, existingUser.id));

        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, existingToken.id));
      });
      return { success: 'Password updated' };
    } catch (error) {
      console.log({ error });

      throw error;
    }
  });
