import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import type { StacksNetwork } from '@stacks/network';
import { STACKS_NETWORK, CONTRACT_ADDRESS, CONTRACT_NAME } from './stacks-config';

export async function sendTip(
  senderAddress: string,
  recipientAddress: string,
  amount: number,
  message: string
): Promise<string> {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'send-tip',
    functionArgs: [
      standardPrincipalCV(recipientAddress),
      uintCV(amount * 1_000_000), // STX mikro birimlerine çevir
      stringUtf8CV(message),
    ],
    senderKey: '', // Connect ile otomatik dolacak
    validateWithAbi: true,
    network: STACKS_NETWORK as StacksNetwork,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({
    transaction,
    network: STACKS_NETWORK as StacksNetwork,
  });

  if ('error' in broadcastResponse) {
    throw new Error(broadcastResponse.error);
  }

  return broadcastResponse.txid;
}

export function formatSTX(microSTX: number): string {
  return (microSTX / 1_000_000).toFixed(6);
}

export function parseSTX(stx: string): number {
  return Math.floor(parseFloat(stx) * 1_000_000);
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}
