import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid Email address',
  }),
  password: z.string().min(6, {
    message: 'Password is required and at least 6 characters',
  }),
  code: z.optional(z.string()),
});
