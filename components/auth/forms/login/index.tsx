'use client';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
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
import { LoginSchema } from '@/types/schemas/auth/login';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { emailSignin } from '@/server/actions/email-signin';
import { cn } from '@/lib/utils';
import FormErrorMessage from '@/components/shared/messages/error';
import FormSuccessMessage from '@/components/shared/messages/success';

type Props = {};

const AuthLoginForm = (props: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute, status } = useAction(emailSignin, {
    onSuccess(data) {
      if (data?.data?.error) setError(data?.data?.error);
      if (data?.data?.success) {
        setSuccess(data?.data.success);
      }
    },
  });

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="Nice to see you again"
      backButtonHref="/auth/register"
      backButtonLabel="Do not have an account?"
      showSocials={true}
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
              <Button size={'sm'} variant={'link'} asChild>
                <Link href={'/auth/reset'}>Forgot your password?</Link>
              </Button>
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
              {'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default AuthLoginForm;
