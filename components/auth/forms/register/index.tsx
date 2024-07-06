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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RegisterSchema } from '@/types/schemas/register';
import { emailSignup } from '@/server/actions/email-signup';
import AuthFormSuccessMessage from '../../messages/success';
import AuthFormErrorMessage from '../../messages/error';

type Props = {};

const AuthRegisterForm = (props: Props) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const { execute, status } = useAction(emailSignup, {
    onSuccess(data) {
      if (data?.data?.error) setError(data?.data?.error);
      if (data?.data?.success) setSuccess(data?.data?.success);
    },
  });

  const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      cardTitle="Create an account 🎉"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      showSocials={true}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="John Doe" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AuthFormSuccessMessage message={success} />
              <AuthFormErrorMessage message={error} />
              {/* <Button size={'sm'} variant={'link'} asChild>
                <Link href={'/auth/reset'}>Forgot your password?</Link>
              </Button> */}
            </>
            <Button
              type="submit"
              className={cn(
                'w-full my-2',
                status === 'executing' ? 'animate-pulse' : ''
              )}
            >
              {'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default AuthRegisterForm;
