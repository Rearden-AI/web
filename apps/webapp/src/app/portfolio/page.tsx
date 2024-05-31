'use client';

import { AccountBalance } from './account-balance';

export default function Portfolio() {
  return (
    <div
      id='messages'
      className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-1 flex-col gap-4 overflow-y-auto py-3 '
    >
      <div className='mx-auto flex w-full max-w-[1108px] flex-col gap-[90px]'>
        <AccountBalance />
      </div>
    </div>
  );
}
