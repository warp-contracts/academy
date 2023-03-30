# Introduction

The Warp team has implemented `atomic-asset` and `tradeable` standard in two languages Rust and Typescript.
The default implementation is composed from two standards [atomic-asset](./atomic-asset.md) and [tradeable](./tradeable.md).

You can use implementations directly, or leverage libraries which allows to compose own implementations.
Thanks to libraries it is up to you, which interfaces will you expose.:::danger

Libraries exposes functions, which as first argument accept current state of contract and return modified state.
You should check [State section](./tradeable-atomic-asset.md#state) to avoid clash of state fields names.
:::

## Discoverability

To find existing contracts implementing the atomic-asset standard, we can use `tags` that are part of every Arweave transaction.
Tags can be specified [during deployment](../docs/sdk/advanced/register-contract) of atomic-asset.

- During deployment following tag should be added : `{name: 'Indexed-By', value: 'atomic-asset'}`
  - This tag is supported by [warp-aggregate-node](../docs/aggregate-node/overview.md). Thus allow to query assets by its owner - [documentation](../docs/aggregate-node/overview.md#nft-by-owner)

## State

These is state structure for both implementations.

- `name`
  - `?string`
  - Full name of the atomic-asset, can be empty
- `description`
  - `?string`
  - Description of the atomic-asset, can be empty
- `owner`
  - `?string`
  - If the contract is `NFT` then `totalSupply == 1` and `owner` field is set
  - If the contract is fungible token, then `totalSupply > 1` and `owner` field is empty
  - If the contract is fungible token, and `totalSupply` is owned by one account then `owner` field is set to this account
- `symbol`
  - `string`
  - symbol representing asset
- `decimals`
  - `uint`
  - The number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation
- `totalSupply`
  - `uint`
  - Number of tokens that were minted
  - If `totalSupply == 1` then contract is NFT (non fungible token)
  - If `totalSupply > 1` then contract is fungible token
- `balances`
  - `Map<string,uint>`
  - Represent the mapping from user address to current balance `address => balance`
- `allowances`
  - `Map<string,Map<string, uint>>`
  - which represent allowance from user given to other users `address => (address => allowance_amount)`

## Rust implementation

- implementation can be found [here](https://github.com/warp-contracts/wrc/tree/master/contracts/atomic-asset-rust)
- library coming soon

## Typescript implementation

- implementation can be found [here](https://github.com/warp-contracts/wrc/tree/master/contracts/atomic-asset-typescript)
- library can be installed via package manager - [atomic-asset-typescript](https://www.npmjs.com/package/atomic-asset-typescript)

```
(npm) npm i atomic-asset-typescript
(yarn) yarn add atomic-asset-typescript
```

- [Minimal repository](https://github.com/warp-contracts/atomic-asset-example) showing how to construct own atomic-asset implementation using library, deploy it and interact via bindings.

## Deployment

:::info
Deployment of atomic-asset requires extra step, which is described [here](../docs/sdk/advanced/register-contract)
:::

:::info
Pre-deployed srcTxId are implementing `atomic-asset` and `tradeable` interfaces.
:::

- You can deploy from source code like any other `warp-contract` [usage](../docs/sdk/basic/deployment#deploy) and use deployed `srcTxId` as described [here](../docs/sdk/advanced/register-contract)
- Or you can use pre-deployed `srcTxId` [usage](../docs/sdk/basic/deployment#deployfromsourcetx)
  - for rust implementation: [Ftl4VQMwpSYto66XsL6_mImKxChLkOWrrL1l4B8bKV0o](https://sonar.warp.cc/#/app/source/Ftl4VQMwpSYto66XsL6_mImKxChLkOWrrL1l4B8bKV0)
  - for js implementation: [foOzRR7kX-zGzD749Lh4_SoBogVefsFfao67Rurc2Tg](https://sonar.warp.cc/#/app/source/foOzRR7kX-zGzD749Lh4_SoBogVefsFfao67Rurc2Tg)

## Bindings

You can also use javascript/typescript bindings which ease interacting with contract and expose type information.
Bindings are available on npm - [atomic-asset-js-bindings](https://www.npmjs.com/package/atomic-asset-js-bindings).

```
(npm) npm i atomic-asset-js-bindings
(yarn) yarn add atomic-asset-js-bindings
```

### Example

```ts
import { AtomicAssetContractImpl } from "atomic-asset-js-bindings";

const warp = WarpFactory.forMainnet();
const atomicAsset = new AtomicAssetContractImpl("contract_tx_id", warp);
const { balance } = await atomicAsset.balanceOf("some_address");
```
