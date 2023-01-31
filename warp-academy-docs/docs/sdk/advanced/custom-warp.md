# Custom `Warp` instance

The `Warp` instance can be fully customized by the `WarpFactory.custom` method.

```typescript
const warp = WarpFactory.custom(
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

`custom` method returns preconfigured instance of `WarpBuilder` which can be further customized,
the configuration is finished with `build` method.
