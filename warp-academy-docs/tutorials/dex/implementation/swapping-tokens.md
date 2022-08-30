# Swapping tokens

Let us finally write the most important function that will perform a token swap and put it in the `swap.ts` file:

```javascript
// file: swap.ts
 export const swap = async (
    state: DexState,
    { caller, input: { amountIn0, amountIn1 } }: DexAction
  ): Promise<ContractResult> => {
    
 }
```

It accepts two parameters `amountIn0` and `amountIn1` defining the amounts of the corresponding tokens. We're going to swap the token whose amount is positive into the token whose amount is zero.


We start by transferring in the source token: 

```javascript
let transferInResult = await SmartWeave.contracts.write(
        amountIn0 > 0 ? state.token0 : state.token1, {
        function: 'transferFrom',
        from: caller,
        to: SmartWeave.contract.id,
        amount: amountIn0 > 0 ? amountIn0 : amountIn1
    });
```

We make an external call to the token contract using the `transferFrom` pattern in exactly the same way as we transferred in the initial liquidity.

The next step is to calculate the matching amount of the second token using the `calculateAmountOut` function we implemented in the previous step:

```javascript
    const amountOut =  calculateAmountOut(
        state.reserve0, state.reserve1,
        amountIn0, amountIn1
    );
```

Now we can transfer out the tokens to the address which has called the swap function and has provided assets for the swap: 

```javascript
    let transferOutResult = await SmartWeave.contracts.write(
        amountIn0 > 0 ? state.token1 : state.token0, {
        function: 'transfer',
        to: caller,
        amount: amountOut
    });
```

The final step is to update the internal state of the contract and return it from the function:

```javascript
    // Update reserves

    if (amountIn0 > 0) {
        state.reserve0 += 10;
        state.reserve1 -= amountOut;    
    } else {
        state.reserve1 += amountIn1;
        state.reserve0 -= amountOut;
    }

    return { state };
```
