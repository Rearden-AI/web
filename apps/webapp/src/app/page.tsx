'use client';

import { Icons } from '@rearden/ui/components/icons';

export default function Home() {
  return (
    <div
      id='messages'
      className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch mb-[50px]  flex flex-1 flex-col-reverse gap-4 overflow-y-auto'
    >
      <div className='mx-auto flex w-full flex-col items-center gap-4'>
        <div className='rounded-[20px] bg-image-gradient-222deg p-[3px]'>
          <div className='flex justify-between rounded-[20px] bg-card p-6'>
            <Icons.logo className='size-[64px]' />
          </div>
        </div>
        <p className='mt-6 w-fit bg-primary-gradient bg-clip-text text-[38px] font-extrabold leading-none text-transparent'>
          Hello <span className='text-[38px] font-extrabold leading-none'>👋</span>
        </p>
        <h2>How can I help you today?</h2>
        <div className='mt-11 grid w-full grid-cols-2 gap-5'>
          {[
            'Simple strategies',
            'Dive into tech research',
            'Analyse your portfolio',
            'Find new project',
          ].map((i, index) => (
            <div
              key={index}
              className='flex w-full items-center gap-2 rounded-[18px] border border-border-third bg-card px-6 py-5'
            >
              <p className='text-[26px] font-extrabold leading-none'>👉</p>
              <p className='text-lg font-medium leading-[26px]'>{i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
