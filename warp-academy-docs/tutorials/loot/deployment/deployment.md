# Deploy your contract

The smart contract deployment code is very similar to the one that we used in the testing script.
You can see an example of the deployment script in [warp-academy-loot/src/tools/deploy-contracts.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/src/tools/deploy-contracts.js).

After running the deployment script, both the contract's transaction id and source transaction id will be printed (along with a generated link to SonAR contracts explorer).
Thanks to Warp infrastructure, the contract can be used immediately after deployment.

## 🔥 Interact with the deployed contract
To learn how to interact with your deployed contract check out scripts:
* for local development - [warp-academy-loot/src/tools/simple-demo.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/src/tools/simple-demo.js)
* for Arweave mainnet - [warp-academy-loot/src/tools/simple-demo-prod.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/src/tools/simple-demo-prod.js)
