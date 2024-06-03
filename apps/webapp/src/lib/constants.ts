import { ActionType, ChatSchemaState, Role } from '../types/chat';
import { maverickAbi, syncSwapRouterAbi } from './abi';

export const mockChatAirdrop = {
  name: null,
  uuid: `1`,
  created_at: new Date(),
  state: ChatSchemaState.ACTIVE,
  user_id: 1,
  history: [
    {
      role: Role.USER,
      content: 'Hi! What is airdrop and how it works?',
    },
    {
      role: Role.SYSTEM,
      content: `In a process called Airdrop, early users are rewarded with the protocol's native token for performing actions that benefit the protocol. \n\nA crypto airdrop usually involves the following steps:\n\n1. The project team communicates the details and requirements of the airdrop through their official channels or cryptocurrency communities.\n2. The interested participants register for the airdrop by providing their wallet address and other information or performing the required tasks.\n3. The project team verifies the eligibility and validity of the participants and distributes the tokens to their wallets according to the rules of the airdrop.\n4. The participants receive the tokens in their wallets and can use them according to the terms and conditions of the project.\n\nAre you interested in airdrop hunting?`,
    },
    {
      role: Role.USER,
      content: 'Yep, are there any options to try it out?',
    },
    {
      role: Role.SYSTEM,
      content: `Sure, one of the current trending option is zkSync Airdrop (L2 network with high likelihood of distributing tokens to the community). Here is the strategy to participate in early adoption of zkSync network using ETH asset:\n\n1. Bridge ETH to zkSync using Orbiter. Source https://www.orbiter.finance/\n2. Swap Assets on SyncSwap. Source https://syncswap.xyz/\n3. Provide Liquidity to Maverick. Source https://app.mav.xyz/?chain=1\n\nIf you are okay with this strategy, I can prepare its execution.`,
      contains_strategy_previews: ['deposit_eth_lido', '"deposit_steth_eigenlayer"'],
    },
    {
      role: Role.SYSTEM,
      content: '',
      strategies: [
        // {
        //   action_type: ActionType.TRANSFER,
        //   details: {
        //     name: 'Bridge ETH to zkSync using Orbiter',
        //     dapp_link: 'https://www.orbiter.finance/',
        //     from: 'ETH', // need to add API
        //     to: 'ETH',
        //     network: 1, // need to add API
        //     token_address_in: null,
        //   },
        //   body: {
        //     token_address_in: null,
        //     contract_address: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
        //   },
        // },
        {
          action_type: ActionType.SWAP,
          details: {
            name: 'Swap ETH→USDC on SyncSwap.',
            dapp_link: 'https://syncswap.xyz/',
            from: 'ETH', // need to add API
            to: 'USDC', // need to add API
            network: 324, // need to add API
            token_address_in: null,
          },
          body: {
            token_address_in: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
            contract_address: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
            pool_address: '0x7e30d17C78c42e715e58eC20Dd703786549AA5F1',
            abi: syncSwapRouterAbi[0],
            withdraw_mode: '1',
            token_in: '0x0000000000000000000000000000000000000000',
            callback_data: '0x',
            amount_out_min: BigInt(0),
            deadline: BigInt(Math.floor(Date.now() / 1000) + 1800),
          },
        },
        {
          action_type: ActionType.SWAP,
          details: {
            name: 'Swap ETH→LUSD on SyncSwap.',
            dapp_link: 'https://syncswap.xyz/',
            from: 'ETH', // need to add API
            to: 'LUSD', // need to add API
            network: 324, // need to add API
            token_address_in: null,
          },
          body: {
            token_address_in: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
            contract_address: '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295',
            pool_address: '0x4E7d2e3f40998DaeB59a316148BFbF8efd1F7F3c',
            abi: syncSwapRouterAbi[0],
            withdraw_mode: '1',
            token_in: '0x0000000000000000000000000000000000000000',
            callback_data: '0x',
            amount_out_min: BigInt(0),
            deadline: BigInt(Math.floor(Date.now() / 1000) + 1800),
          },
        },
        {
          action_type: ActionType.TRANSACTION,
          details: {
            name: 'Approve USDC on Maverick',
            dapp_link: 'https://app.mav.xyz/',
            network: 324,
            token_address_in: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
          },
          body: {
            contract_address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
            abi: {
              constant: false,
              inputs: [
                { name: '_spender', type: 'address' },
                { name: '_amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ name: '', type: 'bool' }],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            arguments: [
              {
                name: '_spender',
                value: '0x39e098a153ad69834a9dac32f0fca92066ad03f4',
              },
              { name: '_amount' },
            ],
          },
        },

        {
          action_type: ActionType.TRANSACTION,
          details: {
            name: 'Approve LUSD on Maverick',
            dapp_link: 'https://app.mav.xyz/',
            network: 324, // need to add API
            token_address_in: '0x503234F203fC7Eb888EEC8513210612a43Cf6115', // need to add API
          },
          body: {
            contract_address: '0x503234F203fC7Eb888EEC8513210612a43Cf6115',
            abi: {
              constant: false,
              inputs: [
                { name: '_spender', type: 'address' },
                { name: '_amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ name: '', type: 'bool' }],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            arguments: [
              {
                name: '_spender',
                value: '0x39e098a153ad69834a9dac32f0fca92066ad03f4',
              },
              { name: '_amount' },
            ],
          },
        },

        {
          action_type: ActionType.ADD_LIQUIDITY,
          details: {
            name: 'Provide Liquidity to Maverick. ',
            dapp_link: 'https://app.mav.xyz/',
            from: ['USDC', 'LUSD'], // need to add API
            to: 'LP LUSD-USDC', // need to add API
            network: 324, // need to add API
            token_address_in: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
            token_address_out: '0x503234F203fC7Eb888EEC8513210612a43Cf6115',
            apy: '0.9%',
          },
          body: {
            token_address_in: '0x503234f203fc7eb888eec8513210612a43cf6115',
            contract_address: '0x39E098A153Ad69834a9Dac32f0FCa92066aD03f4',
            abi: maverickAbi[0],
          },
        },
        // {
        //   action_type: ActionType.TRANSFER,
        //   details: {
        //     name: "Register a Domain Name on zkSync",
        //     dapp_link: "https://app.zkns.domains/. ",
        //     from: "ETH", // need to add API
        //     network: 324, // need to add API
        //     token_address_in: null,
        //   },
        //   body: {
        //     token_address_in: null,
        //     contract_address: "0x80C67432656d59144cEFf962E8fAF8926599bCF8",
        //   },
        // },
        // 0xAE23B6E7f91DDeBD3B70d74d20583E3e674Bd94f method DIRECT REGISTER // https://app.zkns.domains/name/zk/234/register
      ],
    },
  ],
};

// mainnet swap there -0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295

export const mockChat = {
  name: null,
  uuid: `1`,
  created_at: new Date(),
  state: ChatSchemaState.ACTIVE,
  user_id: 1,
  history: [
    {
      role: Role.USER,
      content: '1',
    },
    {
      role: Role.SYSTEM,
      content: `Earning yield on ETH can be divided by your risk tolerance.\n\nFor the long-term and low risk strategy you can supply ETH into native staking and earn 3-7% APY. Staked ETH you can supply into Eigenlayer and receive up 60% APY.\n\nHere is some explanation👇\n\n1. Lido / Rocket Pool / StakeWise / Everstake with APY up to 7% (currently is 2.9%).\n2. Eigenlayer doesn’t give a direct return on your position. APY is calculated based on the point rewards program and represent a projected APY:\n    - 1 stETH generates 24 points per day. 8760 points per year.\n    - 1 point is valued at $0.2 on average based on the Whales Market.\n    - Based on the ETH price of $3100 you can earn $1780 in points value.\n\nIf you are okay with this strategy I can prepare a guide for its execution.`,
      contains_strategy_previews: ['deposit_eth_lido', '"deposit_steth_eigenlayer"'],
    },
    {
      role: Role.SYSTEM,
      content: '',
      strategies: [
        {
          action_type: ActionType.DEPOSIT,
          details: {
            name: 'Deposit ETH to Lido',
            dapp_link: 'https://lido.fi/',
            apy: '5-10%',
            from: 'ETH', // need to add API
            to: 'stETH', // need to add API
            network: 17000, // need to add API
            token_address_in: null, // need to add API
          },
          body: {
            token_address_in: null,
            token_address_out: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            contract_address: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            abi: {
              constant: false,
              inputs: [
                {
                  name: '_referral',
                  type: 'address',
                },
              ],
              name: 'submit',
              outputs: [{ name: '', type: 'uint256' }],
              payable: true,
              stateMutability: 'payable',
              type: 'function',
            },
            arguments: [
              {
                name: '_referral',
                value: '0xd6EbF043D30A7fe46D1Db32BA90a0A51207FE229',
              },
            ],
          },
        },
        {
          action_type: ActionType.TRANSACTION,
          details: {
            name: 'Approve stETH on Eigenlayer',
            dapp_link: 'https://eigenlayer.xyz/',
            network: 17000, // need to add API
            token_address_in: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034', // need to add API
          },
          body: {
            token_address_in: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            token_address_out: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            contract_address: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            abi: {
              constant: false,
              inputs: [
                { name: '_spender', type: 'address' },
                { name: '_amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ name: '', type: 'bool' }],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            arguments: [
              {
                name: '_spender',
                value: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6',
              },
              { name: '_amount' },
            ],
          },
        },
        {
          action_type: ActionType.DEPOSIT,
          details: {
            name: 'stETH restaking in Eigenlayer', // need to add API
            dapp_link: 'https://eigenlayer.xyz/',
            apy: '7-11%',
            from: 'stETH', // need to add API
            network: 17000, // need to add API
            token_address_in: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034', // need to add API
          },
          body: {
            token_address_in: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            token_address_out: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
            contract_address: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6',
            abi: {
              inputs: [
                {
                  internalType: 'contractIStrategy',
                  name: 'strategy',
                  type: 'address',
                },
                {
                  internalType: 'contractIERC20',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'depositIntoStrategy',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'shares',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            arguments: [
              {
                name: 'strategy',
                value: '0x7D704507b76571a51d9caE8AdDAbBFd0ba0e63d3',
              },
              {
                name: 'token',
                value: '0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034',
              },
              { name: 'amount' },
            ],
          },
        },
      ],
    },
    {
      role: Role.SYSTEM,
      content: '',
      result: [
        {
          actionType: 'deposit',
          actionName: 'Deposit ETH to Lido',
          transactionHash: '0xafc74e3f02cd884746be922cd2e96adedc3487fab8e3e56b376a76525d63383c',
          amount: '0.001',
          token: 'ETH',
          time: '2024-05-17T15:22:02.548Z',
          status: 'success',
          account: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
        },
        {
          actionType: 'transaction',
          actionName: 'Approve stETH on Eigenlayer',
          transactionHash: '0x5f5de9c572b7051fd9a63ec19af37e73bd278d91100820aecefc5cb211a6c692',
          amount: '0.001',
          token: 'stETH',
          time: '2024-05-17T15:23:03.100Z',
          status: 'success',
          account: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
        },
        {
          actionType: 'deposit',
          actionName: 'stETH restaking in Eigenlayer',
          transactionHash: '0x5a325ac6be6825bebac1cbd519bc55c8a803b89921c41bbcad4e24440dd96124',
          amount: '0.001',
          token: 'stETH',
          time: '2024-05-17T15:23:26.592Z',
          status: 'success',
          account: '0x9a868D58C7F31DAd95626e9632A937Fff69a4F0e',
        },
      ],
    },
  ],
};
