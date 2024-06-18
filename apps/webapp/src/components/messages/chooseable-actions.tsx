import { ChatResponse, ChooseableAction, Role } from '../../types/chat';
import axiosInstance from '../../config/axios';
import { API_ID, ApiRoutes } from '../../constants/api-routes';
import { useParams } from 'next/navigation';
import { useChainId } from 'wagmi';
import { useStore } from '../../state';
import { chatsSelector } from '../../state/chats';
import { BorderWrapper } from '@rearden/ui/components/border-wrapper';
import { ExecuteButton } from '../execute-button';

export const ChooseableActions = ({ actions }: { actions: ChooseableAction[] }) => {
  const { writeToChat } = useStore(chatsSelector);
  const params = useParams<{ id?: string }>();
  const chain = useChainId();
  return (
    <div className='flex flex-col gap-4'>
      {actions.map((i, index) => (
        <div
          key={i.key}
          className='flex flex-col gap-3 rounded-md border border-border-secondary bg-card-secondary py-5 pl-4 pr-6 shadow-3xl'
        >
          <div className='flex items-center gap-2'>
            <BorderWrapper
              className='image-gradient-133deg rounded-[7px] px-3 py-1'
              wrapperClassName='p-[0.7px] rounded-[7px] flex-0 w-fit'
            >
              <p className='w-fit bg-primary-gradient bg-clip-text text-base font-bold text-transparent'>
                {index + 1}
              </p>
            </BorderWrapper>
            <div className='flex justify-between w-full items-center'>
              <p className='w-fit bg-primary-gradient bg-clip-text text-lg font-bold leading-[26px] text-transparent'>
                {i.name}
              </p>
              <p className='text-base font-medium leading-[26px] rounded-sm bg-card px-3 py-1'>
                {' '}
                APY ≈ {i.approxApy}%
              </p>
            </div>
          </div>
          <ExecuteButton
            onClick={() => {
              try {
                void (async () => {
                  const { data } = await axiosInstance.post<ChatResponse>(
                    ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id!),
                    {
                      chosen_action_key: i.key,
                      message: '',
                      timestamp: Date.now(),
                      chain_id: chain,
                    },
                  );

                  writeToChat({
                    role: Role.SYSTEM,
                    content: data.body,
                    ...data,
                  });
                })();
              } catch (error) {}
            }}
          />
        </div>
      ))}
    </div>
  );
};
