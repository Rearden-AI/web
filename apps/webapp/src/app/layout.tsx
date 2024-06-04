import { inter } from '@rearden/ui/lib/fonts';
import { cn } from '@rearden/ui/lib/utils';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { ChatInput } from '../components/chat-input';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';
import '@rearden/ui/styles/globals.css';
import { authOptions } from '../lib/auth';

export const metadata: Metadata = {
  title: 'Rearden - Web3 Copilot',
  description: 'Rearden - Web3 Copilot',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={cn(inter.variable)}>
        <Providers session={session}>
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
        </Providers>
      </body>
    </html>
  );
}
