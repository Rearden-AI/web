import { Icons } from '@rearden/ui/components/icons';
import { Button } from '@rearden/ui/components/ui/button';
import Image from 'next/image';

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
    <div className='pt-[42px] px-12 flex flex-col relative'>
      <div className='flex items-center gap-2 mb-[138px]'>
        <div>
          <Icons.logo className='size-[22px]' />
        </div>
        <p className='text-2xl font-bold leading-[34px]'>Rearden</p>
      </div>
      <div className='flex justify-center mb-10'>
        <Icons.landing_hero />
      </div>
      <div className='flex flex-col items-center gap-3 mb-[60px]'>
        <p className='text-[40px] leading-[44px] font-medium text-muted-foreground'>Web3 Copilot</p>
        <p className='text-2xl leading-[30px] font-medium'>Power Up Your Investment strategies</p>
        <div className='flex items-center gap-5 mt-7'>
          <Button className='w-[208px]' variant='secondary'>
            Read more
          </Button>
          <Button className='w-[208px]'>Join waitlist</Button>
        </div>
      </div>
      <div className='flex justify-center mb-[120px]'>
        <Image src='/hero.webp' alt='' width={962} height={601} />
      </div>
      <div className='flex justify-between'>
        {cards.map(i => (
          <div key={i.label} className='flex items-center gap-6'>
            <div className='rounded-full p-4 border border-border'>
              <Image src={i.iconUri} width={32} height={31} alt='' />
            </div>
            <p className='text-xl leading-[24px] font-medium'>{i.label}</p>
          </div>
        ))}
      </div>
      <div className='absolute size-[458px] rounded-[458px] bg-orange blur-[345px] top-[-167px] left-[-303px] z-[-10]' />
      <div className='absolute size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px] top-[773px] left-[-183px] z-[-10]' />
      <div className='absolute size-[458px] rounded-[458px] bg-orange blur-[345px] top-[-57px] right-8 z-[-10]' />
      <div className='absolute size-[458px] rounded-[458px] bg-[rgba(253,122,36,0.40)] blur-[345px] top-[726px] right-[433px] z-[-10]' />
    </div>
  );
};
