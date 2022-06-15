import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { ArWallet, WarpNodeFactory } from 'warp-contracts';
import jwk from '../../.secrets/jwk.json';

(async () => {
  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(
    path.join(__dirname, '../contracts/pst/contract.js'),
    'utf8'
  );
  const initialState = fs.readFileSync(
    path.join(__dirname, '../contracts/pst/initial-state.json'),
    'utf8'
  );

  // Arweave and Warp initialization
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
  const warp = WarpNodeFactory.memCached(arweave);

  // Deploying contract
  console.log('Deployment started');
  const contractTxId = await warp.createContract.deploy({
    wallet: jwk as ArWallet,
    initState: initialState,
    src: contractSrc,
  });
  console.log('Deployment completed: ' + contractTxId);
})();
