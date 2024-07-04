'use client';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

type Props = {};

const AuthSocials = (props: Props) => {
  const handleSignin = (strategy: string) =>
    signIn(strategy, { redirect: false, callbackUrl: '/' });
  return (
    <div>
      <Button onClick={() => handleSignin('google')}>
        Sign in with Google
      </Button>
      <Button onClick={() => handleSignin('github')}>
        Sign in with Github
      </Button>
    </div>
  );
};

export default AuthSocials;
