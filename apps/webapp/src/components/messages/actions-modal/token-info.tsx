interface TokenInfoProps {
  params: {
    icon: string | null;
    name: string;
    value: string;
  };
}

export const TokenInfo = ({ params }: TokenInfoProps) => {
  return (
    <div className='flex flex-col'>
      <p className='text-sm font-bold'>{params.name}</p>

      <div className='flex items-center gap-1'>
        {/* {params.icon && <Image src={params.icon} width={18} height={18} alt={params.value} />} */}
        <p className='w-fit bg-primary-gradient bg-clip-text text-base font-semibold text-transparent'>
          {params.value}
        </p>
      </div>
    </div>
  );
};
