'use client';

import { useTheme } from 'next-themes';
import { Toaster as Toasty } from 'sonner';

const Toaster = () => {
  const { theme } = useTheme();
  if (typeof theme === 'string')
    return (
      <Toasty
        richColors
        theme={theme as 'light' | 'dark' | 'system' | undefined}
      />
    );
};

export default Toaster;
