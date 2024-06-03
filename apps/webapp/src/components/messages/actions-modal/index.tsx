'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../../state';
import { chatsSelector } from '../../../state/chats';
import { Action, ActionType, HistoryMessage, Role } from '../../../types/chat';
import { ExecuteButton } from '../../execute-button';
import { Stepper } from '../../stepper';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rearden/ui/components/ui/dialog';
import { AddLiquidityForm } from './add-liquidity-form';
import useAxiosAuth from '../../../hooks/axios-auth';
import { API_ID, ApiRoutes } from '../../../lib/api-routes';
import { useParams } from 'next/navigation';
import { TransactionForm } from './transaction-form';

export const ActionsModal = ({ wallet, strategies }: { wallet: string; strategies: Action[] }) => {
  const axiosInstance = useAxiosAuth();
  const { writeToChat } = useStore(chatsSelector);
  const [open, setOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [result, setResult] = useState<number[]>([]);
  const params = useParams<{ id?: string }>();

  useEffect(() => {
    if (result.length !== strategies.length) return;
    void (async () => {
      const { data } = await axiosInstance.post<HistoryMessage>(
        ApiRoutes.CHAT_BY_ID.replace(API_ID, params.id!),
        {
          timestamp: Date.now(),
          transaction_ids: result,
          message: '',
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
  }, [result, strategies, writeToChat, params, axiosInstance]);

  const steps = useMemo(() => {
    return strategies.map((i, index) => {
      return {
        index: index + 1,
        children:
          i.action_type === ActionType.ADD_LIQUIDITY ? (
            <AddLiquidityForm
              key={index}
              index={index + 1}
              action={i}
              setCurrentStep={setCurrentStep}
              setResult={setResult}
            />
          ) : (
            <TransactionForm
              key={index}
              index={index + 1}
              action={i}
              setCurrentStep={setCurrentStep}
              setResult={setResult}
            />
          ),
      };
    });
  }, [strategies]);

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <ExecuteButton
          disabled={Boolean(!wallet)}
          onClick={() => {
            setOpen(true);
          }}
        />
      </DialogTrigger>
      <DialogContent className='flex w-[515px] flex-col gap-4'>
        <DialogHeader>
          <DialogTitle>Strategy execution</DialogTitle>
        </DialogHeader>
        <Stepper steps={steps} currentStep={currentStep} />
      </DialogContent>
    </Dialog>
  );
};
