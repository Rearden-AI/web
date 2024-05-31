import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export const SUI_CLIENT = new SuiClient({ url: getFullnodeUrl('mainnet') });
