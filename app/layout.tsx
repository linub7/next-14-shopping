import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import CustomNav from '@/components/shared/navigation/nav';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Toaster from '@/components/shared/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopping',
  description: 'Best Shopping App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('px-6 md:px-12 max-w-8xl m-auto', `${inter.className}`)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CustomNav />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
