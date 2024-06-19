'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@rearden/ui/components/ui/dialog';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useChainId } from 'wagmi';
import axiosInstance from '../../../config/axios';
import { API_ID, ApiRoutes } from '../../../constants/api-routes';
import { useStore } from '../../../state';
import { chatsSelector } from '../../../state/chats';
import { Action, HistoryMessage, Role, UserInputObject } from '../../../types/chat';

import { ExecuteButton } from '../../execute-button';
import { Stepper } from '../../stepper';
import { TransactionForm } from './transaction-form';

export const ActionsModal = ({ actions }: { actions: Action[] }) => {
  const { writeToChat } = useStore(chatsSelector);
  const chain = useChainId();
  const [open, setOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [result, setResult] = useState<number[]>([]);
  const [actionValues, setActionValues] = useState<UserInputObject>({});
  const params = useParams<{ id?: string }>();

  useEffect(() => {
    if (!actions.length || result.length !== actions.length) return;
    void (async () => {
      const { data } = await axiosInstance.post<HistoryMessage>(
        ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id!),
        {
          timestamp: Date.now(),
          transaction_ids: result,
          message: '',
          chain_id: chain,
        },
      );

      writeToChat({
        role: Role.SYSTEM,
        content: data.content,
        transactions: data.transactions,
        timestamp: data.timestamp,
      });
      setOpen(false);
      setCurrentStep(1);
      setResult([]);
    })();
  }, [result, actions, writeToChat, params, chain]);

  const steps = useMemo(() => {
    return actions.map((i, index) => {
      return {
        index: index + 1,
        children: (
          <TransactionForm
            key={index}
            index={index + 1}
            action={i}
            actionValues={actionValues}
            setCurrentStep={setCurrentStep}
            setResult={setResult}
            setActionValues={setActionValues}
          />
        ),
      };
    });
  }, [actions, actionValues]);

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        setOpen(value);
      }}
    >
      <ExecuteButton
        onClick={() => {
          setOpen(true);
        }}
      />
      <DialogContent className='flex w-[515px] flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>Strategy execution</DialogTitle>
        </DialogHeader>
        <Stepper steps={steps} currentStep={currentStep} />
      </DialogContent>
    </Dialog>
  );
};
