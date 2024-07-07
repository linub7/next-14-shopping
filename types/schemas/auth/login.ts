import * as z from 'zod';

import { AUTH_PASSWORD_LENGTH } from '@/constants';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid Email address',
  }),
  password: z.string().min(AUTH_PASSWORD_LENGTH, {
    message: `Password is required and at least ${AUTH_PASSWORD_LENGTH} characters`,
  }),
  code: z.optional(z.string()),
});
