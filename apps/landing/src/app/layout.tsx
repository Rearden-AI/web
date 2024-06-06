import type { Metadata } from 'next';
import { inter } from '@rearden/ui/lib/fonts';
import { cn } from '@rearden/ui/lib/utils';
import '@rearden/ui/styles/globals.css';

export const metadata: Metadata = {
  title: 'Rearden - Web3 Copilot',
  description: 'Rearden - Web3 Copilot',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={cn(inter.variable)}>
        <div className='flex w-full '>{children}</div>
      </body>
    </html>
  );
}
