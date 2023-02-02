# Warp Contracts isolated-vm plugin

This plugin adds a support for [isolated-vm](https://github.com/laverdet/isolated-vm#isolated-vm----access-to-multiple-isolates-in-nodejs)-based executor.

## Installation

`yarn add warp-contracts-plugin-ivm`

```js
WarpFactory.forMainnet().use(new IvmPlugin({}));
```

Requires:

1. `warp-contract` SDK ver. min. `1.2.22`.
2. At least 2GB of ram to be built - https://github.com/laverdet/isolated-vm/issues/309
3. gcc (ubuntu-like: `sudo yum install gcc gcc-c++`, fedora-like: `sudo yum install gcc gcc-c++`)
