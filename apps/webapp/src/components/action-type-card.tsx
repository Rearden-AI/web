import { cn } from '@rearden/ui/lib/utils';
import { ActionType } from '../types/chat';
import { Icons } from '@rearden/ui/components/icons';

export const ActionTypeCard = ({
  type,
  className,
  classNameText,
  classNameIcon,
}: {
  type: ActionType;
  className?: string;
  classNameText?: string;
  classNameIcon?: string;
}) => {
  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center gap-1 text-lg font-bold leading-[26px]',
        className,
      )}
    >
      <p className={cn('txt-inherit order-1 capitalize', classNameText)}>{type}</p>
      <Icons.deposit className={cn('order-2', classNameIcon)} />
    </div>
  );
};
