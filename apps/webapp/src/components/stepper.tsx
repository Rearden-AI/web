import React, { Fragment } from 'react';

import { cn } from '@rearden/ui/lib/utils';
import { Icons } from '@rearden/ui/components/icons';

export const Stepper = ({
  steps,
  currentStep,
}: {
  steps: {
    index: number;
    children: JSX.Element;
  }[];
  currentStep: number;
}) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between'>
        {steps.length > 1 &&
          steps.map((i, index) => {
            return (
              <Fragment key={index}>
                <div key={i.index} className='flex flex-col items-center gap-1'>
                  <p
                    className={cn(
                      'text-base font-bold text-[#525252]',
                      currentStep >= i.index &&
                        'bg-primary-gradient w-fit bg-clip-text text-transparent',
                    )}
                  >
                    {i.index}
                  </p>
                  <div>
                    {currentStep > i.index ? (
                      <Icons.done />
                    ) : currentStep === i.index ? (
                      <Icons.gradient_circle />
                    ) : (
                      <Icons.circle />
                    )}
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      'mb-3 h-1 flex-1 self-end border-b border-dashed border-[#FF7B21]',
                      index + 1 >= currentStep && 'border-[#525252]',
                    )}
                  />
                )}
              </Fragment>
            );
          })}
      </div>
      {steps.find(i => i.index === currentStep)?.children}
    </div>
  );
};
