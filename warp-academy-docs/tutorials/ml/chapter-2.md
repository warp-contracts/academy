# 📦 Chapter II - Trust no one
Now that we've posted the price package within the transaction, we need to somehow
verify and unpack this data in the contract.

<figure style={{width: 400}}>

![machine.jpeg](/img/tutorial/ml/machine.jpeg)
<figcaption align = "center"><i>"a machine unpacking and verifying data, simple colors, retro futurism old poster"</i></figcaption>

</figure>

### RedStone Oracles extension

In order to do this, the contract code has to have
access to the `redstone-protocol` library from the RedStone Oracles ecosystem.

First we need to install the library:  
```sh
npm install --save redstone-protocol
```

We will now introduce a Warp Plugin 🔌 - `SmartWeave` [extension](../../docs/sdk/advanced/plugins/custom-extension) that will make `redstone-protocol` available for the contract code.

:::info
Each Warp Plugin must implement two functions:
1. `process` - it performs the plugin's logic. In case of SmartWeave extensions, the `input` parameter
is simply the `SmartWeave.extensions` object - where you can attach your libraries.
2. `type` - the name of the plugin - required by the SDK to differentiate between differentiate types of plugins.
In case of SmartWeave extension - the type must begin with `smartweave-extension-` prefix.

The full API of a Warp Plugin interface is [here](https://github.com/warp-contracts/warp/blob/main/src/core/WarpPlugin.ts).
:::

```javascript
import * as redstone from "redstone-protocol";

export class RedStonePlugin  {
  process(input) {
    input.redstone = redstone;
  }

  type() {
    return 'smartweave-extension-redstone';
  }
}
```

and plug it into our `Warp` instance:
```javascript
const warp = WarpFactory.forMainnet()
  .use(new RedStonePlugin());
```

:::warning
Always double-check whether the code of the library that you add via an extension is deterministic!

Also - consider using SmartWeave extensions as a last resort and use it only if attaching the library
code into the contract code itself is not possible.
Attaching libraries code into the contract increases decentralization and makes it easier to evaluate the contract
\- as the clients don't need to attach specific plugins.
A good example of a contract with attached libraries is WeaveDB's [solution](https://sonar.warp.cc/#/app/contract/f86Qw3vp6TlgxI3mABFnWDQNqR8mPVkVTBN04hwywqc#code).
:::

Now that we have the `Warp` instance configured with a new extension, we can use this extension in our contract code to verify
the incoming price packages.

### Defining authorised signers
Each price package is signed by one of the nodes from the given RedStone Oracles data service.
The list of the nodes and their EVM address can be obtained from [here](https://app.redstone.finance/#/app/data-services/redstone-avalanche-prod).

Let's use the [constructor](../../docs/sdk/advanced/constructor) to define a list of authorised signers.
The Warp SDK ensures that the constructor will be called exactly once, as a first function during contract evaluation.

```js
// constructor - https://docs.warp.cc/docs/sdk/advanced/constructor
if (input.function === '__init') {
    // redstone-avalanche-prod nodes
    state.redstoneAuthorizedSigners = [
      '0x1eA62d73EdF8AC05DfceA1A34b9796E937a29EfF',
      '0x2c59617248994D12816EE1Fa77CE0a64eEB456BF',
      '0x12470f7aBA85c8b81D63137DD5925D6EE114952b',
      '0x109B4a318A4F5ddcbCA6349B45f881B4137deaFB',
      '0x83cbA8c619fb629b81A65C2e67fE15cf3E3C9747'
    ];
    
    return {state};
}

```

To use a constructor, we must deploy a contract with a proper manifest (with `useConstructor` option set to `true`) - that will specify that the SDK must
call the constructor function before evaluating any interaction:

```javascript
const {contractTxId} = await warp.deploy({
    wallet: signer,
    initState: JSON.stringify({}),
    src: CONTRACT_CODE,
    evaluationManifest: {
      evaluationOptions: {
        useConstructor: true
      }
    }
  });
```

### Verifying data package

Having authorised signers defined and our new RedStone Oracles Protocol extension added, we can write a function that will extract price, its timestamp and
verify the signature.

```js
function extractValueFromPricePackage(pricePackage, authorizedSigners) {
  // redstone-protocol extension
  const redstone = SmartWeave.extensions.redstone;

  // parse stringified version
  const pricePackageObj = JSON.parse(pricePackage);
  
  // create a SignedDataPackage from object
  const signedDataPackage = redstone.SignedDataPackage.fromObj(pricePackageObj);
  
  // recover signer address from the package
  const recoveredSignerAddress = signedDataPackage.recoverSignerAddress();

  // check if signer address is within authorized signers
  if (!authorizedSigners.includes(recoveredSignerAddress)) {
    throw new ContractError(`Unauthorized price package signer: ${recoveredSignerAddress}`);
  }
  
  return {v: pricePackageObj.dataPoints[0].value, t: pricePackageObj.timestampMilliseconds};
}
```

:::caution
In a real-life contract, the validation should be twofold:
1. the signatures validation - already implemented
2. the timestamps validation - if you want to teach your network with 'current' price data, you should verify whether
the incoming prices packages are not too 'old' (e.g. older than 1 Arweave block - roughly 2 minutes) and no older
than the previously accepted data (or - the other way - are not sent from the 'future' 🙂).  
Consider this as a homework!
:::

With this function ready, we can finally start writing our main contract function - `train`
```js
if (input.function === 'train') {
  // get the stringified price package from the interaction input
  const pricePackage = input.pricePackage;

  // verify the price package signature and extract price with a timestamp
  const priceWithTimestamp = extractValueFromPricePackage(pricePackage, state.redstoneAuthorizedSigners);
  logger.info('train:', priceWithTimestamp);
  
  // add to data to train
  state.toTrain.push(priceWithTimestamp);

  // train the network every 5th package
  if (state.toTrain.length == 5) {
    logger.info('training');
    doTrain(state);
  }

  return {state};
}
```

Did you notice the `doTrain` function? It's the core of our smart contract - let's move to the next chapter!
