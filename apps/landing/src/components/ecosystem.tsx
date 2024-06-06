import Image from 'next/image';

export const Ecosystem = () => {
  return (
    <div className='mt-[230px] flex w-full flex-col items-center gap-20'>
      <div className='flex w-full items-center justify-center'>
        <div className='w-[45%]'>
          {/* TODO add icon under first letter */}
          <div className='relative text-center text-[44px] font-medium leading-[52px]'>
            Rearden Ecosystem — The Endgame of Environment
          </div>
        </div>
      </div>
      <Image src='/ecosystem.png' width={1357} height={1271} alt='' />
    </div>
  );
};
