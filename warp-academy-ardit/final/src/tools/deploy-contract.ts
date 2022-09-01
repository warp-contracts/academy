import fs from 'fs';
import path from 'path';
import { WarpFactory } from 'warp-contracts';
import jwk from '../../.secrets/jwk.json';

(async () => {
  const warp = WarpFactory.forMainnet();
  const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');

  const initialState = {
    messages: [],
  };

  console.log('Deployment started');
  const { contractTxId } = await warp.createContract.deploy({
    wallet: jwk,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  console.log('Deployment completed: ' + contractTxId);
})();
``;
