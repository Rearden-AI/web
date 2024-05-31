import type { Metadata } from 'next';
import { inter } from '@rearden/ui/lib/fonts';
import { cn } from '@rearden/ui/lib/utils';
import { ChatInput } from '../components/chat-input';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { Providers } from './providers';
import '@rearden/ui/styles/globals.css';

export const metadata: Metadata = {
  title: 'Rearden - Web3 Copilot',
  description: 'Rearden - Web3 Copilot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body className={cn(inter.variable)}>
          <div className='flex h-screen w-full flex-col gap-4 px-6 py-4'>
            <Header />
            <div className='flex flex-1'>
              <Sidebar />
              <div className='mx-auto flex max-w-[933px] flex-1 flex-col justify-between px-0'>
                <div className='flex max-h-[calc(100vh-170px)] flex-1'>{children}</div>
                <ChatInput />
              </div>
            </div>
          </div>
        </body>
      </html>
    </Providers>
  );
}
