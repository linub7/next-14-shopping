'use client';

import AuthCard from '../../card';

type Props = {};

const AuthLoginForm = (props: Props) => {
  return (
    <AuthCard
      cardTitle="Nice to see you again"
      backButtonHref="/auth/register"
      backButtonLabel="Do not have an account?"
      showSocials={true}
    >
      <div>
        <h1>hey</h1>
      </div>
    </AuthCard>
  );
};

export default AuthLoginForm;
