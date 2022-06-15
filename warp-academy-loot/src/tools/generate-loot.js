const Arweave = require('arweave');
const { WarpNodeFactory, LoggerFactory } = require("warp-contracts");
const wallet = require("../../.secrets/jwk.json");
const { loot: lootContractAddress } = require("../deployed-contracts.json");

(async () => {
  // Set up Arweave client
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  // Set up Warp client
  LoggerFactory.INST.logLevel('silly');
  const warp = WarpNodeFactory.memCached(arweave);

  // Interacting with the contract
  const contract = warp
    .contract(lootContractAddress)
    .connect(wallet)
    .setEvaluationOptions({
      waitForConfirmation: true,
    });

  // Generating a loot
  console.log('Generating a loot');
  await contract.writeInteraction({
    function: "generate",
  });
  console.log('Completed');
})();
