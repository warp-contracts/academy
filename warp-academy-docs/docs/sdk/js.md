# JavaScript / TypeScript contracts

WASM provides proper sandboxing ensuring execution environment isolation which guarantees security to the contracts execution. As for now - **Assemblyscript**, **Rust** and **Go** languages are supported. WASM contracts templates containing example PST contract implementation within tools for compiling contracts to WASM, testing, deploying (locally, on testnet and mainnet) and writing interactions are available in a [dedicated repository](https://github.com/warp-contracts/warp-wasm-templates).

Using SDKs' methods works exactly the same as in case of a regular JS contract. While deploying the contract, you just need to pass some additional arguments:

```ts
const contractTxId = await warp.createContract.deploy({
  wallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
  wasmSrcCodeDir: path.join(__dirname, '../data/wasm/rust/src'),
  wasmGlueCode: path.join(__dirname, '../data/wasm/rust/rust-pst.js'),
});
```

Additionally, it is possible to set gas limit for interaction execution in order to e.g. protect a contract against infinite loops. Defaults to `Number.MAX_SAFE_INTEGER` (2^53 - 1).

```js
contract = smartweave.contract(contractTxId).setEvaluationOptions({
  gasLimit: 14000000,
});
```
