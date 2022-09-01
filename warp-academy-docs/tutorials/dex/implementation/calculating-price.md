# Calculating price

We're going to use the formula to calculate the price described in the Intro section:

```
x * y = k where x and y are the reserves
```

( amount of token X in DEX ) x ( amount of token Y in DEX ) = k

We implement the code creating the `calculateAmountOut` function:

```ts
// file: src/swap.ts
const calculateAmountOut = (
  reserve0: number,
  reserve1: number,
  amountIn0: number,
  amountIn1: number
) => {
  if (amountIn0 == 0 && amountIn1 == 0) {
    throw new ContractError('Must specify at least one amountIn');
  }

  if (amountIn0 > 0 && amountIn1 > 0) {
    throw new ContractError('Must specify only one amountIn');
  }

  return amountIn0 > 0
    ? 
      Math.round((amountIn0 * reserve1) / (reserve0 + amountIn0))
    : Math.round((amountIn1 * reserve0) / (reserve1 + amountIn1));
};
```

The logic is very straightforward. First, we make sure that one and only one of the `amountIn0` and `amountIn1` is defined. The variable which is above zero will define which token is our source asset. Next, we calculate the equivalent amount of the second token, so the reserves after the swap will maintain the constant product invariant.

_❗ As you might have noticed the price varies with the amount of tokens we provide, therefore we prefered to call the function `calculateAmountOut` rather than simply calculatePrice._

We will also implement a public (exported) view function that will allow external users to query the expected `amountOut` before making the swap:

```ts
export const getAmountOutForAmountIn = async (
  state: DexState,
  { input: { amountIn0, amountIn1 } }: DexAction
): Promise<ContractResult> => {
  return {
    result: calculateAmountOut(
      state.reserve0,
      state.reserve1,
      amountIn0,
      amountIn1
    ),
  };
};
```
