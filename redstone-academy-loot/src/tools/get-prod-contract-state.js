const Arweave = require('arweave');
const { SmartWeaveNodeFactory, LoggerFactory } = require("redstone-smartweave");
const wallet = require("../../.secrets/jwk.json");
const { loot: lootContractAddress } = require("../deployed-contracts.json");

(async () => {
  // Set up Arweave client
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });

  // Set up SmartWeave client
  LoggerFactory.INST.logLevel('error');
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Interacting with the contract
  const contract = smartweave
    .contract(lootContractAddress)
    .connect(wallet)
    .setEvaluationOptions({
      waitForConfirmation: true,
    });

  // Read state
  const state = await contract.readState();
  console.log("Current state for contract: " + lootContractAddress);
  console.log(JSON.stringify(state, null, 2));
})();
