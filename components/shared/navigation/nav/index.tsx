import Link from 'next/link';
import { LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { auth } from '@/server/auth';
import NavUserButton from '../user-button';
import NavLogo from '../logo';
import CartDrawer from '../../cart/drawer';

type Props = {};

const CustomNav = async (props: Props) => {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href={'/'} aria-label="Shopping">
              <NavLogo />
            </Link>
          </li>
          <li className="relative flex items-center hover:text-primary transition-all duration-300 ease-in-out cursor-pointer">
            <CartDrawer />
          </li>
          <li className="flex items-center justify-center">
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
