import Arweave from 'arweave';
import { LoggerFactory, WarpFactory, Warp } from 'warp-contracts';

// initialize Warp instance for use with Arweave mainnet
LoggerFactory.INST.logLevel('info');
export const warp: Warp = WarpFactory.forMainnet();

// you don't need to initialize Arweave instance manually - just use the Arweave instance from Warp
export const arweave: Arweave = warp.arweave;
