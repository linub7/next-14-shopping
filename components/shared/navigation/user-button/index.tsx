'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

const NavUserButton = ({ user }: Session) => {
  const handleSignout = () => signOut();
  return (
    <div>
      <h1>{user?.email}</h1>
      <button onClick={handleSignout}>Signout</button>
    </div>
  );
};

export default NavUserButton;
