# Implementation tutorial for loot contract on SmartWeave

This tutorial shows how to implement a simple loot contract on SmartWeave protocol.

### What is SmartWeave
[SmartWeave](https://www.npmjs.com/package/redstone-smartweave) is a new generation of smart contracts built on Arweave.
It uses lazy-evaluation to move the burden of contract execution from network nodes to smart contract users.

### The smart contract idea
We will implement a simple [LOOT](https://www.lootproject.com/)-like contract, which allows to generate and transfer different magical assets, like for example `black silver sword` or `blue gold crown`. Each asset will be unique and can belong to only one wallet at a time.

Initially there are no generated assets, but users will be able to generate and claim them.
Users also will be able to transfer their assets to others.

### Deployed version
We've already deployed this contract on the Arweave blockchain. Its transaction id is [Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY](https://scanner.redstone.tools/#/app/contract/Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY). You can check its source code in our [Scanner.](https://scanner.redstone.tools/#/app/contract/Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY#code)

### 🙋‍♂️ Need help?
Please feel free to contact us [on Discord](https://redstone.finance/discord) if you have any questions.

### Prerequisites
- Prepared Node.js environment
- `yarn` installed
- Basic Javascript coding skills
- Basic understanding of [SmartWeave](https://www.npmjs.com/package/redstone-smartweave)

## 📦 Install dependencies
```bash
# Install dependencies
$ yarn add arweave redstone-smartweave

# Install dev dependencies
$ yarn add arlocal jest -D
```

## 🧑‍💻 Implement the smart contract
💡 You can find the ready-made implementation of the smart contract in [src/contracts/loot.](../src/contracts/loot)

### Start with a state
The first 2 things you should think about before implementing a SmartWeave contract are
- what you need to store in the contract state
- how to store it there in the most efficient and easy-to-use way

In our case the state can have 2 properties:
- `name` - name of the loot pool
- `assets` - object with assets ({ "assetName": "ownerAddress", ... })

Initially the `assets` object will be empty. But it will be filling with the newly generated assets, pointing to their owners. This state structure allows to quickly understand who owns an asset or switch the ownership.

Let's save the initial state in JSON format to `initial-state.json` file
```json
{
  "name": "SmartWeave loot",
  "assets": {}
}
```

### Implement contract logic in Javascript
Let's create a new file `contract.js` and add the following initial code
```javascript
// file: contract.js

export async function handle(state, action) {
  // All the smart contract code should be be placed inside the handle function
  // ...
}
```
As you can see the `handle` function has 2 arguments, that will be fulfilled with values during interaction with the contract. The `state` argument will contain (guess what) the state. And the `action` argument will contain information about the interaction function name and (optioanlly) its arguments.

#### Implement the first method `name`
Let's implement the first (and the simplest) function for getting the name of the loot pool.
```javascript
// file: contract.js

switch (action.input.function) {
  case "name": {
    return { result: state.name };
  }

  default: {
    throw new ContractError(
      `Unsupported contract function: ${functionName}`);
  }
}
```
💡 Note! This function reads from state, but doesn't change it.

#### Implement `getOwner` and `transfer` methods
Let's add some token-like methods inside the `swtich` block.
```javascript
// file: contract.js

case "getOwner": {
  const asset = action.input.data.asset;
  if (state.assets[asset]) {
    return { result: state.assets[asset] };
  } else {
    return { result: `The asset "${asset}" doesn't exist yet` };
  }
}

case "transfer": {
  const toAddress = action.input.data.to;
  const asset = action.input.data.asset;
  if (state.assets[asset] !== action.caller) {
    throw new ContractError("Can not transfer asset that doesn't belong to sender");
  }
  state.assets[asset] = toAddress;
  return { state };
}
```
As you can see, the `getOwner` function also doesn't change the contract state, while the `transfer` function updates the owner of the provided asset. This interaction will require sending a transaction to Arweave and the sender will need to pay some fee in AR tokens.

#### Implement `generate` method
Great! Now we can implement the core function for the whole contract.

We can add the following arrays right after the first contract line.
```javascript
// file: contract.js

const COLORS = ["green", "red", "yellow", "blue", "black", "brown", "pink", "orange", "purple", "gray"];
const MATERIALS = ["gold", "wood", "silver", "fire", "diamond", "platinum", "palladium", "bronze", "lithium", "titanium"];
const ITEMS = ["sword", "shield", "robe", "stone", "crown", "katana", "dragon", "ring", "axe", "hammer"];
```

Then, we add a `generate` function inside the `switch .. case` block

```javascript
// file: contract.js

case "generate": {
  const colorIndex = await getRandomIntNumber(COLORS.length, "color");
  const materialIndex = await getRandomIntNumber(MATERIALS.length, "material");
  const itemIndex = await getRandomIntNumber(ITEMS.length, "item");
  const asset = COLORS[colorIndex] + " " + MATERIALS[materialIndex] + " " + ITEMS[itemIndex];

  if (!state.assets[asset]) {
    state.assets[asset] = action.caller;
  } else {
    throw new ContractError(
      `Generated item (${asset}) is already owned by: ${state.assets[asset]}`);
  }
  return { state };
}
```

But it would need a help function `getRandomIntNumber` for random number generation. It's not an easy task to generate random numbers in Smart Contracts. For the sake of simplicity we'll create a pseudo-random number generation, which will be based on current block height, transaction id, caller address, timestamp and some unique value.

```javascript
// file: contract.js

function bigIntFromBytes(byteArr) {
  let hexString = "";
  for (const byte of byteArr) {
    hexString += byte.toString(16).padStart(2, '0');
  }
  return BigInt("0x" + hexString);
}

// This function calculates a pseudo-random int value,
// which is less then the `max` argument.
// Note! To correctly generate several random numbers in
// a single contract interaction, you should pass different
// values for the `uniqueValue` argument
async function getRandomIntNumber(max, uniqueValue = "") {
  const pseudoRandomData = SmartWeave.arweave.utils.stringToBuffer(
    SmartWeave.block.height
    + SmartWeave.block.timestamp
    + SmartWeave.transaction.id
    + action.caller
    + uniqueValue
  );
  const hashBytes = await SmartWeave.arweave.crypto.hash(pseudoRandomData);
  const randomBigInt = bigIntFromBytes(hashBytes);
  return Number(randomBigInt % BigInt(max));
}
```

💡 Note! You can use the global variable `SmartWeave` inside your contract code. You can learn more about it [here.](https://github.com/redstone-finance/redstone-smartweave/blob/main/src/legacy/smartweave-global.ts)

#### Add bonus methods `generatedAssets` and `assetsLeft`
Ok, the core part of the contract is ready. So let's add 2 bonus methods inside the `switch .. case` block.
```javascript
// file: contract.js

case "generatedAssets": {
  return { result: Object.keys(state.assets) };
}

case "assetsLeft": {
  const allAssetsCount = COLORS.length * MATERIALS.length * ITEMS.length;
  const generatedAssetsCount = Object.keys(state.assets).length;
  const assetsLeftCount = allAssetsCount - generatedAssetsCount;
  return { result: assetsLeftCount };
}
```

Boom! The contract code is ready to ~~use~~ test.

## 🔥 Test your contract
I strongly recommend you to implement tests for all your smart contracts. It's generaly a good practice and it will help you to avoid silly bugs before deploying contracts to blockchain.

The best way to implement tests is to use a special test framework like [JEST](https://jestjs.io/). But to keep this tutorial shorter we will implement a simple Node.js testing script. It will deploy the contract, interact with it, and print some output.

We will use arlocal to run a local Arweave instance. It is much faster than the real blockchain.
And it allows to test SmartWave contracts without spending AR tokens.

Let's create a new file `simple-demo.js`.

### Implemented tests
You can see the ready-made implementation of the test script in [src/tools/simple-demo.js](../src/tools/simple-demo.js). You can also see a better solution (JEST tests) in [tests/contracts.](../tests/contracts)

### Test in node and browser environments
You should test your contracts in both browser and Node.js environments, so that your users are able to use them anywhere. Pay special attention to using such globals as `Buffer`, `ArrayBuffer` or `Uint8Array` that may work differently in different environments.

#### 1.Load required modules
```javascript
// File: simple-demo.js

const fs = require('fs');
const path = require('path');
const Arweave = require('arweave');
const { SmartWeaveNodeFactory, LoggerFactory } = require("redstone-smartweave");
const { default: ArLocal } = require("arlocal");

(async () => {
  // the pieces of code below should be placed here
  // because they use `await`
})();
```

#### 2. Configure `ArLocal`, `Arweave` and `Smarteave`
```javascript
// File: simple-demo.js

// Set up ArLocal
const arLocal = new ArLocal(1985, false);
await arLocal.start();

// Set up Arweave client
const arweave = Arweave.init({
  host: "localhost",
  port: 1985,
  protocol: "http"
});
const wallet = await arweave.wallets.generate();
const mine = () => arweave.api.get("mine");

// Set up SmartWeave client
LoggerFactory.INST.logLevel('error');
const smartweave = SmartWeaveNodeFactory.memCached(arweave);
```

#### 3. Load contract source code and initial state
```javascript
// File: simple-demo.js

const contractSrc = fs.readFileSync("_REPLACE_WITH_PATH_TO_CONTRACT_CODE_", "utf8");
const initialState = fs.readFileSync("_REPLACE_WITH_PATH_TO_INITIAL_STATE_", "utf8");
```

#### 4. Deploy your contract to arlocal
```javascript
// File: simple-demo.js

const contractTxId = await smartweave.createContract.deploy({
  wallet,
  initState: initialState,
  src: contractSrc
});
await mine();
```

#### 5. Interact with your contract
You can read more about interacting with your contracts in our [dedicated repo with examples.](https://github.com/redstone-finance/redstone-smartweave-examples)

```javascript
// File: simple-demo.js

// Interacting with the contract
const contract = smartweave
  .contract(contractTxId)
  .connect(wallet);

// Read state
const state = await contract.readState();
console.log("State before any interactions");
console.log(JSON.stringify(state, null, 2));

// Write intetraction
console.log("Sending 'generate' interaction...");
await contract.writeInteraction({ function: "generate" });
await mine();
console.log("Interaction has been sent");

// Read state after interaction
const stateAfterInteraction = await contract.readState();
console.log("State after 1 interaction");
console.log(JSON.stringify(stateAfterInteraction, null, 2));

// Using generatedAssets contract function
const { result: generatedAssets } = await contract.viewState({
  function: "generatedAssets"
});
const generatedAsset = generatedAssets[0];
console.log(`Generated asset: ${generatedAsset}`);

// Transfering the asset to another address
console.log("Sending 'transfer' interaction...");
await contract.writeInteraction({
  function: "transfer",
  data: {
    to: "another-address",
    asset: generatedAsset,
  },
});
await mine();
console.log("Interaction has been sent");

// Getting the new owner of the asset
const { result: newOwner } = await contract.viewState({
  function: "getOwner",
  data: { asset: generatedAsset }
});
console.log(`New owner of the asset ${generatedAsset}: ${newOwner}`);

// Generating the new asset
console.log("Sending 'generate' interaction...");
await contract.writeInteraction({ function: "generate" });
await mine();
console.log("Interaction has been sent");

// Getting the final state
console.log(`Getting final state`);
const finalState = await contract.readState();
console.log(JSON.stringify(finalState, null, 2));

```

#### 6. Shut down arlocal
```javascript
// File: simple-demo.js

await arLocal.stop();
```

## 🔒 Deploy your contract
The smart contract deployment code is very similar to the one that we've used in the testing script. You can see an example of the deployment script in [src/tools/deploy-contracts.js.](../src/tools/deploy-contracts.js).

After running the deployment script the contract transaction Id will be printed.
This transaction should be mined on Arweave in about 20-30 minutes. You can check its status on [Viewblock.](https://viewblock.io)

## 🔥 Interact with the deployed contract
To learn how to interact with your deployed contract, check out our [dedicated repo with examples.](https://github.com/redstone-finance/redstone-smartweave-examples)
