import Link from 'next/link';
import { LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { auth } from '@/server/auth';
import NavUserButton from '../user-button';

type Props = {};

const CustomNav = async (props: Props) => {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between">
          <li>logo</li>
          <li>
            {!session ? (
              <Button asChild>
                <Link className="flex gap-2" href={'/auth/login'}>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            ) : (
              <NavUserButton user={session?.user} expires={session?.expires} />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default CustomNav;
