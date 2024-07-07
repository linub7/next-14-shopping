'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

import { DashboardSettingsSchema } from '@/types/schemas/dashboard/settings';
import { auth } from '../auth';
import { db } from '..';
import { users } from '../schema';
import { BCRYPT_SALT_ROUND } from '@/constants';

const actionClient = createSafeActionClient();

export const updateSettings = actionClient
  .schema(DashboardSettingsSchema)
  .action(async ({ parsedInput: values }) => {
    const sessionUser = await auth();
    if (!sessionUser) return { error: 'user not found' };

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, sessionUser.user.id),
    });
    if (!dbUser) return { error: 'User not found' };

    // sessionUser.user.isOAuth -> user signed up with a provider like google or github end etc
    if (sessionUser.user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.password && values.newPassword && dbUser.password) {
      const isPasswordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );
      if (!isPasswordMatch) return { error: 'Invalid Credentials' };

      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      );
      if (samePassword) return { error: 'Enter different password' };

      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        BCRYPT_SALT_ROUND
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
    await db
      .update(users)
      .set({
        name: values.name,
        password: values.password,
        twoFactorEnabled: values.isTwoFactorEnabled,
        email: values.email,
        image: values.image,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath('/dashboard/settings');
    return { success: 'Settings updated' };
  });
