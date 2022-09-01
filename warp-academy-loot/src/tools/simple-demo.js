const fs = require('fs');
const path = require('path');
const {LoggerFactory, WarpFactory} = require('warp-contracts');
const {default: ArLocal} = require('arlocal');

(async () => {
  let arLocal;
  try {
    // Set up ArLocal
    arLocal = new ArLocal(1985, false);
    await arLocal.start();

    // Set up Warp client
    LoggerFactory.INST.logLevel('error');
    const warp = WarpFactory.forLocal(1985);

    let wallet;
    // note: warp.testing.generateWallet() automatically adds funds to the wallet
    ({jwk: wallet} = await warp.testing.generateWallet());

    // Deploying contract
    const contractSrc = fs.readFileSync(path.join(__dirname, '../contracts/loot/contract.js'), 'utf8');
    const initialState = fs.readFileSync(path.join(__dirname, '../contracts/loot/initial-state.json'), 'utf8');
    const {contractTxId} = await warp.createContract.deploy({
      wallet,
      initState: initialState,
      src: contractSrc,
    });
    // note: we need to mine block in ArLocal - so that contract deployment transaction was mined.
    await warp.testing.mineBlock();

    // Interacting with the contract
    const contract = warp.contract(contractTxId)
      .setEvaluationOptions({allowBigInt: true})
      .connect(wallet);

    // Read state
    const {cachedValue} = await contract.readState();
    console.log('State before any interactions');
    console.dir(cachedValue.state, {depth: null});

    // Write interaction
    console.log("Sending 'generate' interaction...");
    // note: if Warp instance is created with 'forLocal' - the writeInteraction method
    // automatically mines a new block - so that you won't have to do it manually in your tests.
    // if you want to switch off automatic mining - set evaluationOptions.mineArLocalBlocks to false, e.g.
    // contract.setEvaluationOptions({ mineArLocalBlocks: false })
    await contract.writeInteraction({function: 'generate'});
    console.log('Interaction has been sent');

    // Read state after interaction
    const stateAfterInteraction = await contract.readState();
    console.log('State after 1 interaction');
    console.dir(stateAfterInteraction.cachedValue.state, {depth: null});

    // Using generatedAssets contract function
    const {result: generatedAssets} = await contract.viewState({
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
    console.log('Interaction has been sent');

    // Getting the new owner of the asset
    const {result: newOwner} = await contract.viewState({
      function: 'getOwner',
      data: {asset: generatedAsset},
    });
    console.log(`New owner of the asset ${generatedAsset}: ${newOwner}`);

    // Generating the new asset
    console.log("Sending 'generate' interaction...");
    await contract.writeInteraction({function: 'generate'});
    console.log('Interaction has been sent');

    // Getting the final state
    console.log(`Getting final state`);
    const finalState = await contract.readState();
    console.dir(finalState.cachedValue.state, {depth: null});

  } finally {
    // Shutting down ArLocal
    await arLocal.stop();
  }
})();
