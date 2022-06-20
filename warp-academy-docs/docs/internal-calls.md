### Internal read

SmartWeave protocol currently supports only internal reads - it means that contracts can read each others' state. In order to do that you need to use SmartWeave global object. If you are not familiar with it check out [protocol contract guide](https://github.com/ArweaveTeam/SmartWeave/blob/master/CONTRACT-GUIDE.md#smartweave-global-api). Here's how you use it in the contract:

```js
const state = await SmartWeave.contracts.readContractState(action.input.contractId);
```

Check out the example in the [integration tests directory](https://github.com/warp-contracts/warp/blob/main/src/__tests__/integration/data/example-contract.js#L41).

### Internal writes

SmartWeave protocol currently natively does not support writes between contract. This lack of interoperability is a big limitation for real-life applications - especially if you want to implement features like staking/vesting, disputes.

SmartWeave protocol has been extended in **Warp** by adding internal writes feature.

A new method has been added to SmartWeave global object. It allows to perform writes on other contracts.

The method first evaluates the target (ie. specified by the contractTxId given in the first parameter) contract's state up to the "current" block height (ie. block height of the interaction that is calling the write method) and then applies the input (specified as the secon parameter of the write method). The result is memoized in cache.

You use internal writes similair to how you would use internal reads. However, apart from indicating contract id, you need to specify function you want to call in the external contract:

```js
await SmartWeave.contracts.write(contractTxId, { function: 'add' });
```

For each newly created interaction with given contract - a dry run is performed and the call report of the dry-run is analysed. A list of all inner-calls between contracts is generated. For each generated inner call - an additional tag is generated: `{'interactWrite': contractTxId}` - where contractTxId is the callee contract.

When state is evaluated for the given contract ("Contract A") all the interactions - direct and internalWrites. If it is an internalWrite interaction - contract specified in the internalWrite ("Contract B") tag is loaded and its state is evaluate. This will cause the write method (described in p.1) to be called. After evaluating the "Contract B" contract state - the latest state of the "Contract A" is loaded from cache (it has been updated by the write method) and evaluation moves to next interaction.

### `evaluationOptions`

In order for internal calls to work you need to set evaluationOptions to true:

```ts
const callingContract = smartweave
  .contract<ExampleContractState>(calleeTxId)
  .setEvaluationOptions({
    internalWrites: true,
  })
  .connect(wallet);
```

### Conclusion

You can view real world examples in the [following directory of Warp SDK](https://github.com/warp-contracts/warp/tree/main/src/__tests__/integration/internal-writes). If you would like to read whole specification and motivation which stands behind introducing internal writes feature, please read [following issue](https://github.com/warp-contracts/warp/issues/37).
