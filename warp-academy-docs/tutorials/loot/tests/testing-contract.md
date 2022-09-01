# Test your contract

We strongly recommend you implement tests for all your smart contracts. It's generaly a good practice and it will help you to avoid simple bugs before deploying contracts to blockchain.

The best way to implement tests is to use a special test framework like [JEST](https://jestjs.io/). But to keep this tutorial shorter we will implement a simple Node.js testing script. It will deploy the contract, interact with it, and print some output.

We will use arlocal to run a local Arweave instance. It is much faster than the real blockchain.
And it allows us to test SmartWave contracts without spending AR tokens.

Let's create a new file `simple-demo.js`.

## 🔥 Implemented tests

You can see the ready-made implementation of the test script in [warp-academy-loot/src/tools/simple-demo.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/src/tools/simple-demo.js).  
There is also an alternative version, that works on Arweave mainnet: [warp-academy-loot/src/tools/simple-demo-prod.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/src/tools/simple-demo-prod.js).

You can also see a better solution (JEST tests) in [warp-academy-loot/tests/contracts/contract.spec.js](https://github.com/warp-contracts/academy/blob/main/warp-academy-loot/tests/contracts/contract.spec.js)

## 🌐 Test in node and browser environments

You should test your contracts in both browser and Node.js environments, so that your users are able to use them anywhere. Pay special attention to using such globals as `Buffer`, `ArrayBuffer` or `Uint8Array` that may work differently in different environments.

## ⚓ Load required modules

```javascript
// File: simple-demo.js

const fs = require('fs');
const path = require('path');
const { WarpFactory, LoggerFactory } = require('warp-contracts');
const { default: ArLocal } = require('arlocal');

(async () => {
  // the pieces of code below should be placed here
  // because they use `await`
})();
```

## 🧑‍🔧 Configure `ArLocal`, `Warp` and generate wallet.

```javascript
// File: simple-demo.js

// Set up ArLocal
const arLocal = new ArLocal(1985, false);
await arLocal.start();

// Set up Warp client
LoggerFactory.INST.logLevel('error');

// note: the 'forLocal' returns Warp instance suitable for local testing with ArLocal
// it is using in-memory cache by default and automatically mines ArLocal blocks
// after writing each interaction
const warp = WarpFactory.forLocal(1985);

// note: warp.testing.generateWallet() automatically adds funds to the wallet
({jwk: wallet, address: walletAddress} = await warp.testing.generateWallet());

```

## 🔧 Load contract source code and initial state

```javascript
// File: simple-demo.js

const contractSrc = fs.readFileSync(
  '_REPLACE_WITH_PATH_TO_CONTRACT_CODE_',
  'utf8'
);
const initialState = fs.readFileSync(
  '_REPLACE_WITH_PATH_TO_INITIAL_STATE_',
  'utf8'
);
```

## 🛳️ Deploy your contract to `ArLocal`

```javascript
// File: simple-demo.js

const contractTxId = await warp.createContract.deploy({
  wallet,
  initState: initialState,
  src: contractSrc,
});

// note: we need to mine block in ArLocal - so that contract deployment transaction was mined.
await warp.testing.mineBlock();
```

## 🤏 Interact with your contract

```javascript
// File: simple-demo.js

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
```

## 🛑 Shut down `ArLocal`

```javascript
// File: simple-demo.js

await arLocal.stop();
```
