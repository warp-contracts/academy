# Register contract

Typically, deploying a contract through Warp Gateway requires wrapping contract transaction in another transaction (Warp Gateway posts a contract transaction to the Bundlr Network as a data of the bundled transaction - more about in [this doc](https://academy.warp.cc/docs/sdk/advanced/bundled-contract/)).

As Warp Contracts has implemented the Nested Bundled standard development process, we can now create a legit AtomicNFT as the nested transaction (our contract) can be served via Arweave.


Here is a method for creating a contract. Let's go through the process.

1. User needs to prepare contract transaction, all the tags required by the [SmartWeave Protocol](https://academy.warp.cc/docs/sdk/advanced/smartweave-protocol) need to be included, initial state should be set in the tag, tags specific for AtomicNFT ('Title', 'Description', 'Type', 'Content-Type') should also be included in the contract tags.

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
`register` method requires installing [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy). Learn more about this plugin in [`Deploy Plugin` section](https://academy.warp.cc/sdk/advanced/plugins/deployment).
:::caution

```ts
import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const { contractTxId } = await warp.register(tx.id, 'node2');
console.log(`Check the data: https://arweave.net/${contractTxId}`);
```

The whole process allows to have data and contract linked into one transaction and both are served under the same id.
