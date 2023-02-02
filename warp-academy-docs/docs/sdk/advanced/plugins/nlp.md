# Warp Contracts Nlp plugin

This plugin attaches the `NlpManager` from the [nlp.js](https://www.npmjs.com/package/node-nlp) library to the `SmartWeave` global object.  
It can be then used inside the contract like this:

```js
const manager = new SmartWeave.extensions.NlpManager({ languages: ['en'], forceNER: true, nlu: { log: true } });
```

## Installation

`yarn add warp-contracts-plugin-nlp`

```ts
import { NlpExtension } from 'warp-contracts-nlp-plugin';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet().use(new NlpExtension());
```

Requires `warp-contract` SDK ver. min. `1.2.18`.
