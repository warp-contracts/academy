# Warp Contracts Plugin - Ethers

This plugin attaches the `ethers.utils` from the [ethers](https://www.npmjs.com/package/ethers) library to the `SmartWeave` global object.  
It can be then used inside the contract like this:

```js
const address = SmartWeave.extensions.ethers.utils.verifyMessage(message, signature);
```

## Installation

`yarn add warp-contracts-plugin-ethers`

```ts
import { EthersExtension } from 'warp-contracts-plugin-ethers';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet().use(new EthersExtension());
```

Requires `warp-contracts` SDK ver. min. `1.2.30`.
