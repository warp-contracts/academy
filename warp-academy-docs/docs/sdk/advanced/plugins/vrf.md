# Verifiable Random Function

This plugin allows to:
1. generate a mock VRF data (useful for testing using `forLocal` Warp instance).
2. verify VRF proof during state evaluation (for each interaction that contain VRF data generated by the sequencer).
## Installation

- using npm

```sh
npm install warp-contracts-plugin-vrf
```

- using yarn

```
yarn add warp-contracts-plugin-vrf
```

## Usage

```ts
import { WarpFactory } from 'warp-contracts';
import { VRFPlugin } from "warp-contracts-plugin-vrf";

const warp = WarpFactory.forMainnet().use(new VRFPlugin());
```

:::caution
This plugin requires at least `warp-contracts` version `1.4.4`.
For older versions of the SDK, the plugin functionality is included in the SDK itself.
:::