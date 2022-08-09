import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { PstState } from '../contracts/types/types';
import { LoggerFactory, PstContract, Warp, WarpNodeFactory } from 'warp-contracts';
import fs from 'fs';
import path from 'path';

let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: PstState;

let arweave: Arweave;
let warp: Warp;

(async () => {
  arweave = Arweave.init({
    host: 'testnet.redstone.tools',
    port: 443,
    protocol: 'https',
  });

  LoggerFactory.INST.logLevel('error');

  warp = WarpNodeFactory.memCachedBased(arweave).useArweaveGateway().build();
  // wallet = await arweave.wallets.generate();
  // const address = await arweave.wallets.getAddress(wallet);
  // await arweave.api.get(`/mint/${address}/1000000000000000`);
  // walletAddress = await arweave.wallets.jwkToAddress(wallet);

  // contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  // const stateFromFile: PstState = JSON.parse(
  //   fs.readFileSync(path.join(__dirname, '../../dist/contracts/initial-state.json'), 'utf8')
  // );

  // initialState = {
  //   ...stateFromFile,
  //   ...{
  //     owner: walletAddress,
  //   },
  // };

  // const contractTxId = await warp.createContract.deploy({
  //   wallet,
  //   initState: JSON.stringify(initialState),
  //   src: contractSrc,
  // });

  // console.log(contractTxId);

  const contract = warp.contract('lKw1ihNCLy-lTh3-RwXelV7-sWGGpRPKpF2mjpBCqNo');

  const result = await contract.viewState({
    function: 'getSchema',
    id: 'Human',
  });
  console.log(result);
  await arweave.api.get('mine');
})();
