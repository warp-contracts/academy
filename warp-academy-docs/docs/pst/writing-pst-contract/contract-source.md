# Contract Source

## 🪓 What do we need in contract source?

Let's talk about contract source. It exports one function - `handle` - which accepts two arguments:

- `state` - contract's current state.
- `action` - contract interaction with two properties:
  - `caller` - wallet address of user interacting with the contract.
  - `input` - user's input to the contract.

`Handle` function should end by:

- returning `{ state: newState }` - when contract state is changing after specific interaction.
- returning `{ result: someResult }` - when contract state is not changing after interaction.
- throwing `ContractError` exception.

## 📃 Contract source types

We will start by writing some additional types. Head again to [warp-academy-pst/challenge/src/contracts/types/types.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/types/types.ts) and write following types:

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

export type ContractResult = { state: PstState } | { result: PstResult };
```

Time for an explanation.

`PstAction` represents contract's interaction. As mentioned earlier it has two properties - caller and input. In our contract user will have an ability to write three types of inputs (`PstInput`):

- `function` - type of interaction (in our case - it can be **transfering tokens**, **minting tokens** or **reading balances** - `PstFunction`)
- `target` - target address.
- `qty` - amount of tokens to be transferred/minted.

`PstResult` - object possible to be returned by interacting with the contract when the state is not being changed:

- `target` - target address.
- `ticker` - an abbreviation used to uniquely identify the token.
- `balance` - specific address balance.

`ContractResult` - contract's handler function should be terminated by one of those:

- `state` - when the state is being changed
- `result` - when the interaction was a read-only operation

## 🎬 Actions

Let's prepare all the interactions that will be possible within our contract. We will put them in separate files, each of the files in a dedicated folder - either `read` (actions responsible for reading state) or `write` (which change current state). All the folders and files are already prepared, you just need to fill them with some code.

### 📖 Read

[warp-academy-pst/challenge/src/contracts/actions/read/balance.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/actions/read/balance.ts)

```js

declare const ContractError;

export const balance = async (
  state: PstState,
  { input: { target } }: PstAction
): Promise<ContractResult> => {
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

The above function will help us read the balance of the inidicated target address. It takes two arguments - contract computed state and destructured contract action which give us input to the interaction. Remember that we have three possible options to be returned from the interactions? In the above interaction we added two of them - thanks to simple error handling we can return `ContractError` or result.

### 🖊️ Write

Now let's add two `write` interactions which will change our contract's state:

[warp-academy-pst/challenge/src/contracts/actions/write/mintTokens.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/actions/write/mintTokens.ts)

```js

declare const ContractError;

export const mintTokens = async (
  state: PstState,
  { caller, input: { qty } }: PstAction
): Promise<ContractResult> => {
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

This one will help us minting some tokens to the caller's address. It takes two arguments - contract state and the destructured caller of the interaction as well as the input to the interaction. It adds tokens to the caller's address. It can throw `ContractError` exception or return contract's state.

[warp-academy-pst/challenge/src/contracts/actions/write/transferTokens.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/actions/write/transferTokens.ts)

```js

declare const ContractError;

export const transferTokens = async (
  state: PstState,
  { caller, input: { target, qty } }: PstAction
): Promise<ContractResult> => {
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

And the last one - the core function of our contract which will be responsible for transfering tokens between addresses. It takes two arguments - state and destructured caller of the interaction as well as the input to the interaction. It subtract's the indicated amount of tokens from caller's address and adds them to the target address. It can throw `ContractError` exception or return contract's state.

## ⚓ Handle function

Wow, a lot of work done. Now the cherry on top. We will put all the interactions together to write the final `handle` function which will be exported from the contract source.

[warp-academy-pst/challenge/src/contracts/contract.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/contract.ts)

```js

import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
import { PstAction, PstResult, PstState } from './types/types';

declare const ContractError;

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

`Handle` function is an asynchronous function and it returns a promise of type `ContractResult`. As mentioned above, it takes two arguments - state and action. It waits for one of the interactions to be called and returns the result of matching functions - the ones that we prepared earlier.

## 🎨 Bundling contract

Now comes the tricky part. We need to find a way to bundle our contract source so its output code is in Javascript and not typescript. We will use esbuild tool to achieve that result but of course you can use whichever bundler you'd like. We will not go into the details but you can view the bundling script here [https://github.com/warp-contracts/academy/blob/main/warp-academy-pst/challenge/build.js](https://github.com/warp-contracts/warp/blob/main/warp-academy-pst/challenge/build.js).

It takes the contract source file as an esbuild source file, bundles it and put's its compiled Javascript version in a `dist` folder.

```js
const { build } = require('esbuild');
const replace = require('replace-in-file');

const contracts = ['/contracts/contract.ts'];

build({
  entryPoints: contracts.map((source) => {
    return `./src${source}`;
  }),
  outdir: './dist',
  minify: false,
  bundle: true,
  format: 'iife',
})
  .catch(() => process.exit(1))
  .finally(() => {
    const files = contracts.map((source) => {
      return `./dist${source}`.replace('.ts', '.js');
    });
    replace.sync({
      files: files,
      from: [/\(\(\) => {/g, /}\)\(\);/g],
      to: '',
      countMatches: true,
    });
  });
```

Now we just need to add a few commands to our `package.json` file that will simply remove everything from `dist` folder (which contains the minimized version of the source code), run the bundling script and additionally - copy `initial-state.json` file to the `dist` folder so we'll have all the files we need to deploy the contract in one place.

```json
    "build:contracts": "yarn run clean && yarn run build-ts && npm run cp",
    "build-ts": "node build.js",
    "clean": "rimraf ./dist",
    "cp": "copyfiles -u 1 ./src/**/*.json dist"
```

## 🎉 Conclusion

Well done! We have all the parts which are needed to deploy our contract. But before that we need to test it out to see if it works correctly.
