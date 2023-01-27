# WarpFactory

To properly initialize Warp you can use one of three methods available in WarpFactory class which simplifies the process of creating Warp.

### forLocal

Creates a Warp instance suitable for testing in a local environment (e.g. with a use of ArLocal instance).

```typescript
warp = WarpFactory.forLocal();
```

Default parameters (each of them can be adjusted to your needs):

1. `port` - set to `1984`
2. `arweave` - Arweave initialized with `host` set to `localhost`, `port` set to default `port` from p. 1 and `protocol` set to `http`
3. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `true`

#### forTestnet

Creates a Warp instance suitable for testing.

```typescript
warp = WarpFactory.forTestnet();
```

Default parameters (each of them can be adjusted to your needs):

1. `arweave` - Arweave initialized with `host` set to `arweave.net`, `port` set to `443` and `protocol` set to `https`
2. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `false`

#### forMainnet

Creates a Warp instance suitable for use with mainnet.
By default, the [Warp gateway](https://github.com/warp-contracts/gateway#warp-gateway) is being used for:

1.  deploying contracts
2.  writing new transactions through Warp Sequencer
3.  loading contract interactions

```typescript
warp = WarpFactory.forMainnet();
```

Default parameters (each of them can be adjusted to your needs):

1. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `false`
2. `useArweaveGw` - defaults to `false`, if set to `true` - `arweave.net` gateway is used for deploying contracts, writing and loading interactions
3. `arweave` - Arweave initialized with `host` set to `arweave.net`, `port` set to `443` and `protocol` set to `https`

#### custom

Allows to fully customize `Warp` instance.

```typescript
warp = WarpFactory.custom(
  arweave,
  {
    ...defaultCacheOptions,
    inMemory: true,
  },
  'testnet'
)
  .useArweaveGateway()
  .setInteractionsLoader(loader)
  .build();
```

No default parameters are provided, these are the parameters that you can adjust to your needs:

1. `arweave` - initializes Arweave
2. `cacheOptions` - optional cache options parameter
3. `environment` - environment in which Warp will be initialized

`custom` method returns preconfigured instance of `Warp` - `WarpBuilder` which can be customized, the configuration is finished with `build` method.
