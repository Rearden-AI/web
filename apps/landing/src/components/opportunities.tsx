import Image from 'next/image';

const cards = [
  {
    label: 'Pendle YT in January 2024?',
    descriptions: 'Pendle YT on eETH (Etherfi) generated over 100% returns in 3 months.',
    iconUri: '/contract.png',
  },
  {
    label: 'XAI nodes in November 2023?',
    descriptions: 'XAI nodes sales generated over 250% returns in 5 months.',
    iconUri: '/bankruptcy.png',
  },
  {
    label: 'Eigenlayer in 2023?',
    descriptions: 'Eigenlayer early suppliers got up to 50% on the ETH stack.',
    iconUri: '/essay.png',
  },
];

export const Opportunities = () => {
  return (
    <div className='mt-[230px] flex w-full flex-col items-center gap-[60px]'>
      <p className='text-[44px] font-medium leading-[52px]'>
        Have you missed such opportunities during this cycle?
      </p>
      <div className='flex w-full items-center justify-between pr-[46px]'>
        <Image src='/opportunities.png' width={602} height={520} alt='' />
        <div className='flex w-1/2 flex-col gap-[60px]'>
          <div className='flex flex-col gap-10'>
            {cards.map(i => (
              <div key={i.label} className='flex items-center gap-5'>
                <Image src={i.iconUri} width={46} height={46} alt='' />
                <div className='flex flex-col justify-center'>
                  <p className='text-xl font-medium leading-[24px]'>{i.label}</p>
                  <p className='text-base font-normal'>{i.descriptions}</p>
                </div>
              </div>
            ))}
          </div>
          <p className='text-[30px] font-semibold leading-10'>
            Start leveraging your skills and knowledge with Rearden and never get FOMO anymore!
          </p>
        </div>
      </div>
    </div>
  );
};
