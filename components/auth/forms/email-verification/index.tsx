'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { newVerification } from '@/server/actions/tokens';
import AuthCard from '../../card';
import FormErrorMessage from '@/components/shared/messages/error';
import FormSuccessMessage from '@/components/shared/messages/success';

type Props = {};

const AuthEmailVerificationForm = (props: Props) => {
  // useSearchParams() => only in client component
  const token = useSearchParams().get('token');
  const router = useRouter();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  console.log({ error, success });

  useEffect(() => {
    handleVerification();

    return () => {};
  }, []);

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('error not found');
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data?.error) {
          setError(data?.error);
        }
        if (data?.success) {
          setSuccess(data?.success);
          router.push('/auth/login');
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <AuthCard
      cardTitle="Verify Your account"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex flex-col justify-center items-center">
        <p>{!success && !error ? 'Verifying email...' : null}</p>
        <FormSuccessMessage message={success} />
        <FormErrorMessage message={error} />
      </div>
    </AuthCard>
  );
};

export default AuthEmailVerificationForm;
