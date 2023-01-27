# Contract methods

### `connect`

```typescript
connect(signer: ArWallet | CustomSignature): Contract<State>;
```

Allows to connect wallet to a contract. Connecting a wallet MAY be done before "viewState" (depending on contract implementation, ie. whether called contract's function required "caller" info) Connecting a wallet MUST be done before "writeInteraction".

- `signer` - JWK object with private key, 'use_wallet' string or custom signing function of type:

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

#### `readState`

```typescript
import { SortKeyCacheResult } from './SortKeyCache';

async function readState(
  sortKeyOrBlockHeight?: string | number,
  currentTx?: { contractTxId: string; interactionTxId: string }[],
  interactions?: GQLNodeInterface[]
): Promise<SortKeyCacheResult<EvalStateResult<State>>>;
```

Returns state of the contract at required blockHeight or sortKey. Similar to the `readContract` from the version 1.

- `sortKeyOrBlockHeight` - either a sortKey or block height at which the contract should be read
- `currentTx` - if specified, will be used as a current transaction
- `interactions`

<details>
  <summary>Example</summary>

```typescript
const { sortKey, cachedValue } = await contract.readState();
```

</details>

---

#### `viewState`

```typescript
async function viewState<Input = unknown, View = unknown>(
  input: Input,
  tags?: Tags,
  transfer?: ArTransfer
): Promise<InteractionResult<State, View>>;
```

Returns the "view" of the state, computed by the SWC - ie. object that is a derivative of a current state and some specific smart contract business logic. Similar to the `interactRead` from the current SDK version.

- `input` the interaction input
cdf-0dxsbjn- `tags` an array of tags with name/value as objects
- `transfer` target and winstonQty for transfer

<details>
  <summary>Example</summary>

```typescript
const { result } = await contract.viewState<any, any>({
  function: "NAME_OF_YOUR_FUNCTION",
  data: { ... }
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

#### `writeInteraction`

```typescript
async function writeInteraction<Input = unknown>(
  input: Input,
  options?: WriteInteractionOptions
): Promise<WriteInteractionResponse | null>;
```

Writes a new "interaction" transaction - i.e. such transaction that stores input for the contract.

- `input` the interaction input
- `options` - an object with some custom options (see [WriteInteractionOptions](https://github.com/warp-contracts/warp/blob/main/src/contract/Contract.ts#L49))

By default write interaction transactions are bundled and posted on Arweave using Warp Sequencer. If you want to post transactions directly to Arweave - disable bundling by setting `options.disableBundling` to `true`.

<details>
  <summary>Example</summary>

```typescript
const result = await contract.writeInteraction({
  function: "NAME_OF_YOUR_FUNCTION",
  data: { ... }
});
```

</details>
