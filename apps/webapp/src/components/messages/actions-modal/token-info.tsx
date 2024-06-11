import { Fragment } from 'react';
import Image from 'next/image';

interface TokenInfoProps {
  label: string;
  value: string | string[];
}

export const TokenInfo = ({ label, value }: TokenInfoProps) => {
  return (
    <div className='flex flex-col'>
      <p className='text-sm font-bold'>{label}</p>
      {typeof value === 'string' ? (
        <div className='flex items-center gap-1'>
          <Image src={`/${value}.png`} width={18} height={18} alt={value} />
          <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
            {value}
          </p>
        </div>
      ) : (
        <div className='flex items-center gap-1'>
          {value.map((i, index) => (
            <Fragment key={i}>
              <div className='flex items-center gap-1'>
                <Image src={`/${i}.png`} width={18} height={18} alt={i} />
                <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
                  {i}
                </p>
              </div>
              {index < value.length - 1 ? (
                <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
                  &
                </p>
              ) : (
                <></>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
