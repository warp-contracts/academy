import Arweave from 'arweave';
import {
  LoggerFactory,
  WarpWebFactory,
  WarpGatewayInteractionsLoader,
} from 'warp-contracts';
import deployedContracts from './deployed-contracts.json';
import { url } from '@/constants';

// Set up Arweave client
export const arweave = Arweave.init({
  host: 'dh48zl0solow5.cloudfront.net',
  port: 443,
  protocol: 'https',
});

// Set up Warp client
LoggerFactory.INST.logLevel('debug');

// const warp = new WarpWebFactory.memCached(arweave);
const warp = WarpWebFactory.memCachedBased(arweave)
  .setInteractionsLoader(
    new WarpGatewayInteractionsLoader(url.warpGateway)
  )
  .build();

// Interacting with the contract
const contract = warp
  .contract(deployedContracts.loot)
  .connect('use_wallet');

export default contract;
