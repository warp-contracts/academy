const fs = require('fs');
const path = require('path');
const Arweave = require('arweave');
const { WarpNodeFactory, LoggerFactory } = require('warp-contracts');
const { default: ArLocal } = require('arlocal');

(async () => {
  // Set up ArLocal
  const arLocal = new ArLocal(1985, false);
  await arLocal.start();

  // Set up Arweave client
  const arweave = Arweave.init({
    host: 'localhost',
    port: 1985,
    protocol: 'http',
  });
  const wallet = await arweave.wallets.generate();

  const walletAddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
  const mine = () => arweave.api.get('mine');

  // Set up Warp client
  LoggerFactory.INST.logLevel('error');
  const warp = WarpNodeFactory.memCached(arweave);

  // Deploying contract
  const contractSrc = fs.readFileSync(path.join(__dirname, '../contracts/loot/contract.js'), 'utf8');
  const initialState = fs.readFileSync(path.join(__dirname, '../contracts/loot/initial-state.json'), 'utf8');
  const contractTxId = await warp.createContract.deploy({
    wallet,
    initState: initialState,
    src: contractSrc,
  });
  await mine();

  // Interacting with the contract
  const contract = warp.contract(contractTxId).connect(wallet);

  // Read state
  const state = await contract.readState();
  console.log('State before any interactions');
  console.log(JSON.stringify(state, null, 2));

  // Write interaction
  console.log("Sending 'generate' interaction...");
  await contract.writeInteraction({ function: 'generate' });
  await mine();
  console.log('Interaction has been sent');

  // Read state after interaction
  const stateAfterInteraction = await contract.readState();
  console.log('State after 1 interaction');
  console.log(JSON.stringify(stateAfterInteraction, null, 2));

  // Using generatedAssets contract function
  const { result: generatedAssets } = await contract.viewState({
    function: 'generatedAssets',
  });
  const generatedAsset = generatedAssets[0];
  console.log(`Generated asset: ${generatedAsset}`);

  // Transferring the asset to another address
  console.log("Sending 'transfer' interaction...");
  await contract.writeInteraction({
    function: 'transfer',
    data: {
      to: 'another-address',
      asset: generatedAsset,
    },
  });
  await mine();
  console.log('Interaction has been sent');

  // Getting the new owner of the asset
  const { result: newOwner } = await contract.viewState({
    function: 'getOwner',
    data: { asset: generatedAsset },
  });
  console.log(`New owner of the asset ${generatedAsset}: ${newOwner}`);

  // Generating the new asset
  console.log("Sending 'generate' interaction...");
  await contract.writeInteraction({ function: 'generate' });
  await mine();
  console.log('Interaction has been sent');

  // Getting the final state
  console.log(`Getting final state`);
  const finalState = await contract.readState();
  console.log(JSON.stringify(finalState, null, 2));

  // Shutting down ArLocal
  await arLocal.stop();
})();
