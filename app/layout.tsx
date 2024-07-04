import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import CustomNav from '@/components/shared/navigation/nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomNav />
        {children}
      </body>
    </html>
  );
}
