# `Contract` instance

After obtaining a `warp` instance via one of the `WarpFactory` methods, we can now 'attach' it to a specific contract.
Simply call:
```typescript
const contract: Contract = warp.contract('<contract_tx_id>');
```

:::info
The `Contract` instance gives us access to several methods that allow to interact with our SmartWeave contract.
:::

## Basic `Contract` methods

### `readState`

```typescript
import { SortKeyCacheResult } from './SortKeyCache';

async function readState(sortKeyOrBlockHeight?: string | number): Promise<SortKeyCacheResult<EvalStateResult<State>>>;
```

Returns the state of the contract. If no `sortKeyOrBlockHeight` is passed, the most recent state will be evaluated and returned.

- `sortKeyOrBlockHeight` - either a sort key (see [SmartWeave Protocol](https://academy.warp.cc/docs/sdk/smartweave-protocol) to read more about sort keys) or block height at which the contract's state should be returned

The result contains fields:
- `sortKey` - that sort key at which the state has been evaluated
- `cachedValue.state` - the evaluated state
- `cachedValue.validity` - the validity report. If interaction is processed properly, a `true` value is set for its id.
If interaction throws any kind of error - `false` will be set.
- `cachedValue.errorMessage` - the error message registered during evaluation - i.e. the messages of all the `ContractError` thrown.

<details>
  <summary>Example</summary>

```typescript
const { sortKey, cachedValue } = await contract.readState();
```

</details>

---

### `connect`

```typescript
connect(signer: ArWallet | CustomSignature): Contract<State>;
```

Allows to connect wallet to a contract. Connecting a wallet MAY be done before `viewState` (depending on contract implementation, i.e. whether called contract's function required "caller" info).   
Connecting a wallet MUST be done before `writeInteraction`.

- `signer` - Arweave JSON Web Key (JWK), 'use_wallet' string or custom signing function of type:

```ts
{
  signer: SigningFunction;
  type: SignatureType;
}
```

<details>
  <summary>Example</summary>

```typescript
const contract = warp.contract('YOUR_CONTRACT_TX_ID').connect(jwk);
```

</details>

---

### `viewState`

```typescript
async function viewState<Input = unknown, View = unknown>(
  input: Input,
  tags?: Tags
): Promise<InteractionResult<State, View>>;
```

Returns the "view" of the state, computed by the SmartWeave contract - i.e. object that is a derivative of a current contract state and some specific smart contract business logic.  
Similar to the `view` function from [Solidity](https://docs.soliditylang.org/en/v0.8.17/contracts.html#view-functions).

- `input` the interaction input
- `tags` an array of tags with name/value as objects

<details>
  <summary>Example</summary>

```typescript
const { result } = await contract.viewState({
  function: "NAME_OF_YOUR_FUNCTION",
  data: { ... }
});
```

</details>

### `writeInteraction`

```typescript
async function writeInteraction<Input = unknown>(
  input: Input,
  options?: WriteInteractionOptions
): Promise<WriteInteractionResponse | null>;
```

Writes a new "interaction" transaction - i.e. such transaction that stores input for the contract.
The interaction transactions are loaded during the contract state evaluation.

- `input` the interaction input
- `options` - an object with some custom options (see [WriteInteractionOptions](https://github.com/warp-contracts/warp/blob/main/src/contract/Contract.ts#L49))

In case of the `forMainnet` and `forTestnet` obtained `Warp` instances, interaction transactions are bundled and posted on Arweave using Warp Sequencer.  
If you want to post transactions directly to Arweave - disable bundling by setting `options.disableBundling` to `true`.

The result contains
- `originalTxId` - the transaction id of the newly created interaction
- `bundlrResponse` - the response from Bundlr

<details>
  <summary>Example</summary>

```typescript
const result = await contract.writeInteraction({
  function: "NAME_OF_YOUR_FUNCTION",
  data: { ... }
});
```

</details>

---


#### `setEvaluationOptions`

```typescript
function setEvaluationOptions(options: Partial<EvaluationOptions>): Contract<State>;
```

Allows to set [EvaluationOptions](https://github.com/warp-contracts/warp/blob/main/src/core/modules/StateEvaluator.ts#L98) that will overwrite current configuration.

<details>
  <summary>Example</summary>

```typescript
const contract = warp.contract('YOUR_CONTRACT_TX_ID').setEvaluationOptions({
  waitForConfirmation: true,
  ignoreExceptions: false,
});
```

</details>

---



#### `dryWrite`

```typescript
async function dryWrite<Input>(
  input: Input,
  caller?: string,
  tags?: Tags,
  transfer?: ArTransfer
): Promise<InteractionResult<State, unknown>>;
```

A dry-write operation on contract. It first loads the contract's state and then creates a "dummy" transaction and applies the given Input on top of the current contract's state.

- `input` - input to be applied on the current contract's state
- `tags` - additional tags to be added to interaction transaction
- `transfer` - additional transfer data to be associated with the "dummy" transaction
- `caller` - an option to override the caller - if available, this value will overwrite the caller evaluated from the wallet connected to this contract.

<details>
  <summary>Example</summary>

```typescript
const result = await contract.dryWrite({
  function: "NAME_OF_YOUR_FUNCTION",
  data: { ... }
});
```

</details>

---

