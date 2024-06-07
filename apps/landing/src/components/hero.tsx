import { Icons } from '@rearden/ui/components/icons';
import { Button, buttonVariants } from '@rearden/ui/components/ui/button';
import { cn } from '@rearden/ui/lib/utils';
import Image from 'next/image';
import { X_LINK } from '../utils/constants';

const cards = [
  {
    label: 'Market ideas & Insights',
    iconUri: '/leadership.png',
  },
  {
    label: 'Investment strategy research',
    iconUri: '/improvement.png',
  },
  {
    label: 'Risks evaluation',
    iconUri: '/innovation.png',
  },
  {
    label: 'ROI',
    iconUri: '/settlement.png',
  },
];

export const Hero = () => {
  return (
    <div className='relative flex flex-col px-12 pt-[42px]'>
      <div className='mb-[138px] flex items-center gap-2'>
        <div>
          <Icons.logo className='size-[22px]' />
        </div>
        <p className='text-2xl font-bold leading-[34px]'>Rearden</p>
      </div>
      <div className='mb-10 flex justify-center'>
        <Icons.landing_hero />
      </div>
      <div className='mb-[60px] flex flex-col items-center gap-3'>
        <p className='text-[40px] font-medium leading-[44px] text-muted-foreground'>Web3 Copilot</p>
        <p className='text-2xl font-medium leading-[30px]'>Power Up Your Investment strategies</p>
        <div className='mt-7 flex items-center gap-5'>
          <a
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
              'w-[208px]',
            )}
            href={X_LINK}
            target='_blank'
            rel='noopener noreferrer'
          >
            Read more
          </a>
          <Button className='w-[208px]'>Join waitlist</Button>
        </div>
      </div>
      <div className='mb-[120px] flex justify-center'>
        <Image src='/hero.webp' alt='' width={962} height={601} />
      </div>
      <div className='flex justify-between'>
        {cards.map(i => (
          <div key={i.label} className='flex items-center gap-6'>
            <div className='rounded-full border border-border p-4'>
              <Image src={i.iconUri} width={32} height={31} alt='' />
            </div>
            <p className='text-xl font-medium leading-[24px]'>{i.label}</p>
          </div>
        ))}
      </div>
      <div className='absolute left-[-303px] top-[-167px] -z-10 size-[458px] rounded-[458px] bg-orange blur-[345px]' />
      <div className='absolute left-[-183px] top-[773px] -z-10 size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px]' />
      <div className='absolute right-8 top-[-57px] -z-10 size-[458px] rounded-[458px] bg-orange blur-[345px]' />
      <div className='absolute right-[433px] top-[726px] -z-10 size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px]' />
    </div>
  );
};
