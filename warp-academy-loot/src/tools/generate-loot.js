const {WarpFactory, LoggerFactory, defaultCacheOptions} = require("warp-contracts");
const wallet = require("../../.secrets/jwk.json");
const {loot: lootContractAddress} = require("../deployed-contracts.json");

(async () => {
  LoggerFactory.INST.logLevel('error');
  const warp = WarpFactory.forMainnet({...defaultCacheOptions, inMemory: true});

  // Interacting with the contract
  const contract = warp
    .contract(lootContractAddress)
    .connect(wallet)
    .setEvaluationOptions({
      allowBigInt: true,
    });

  // Generating a loot
  console.log('Generating a loot');
  const {originalTxId} = await contract.writeInteraction({
    function: "generate",
  });

  console.log('Completed, txId:', originalTxId);
})();
