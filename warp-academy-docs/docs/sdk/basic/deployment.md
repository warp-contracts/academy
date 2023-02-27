# Contract Deployment

In order to read contracts' state or write new interactions - you must first deploy it to the Arweave network.  
This obviously requires a prepared contract code - if you want to write your first contract - head to the [ArDit tutorial](https://academy.warp.cc/tutorials/ardit/introduction/intro).

### DeployPlugin

Since `warp-contracts@1.2.54` deployment functionality has been moved to a dedicated plugin - [`warp-contracts-plugin-deploy`](https://www.npmjs.com/package/warp-contracts-plugin-deploy). In order to use it and deploy your contract you must first install the plugin:

```sh
yarn add warp-contracts-plugin-deploy

npm install warp-contracts-plugin-deploy
```

...and then attach it to the `Warp` instance:

```ts
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet().use(new DeployPlugin());
```

### Deployment methods

Further informations about deployment - including all possible deployment methods can be found in the [DeployPlugin docs](https://academy.warp.cc/docs/sdk/advanced/plugins/deployment).

### Bundled contract format

You can learn more about how your contract is being posted to Arweave in [Bundled contract format section](https://academy.warp.cc/docs/sdk/advanced/bundled-contract).