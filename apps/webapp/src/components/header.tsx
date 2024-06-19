'use client';

import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { Icons } from '@rearden/ui/components/icons';
import Link from 'next/link';
import { PagePath } from '../constants/nav-routes';
import { CustomConnectButton } from './custom-connect-button';

export const Header = () => {
  return (
    <BorderWrapper className='px-5 py-4'>
      <Link href={PagePath.INDEX} className='flex items-center gap-2'>
        <div className='rounded-[7px] bg-image-gradient-222deg p-px'>
          <div className='flex justify-between rounded-[7px] bg-card p-2'>
            <Icons.logo />
          </div>
        </div>
        <h2>Rearden</h2>
      </Link>
      <div className='flex items-center gap-10'>
        <CustomConnectButton />
      </div>
    </BorderWrapper>
  );
};
