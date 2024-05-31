import { useRef, useState } from 'react';
import Image from 'next/image';

import { Validation } from '../hooks/validation-result';
import { cn } from '@rearden/ui/lib/utils';
import { BorderWrapper } from './border-wrapper';
import { Input, InputProps } from '@rearden/ui/components/ui/input';

export const InputElement = ({
  label,
  balance,
  validationResult,
  ...props
}: {
  label?: string;
  balance?: { symbol: string; displayValue: string };
  validationResult?: Validation;
} & InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <div className='flex w-full flex-col gap-[6px]'>
      {label && (
        <p className={cn('text-sm font-bold', validationResult && 'text-error')}>{label}</p>
      )}
      <BorderWrapper
        wrapperClassName={cn(
          'bg-image-gradient-secondary-101deg cursor-text hover:shadow-sm',
          focus && 'bg-primary-gradient hover:shadow-none',
          validationResult && 'bg-error hover:shadow-none',
        )}
        className='flex items-center gap-3 p-3'
        tabIndex={-1}
        onFocus={() => {
          setFocus(true);
          inputRef.current?.focus();
        }}
        onBlur={() => setFocus(false)}
      >
        <div className='flex w-fit items-center gap-2'>
          <div className='size-6'>
            {balance?.symbol && (
              <Image src={`/${balance.symbol}.png`} height={24} width={24} alt={balance.symbol} />
            )}
          </div>
          <p className='text-base font-semibold'>{balance?.symbol}</p>
        </div>
        <Input {...props} className='ml-3 h-6 pl-0' ref={inputRef} />
      </BorderWrapper>
      {balance && (
        <p
          className={cn(
            'text-sandstone text-[12px] font-semibold leading-4',
            validationResult && 'text-error',
          )}
        >
          {validationResult
            ? validationResult.issue
            : `Your balance: ${balance.symbol} ${balance.displayValue}`}
        </p>
      )}
    </div>
  );
};
