import Image from 'next/image';

export const Ecosystem = () => {
  return (
    <div className='mt-[230px] flex flex-col w-full items-center gap-20'>
      <div className='w-full flex items-center justify-center'>
        <div className='w-[45%]'>
          {/* TODO add icon under first letter */}
          <div className='text-[44px] relative leading-[52px] font-medium text-center'>
            Rearden Ecosystem — The Endgame of Environment
          </div>
        </div>
      </div>
      <Image src='/ecosystem.png' width={1357} height={1271} alt='' />
    </div>
  );
};
