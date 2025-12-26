import { STACKS_MAINNET } from '@stacks/network';

export const STACKS_NETWORK = STACKS_MAINNET;

export const CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78'; // Deploy sonrası güncellenecek
export const CONTRACT_NAME = 'tip-jar';

export const STACKS_EXPLORER = 'https://explorer.hiro.so';
export const STACKS_API = 'https://api.mainnet.hiro.so';

export interface Tip {
  sender: string;
  recipient: string;
  amount: number;
  message: string;
  timestamp: number;
  txId: string;
}

export interface TipJarUser {
  address: string;
  username: string;
  totalReceived: number;
  totalTips: number;
}
