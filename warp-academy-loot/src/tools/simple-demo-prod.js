const {LoggerFactory, WarpFactory, defaultCacheOptions} = require("warp-contracts");
const wallet = require("../../.secrets/jwk.json");
const fs = require("fs");
const path = require("path");

(async () => {
  // Set up Warp client
  LoggerFactory.INST.logLevel('error');

  // note: by default 'forMainnet' creates a Warp instance that is using persistent cache
  // we're setting the "inMemory" here for the cache options - so that no cache files
  // would be stored between script calls.
  const warp = WarpFactory.forMainnet({...defaultCacheOptions, inMemory: true});

  // Deploying contract
  const contractSrc = fs.readFileSync(path.join(__dirname, '../contracts/loot/contract.js'), 'utf8');
  const initialState = fs.readFileSync(path.join(__dirname, '../contracts/loot/initial-state.json'), 'utf8');
  const {contractTxId} = await warp.createContract.deploy({
    wallet,
    initState: initialState,
    src: contractSrc,
  });

  // Interacting with the contract
  const contract = warp
    .contract(contractTxId)
    .connect(wallet)
    .setEvaluationOptions({
      allowBigInt: true,
    });

  // Read state
  const result1 = await contract.readState();
  console.log("State before any interactions");
  console.dir(result1.cachedValue.state, {depth: null});

  // Write interaction
  console.log("Sending 'generate' interaction...");
  await contract.writeInteraction({function: "generate"});
  console.log("Interaction has been sent");

  // Read state after interaction
  const stateAfterInteraction = await contract.readState();
  console.log("State after 1 interaction");
  console.dir(stateAfterInteraction.cachedValue.state, {depth: null});

  // Using generatedAssets contract function
  const {result: generatedAssets} = await contract.viewState({
    function: "generatedAssets"
  });
  const generatedAsset = generatedAssets[0];
  console.log(`Generated asset: ${generatedAsset}`);

  // Transferring the asset to another address
  console.log("Sending 'transfer' interaction...");
  await contract.writeInteraction({
    function: "transfer",
    data: {
      to: "another-address",
      asset: generatedAsset,
    },
  });
  console.log("Interaction has been sent");

  // Getting the new owner of the asset
  const {result: newOwner} = await contract.viewState({
    function: "getOwner",
    data: {asset: generatedAsset}
  });
  console.log(`New owner of the asset ${generatedAsset}: ${newOwner}`);

  // Generating the new asset
  console.log("Sending 'generate' interaction...");
  await contract.writeInteraction({function: "generate"});
  console.log("Interaction has been sent");

  // Getting the final state
  console.log(`Getting final state`);
  const finalState = await contract.readState();
  console.dir(finalState.cachedValue.state, {depth: null});
})();
