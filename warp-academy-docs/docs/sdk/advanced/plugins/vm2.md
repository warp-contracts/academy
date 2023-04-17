# VM2

It is possible to provide an isolated execution environment in the JavaScript implementation thanks to [VM2](https://github.com/patriksimek/vm2) - a sandbox that can run untrusted code with whitelisted Node's built-in modules. It works only in a NodeJS environment and enhances security at a (slight) cost of performance, so it should be used it for contracts one cannot trust.

## Installation

:::caution
Using the plugin requires at least `warp-contracts` version `1.4.1`. If your are using older version of the Warp SDK, please refer to the description [here](../vm2.md)
:::

```sh
npm install warp-contracts-plugins-vm2

or

yarn add warp-contracts-plugins-vm2
```

## Usage

In order to execute the contract in a sanboxed environment provided by VM2, attach the plugin when creating Warp instance.

```ts
import { WarpFactory } from 'warp-contracts';
import { VM2Plugin } from 'warp-contracts-plugin-deploy';

const warp = WarpFactory.forMainnet().use(new VM2Plugin());
```
