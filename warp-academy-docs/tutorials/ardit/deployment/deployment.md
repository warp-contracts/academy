# Contract deployment

In order to deploy the contract to mainnet, we need to call an asynchronous function which will firstly create Warp instance...

```ts
// src/tools/deploy-contract.ts

const warp = WarpFactory.forMainnet();
```

...then read our compiled contract source and define initial state for the contract...

```ts
// src/tools/deploy-contract.ts

const contractSrc = fs.readFileSync(
  path.join(__dirname, '../../dist/contract.js'),
  'utf8'
);

const initialState = {
  messages: [],
};
```

...and lastly deploy the contract using `deploy` method from Warp SDK

```ts
// src/tools/deploy-contract.ts

const { contractTxId } = await warp.createContract.deploy({
  wallet: jwk,
  initState: JSON.stringify(initialState),
  src: contractSrc,
});
```

Remember to create a file with your wallet jwk and keep it secret!

Now, you are ready to run the script

```sh
yarn ts-node src/tools/deploy-contract.ts
```

That's it, you've just deployed your contract. You can view it in [SonAr](https://sonar.warp.cc). You can now interact with the contract similarly to how we did it while testing the contract. Just connect to the contract and write interactions.

```ts
const ardit = warp.contract<ArditState>(contractId).connect(ownerWallet);
await ardit.writeInteraction({
  function: 'postMessage',
  content: 'Hello world!',
});
```

You can now read the updated state of the contract

```ts
const { cachedValue } = await ardit.readState();
const state = cachedValue.state;
```
