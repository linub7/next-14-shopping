import * as z from 'zod';

import { AUTH_PASSWORD_LENGTH } from '@/constants';

export const DashboardSettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(
      z.string().email({
        message: 'Invalid Email address',
      })
    ),
    password: z.optional(
      z.string().min(AUTH_PASSWORD_LENGTH, {
        message: `Password is required and at least ${AUTH_PASSWORD_LENGTH} characters`,
      })
    ),
    newPassword: z.optional(
      z.string().min(AUTH_PASSWORD_LENGTH, {
        message: `New password is required and at least ${AUTH_PASSWORD_LENGTH} characters`,
      })
    ),
  })
  .refine(
    (data) => {
      if (data?.password && !data?.newPassword) return false;
      return true;
    }, // this will throw an error if new password is left empty
    { message: 'New Password is required', path: ['newPassword'] }
  );
