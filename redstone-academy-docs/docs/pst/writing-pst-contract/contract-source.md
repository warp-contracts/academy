# Contract Source

## 🪓 What do we need in contract source?

Let's talk about contract source. It exports one function - `handle` - which accepts two arguments:

- state - contract's current state
- action - contract interaction with two properties:
  - caller - wallet address of user interacting with the contract
  - input - user's input to the contract.

`Handle` function can return three types of values:

- state - when contract's state is changing after specific interaction
- other result - when contract's state is not changing after interaction
- ContractError

## 📃 Contract source types

We will start by writing some additional types. Head again to [redstone-academy-pst/challenge/src/contracts/types/types.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/types/types.ts) write following types:

```js
export interface PstAction {
  input: PstInput;
  caller: string;
}

export interface PstInput {
  function: PstFunction;
  target: string;
  qty: number;
}

export interface PstResult {
  target: string;
  ticker: string;
  balance: number;
}

export type PstFunction = 'transfer' | 'mint' | 'balance';
```

Time for explanation.

`PstAction` represents contract's interaction. As mentioned earlier it can be either caller or input. In our contract user will have an ability to write three types of inputs (`PstInput`):

- `function` - type of interaction (in our case - it can be transfering tokens, minting tokens or reading balances - `PstFunction`)
- `target` - target address
- `qty` - amount of tokens to be transferred/minted

`PstResult` - object possible to be returned by interacting with the contract:

- `target` - target address
- `ticker` - ??
- `balance` - specific address balance

## 🎬 Actions

Let's prepare all the interactions that will be possible within our contract. We will put them in separate files, each of the files in a dedicated folder - either `read` (actions responsible for reading state) or `write` (which change current state). All the folders and files are already prepared, you just need to fill them with some code.

### Read

[redstone-academy-pst/challenge/src/contracts/actions/read/balance.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/actions/read/balance.ts)

```js

declare const ContractError;

export const balance = async (
  state: PstState,
  { input: { target } }: PstAction
) => {
  const ticker = state.ticker;
  const balances = state.balances;

  if (typeof target !== 'string') {
    throw new ContractError('Must specify target to get balance for');
  }

  if (typeof balances[target] !== 'number') {
    throw new ContractError('Cannot get balance, target does not exist');
  }

  return { result: { target, ticker, balance: balances[target] } };
};

```

Above function will help us read balance of inidicated target address. I takes two arguments - contract initial state and destructured contract action which give us input to the interaction. Remember that we have three possible options to be returned from the interactions? In above interaction we added two of them - thanks to simple error handling we can return `ContractError` or result.

### Write

Now let's add two `write` interactions which will change our contract's state:

[redstone-academy-pst/challenge/src/contracts/actions/write/mintTokens.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/actions/write/mintTokens.ts)

```js

declare const ContractError;

export const mintTokens = async (
  state: PstState,
  { caller, input: { qty } }: PstAction
) => {
  const balances = state.balances;

  if (qty <= 0) {
    throw new ContractError('Invalid token mint');
  }

  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  balances[caller] ? (balances[caller] += qty) : (balances[caller] = qty);
  return { state };
};

```

This one will help us miting some tokens to the caller's address. It takes two arguments - contract's state and destructured caller of the interaction as well as the input to the interaction. It adds tokens to caller's address. It can return `ContractError` or contract's state.

[redstone-academy-pst/challenge/src/contracts/actions/write/transferTokens.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/actions/write/transferTokens.ts)

```js

declare const ContractError;

export const transferTokens = async (
  state: PstState,
  { caller, input: { target, qty } }: PstAction
) => {
  const balances = state.balances;
  if (!Number.isInteger(qty)) {
    throw new ContractError('Invalid value for "qty". Must be an integer');
  }

  if (!target) {
    throw new ContractError('No target specified');
  }

  if (qty <= 0 || caller === target) {
    throw new ContractError('Invalid token transfer');
  }

  if (!balances[caller]) {
    throw new ContractError(`Caller balance is not defined!`);
  }

  if (balances[caller] < qty) {
    throw new ContractError(
      `Caller balance not high enough to send ${qty} token(s)!`
    );
  }

  balances[caller] -= qty;
  if (target in balances) {
    balances[target] += qty;
  } else {
    balances[target] = qty;
  }

  return { state };

```

And the last one - core function of our contract which will be responsible for transfering tokens between addresses. It takes two arguments - state and destructured caller of the interaction as well as the input to the interaction. It substract indicated amount of tokens from caller's address and add them to the target address. It can return `ContractError` or contract's state.

## ⚓ Handle function

Wow, a lot of work done. Now the cherry on top. We will put all the interactions together to write the final `handle` function which will be exported from the contract source.

[redstone-academy-pst/challenge/src/contracts/contract.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/contract.ts)

```js

import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
import { PstAction, PstResult, PstState } from './types/types';

declare const ContractError;

declare type ContractResult = { state: PstState } | { result: PstResult };

export async function handle(
  state: PstState,
  action: PstAction
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'mint':
      return await mintTokens(state, action);
    case 'transfer':
      return await transferTokens(state, action);
    case 'balance':
      return await balance(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`
      );
  }
}

```

`Handle` function is an asynchronous function and it returns promise of type `ContractResult`. As mentioned above, it takes two arguments - state and action. It waits for one of the interactions to be called and return result of matching functions - the ones that we prepared earlier.

## 🎉 Conclusion

Well done! We have all the parts which are needed to deploy our contract. But before that we need to test it out to see if it works correctly.
