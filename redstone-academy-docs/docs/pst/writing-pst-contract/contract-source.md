# Contract Source

### Handle function

Core parts of every SmartWeave contract are contract source and initial state.

Let's start with contract source. It exports one function - `handle` which accepts two arguments:

- state - contract's current state
- action - contract interaction with two properties
  - caller - wallet address of user interacting with the contract
  - input - user's input to the contract

`Handle` function can return three types of values:

- state - when contract's state is changing after specific interaction
- other result - when contract's state is not changing after interaction
- ContractError

### Challenge time

We will use Typescript power to make our code more readable. Let's start with preparing some types. Head to [redstone-academy-pst/challenge/src/contracts/types/types.ts](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-pst/challenge/src/contracts/types/types.ts) and let's start writing!

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

export interface PstState {
  ticker: string;
  name: string;
  owner: string;
  balances: {
    [address: string]: number,
  };
}

export type PstFunction = 'transfer' | 'mint' | 'balance';
```

Time for explanation
`PstAction` represents contract's interaction. As mentioned earlier it can be either caller or input. In our contract user will have an ability to write three types of inputs (`PstInput`):

- `function` - type of interaction (in our case - it can be transfering tokens, minting tokens or reading balances)
- `target` - target address
- `qty` - amount of tokens to be transferred/minted

`PstResult` - object possible to be returned by interacting with the contract:

- `target` - target address
