'use client';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
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

import { newPassword } from '@/server/actions/new-password';
import FormErrorMessage from '@/components/shared/messages/error';
import { NewPasswordSchema } from '@/types/schemas/auth/new-password';
import FormSuccessMessage from '@/components/shared/messages/success';

const AuthNewPasswordForm = () => {
  const token = useSearchParams().get('token');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const { execute, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data?.data?.error) setError(data?.data?.error);
      if (data?.data?.success) setSuccess(data?.data?.success);
    },
  });

  const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ password: values.password, token });
  };
  return (
    <AuthCard
      cardTitle="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder="******"
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
              {'New Password'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default AuthNewPasswordForm;
