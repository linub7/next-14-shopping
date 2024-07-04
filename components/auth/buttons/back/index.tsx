'use client';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type Props = {
  href: string;
  label: string;
};

const AuthBackButton = (props: Props) => {
  const { href, label } = props;
  return (
    <Button className="font-medium w-full" variant={'link'} asChild>
      <Link href={href} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
};

export default AuthBackButton;
