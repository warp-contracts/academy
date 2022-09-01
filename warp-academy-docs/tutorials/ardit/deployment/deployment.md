# Contract deployment

In order to deploy the contract to mainnet, we need to call a function which will firstly create Warp instance...

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

Remember to create a file with your wallet jwk and keep it secret! You can generate your wallet and get its jwk by running following command:

```ts
const jwk = await warp.arweave.wallets.generate();
const walletAddress = await warp.arweave.wallets.jwkToAddress(jwk);
```

Now, you are ready to run the script

```sh
yarn ts-node src/tools/deploy-contract.ts
```

That's it, you've just deployed your contract. You can view it in [SonAr](https://sonar.warp.cc). Thanks to the Warp Sequencer (responsible for ordering transactions) and Bundlr (L2 for Arweave which guarantees instant data availability), your contract is accesible right away and you can write interactions instantly after deployment. You can interact with the contract similarly to how we did it while testing the contract. Just connect to the contract and write interactions.

```ts
const ardit = warp.contract<ArditState>(contractId).connect(ownerWallet);
await ardit.writeInteraction({
  function: 'postMessage',
  content: 'Hello world!',
});
```

Again - your transaction is bundled and available immediately. Thanks to that, you can now read the updated state of the contract

```ts
const { cachedValue } = await ardit.readState();
const state = cachedValue.state;
```
