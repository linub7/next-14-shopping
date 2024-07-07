import * as z from 'zod';

import { AUTH_NAME_LENGTH, AUTH_PASSWORD_LENGTH } from '@/constants';

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Invalid Email address',
  }),
  password: z.string().min(AUTH_PASSWORD_LENGTH, {
    message: `Password is required and at least ${AUTH_PASSWORD_LENGTH} characters`,
  }),
  name: z.string().min(AUTH_NAME_LENGTH, {
    message: `Name is required and at least ${AUTH_NAME_LENGTH} characters`,
  }),
});
