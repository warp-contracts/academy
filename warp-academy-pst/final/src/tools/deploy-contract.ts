import fs from 'fs';
import path from 'path';
import {LoggerFactory, WarpFactory} from 'warp-contracts';

// note: remember to build the contract first - yarn build:contracts
(async () => {
  // Warp and Arweave initialization
  LoggerFactory.INST.logLevel('error');
  const warp = WarpFactory.forMainnet();
  const arweave = warp.arweave;

  // generating Arweave wallet
  const jwk = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.jwkToAddress(jwk);

  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8'
  );
  const stateFromFile = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../dist/contracts/initial-state.json'),
    'utf8'
  ));

  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  };

  // Deploying contract
  console.log('Deployment started');
  const result = await warp.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc,
  });

  console.log('Deployment completed: ', {
    ...result,
    sonar: `https://sonar.warp.cc/#/app/contract/${result.contractTxId}`
  });
})();
