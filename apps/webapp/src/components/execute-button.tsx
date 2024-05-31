import { Icons } from '@rearden/ui/components/icons';
import { Button, ButtonProps } from '@rearden/ui/components/ui/button';

export const ExecuteButton = (props: ButtonProps) => {
  return (
    <Button
      className='mt-1 flex w-fit items-center gap-[6px] rounded-sm bg-background px-3 py-2 hover:bg-image-gradient-101deg disabled:opacity-60'
      variant='ghost'
      {...props}
    >
      <Icons.rocket />
      <p className='w-fit bg-primary-gradient bg-clip-text text-sm font-semibold text-transparent'>
        Execute strategy
      </p>
    </Button>
  );
};
