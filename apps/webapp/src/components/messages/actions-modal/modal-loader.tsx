import { Loader } from '../../loader';

export const ModalLoader = () => {
  return (
    <div className='flex flex-col items-center'>
      <div>
        <Loader />
      </div>
      <p className='mb-2 mt-[-8px] text-base font-semibold text-muted-foreground'>
        Transaction is processing
      </p>
      <p className='text-base font-semibold text-muted-foreground'>Please wait...</p>
    </div>
  );
};
