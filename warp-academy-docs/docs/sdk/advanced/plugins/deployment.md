# Warp Contracts Plugin - Deploy Plugin

Warp Contracts SDK's main aim is to serve as a contract evaluator. However, it can be extended with `DeployPlugin` which enables several contract deployment methods.

### Installation and usage

In order to use `DeployPlugin` firstly, install [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy):

```sh
yarn add warp-contracts-plugin-deploy

npm install warp-contracts-plugin-deploy
```

...and then attach it to the `Warp` instance:

```ts
import { DeployPlugin } from 'warp-contracts-deploy-plugin';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
```

Now, all the deployment methods are available directly from the Warp instance, e.g.:

```ts
const { contractTxId, srcTxId } = await warp.deploy({
  wallet: new ArweaveSigner(wallet),
  initState: JSON.stringify(initialState),
  src: jsContractSrc,
});
```

### Signer

In order to use most of the deployment methods, you will need a wallet which serves as a way of identifying on blockchain. In order to generate one you can simply create using:

#### Arweave

- [`arweave.app`](https://arweave.app/welcome)
- [`ArConnect`](https://www.arconnect.io)
- [`arweave.js`](https://github.com/ArweaveTeam/arweave-js)

#### Ethereum

- [`Metamask`](https://metamask.io)
- [`ethers`](https://docs.ethers.org/v5)

Then, all you need to do is save wallet's keyfile and include it in your project (preferably in `.secrets` folder which won't be exposed to the public).

You will then pass wallet to the deployment methods by setting it as a constructor to one of the dedicated objects. They can all be imported from `warp-contracts-plugin-deploy`:

**server environment**

- `ArweaveSigner`
- `EthereumSigner`

**browser environment**

- `InjectedArweaveSigner`
- `InjectedEthereumSigner`

<details>
  <summary>Example</summary>

```typescript
const wallet = JSON.parse(fs.readFileSync('<path_to_wallet>', 'utf-8'));
const signer = new ArweaveSigner(wallet);
```

</details>

### Initial state

Each contract should have initial state which can be then changed by calling contract interaction functions. It's represented as a simple object, e.g.:

```ts
{
  "owner": "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M",
  "canEvolve": true,
  "balances": {
    "uhE-QeYS8i4pmUtnxQyHD7dzXFNaJ9oMK-IM-QPNY6M": 10000000
  }
}
```

When passing initial state as an argument to the deployment method, it should be stringified.

### Contract Source

Contract source is the essence of the contract containing all interaction functions. It has to be written in Javascript (or compiled to either Javascript or WASM) and then passed to the deployment method. You can learn a lot more about how to write contract source in one of the tutorials - [Ardit](https://academy.warp.cc/tutorials/ardit/introduction/intro) or [PST](https://academy.warp.cc/tutorials/pst/introduction/intro).

### Deployment methods

#### deploy

Deploys contract to Arweave.
Two separate transactions are deployed - one with contract's source and another - with contracts' metadata and its initial state.  
Such separation allows to deploy multiple contracts using the exact same source transaction.

By default, deployment transactions are bundled and posted to Arweave using Warp Gateway.  
If you want to deploy your contract directly to Arweave - disable bundling by setting `disableBundling` to `true`.

The `ContractDeploy` result contains

- `contractTxId` - the id of the newly deployed contract
- `srcTxId` - the id the transaction that contains the contract's source code

```typescript
async function deploy(contractData: ContractData, disableBundling?: boolean): Promise<ContractDeploy>;
```

<details>
  <summary>Example</summary>

```typescript
const initialState = {};
const wallet = JSON.parse(fs.readFileSync('<path_to_wallet>', 'utf-8'));
const contractSrc = fs.readFileSync(path.join('<path_to_your_contract.js>'), 'utf8');

const { contractTxId, srcTxId } = await warp.deploy({
  wallet: new ArweaveSigner(wallet), // usually your Arweave wallet
  initState: JSON.stringify(initialState), // remember to stringify the initial state object
  src: contractSrc,
});
```

</details>

If you want to deploy contract with a `WASM` contract source, simply pass additional arguments indicating path to the source code and WASM glue code. You can learn more about writing `WASM` contracts in a dedicated [`WASM templates repository`](https://github.com/warp-contracts/warp-wasm-templates).

<details>
  <summary>Example</summary>

```typescript
const initialState = {};
const contractSrc = fs.readFileSync(path.join('<path_to_your_contract.wasm>'));

const { contractTxId, srcTxId } = await warp.deploy({
  wallet: new ArweaveSigner(wallet), // usually your Arweave wallet
  initState: JSON.stringify(initialState), // remember to stringify the initial state object
  src: contractSrc,
  wasmSrcCodeDir: path.join(__dirname, '<path_to_the_source_code>'),
  wasmGlueCode: path.join(__dirname, '<path_to_the_wasm_glue_code.js>'),
});
```

</details>

#### deployFromSourceTx

Deploys contract from a source transaction. By default, deployment transaction is bundled and posted on Arweave using Warp Gateway.
If you want to deploy your contract directly to Arweave - disable bundling by setting `disableBundling` to `true`.

```typescript
async function deployFromSourceTx(
  contractData: FromSrcTxContractData,
  disableBundling?: boolean
): Promise<ContractDeploy>;
```

<details>
  <summary>Example</summary>

```typescript
const { contractTxId, srcTxId } = await warp.deployFromSourceTx({
  wallet,
  initState: initialState,
  srcTxId: 'SRC_TX_ID',
});
```

</details>

#### deployBundled

Uses Warp Gateway's endpoint to upload raw data item to Bundlr and index it.

<details>
  <summary>Example</summary>

```typescript
const { contractTxId } = await warp.deployBundled(rawDataItem);
```

</details>

#### register

Registering contract is descirbed in details in [`Register contract` section](https://academy.warp.cc/docs/sdk/advanced/register-contract).

#### createSource

Creating source is described in details in [`Contracts upgrades` section](https://academy.warp.cc/docs/sdk/basic/evolve#create-new-contract-source-transaction).

#### saveSource

Saving source is described in details in [`Contracts upgrades` section](https://academy.warp.cc/docs/sdk/basic/evolve#save-new-contract-source-transaction).

### Bundled contract format

You can learn more about how your contract is being posted to Arweave in [Bundled contract format section](https://academy.warp.cc/docs/sdk/advanced/bundled-contract).
