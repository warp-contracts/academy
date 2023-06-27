# Obtaining `Warp` instance

`Warp` instance allows to interact with contracts (read state, write new interactions, deploy new contracts).

:::tip
To properly initialize `Warp` you can use one of three methods available in `WarpFactory`.
:::

### Local development 

Creates a Warp instance suitable for testing in a local environment (e.g. with a use of [ArLocal](https://github.com/textury/arlocal#arlocal) instance).

```typescript
const warp = WarpFactory.forLocal();
```

Default parameters (each of them can be adjusted to your needs):

1. `port` - set to `1984`
2. `arweave` - Arweave initialized with `host` set to `localhost`, `port` set to default `port` from p. 1 and `protocol` set to `http`
3. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `true`

### Testnet

Creates a Warp instance suitable for using with Warp Testnet.
All contracts and interactions are underneath posted to
Arweave mainnet, but have a special set of tag that allow to differentiate them from the mainnet transactions.

:::info
Testnet transactions have additional `Warp-Testnet` tag with a value set to testnet version (e.g. `1.0.0`).
Example [testnet transaction](https://sonar.warp.cc/#/app/interaction/YGEGvaaScY3rjp995IvC3A75Wc49pKb2rlAqUWIAGRQ?network=testnet).
:::

```typescript
const warp = WarpFactory.forTestnet();
```

Default parameters (each of them can be adjusted to your needs):

1. `arweave` - Arweave initialized with `host` set to `arweave.net`, `port` set to `443` and `protocol` set to `https`
2. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `false`

### Mainnet

Creates a Warp instance suitable for use with Arweave mainnet.
By default, the [Warp gateway](/docs/gateway/overview) is being used for:

1.  deploying contracts
2.  writing new transactions through Warp Sequencer
3.  loading contract interactions

```typescript
const warp = WarpFactory.forMainnet();
```

Default parameters (each of them can be adjusted to your needs):

1. `cacheOptions` - optional cache options parameter, by default `inMemory` cache is set to `false`
2. `useArweaveGw` - defaults to `false`, if set to `true` - `arweave.net` gateway is used for deploying contracts, writing and loading interactions
3. `arweave` - Arweave initialized with `host` set to `arweave.net`, `port` set to `443` and `protocol` set to `https`

### Warp Environment
`WarpEnvironment` is a helper type which can be used in custom scripts to determine in which environment Warp has been initialized.
The value can be obtained from the `Warp` instance.

Possible options:

`'local' | 'testnet' | 'mainnet' | 'custom';`

```javascript
if (warp.environment == 'mainnet') {
  // custom code
}
```
