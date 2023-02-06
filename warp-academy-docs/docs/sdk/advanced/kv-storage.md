# Key-Value Storage for contracts

An alternative way for storing state for contracts.
:::caution
Consider this as an experimental feature (though already used by our own contracts), with some constraints (see below).
:::
### Why?
Imagine a PST contract with millions of entries in the 'balances' map.
With the traditional way of storing a state - a change for one entry, requires passing to contract the whole state (the json) and then storing/caching it again - with only this one change.
This is a big issue both from the storage perspective (we have to cache very similar, very big json's) and performance perspective - as the state needs to be deep-copied before each interaction - to assure a transactional processing (i.e. either all changes from a given interactions should be applied - or none, in case the contract would throw an Error).

### Solution
An alternative way of storing a contract state - via a Key-Value storage (backed-up by default by the LevelDB) has been introduced.
This allows to store and/or retrieve only required parts of the state within any given interaction - instead of having to process the whole BIG json each time.

#### API
The `SmartWeave` 'global' object has 2 new methods added:
1. `SmartWeave.kv.put(key, value)` - allows to store a value (e.g. a wallet balance)
2. `SmartWeave.kv.get(key)` - allows to retrieve a value from the storage by its key

The `Contract` interface has a new method added:
`getStorageValues(keys: string[]): Promise<SortKeyCacheResult<Map<string, any>>>`
\- which allows to check the latest values for the passed array of keys.

:::info
All the changes in the KV storage done within one given interaction are atomic - either all will be applied, or none (in case of an `ContractError`) - this is handled by the `commit`/`rollback` mechanism.
:::

#### Enabling KV storage for contract
In order to use a KV storage in the contract, either:
1. the contract's manifest must be specified during deployment - with a `useKVStorage` option set to `true`:
```ts
await warp.deploy({
      wallet,
      initState: JSON.stringify(initialState),
      src: contractSrc,
      evaluationManifest: {
        evaluationOptions: {
          useKVStorage: true
        }
      }
    }));
```

2. the `evaluationOptions` used for contract evaluation must have the `useKVStorage` option set true, e.g.:
```ts
warp.pst(contractTxId).setEvaluationOptions({
      useKVStorage: true
    }) as PstContract
```    

:::info
With the KV Storage, the 'traditional', json-based state can be still used for storing some of the data (e.g. the name and the ticker of the PST)
:::
#### Example usage in the contract
Examples of using the storage in the contract code (in a standard, PST `transfer` method):

```js
  if (input.function === 'transfer') {
    // NOTE: initial validations are skipped for code brevity
    const target = input.target;
    const qty = input.qty;

    // NOTE: getting a value from the KV storage
    let callerBalance = await SmartWeave.kv.get(caller);
    callerBalance = callerBalance ? callerBalance : 0;

    if (callerBalance < qty) {
      throw new ContractError(`Caller balance not high enough to send ${qty} token(s)!`);
    }

    callerBalance -= qty;
    // NOTE: upserting a value in the KV storage
    await SmartWeave.kv.put(caller, callerBalance);

    let targetBalance = await SmartWeave.kv.get(target);
    targetBalance = targetBalance ? targetBalance : 0;

    targetBalance += qty;
    await SmartWeave.kv.put(target, targetBalance);

    return {state};
  }
``` 

The full contract example is available here: https://github.com/warp-contracts/warp/blob/24c47c01c5f85734e5be69a18bd3092e2a99c1a7/src/__tests__/integration/data/kv-storage.js

#### Example of retrieving the values via SDK
```ts
const result = (await contract.getStorageValues(['voo', 'doo'])).cachedValue;
const fooValue = result.get('voo');
const dooValue = result.get('doo');
```

### Constraints
:::caution
Currently - when using KV storage - no interactions with foreign contracts are allowed. Such support will be added in the future PRs.
The bindings for the Rust are not yet implemented - will be added in https://github.com/warp-contracts/warp/issues/330
:::

### Implementation details
1. the 'put' method adds an entry to the array. All entries from this array are 'committed' to the underneath storage only when SDK verifies that the result of the given interaction is successful.
2. all entries have the sortKey added to the the stored key (the sortKey is taken from the `SmartWeave._activeTx`).
3. The underlying storage is an implementation of the SDKs `SortKeyCache` interface. By default it is using the LevelDB (with a file based storage for node.js env and IndexedDB storage for browser env)
4. Any storage compatible with `SortKeyCache` interface can be used (e.g. https://github.com/warp-contracts/warp-contracts-lmdb#warp-contracts-lmdb-cache).
   In order to configure custom storage - use the `warp.useKVStorageFactory` method, e.g.:
```js
WarpFactory.forMainnet()
  .useKVStorageFactory((contractTxId) => new LmdbCache({
    ...defaultCacheOptions,
    dbLocation: `./cache/warp/kv/lmdb_2/${contractTxId}`
  }))
```

:::info
The cache for each contract has to be stored in a separate db file - that's why the `useKVStorageFactory` has the `contractTxId` as an argument.
:::





