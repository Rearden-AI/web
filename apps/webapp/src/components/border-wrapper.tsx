import { DetailedHTMLProps, HTMLAttributes } from 'react';

import { cn } from '@rearden/ui/lib/utils';

export const BorderWrapper = ({
  children,
  className,
  wrapperClassName,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div className={cn('bg-image-gradient-101deg rounded-lg p-px', wrapperClassName)} {...props}>
      <div className={cn('bg-card flex justify-between rounded-lg', className)}>{children}</div>
    </div>
  );
};
