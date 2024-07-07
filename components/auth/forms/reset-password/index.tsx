'use client';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import AuthCard from '../../card';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { ResetPasswordSchema } from '@/types/schemas/auth/reset-password';
import { resetPassword } from '@/server/actions/reset-password';
import FormErrorMessage from '@/components/shared/messages/error';
import FormSuccessMessage from '@/components/shared/messages/success';

const AuthResetPasswordForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { execute, status } = useAction(resetPassword, {
    onSuccess(data) {
      if (data?.data?.error) setError(data?.data?.error);
      if (data?.data?.success) setSuccess(data?.data?.success);
    },
  });

  const handleSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="johndoe@gmail.com"
                        disabled={status === 'executing'}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccessMessage message={success} />
              <FormErrorMessage message={error} />
            </>
            <Button
              type="submit"
              className={cn(
                'w-full my-2',
                status === 'executing' ? 'animate-pulse' : ''
              )}
            >
              {'Send Token'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default AuthResetPasswordForm;
