# Bundled deploy

### deploy

We can benefit from **Warp sequencer** and deploy our contract using bundler. The API is trivial:

```ts
deploy(contractData: ContractData, useBundler?: boolean): Promise<string>;
```

If you are interested in exploring the `ContractData` interface, you can check it out [here](https://github.com/warp-contracts/warp/blob/main/src/contract/deploy/CreateContract.ts#L26).

So, if you want to bundle the deployment of your contract, simply call the `deploy` function without passing 2nd. argument - as it is `true` by default.
Here is the example:

```ts
await warp.createContract.deploy(
  {
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  }
);
```

It works for regular Javascript contracts as well as for WASM contracts.

### deployFromSourceTx

We can also deploy our contract directly from the already deployed source. It is useful when multiple contracts use the same contract source.
The API is very similar to the regular deploy method (again - second argument needs to be set to `true` - which is the default value).
Instead of passing the contract source we just need to pass its id.

```ts
const contractTxId = await warp.createContract.deployFromSourceTx(
  {
    wallet,
    initState: initialState,
    srcTxId: srcTxId,
  }
);
```
