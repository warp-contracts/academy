# Internal calls

### Internal reads

Internal read is a way for contracts to read each others' state. Here's how we use it in the contract:

```js
const state = await SmartWeave.contracts.readContractState(action.input.contractId);
```

The whole interaction function may look like this:

```js
if (action.input.function === 'readContract') {
  const id = action.input.contractId;
  const contractState = SmartWeave.contracts.readContractState(id);
  return { result: contractState };
}
```

### Internal view state

Internal view state is a way for a contract to ask other contract about its state. This is different from internal read in the following ways:

- internal read simply provides a whole state of one contract to another. The state is usually taken from SDK cache (or evaluated if there are new interactions).
There is no interaction between contracts
- internal view state is a contract method. Caller has to provide input for the method and callee calculates requested 'view' on a state (usually not the whole state) based on the
current state and the input of view state method

Here's how we use it in the contract:

```js
const balanceResult = await SmartWeave.contracts.viewContractState(action.input.contractId, {
  function: "balance",
  target: action.input.wallet
});

if (balanceResult.type == 'ok' && balanceResult.result.balance > 0) {
  // contract logic
}

return { state };
```

### Internal writes

Internal write on the other hand, is a way for contracts to write interactions to some external contract.

In order for internal writes to work we need to set `internalWrites` evaluation option to `true`.
If you are not familiar with the `EvaluationOptions` interface, check out [Warp SDK](https://github.com/warp-contracts/warp/blob/main/src/core/modules/StateEvaluator.ts#L123).
Basically, setting `evaluationOptions` lets us change the behavior of some contract features.

```ts
const callingContract = smartweave
  .contract<ExampleContractState>(calleeTxId)
  .setEvaluationOptions({
    internalWrites: true,
  })
  .connect(wallet);
```

We use internal writes similar to how we would use internal reads. However, apart from indicating contract id, we need to specify the function we want to call in the external contract:

```js
await SmartWeave.contracts.write(contractTxId, { function: 'add' });
```

Here's how we could write our internal writes based interaction:

```js
if (action.input.function === 'addAndWrite') {
  const result = await SmartWeave.contracts.write(action.input.contractId, {
    function: 'addAmount',
    amount: action.input.amount,
  });

  state.counter += result.state.counter;

  return { state };
}
```

The internal writes method first evaluates the target (specified by the `contractTxId` given in the first parameter) contract's state up to the "current" block height (i.e. block height of the interaction that is calling the write method) and then applies the input (specified as the second parameter of the write method).
The result is memoized in cache.
If the internal write will throw an exception - the original transaction (the 'callee' transaction) will throw `ContractError` by default -
you don't have to manually check the result of the internal write.

For each newly created interaction with a given contract - a dry run is performed and the call report of the dry-run is analyzed.
A list of all inner-calls between contracts is generated.
For each generated inner call - an additional tag is generated: `{'interactWrite': contractTxId}` - where `contractTxId` is the callee contract.

When state is evaluated for the given contract ("Contract A") all of its interactions - direct and internalWrites - are being loaded.
During the state evaluation - if it is an internalWrite interaction - contract specified in the internalWrite ("Contract B") tag is loaded and its state is evaluated.
This will cause the write method to be called.
After evaluating the "Contract B" contract state - the latest state of the "Contract A" is loaded from cache (it has been updated by the write method) and evaluation moves to the next interaction.

### Conclusion

You can view real world examples in the [following directory of Warp SDK](https://github.com/warp-contracts/warp/tree/main/src/__tests__/integration/internal-writes). If you would like to read the whole specification and the motivation which stands behind introducing the internal writes feature, please read [the following issue](https://github.com/warp-contracts/warp/issues/37).
