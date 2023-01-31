# Cache

Warp uses [LevelDB](https://github.com/google/leveldb) to cache the state. During the state evaluation, state is then evaluated only for the interactions that the state hasn't been evaluated yet. State is being cached per transaction and not per block height.
The reason behind that caching per block height is not enough if multiple interactions are at the same height and two contracts interact with each other.
The LevelDB is a lexicographically sorted key-value database - so it's ideal for this use case - as it simplifies cache look-ups (e.g. lastly stored value or value "lower-or-equal" than given sortKey). The cache for contracts are implemented as [sub-levels](https://www.npmjs.com/package/level#sublevel--dbsublevelname-options).
The default location for the node.js cache is `./cache/warp`.

In the browser environment Warp uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to cache the state - it's a low-level API for client-side storage.
The default name for the browser IndexedDB cache is warp-cache.

In order to reduce the cache size, the oldest entries are automatically pruned.

It is possible to use the in-memory cache instead by setting `cacheOptions.inMemory` to `true` while initializing Warp. `inMemory` cache is used by default in local environment.

You can also supply your own implementation of the `SortKeyCache` interface and use them as a state and contracts cache.
In order to use custom implementation call either `useStateCache` or `useContractCache` on `warp` instance.
An example - LMDB - implementation is available [here](https://github.com/warp-contracts/warp-contracts-lmdb#warp-contracts-lmdb-cache).
