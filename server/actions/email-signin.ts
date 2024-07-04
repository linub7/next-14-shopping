'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';

import { LoginSchema } from '@/types/schemas/login';
import { db } from '..';
import { users } from '../schema';

const actionClient = createSafeActionClient();

export const emailSignin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser?.email !== email) {
      return { error: 'Email not found' };
    }
    //   if (!existingUser?.emailVerified) {
    //     return {error: ''}
    //   }
    return { success: email };
  });
