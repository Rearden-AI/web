export const tokenAbi = [
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
] as const;

//TODO DELETE
export const syncSwapRouterAbi = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'pool',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
              },
              {
                internalType: 'address',
                name: 'callback',
                type: 'address',
              },
              {
                internalType: 'bytes',
                name: 'callbackData',
                type: 'bytes',
              },
            ],
            internalType: 'struct IRouter.SwapStep[]',
            name: 'steps',
            type: 'tuple[]',
          },
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amountIn',
            type: 'uint256',
          },
        ],
        internalType: 'struct IRouter.SwapPath[]',
        name: 'paths',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'swap',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPool.TokenAmount',
        name: 'amountOut',
        type: 'tuple',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const maverickAbi = [
  {
    inputs: [
      { internalType: 'contract IPool', name: 'pool', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      {
        components: [
          { internalType: 'uint8', name: 'kind', type: 'uint8' },
          { internalType: 'int32', name: 'pos', type: 'int32' },
          { internalType: 'bool', name: 'isDelta', type: 'bool' },
          { internalType: 'uint128', name: 'deltaA', type: 'uint128' },
          { internalType: 'uint128', name: 'deltaB', type: 'uint128' },
        ],
        internalType: 'struct IPool.AddLiquidityParams[]',
        name: 'params',
        type: 'tuple[]',
      },
      { internalType: 'uint256', name: 'minTokenAAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'minTokenBAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
    ],
    name: 'addLiquidityToPool',
    outputs: [
      { internalType: 'uint256', name: 'receivingTokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenAAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenBAmount', type: 'uint256' },
      {
        components: [
          { internalType: 'uint128', name: 'deltaA', type: 'uint128' },
          { internalType: 'uint128', name: 'deltaB', type: 'uint128' },
          { internalType: 'uint256', name: 'deltaLpBalance', type: 'uint256' },
          { internalType: 'uint128', name: 'binId', type: 'uint128' },
          { internalType: 'uint8', name: 'kind', type: 'uint8' },
          { internalType: 'int32', name: 'lowerTick', type: 'int32' },
          { internalType: 'bool', name: 'isActive', type: 'bool' },
        ],
        internalType: 'struct IPool.BinDelta[]',
        name: 'binDeltas',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const poolAbi = [
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
    ],
    name: 'activeTickLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sqrtPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveB',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'path',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'exactOutput',
        type: 'bool',
      },
    ],
    name: 'calculateMultihopSwap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        internalType: 'bool',
        name: 'tokenAIn',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exactOutput',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'sqrtPriceLimit',
        type: 'uint256',
      },
    ],
    name: 'calculateSwap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'returnAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'startBinIndex',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'endBinIndex',
        type: 'uint128',
      },
    ],
    name: 'getActiveBins',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'id',
            type: 'uint128',
          },
          {
            internalType: 'uint8',
            name: 'kind',
            type: 'uint8',
          },
          {
            internalType: 'int32',
            name: 'lowerTick',
            type: 'int32',
          },
          {
            internalType: 'uint128',
            name: 'reserveA',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'reserveB',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'mergeId',
            type: 'uint128',
          },
        ],
        internalType: 'struct IPoolInformation.BinInfo[]',
        name: 'bins',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'binId',
        type: 'uint128',
      },
    ],
    name: 'getBinDepth',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depth',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'int32',
        name: 'tick',
        type: 'int32',
      },
    ],
    name: 'getBinsAtTick',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'reserveA',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'reserveB',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'mergeBinBalance',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'mergeId',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'totalSupply',
            type: 'uint128',
          },
          {
            internalType: 'uint8',
            name: 'kind',
            type: 'uint8',
          },
          {
            internalType: 'int32',
            name: 'lowerTick',
            type: 'int32',
          },
        ],
        internalType: 'struct IPool.BinState[]',
        name: 'bins',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
    ],
    name: 'getSqrtPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sqrtPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPool',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'int32',
        name: 'tick',
        type: 'int32',
      },
    ],
    name: 'tickLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: 'sqrtPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveA',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveB',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
