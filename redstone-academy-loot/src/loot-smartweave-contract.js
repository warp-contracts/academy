import Arweave from 'arweave';
import {
  LoggerFactory,
  SmartWeaveWebFactory,
  RedstoneGatewayInteractionsLoader,
} from 'redstone-smartweave';
import deployedContracts from './deployed-contracts.json';
import { url } from '@/constants';

// Set up Arweave client
export const arweave = Arweave.init({
  host: 'dh48zl0solow5.cloudfront.net',
  port: 443,
  protocol: 'https',
});

// Set up SmartWeave client
LoggerFactory.INST.logLevel('debug');

// const smartweave = new SmartWeaveWebFactory.memCached(arweave);
const smartweave = SmartWeaveWebFactory.memCachedBased(arweave)
  .setInteractionsLoader(
    new RedstoneGatewayInteractionsLoader(url.redstoneGateway)
  )
  .build();

// Interacting with the contract
const contract = smartweave
  .contract(deployedContracts.loot)
  .connect('use_wallet');

export default contract;
