'use client';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { IoLogoGithub } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

type Props = {};

const AuthSocials = (props: Props) => {
  const handleSignin = (strategy: string) =>
    signIn(strategy, { redirect: false, callbackUrl: '/' });
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button
        variant={'outline'}
        className="flex items-center gap-4 w-full"
        onClick={() => handleSignin('google')}
      >
        <p>Sign in with Google</p>
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button
        variant={'outline'}
        className="flex items-center gap-4 w-full"
        onClick={() => handleSignin('github')}
      >
        <p>Sign in with Github</p>
        <IoLogoGithub className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default AuthSocials;
