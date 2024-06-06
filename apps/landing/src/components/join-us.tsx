'use client';

import { Icons } from '@rearden/ui/components/icons';
import { InputElement } from '@rearden/ui/components/input';
import { Button } from '@rearden/ui/components/ui/button';

export const JoinUs = () => {
  return (
    <div className='relative mb-[160px] mt-[480px] flex items-center justify-center'>
      <div className='flex w-full max-w-[1348px] items-center justify-between rounded-[20px] border border-border bg-background px-10 py-[75px]'>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
          className='flex w-full max-w-[782px] flex-col gap-8'
        >
          <p className='mb-2 text-[32px] font-medium leading-10 text-muted-foreground'>
            Connect your wallet and leave email
          </p>
          <InputElement className='w-full' placeholder='Email' />
          <Button className='w-[208px] self-end' type='button'>
            Join waitlist
          </Button>
        </form>
        <div className='flex items-center gap-6'>
          <div>
            <Icons.waiting_list />
          </div>
          <div className='flex flex-col justify-between gap-2'>
            <p className='text-base font-normal leading-5'>waiting line</p>
            <p className='text-2xl font-semibold leading-[30px]'>27,000</p>
          </div>
        </div>
      </div>
      <div className='absolute bottom-[-83px] left-[-120px] -z-10 size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px]' />
      <div className='absolute bottom-[348px] right-[-230px] -z-10 size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px]' />
    </div>
  );
};
