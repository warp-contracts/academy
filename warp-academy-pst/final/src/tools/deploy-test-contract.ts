import fs from 'fs';
import path from 'path';
import {LoggerFactory, WarpFactory} from 'warp-contracts';

// note: remember to build the contract first - yarn build:contracts
(async () => {
  // Warp initialization for public testnet
  LoggerFactory.INST.logLevel('error');
  const warp = WarpFactory.forTestnet();

  // generating Arweave wallet
  const { jwk } = await warp.testing.generateWallet();

  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8'
  );
  const initialState = fs.readFileSync(
    path.join(__dirname, '../../dist/contracts/initial-state.json'),
    'utf8'
  );

  // Deploying contract
  console.log('Deployment started');
  const result = await warp.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc,
  });

  console.log('Deployment completed: ', result);
  console.log(`Your contract should be visible in a few seconds here:
   https://sonar.warp.cc/#/app/contract/${result.contractTxId}?network=testnet`);
})();
