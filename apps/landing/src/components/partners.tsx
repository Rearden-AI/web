//FFF to text-muted-foreground

import { cn } from '@rearden/ui/lib/utils';
import Image from 'next/image';

const partners = [
	{
    name: 'Nvidia',
    logoUri: '/nvidia.svg',
  },
  {
    name: 'Chainlink',
    logoUri: '/chainlink.png',
  },
  {
    name: 'Wormhole',
    logoUri: '/wormhole.png',
  },

];

export const Partners = () => {
  return (
    <div className='mt-[280px] flex flex-col w-full items-center gap-[52px] px-20'>
      <p className='text-5xl leading-[60px] font-medium text-center'>Our Partners</p>
      <div className='flex flex-col items-center w-full'>
        <div className='h-[2px] bg-border w-[calc(100%-110px)]' />
        <div className='flex justify-between w-full'>
          {partners.map((i, index, array) => (
            <div
              key={i.name}
              className={cn(
                'flex flex-col gap-4',
                index !== 0 && 'items-center',
                index === array.length - 1 && 'items-end',
              )}
            >
              <div
                className={cn(
                  'flex flex-col gap-0 items-center',
                  index === 0 && 'ml-[30px]',
                  index === array.length - 1 && 'mr-[50px]',
                )}
              >
                <div className={cn('w-[2px] h-[70px] bg-border')} />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='10'
                  height='10'
                  viewBox='0 0 10 10'
                  fill='none'
                >
                  <circle cx='5' cy='5' r='5' fill='url(#paint0_linear_656_1372)' />
                  <defs>
                    <linearGradient
                      id='paint0_linear_656_1372'
                      x1='-0.785441'
                      y1='10'
                      x2='36.2894'
                      y2='17.2906'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#FF7B21' />
                      <stop offset='0.907261' stopColor='#F24ECE' stopOpacity='0.6' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className='flex flex-col items-center gap-3'>
                <Image src={i.logoUri} alt='' width={40} height={40} />
                <p className='text-[30px] leading-[30px] font-normal text-muted-foreground'>
                  {i.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
