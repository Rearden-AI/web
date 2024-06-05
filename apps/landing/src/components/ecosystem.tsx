import Image from 'next/image';

//FFF to text-muted-foreground
export const Ecosystem = () => {
  return (
    <div className='mt-[230px] flex flex-col w-full items-center gap-20'>
      <div className='w-full flex items-center justify-center'>
        <div className='w-[45%]'>
          <div className='text-[44px] relative leading-[52px] font-medium text-center before:absolute before:top-[-30px]  before:left-[0px] before:content-[""] before:bg-[url("/star.svg")] before:bg-[length:68px_80px] before:h-[68px] before:w-20 before:z-[-10]'>
            Rearden Ecosystem — The Endgame of Environment
          </div>
        </div>
      </div>
      <Image src='/ecosystem.png' width={1357} height={1271} alt='' />
    </div>
  );
};
