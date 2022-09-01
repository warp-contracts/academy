const { WarpFactory, LoggerFactory, defaultCacheOptions} = require("warp-contracts");
const wallet = require("../../.secrets/jwk.json");
const { loot: lootContractAddress } = require("../deployed-contracts.json");

(async () => {
  // Set up Warp client
  LoggerFactory.INST.logLevel('error');
  const warp = WarpFactory.forMainnet({...defaultCacheOptions, inMemory: true});

  // Interacting with the contract
  const contract = warp
    .contract(lootContractAddress)
    .connect(wallet)
    .setEvaluationOptions({
      allowBigInt: true,
    });

  // Read state
  console.log('Reading contract state...');
  const {cachedValue} = await contract.readState();
  console.log("Current state for contract: " + lootContractAddress);
  console.dir(cachedValue.state, {depth: null});
})();
