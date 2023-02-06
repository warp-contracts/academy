# Cache

### LevelDB cache
By default, Warp uses [LevelDB](https://github.com/google/leveldb) to cache the state and contracts (metadata, source code, etc).

During the state evaluation, state is then evaluated only for the interactions that the state hasn't been evaluated yet.

:::info
State is being cached per transaction (i.e. its **sort key**) and NOT per block height.

Each contract may have multiple transactions at any given block height - that's why caching by block height is not sufficient
\- especially when contracts interact with each other.
:::

:::info

The cache for contracts' state is implemented as [sub-levels](https://www.npmjs.com/package/level#sublevel--dbsublevelname-options).
The default location for the Node.js cache is `./cache/warp`.

:::

:::info
In the browser environment Warp uses [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to cache the state - it's a low-level API for client-side storage.
The default name for the browser IndexedDB cache is warp-cache.
:::

In order to reduce the cache size, the oldest entries are automatically pruned.

:::tip
It is possible to use the in-memory cache instead by setting `cacheOptions.inMemory` to `true` while initializing Warp. `inMemory` cache is used by default in local environment.
:::

:::tip
You can also supply your own implementation of the `SortKeyCache` interface and use them as a state and contracts cache.
In order to use custom implementation call either `useStateCache` or `useContractCache` on `warp` instance.
:::

### LMDB cache
Warp Contracts implementation of the `SortKeyCache` using the [LMDB](https://github.com/kriszyp/lmdb-js#readme) database.

:::tip
LMDB is a much better solution (than LevelDB) in terms of read/write access times and concurrent access. Comparison by [Mozilla](https://mozilla.github.io/firefox-browser-architecture/text/0017-lmdb-vs-leveldb.html).
:::

#### Installation
:::caution
LMDB based cache is compatible only with Node.js env.
:::

```
yarn add warp-contracts-lmdb
```

:::info
Requires `warp-contracts` SDK ver. min. 1.2.17
:::

#### Custom options
LmdbCache constructor accepts a second param with custom configuration.

| Option                | Required   | Description                                                                                                                           |
|-----------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------|
| maxEntriesPerContract |   false    | Maximum number of interactions stored per contract id - above this threshold adding another entry triggers removing old interactions. |
| minEntriesPerContract |   false    | Minimum number of interactions stored per contract id. Value used when removing old iteractions.                                      |

#### Usage

```js
const {defaultCacheOptions, WarpFactory} = require("warp-contracts");
const {LmdbCache} = require("warp-contracts-lmdb");

const warp = WarpFactory
  .forMainnet()
  .useStateCache(new LmdbCache({
      ...defaultCacheOptions,
      dbLocation: `./cache/warp/state`
    }, {
      maxEntriesPerContract: 100, 
      minEntriesPerContract: 10
    }
  ))
  .useContractCache(
    // Contract cache
    new LmdbCache({
    ...defaultCacheOptions,
    dbLocation: `./cache/warp/contracts`
    }), 
    // Source cache
    new LmdbCache({
    ...defaultCacheOptions,
    dbLocation: `./cache/warp/src`
  }));
```
