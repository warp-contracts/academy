# Contract Deployment

In order to read contracts' state or write new interactions - you must first deploy it to the Arweave network.  
This obviously requires a prepared contract code - if you want to write your first contract - head to the [ArDit tutorial](http://localhost:3000/tutorials/ardit/introduction/intro).

You will also need an Arweave wallet and (optionally) - contract's initial state.

Several deploy methods are available on a `Warp` instance.

### deploy

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
const contractSrc = fs.readFileSync(path.join('<path_to_your_contract.js>'), 'utf8')

const { contractTxId, srcTxId } = await warp.deploy({
  wallet, // usually your Arweave wallet
  initState: JSON.stringify(initialState), // remember to stringify the initial state object
  src: contractSrc
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
