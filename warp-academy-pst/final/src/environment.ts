import Arweave from 'arweave';
import { LoggerFactory, WarpWebFactory, Warp } from 'warp-contracts';

// Set up Arweave client
export const arweave: Arweave = Arweave.init({
  host: 'testnet.redstone.tools',
  port: 443,
  protocol: 'https',
});

LoggerFactory.INST.logLevel('debug');

// const warp = new WarpWebFactory.memCached(arweave);
export const warp: Warp = WarpWebFactory.memCachedBased(arweave).useArweaveGateway().build();
