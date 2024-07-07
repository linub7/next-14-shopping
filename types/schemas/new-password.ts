import * as z from 'zod';

import { AUTH_PASSWORD_LENGTH } from '@/constants';

export const NewPasswordSchema = z.object({
  password: z.string().min(AUTH_PASSWORD_LENGTH, {
    message: `Password is required and at least ${AUTH_PASSWORD_LENGTH} characters`,
  }),
  token: z.string().nullable().optional(),
});
