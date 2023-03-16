# Arweave Gateway transaction loader

Warp is hardly trying to fulfill the promise of decentralization, that is way interactions and contract definitions stored on arweave can be fetched from independent sources.

## Warp Gateway

As default `warp-sdk` uses warp gateway for loading contract definitions and interactions.
`Warp Gateway` is Warp solution-oriented for performance - you can read more [here](../../gateway/overview.md).
This is the default option used when initializing `warp-sdk` for mainnet - `WarpFactory.forMainnet()`.

## Arweave Gateway

Arweave gateway is a solution maintained by the Arweave team, which allows fetching data from Arweave blockchain.
You can configure `warp-sdk` to use this gateway instead of Warp Gateway. However, be aware of the performance penalty.

### Example usage

:::info
Works only for contracts which all of transactions were processed by warp-sequencer.
We are currently working to support mixed interactions (those submitted directly to arweave or to warp-sequencer).
:::

```js
import {
  ArweaveGatewayBundledContractDefinitionLoader,
  ArweaveGatewayBundledInteractionLoader,
  defaultCacheOptions,
} from "warp-contracts";
import Arweave from "arweave/node/common";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const withArLoader = WarpFactory.custom(
  arweave,
  { inMemory: true, dbLocation: "" }, // cache
  "mainnet"
)
  .setInteractionsLoader(
    new ArweaveGatewayBundledInteractionLoader(arweave, "mainnet")
  )
  .setDefinitionLoader(
    new ArweaveGatewayBundledContractDefinitionLoader(arweave, "mainnet")
  )
  .build();

const arResult = await withArLoader
  .contract("T8Fakv0Sol6ALQ4Mt6FTxEJVDJWT-HDUmcI3qIA49U4")
  .setEvaluationOptions()
  .readState();
```

All fetched transactions are checked for sortKey integrity before evaluating state.
