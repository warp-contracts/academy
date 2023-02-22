# Evolve

Evolve is a feature that allows us to change contract's source code, without having to deploy a new contract. Thanks to the contract being upgradeable, the state of the contract is preserved and the logic can change. **Warp SDK** provides a handful of methods which ease the process of evolving the contract.

Below - the steps we need to follow in order to properly evolve the contract.

### canEvolve

`canEvolve` property should be set in the initial state of the contract. This way we indicate if evolving is possible.

```json
{
  "canEvolve": true
}
```

Optionally, we can also set `evolve` property to `null`. It will be later replaced with the new contract source id when `evolve` interaction will be called. If not set in the initial state - the state will be updated by the SDK when performing `evolve` interaction.

```json
{
  "evolve": null
}
```

### evolve

`evolve` function must be added to the original contract source, an example of such below:

```js
if (action.input.function === 'evolve' && state.canEvolve) {
  if (state.owner !== action.caller) {
    throw new ContractError('Only the owner can evolve a contract.');
  }

  state.evolve = action.input.value;

  return { state };
}
```

It's very important that we set the `evolve` property in the state to exactly this value - `action.input.value`. Only this way, **Warp Gateway** will be able to index new contract source and evolve will be possible for contract which were deployed through **Warp Sequencer**.

So now we have everything ready in our contract. Let's perform the evolve.

### Create new contract source data item

In order to properly evolve, we should first create new contract source data item. We can also create contract source transaction instead of data item if we want to post it later directly to Arweave and not use Bundlr to upload it. If we want to create a transaction - `disableBundling` parameter should be set to `true`.

:::caution
`createSource` method requires installing [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy). Learn more about this plugin in [`Deploy Plugin` section](https://academy.warp.cc/sdk/advanced/plugins/deployment).
:::caution

```typescript
async function createSource(
  wallet: ArWallet | CustomSignature | Signer,
  disableBundling: boolean = false
): Promise<Transaction>;
```

```typescript
interface SourceData {
  src: string | Buffer;
  wasmSrcCodeDir?: string;
  wasmGlueCode?: string;
}
```

<details>
  <summary>Example</summary>

```typescript
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { WarpFactory } from 'warp-contracts';

const wallet = JSON.parse(fs.readFileSync('<path_to_wallet>', 'utf-8'));
const contractSrc = fs.readFileSync(path.join('<path_to_your_contract.js>'), 'utf8');

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const newSource = await warp.createSource({ src: contractSrc}, new ArweaveSigner(wallet));
```

</details>

### Save new contract source

Then, we need to save freshly created source transaction using `saveSource` method. It saves source transaction created using `createSource` method; by default source transaction is sent to Warp Gateway where it is uploaded to Bundlr, if in local environment or bundle is disabled using disableBundling method - source transaction is sent directly to Arweave, returns source id.

:::caution
`saveSource` method requires installing [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy). Learn more about this plugin in [`Deploy Plugin` section](https://academy.warp.cc/sdk/advanced/plugins/deployment).
:::caution

```ts
async function saveSource(src: DataItem | Transaction, disableBundling?: boolean): Promise<string>;
```

<details>
  <summary>Example</summary>

```typescript
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
const newSrcId = await warp.saveSource(src);
```

</details>

### WASM

We can also save new WASM contract source (even if the original contract source was written in pure Javascript). The only difference is that we need to pass new contract source directory as `wasmSrcCodeDir`. Additionally - but only if we want to save Rust contract source, we need to pass a path to wasm-bindgen javascript code which was generated during the build.

```js
const src = await warp.createSource(
  {
    src: newContractSrc,
    wasmSrcCodeDir: path.join(__dirname, '../data/wasm/rust/src'),
    wasmGlueCode: path.join(__dirname, '../data/wasm/rust/rust-contract.js'),
  },
  wallet
);
```

### Call `evolve` interaction

Lastly, we need to call `evolve` interaction. **Warp SDK** provides another easy method. Here is its API:

```ts
async function evolve(newSrcTxId: string, options?: WriteInteractionOptions): Promise<WriteInteractionResponse | null>;
```

And here is the example of usage:

```js
await contract.evolve(newSrcTxId);
```

Evolved contract source is then referred to instead of the original contract source when performing any interactions after the `evolve` interaction. The state is evaluated based on all contract sources linked to the contract. There is no limitation for the number of evolved contract sources associated with one contract.

### Conclusion

If you want to see the whole implementation check out **Warp** integration tests:

1. [initial state](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.json)
2. [evolve function](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.js#L84)
3. [saving new contract source and calling `evolve` interaction](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.js#L84)
4. [WASM - saving new contract source and calling `evolve` interaction](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/wasm/rust-deploy-write-read.test.ts#L228)

It's a powerful tool but of course - use it wisely. Remember, that the contract can be used by many subjects which should be aware of any significant changes.
