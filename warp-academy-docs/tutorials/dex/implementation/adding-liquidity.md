# Adding liqudity to DEX

Let's create a new file `liquidity.ts` in the actions folder and start implementing a function to mint / provide liquidity:

```ts
// file: src/liquidity.ts

export const mint = async (
  state: DexState,
  { caller, input: { amountIn0, amountIn1 } }: DexAction
): Promise<ContractResult> => {};
// We will put the logic of token deposits here
```

The parameters `amountIn0` and `amountIn1` specify how much tokens are we going to deposit.
Before we transfer the tokens let's first record who is making the deposit.
For simplicity, we will implement the simplest version that will allow only a single liquidity provider.

```ts
if (state.liquidityProvider == null) {
  state.liquidityProvider = caller;
} else {
  throw new ContractError('Burn liquidity first before adding it again');
}
```

In the contract's state, we define a variable called `liqudityProvider` that keeps the current liquidity provider. It's only possible to set up the provider when the value is empty (null). Otherwise, the contract will throw an error.

Next, we will write the code that will transfer the tokens from the provider's wallet to the contract. We use the `ERC20` token standard that is defined in the **Warp's** provided [WRC library](https://github.com/warp-contracts/wrc). Although the contract code is written in RUST we could seamlessly communicate with it from the typescript code.

_📣 Warp contracts are fully interoperable regardless of the language they are implemented in._

```ts
if (amountIn0 > 0) {
  const token0TransferResult = await SmartWeave.contracts.write(state.token0, {
    function: 'transferFrom',
    from: caller,
    to: SmartWeave.contract.id,
    amount: amountIn0,
  });
  if (token0TransferResult.type == 'ok') {
    state.reserve0 += amountIn0;
  } else {
    throw new ContractError(
      'Token0 transfer failed: ' + token0TransferResult.errorMessage
    );
  }
}
```

In the code above, we're changing a state of an external `ERC20` contract. Therefore we use the built-in `SmartWeave.contracts.write` method (one of two possible [internal calls](https://academy.warp.cc/features/internal-calls)) to pass as parameters the address of an external contract, function name, and a list of arguments. We also verify the call was successful, by checking if the result's type is `ok`. In case everything is fine, we update the state variable that keeps the size of the reserve. Otherwise, we immediately stop execution and throw an error.

We also need to implement a very similar logic to transfer the second token:

```ts
if (amountIn1 > 0) {
  await SmartWeave.contracts.write(state.token1, {
    function: 'transferFrom',
    from: caller,
    to: SmartWeave.contract.id,
    amount: amountIn1,
  });
  state.reserve1 += amountIn1;
}
```

The final and very important step is to return the `state` variable allowing **Warp** to properly update the contract's state.

```ts
return { state };
```
