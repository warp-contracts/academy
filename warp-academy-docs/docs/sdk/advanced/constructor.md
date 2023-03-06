# Constructor

Available from version: [1.2.56](https://github.com/warp-contracts/warp/releases/tag/1.2.56)

:::caution
Consider this as an experimental feature (though already used by our own contracts).
:::

:::caution
Internal calls feature is not available in constructor code.

Feature is only available for contracts written in JS
:::

The standard way of initializing contract state is done by passing `initState` argument when deploying contract. However, this solution doesn't assure proper validation of the initial state, which in some cases might be required. Constructor optional feature allows defining special function `__init(initState)` which is run before any interactions, thus can assure required state satisfies constraints.

## Spec

- If the constructor feature is not enabled, the constructor is never called by SDK
- To enable the constructor feature you have to set `{useConstructor: true}` flag in the [manifest](./manifest.md) during the deployment of the contract
- You MUST expose `__init` function
- You can access `initState` from deployment as `action.input.args`
- If the constructor feature is enabled, you CAN'T call `__init` function by sending interaction (however you can call it from within contract itself)
- KV feature is available in `__init` function

## Example

```ts
// contract definition
export async function handle(state, action) {
  if (action.input.function == "__init") {
    state.caller = action.caller;
    await SmartWeave.kv.put("contractTxId", SmartWeave.transaction.id);

    state.counter = action.input.args.counter + 1;
  }

  return { state };
}

// deployment
const { contractTxId } = await warp.deploy({
  wallet,
  initState: JSON.stringify({ counter: 0 }),
  src: src,
  evaluationManifest: {
    evaluationOptions: {
      useConstructor: true,
    },
  },
});

const contract = warp.contract(contractTxId).connect(wallet);

const {
  cachedValue: { state },
} = await contract.readState(); // constructor will be called!

// state.counter == 1
// state.caller == wallet address
// KV.get("contractTxId") == contractTxId
```

Initial discussion: https://github.com/warp-contracts/warp/issues/323
