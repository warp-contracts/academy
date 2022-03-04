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
  case 'name': {
    return { result: state.name };
  }

  default: {
    throw new ContractError(`Unsupported contract function: ${functionName}`);
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

const COLORS = [
  'green',
  'red',
  'yellow',
  'blue',
  'black',
  'brown',
  'pink',
  'orange',
  'purple',
  'gray',
];
const MATERIALS = [
  'gold',
  'wood',
  'silver',
  'fire',
  'diamond',
  'platinum',
  'palladium',
  'bronze',
  'lithium',
  'titanium',
];
const ITEMS = [
  'sword',
  'shield',
  'robe',
  'stone',
  'crown',
  'katana',
  'dragon',
  'ring',
  'axe',
  'hammer',
];
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
  let hexString = '';
  for (const byte of byteArr) {
    hexString += byte.toString(16).padStart(2, '0');
  }
  return BigInt('0x' + hexString);
}

// This function calculates a pseudo-random int value,
// which is less then the `max` argument.
// Note! To correctly generate several random numbers in
// a single contract interaction, you should pass different
// values for the `uniqueValue` argument
async function getRandomIntNumber(max, uniqueValue = '') {
  const pseudoRandomData = SmartWeave.arweave.utils.stringToBuffer(
    SmartWeave.block.height +
      SmartWeave.block.timestamp +
      SmartWeave.transaction.id +
      action.caller +
      uniqueValue
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
