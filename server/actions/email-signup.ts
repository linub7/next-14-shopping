'use server';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';

import { db } from '..';
import { users } from '../schema';
import { RegisterSchema } from '@/types/schemas/register';
import { BCRYPT_SALT_ROUND } from '@/constants';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';

const actionClient = createSafeActionClient();

export const emailSignup = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: 'Email confirmation resent' };
      }
      return { error: 'Email already in use' };
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUND);

    // registration
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: 'Confirmation email sent' };
  });
