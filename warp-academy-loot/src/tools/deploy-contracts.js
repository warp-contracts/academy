const fs = require("fs");
const path = require("path");
const { WarpFactory } = require("warp-contracts");
const jwk = require("../../.secrets/jwk.json");

(async () => {
  // Loading contract source and initial state from files
  const contractSrcPromise = fs.promises.readFile(path.join(__dirname, "../contracts/loot/contract.js"), "utf8");
  const initialStatePromise = fs.promises.readFile(path.join(__dirname, "../contracts/loot/initial-state.json"), "utf8");
  const [contractSrc, initialState] = await Promise.all([contractSrcPromise, initialStatePromise])
  // Warp initialization for mainnet
  const warp = WarpFactory.forMainnet();

  // Deploying contract
  console.log("Deployment started");
  const result = await warp.createContract.deploy({
    wallet: jwk,
    initState: initialState,
    src: contractSrc,
  });

  console.log("Deployment completed: ", {
    ...result,
    sonar: `https://sonar.warp.cc/#/app/contract/${result.contractTxId}`
  });
})();
