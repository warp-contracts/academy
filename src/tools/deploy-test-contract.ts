import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { SmartWeaveNodeFactory, LoggerFactory } from 'redstone-smartweave';

(async () => {
  // Set up Arweave client
  const arweave = Arweave.init({
    host: 'localhost',
    port: 1984,
    protocol: 'http',
  });
  const wallet = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);

  const stateFromFile = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../contracts/initial-state.json'),
      'utf8'
    )
  );

  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
      balances: {
        ...stateFromFile.balances,
        [walletAddress]: 555669,
      },
    },
  };
  const mine = () => arweave.api.get('mine');

  // Set up SmartWeave client
  LoggerFactory.INST.logLevel('error');
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Deploying contract
  const contractSrc = fs.readFileSync(
    path.join(__dirname, '../contracts/contract.ts'),
    'utf8'
  );

  const contractTxId = await smartweave.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  await mine();
  const pst = smartweave.contract(contractTxId);
  await pst.readState();
  console.log(contractTxId);
})();
