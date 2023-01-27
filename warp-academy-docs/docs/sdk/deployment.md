# Deployment

### Initial state and data

By default initial state is posted in a stringified form as the data of the contract deployment transaction. If `data` argument is passed while deploying the contract (as an object containing `Content-Type` and body - see examples below), initial state is passed in the `Init-State` tag.

### Wallet

Either Arweave JWK can be passed as the `wallet` parameter or a custom signing function of type:

```ts
(tx: Transaction) => Promise<void>;
```

```ts
wallet: { signer: customSigningFunction, signatureType: 'arweave' }
```

### deploy

Deploys contract to Arweave. By default, deployment transaction is bundled and posted on Arweave using Warp Sequencer. If you want to deploy your contract directly to Arweave - disable bundling by setting `disableBundling` to `true`.

```typescript
async function deploy(contractData: ContractData, disableBundling?: boolean): Promise<ContractDeploy>;
```

<details>
  <summary>Example</summary>

```typescript
const { contractTxId, srcTxId } = await warp.deploy({
  wallet,
  initState: initialState,
  data: { 'Content-Type': 'text/html', body: '<h1>HELLO WORLD</h1>' },
  src: contractSrc,
  tags,
});
```

</details>

#### deployFromSourceTx

Deploys contract from source transaction. By default deployment transaction is bundled and posted on Arweave using Warp Sequencer. If you want to deploy your contract directly to Arweave - disable bundling by setting `disableBundling` to `true`.

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

Uses Warp Gateway's endpoint to index a contract which has already been uploaded to Bundlr (see - [Register contract](https://academy.warp.cc/docs/sdk/register-contract) section).

<details>
  <summary>Example</summary>

```typescript
const { contractTxId } = await warp.register(bundlrId, bundlrNode);
```

</details>
