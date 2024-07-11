'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';

type Props = {
  links: { label: string; path: string; icon: JSX.Element }[];
};

const DashboardsNav = (props: Props) => {
  const { links } = props;
  const pathname = usePathname();

  return (
    <nav className="py-2 overflow-auto mb-4">
      <ul className="flex items-center gap-6 text-xs font-semibold ">
        <AnimatePresence>
          {links?.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link?.label}>
              <Link
                className={cn(
                  'flex flex-col gap-1 items-center relative',
                  pathname === link?.path ? 'text-primary' : ''
                )}
                href={link?.path}
              >
                {link?.icon}
                {link?.label}
                {pathname === link?.path && (
                  <motion.div
                    className="h-[2px] w-full rounded-full bg-primary absolute z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 35 }}
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
};

export default DashboardsNav;
