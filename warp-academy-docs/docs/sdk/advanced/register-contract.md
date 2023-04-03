# Register contract

Typically, deploying a contract through Warp Gateway requires wrapping contract transaction in another transaction (Warp Gateway posts a contract transaction to the Bundlr Network as a data of the bundled transaction - more about in [this doc](/docs/sdk/advanced/bundled-contract)).

This process does not allow to create a legit AtomicNFT as the data of the nested transaction (our contract) cannot be served via Arweave gateway (it will be possible as soon as Nested Bundles will be implemented by Warp).

Therefore, a new contract creation method has been exposed in Warp SDK. Let's go through the process.

1. User needs to prepare contract transaction, all the tags required by the [SmartWeave Protocol](/docs/sdk/advanced/smartweave-protocol) need to be included, initial state should be set in the tag, tags specific for AtomicNFT ('Title', 'Description', 'Type', 'Content-Type') should also be included in the contract tags.

```ts
const contractTags = [
  { name: 'Content-Type', value: 'text/plain' },
  { name: 'App-Name', value: 'SmartWeaveContract' },
  { name: 'App-Version', value: '0.3.0' },
  { name: 'Contract-Src', value: 'XA-sFBRvgIFFklmDV-TUlUPc3_pE3rIsXwH2AjwOYrQ' },
  {
    name: 'Init-State',
    value: JSON.stringify({
      ticker: 'ATOMIC_ASSET',
      owner: address,
      canEvolve: true,
      balances: {
        [address]: 10000000,
      },
      wallets: {},
    }),
  },
  { name: 'Title', value: 'Asset' },
  { name: 'Description', value: 'Description' },
  { name: 'Type', value: 'Text' },
];
```

2. User then needs to initialize Bundlr and uploads the contract within data:

```ts
const jwk = JSON.parse(fs.readFileSync('.secrets/warp-wallet-jwk.json').toString());
const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);

const data = fs.readFileSync('tools/data/data.txt');

const tx = await bundlr.upload(data, { tags: contractTags });
```

3. Finally, contract is sent to Warp Gateway where it is indexed so it can be immediately available for all Warp tools, contract data can be also served by Arweave gateway.

:::caution
`register` method requires installing [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy). Learn more about this plugin in [`Deploy Plugin` section](plugins/deployment).
:::caution

```ts
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const { contractTxId } = await warp.register(tx.id, 'node2');
console.log(`Check the data: https://arweave.net/${contractTxId}`);
```

The whole process allows to have data and contract linked into one transaction and both are served under the same id.
