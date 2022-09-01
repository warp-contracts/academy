# Removing liqudity from DEX

We should also implement a function allowing liquidity providers to remove the assets from our DEX contract.

```ts
// file: src/liquidity.ts

export const burn = async (
    state: DexState,
    { caller, input: { amountIn0, amountIn1 } }: DexAction
  ): Promise<ContractResult> => {
```

The first step is to validate the caller and make sure it is the same wallet that provided the initial liquidity:

```ts
if (caller !== state.liquidityProvider) {
  throw new ContractError('Only the liquidity provider may burn and withdraw the liquidity');
}
```

After this check, we may pay out the tokens and update the internal state of reserves

```ts
await SmartWeave.contracts.write(state.token0, {
  function: 'transfer',
  to: caller,
  amount: state.reserve0,
});
state.reserve0 = 0;

await SmartWeave.contracts.write(state.token1, {
  function: 'transfer',
  to: caller,
  amount: state.reserve1,
});
state.reserve1 = 0;
```

The last step is to set the value of the liquidity provider to null, allowing the contract to accept new initial liquidity again:

```ts
state.liquidityProvider = null;
```

_❗We should always remember to return the `state` variable allowing **Warp** to properly update the contract's state._

```ts
return { state };
```
