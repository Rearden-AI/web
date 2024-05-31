import { ContractFunctionArgs, Hex, encodeAbiParameters, parseUnits } from 'viem';
import { Action } from '../types/chat';

export const prepareDeposit = ({
  action,
  amount,
  decimals,
}: {
  action: Action;
  amount: string;
  decimals: number;
}): ContractFunctionArgs => {
  const updatedArguments = action.body.arguments.map(v => {
    return {
      ...v,
      // if value doesnt exist it means that values is amount
      value: !v.value ? parseUnits(amount, decimals) : v.value,
    };
  });

  const params = action.body.abi.inputs.map(
    i => updatedArguments.find(v => v.name === i.name)?.value,
  );

  return params;
};

export const prepareSwap = ({
  action,
  amount,
  decimals,
  userAddress,
}: {
  action: Action;
  amount: string;
  decimals: number;
  userAddress: Hex;
}): ContractFunctionArgs => {
  const value = parseUnits(amount, decimals);

  const params = [
    { name: 'tokenIn', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'withdraw_mode', type: 'uint8' },
  ];

  const values = [action.body.token_address_in, userAddress, action.body.withdraw_mode];

  const swapData = encodeAbiParameters(params, values);

  return [
    [
      {
        steps: [
          {
            pool: action.body.pool_address ?? '0x',
            data: swapData,
            callback: action.body.token_in ?? '0x',
            callbackData: action.body.callback_data ?? '0x',
          },
        ],
        tokenIn: action.body.token_in ?? '0x',
        amountIn: value,
      },
    ],
    action.body.amount_out_min ?? BigInt(0),
    action.body.deadline ?? BigInt(0),
  ];
};

export const prepareAddLiquidity = ({
  tokenA,
  tokenB,
}: {
  tokenA: {
    amount: string;
    decimals: number;
  };
  tokenB: {
    amount: string;
    decimals: number;
  };
}): ContractFunctionArgs => {
  //https://docs.mav.xyz/v1-technical-reference/v1-contracts/router#fn-addliquiditytopool
  return [
    '0xb59b25d60f0ef9102ee6435cf0f7be8f23b1c6d2',
    BigInt(0), //NFT ID of the token uint256 that will hold LP balance. Use 0 to mint a new token
    [
      {
        kind: 3, //BOTH
        isDelta: true,
        pos: 0,
        deltaA: parseUnits(tokenA.amount, tokenA.decimals),
        deltaB: parseUnits(tokenB.amount, tokenB.decimals),
      },
    ],
    BigInt(0),
    BigInt(0),
    BigInt(1e13),
  ];
};
