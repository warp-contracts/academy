# VM2

It is possible to provide an isolated execution environment in the JavaScript implementation thanks to [VM2](https://github.com/patriksimek/vm2) - a sandbox that can run untrusted code with whitelisted Node's built-in modules. It works only in a NodeJS environment and enhances security at a (slight) cost of performance, so it should be used it for contracts one cannot trust.

## Installation

- using npm

```sh
npm install warp-contracts-plugin-vm2
```

- using yarn

```
yarn add warp-contracts-plugin-vm2
```

## Usage

In order to execute the contract in a sandboxed environment provided by VM2, attach the plugin when creating Warp instance.

```ts
import { WarpFactory } from 'warp-contracts';
import { VM2Plugin } from 'warp-contracts-plugin-vm2';

const warp = WarpFactory.forMainnet().use(new VM2Plugin());
```

:::caution
Using the plugin requires at least `warp-contracts` version `1.4.1`. For older versions of the SDK, in order to isolate the environment within VM2 please set [`evaluationOptions`](../evaluation-options.md) while connecting the contract to Warp:

```js
contract = warp.contract(contractTxId).setEvaluationOptions({
  useVM2: true,
});
```

:::
