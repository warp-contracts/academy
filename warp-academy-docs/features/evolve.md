# Evolve

Evolve is a feature that allows to change contract's source code, without having to deploy a new contract. Thanks to contract being upgradeable, state of the contract is preserved and the logic can change. **Warp SDK** provides couple of handful methods which ease the process of evolving the contract.

Below - the steps we need to follow in order to properly evolve the contract.

### canEvolve

`canEvolve` property should be set in the initial state of the contract. This way we indicate if evolving is possible.

```json
{
  "canEvolve": true
}
```

Optionally, we can also set `evolve` property to `null`. It will be later replaced with the new contract source id when `evolve` interaction will be called. If not set in the initial state - the state will be updated by the SDK when performing `evolve` interaction.

```json
{
  "evolve": null
}
```

### evolve

`evolve` function must be added to the original contract source, an example of such below:

```js
if (action.input.function === 'evolve' && state.canEvolve) {
  if (state.owner !== action.caller) {
    throw new ContractError('Only the owner can evolve a contract.');
  }

  state.evolve = action.input.value;

  return { state };
}
```

It's very important that we set the `evolve` property in wer state to exactly this value - `action.input.value`. Only this way, **Warp Gateway** will be able to index new contract source and evolve will be possible for contract which were deployed through **Warp Sequencer**.

So now we have everything ready in our contract. Let's perform the evolve.

### Post new contract source on Arweave

In order to properly perform evolve, we should first post new contract source on **Arweave**. We post it exactly the same way we would post the original contract source. **Warp SDK** provides a one-liner method to easily save the source but let's see what happens underneath:

```js
const tx = await arweave.createTransaction({ data: newContractSource }, wallet);
tx.addTag(SmartWeaveTags.APP_NAME, 'SmartWeaveContractSource');
tx.addTag(SmartWeaveTags.APP_VERSION, '0.3.0');
tx.addTag('Content-Type', 'application/javascript');
await arweave.transactions.sign(tx, wallet);
await arweave.transactions.post(tx);
```

So we create **Arweave** transaction with data set to the new contract source, we add tags specific for SmartWeave contract source transaction. Finally, we sign it and post it.

Here's the promised one-liner:

```js
const newSrcTxId = await contract.save({ src: newSource });
```

Yes, it's that simple. We can also save new WASM contract source (even if the original contract source was written in pure Javascript). The only difference is that we need to pass new contract source directory as `wasmSrcCodeDir`. Additionally - but only if we want to save Rust contract source, we need to pass path to wasm-bindgen javascript code which was generated during the build.

```js
const newSrcTxId = await pst.save({
  src: newContractSrc,
  wasmSrcCodeDir: path.join(__dirname, '../data/wasm/rust/src'),
  wasmGlueCode: path.join(__dirname, '../data/wasm/rust/rust-contract.js'),
});
```

Remember, that currently it is not possible to save new contract source using **Warp Sequencer**, so we are posting transaction directly on **Arweave**. That's why, we should wait up to 20 minutes for the transaction to be mined. we can check its status using following endpoint:

```js
`https://arweave.net/tx/${newSrcTxId}`;
```

### Call `evolve` interaction

Lastly, we need to call `evolve` interaction. **Warp SDK** provides another easy method. Here is its API:

```js
evolve(newSrcTxId: string, useBundler?: boolean): Promise<string | null>;
```

And here is the example of usage:

```js
await contract.evolve(newSrcTxId, true);
```

Please note, that we need to pass `true` as the second argument if we want to bundle the interaction using **Warp Sequencer**.

Evolved contract source is then referred instead of the original contract source when performing any interactions after the `evolve` interaction. The state is evaluated based on all contract sources linked to the contract. There is no limitation for number of evolved contract sources associated to one contract.

### Conclusion

That's it! We just evolved our contract. If we want to see the whole implementation check out **Warp** integration tests:

1. [initial state](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.json)
2. [evolve function](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.js#L84)
3. [saving new contract source and calling `evolve` interaction](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/token-pst.js#L84)
4. [WASM - saving new contract source and calling `evolve` interaction](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/wasm/rust-deploy-write-read.test.ts#L228)

It's a powerful tool but of course - use it wisely. Remember, that wer contract can be used by many subjects which should be aware of any significant changes.
