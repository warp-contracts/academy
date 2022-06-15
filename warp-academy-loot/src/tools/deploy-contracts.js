const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
const { WarpNodeFactory } = require("warp-contracts");
const jwk = require("../../.secrets/jwk.json");

(async () => {
  // Loading contract source and initial state from files
  const contractSrc = fs.readFileSync(path.join(__dirname, "../contracts/loot/contract.js"), "utf8");
  const initialState = fs.readFileSync(path.join(__dirname, "../contracts/loot/initial-state.json"), "utf8");

  // Arweave and Warp initialization
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  const warp = WarpNodeFactory.memCached(arweave);

  // Deploying contract
  console.log("Deployment started");
  const contractTxId = await warp.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc
  });
  console.log("Deployment completed: " + contractTxId);
})();
