import {
  LoggerFactory, WarpFactory
} from 'warp-contracts';
import deployedContracts from './deployed-contracts.json';

// Set up Warp client
LoggerFactory.INST.logLevel('debug');
const warp = WarpFactory.forMainnet();

// Set up Arweave client
export const arweave = warp.arweave;

// Interacting with the contract
const contract = warp
  .contract(deployedContracts.loot)
  .setEvaluationOptions({
    allowBigInt: true
  })
  .connect('use_wallet');

export default contract;
