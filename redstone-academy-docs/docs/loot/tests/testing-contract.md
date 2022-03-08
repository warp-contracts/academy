# Test your contract

We strongly recommend you implement tests for all your smart contracts. It's generaly a good practice and it will help you to avoid simple bugs before deploying contracts to blockchain.

The best way to implement tests is to use a special test framework like [JEST](https://jestjs.io/). But to keep this tutorial shorter we will implement a simple Node.js testing script. It will deploy the contract, interact with it, and print some output.

We will use arlocal to run a local Arweave instance. It is much faster than the real blockchain.
And it allows us to test SmartWave contracts without spending AR tokens.

Let's create a new file `simple-demo.js`.

## 🔥 Implemented tests

You can see the ready-made implementation of the test script in [redstone-academy-loot/src/tools/simple-demo.js](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-loot/src/tools/simple-demo.js). You can also see a better solution (JEST tests) in [redstone-academy-loot/tests/contracts/contract.spec.js](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-loot/tests/contracts/contract.spec.js)

## 🌐 Test in node and browser environments

You should test your contracts in both browser and Node.js environments, so that your users are able to use them anywhere. Pay special attention to using such globals as `Buffer`, `ArrayBuffer` or `Uint8Array` that may work differently in different environments.

## ⚓ Load required modules

```javascript
// File: simple-demo.js

const fs = require('fs');
const path = require('path');
const Arweave = require('arweave');
const { SmartWeaveNodeFactory, LoggerFactory } = require('redstone-smartweave');
const { default: ArLocal } = require('arlocal');

(async () => {
  // the pieces of code below should be placed here
  // because they use `await`
})();
```

## 🧑‍🔧 Configure `ArLocal`, `Arweave` and `SmartWeave`

```javascript
// File: simple-demo.js

// Set up ArLocal
const arLocal = new ArLocal(1985, false);
await arLocal.start();

// Set up Arweave client
const arweave = Arweave.init({
  host: 'localhost',
  port: 1985,
  protocol: 'http',
});
const wallet = await arweave.wallets.generate();
const mine = () => arweave.api.get('mine');

// Set up SmartWeave client
LoggerFactory.INST.logLevel('error');
const smartweave = SmartWeaveNodeFactory.memCached(arweave);
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

const contractTxId = await smartweave.createContract.deploy({
  wallet,
  initState: initialState,
  src: contractSrc,
});
await mine();
```

## 🤏 Interact with your contract

You can read more about interacting with your contracts in our [dedicated repo with examples.](https://github.com/redstone-finance/redstone-smartweave-examples)

```javascript
// File: simple-demo.js

// Interacting with the contract
const contract = smartweave.contract(contractTxId).connect(wallet);

// Read state
const state = await contract.readState();
console.log('State before any interactions');
console.log(JSON.stringify(state, null, 2));

// Write intetraction
console.log("Sending 'generate' interaction...");
await contract.writeInteraction({ function: 'generate' });
await mine();
console.log('Interaction has been sent');

// Read state after interaction
const stateAfterInteraction = await contract.readState();
console.log('State after 1 interaction');
console.log(JSON.stringify(stateAfterInteraction, null, 2));

// Using generatedAssets contract function
const { result: generatedAssets } = await contract.viewState({
  function: 'generatedAssets',
});
const generatedAsset = generatedAssets[0];
console.log(`Generated asset: ${generatedAsset}`);

// Transfering the asset to another address
console.log("Sending 'transfer' interaction...");
await contract.writeInteraction({
  function: 'transfer',
  data: {
    to: 'another-address',
    asset: generatedAsset,
  },
});
await mine();
console.log('Interaction has been sent');

// Getting the new owner of the asset
const { result: newOwner } = await contract.viewState({
  function: 'getOwner',
  data: { asset: generatedAsset },
});
console.log(`New owner of the asset ${generatedAsset}: ${newOwner}`);

// Generating the new asset
console.log("Sending 'generate' interaction...");
await contract.writeInteraction({ function: 'generate' });
await mine();
console.log('Interaction has been sent');

// Getting the final state
console.log(`Getting final state`);
const finalState = await contract.readState();
console.log(JSON.stringify(finalState, null, 2));
```

## 🛑 Shut down `ArLocal`

```javascript
// File: simple-demo.js

await arLocal.stop();
```
