# Test your contract

We strongly recommend you implement tests for all your smart contracts. It's generally a good practice and it will help you to avoid simple bugs before deploying contracts to the blockchain.

We're going to use one of the most popular testing frameworks - [JEST](https://jestjs.io/) to orchestrate test execution.

Let's create a new file `dex.spec.ts`.

## ⚓ Load required modules

```javascript
// File: tests/dex.spec.ts

import ArLocal from 'arlocal';
import fs from 'fs';
import path from 'path';
import { JWKInterface } from 'arweave/node/lib/wallet';
import {
  getTag,
  LoggerFactory,
  Warp,
  WarpFactory,
  SmartWeaveTags,
  Contract,
  EvalStateResult,
} from 'warp-contracts';

import {
  connectERC20,
  deployERC20,
  ERC20Contract,
  ERC20State,
} from '../erc20/bindings/erc20-js-binding';
import { DexState } from '../src/contracts/types/types';

(async () => {
  // the pieces of code below should be placed here
  // because they use `await`
})();
```

## 🧑‍🔧 Configure `ArLocal` and `Warp`

We should begin by configuring the test environment. It will require spinning off the `ArLocal` test network, connecting it to `Warp`, and generating test wallets.

```javascript
// File: dex.spec.ts

//Starting ArLocal
arlocal = new ArLocal(1822, false);
await arlocal.start();

//Instatiating Warp with the connection to ArLocal
warp = WarpFactory.forLocal(1822);

//Generating test wallets
ownerWallet = await warp.testing.generateWallet();
owner = await warp.arweave.wallets.jwkToAddress(ownerWallet);

user1Wallet = await warp.testing.generateWallet();
user1 = await warp.arweave.wallets.jwkToAddress(user1Wallet);
```

## 🔧 Deploy all the contracts

All the code necessary to deploy contracts on the testnet is described in the deployment section.

## 🤏 Interact with your contract

### Providing liquidity

To provide liquidity we first need to `approve` the DEX contract to access both tokens. Then we could order the DEX contract to collect the tokens and set up liquidity reserves. In the last step, we should verify that the DEX contract is properly initialized by querying its balances and reserves.

```javascript
// File: src/dex.spec.ts

// Approve tokens
await token0.approve({
  spender: dex.txId(),
  amount: 1000000,
});

await token1.approve({
  spender: dex.txId(),
  amount: 1000000,
});

await dex.writeInteraction({
  function: 'mint',
  amountIn0: 1000,
  amountIn1: 2000,
});

let evalResult = await dex.readState();

expect(evalResult.state.reserve0).toEqual(1000);
expect((await token0.balanceOf(dex.txId())).balance).toEqual(1000);

expect(evalResult.state.reserve1).toEqual(2000);
expect((await token1.balanceOf(dex.txId())).balance).toEqual(2000);
```

### Verifying contract constraints

Testing only the positive scenario(aka [Happy path testing](https://en.wikipedia.org/wiki/Happy_path)) it's not enough. We should also try to provide edge case scenarios and see if a contract will prevent users' mistakes or malicious behavior.

Let's check how would the DEX contract react if we try to provide liquidity for the second time.

```javascript
// File: tests/dex.spec.ts

it('should prevent adding liquidity again', async () => {
  await expect(
    dex.writeInteraction(
      {
        function: 'mint',
        amountIn0: 1,
        amountIn1: 1,
      },
      { strict: true }
    )
  ).rejects.toThrow('Burn liquidity first before adding it again');
});
```

### Swapping tokens

Before we can swap tokens we need to approve the DEX to use user assets. Then we can connect the user's wallet to the DEX contract and execute the SWAP function. It's important not only to check if the expected amount of the second token is transferred to user's account, but we should also verify if all the parameters on the DEX contract update accordingly.

```javascript
// File: tests/dex.spec.ts

  it('should swap an amount of token0 for token1', async () => {
    //Approve tokens to swap
    const userToken0 = token0.connect(user1Wallet) as ERC20Contract;
    await userToken0.approve({
      spender: dex.txId(),
      amount: 10
    });

    await dex.connect(user1Wallet).writeInteraction({
      function: 'swap',
      amountIn0: 10,
      amountIn1: 0
    });

    expect((await token0.balanceOf(dex.txId())).balance).toEqual(1010);
    expect((await token1.balanceOf(dex.txId())).balance).toEqual(1980);

    expect((await token0.balanceOf(user1)).balance).toEqual(90);
    expect((await token1.balanceOf(user1)).balance).toEqual(120);

    let evalResult = await dex.readState();
    expect(evalResult.state.reserve0).toEqual(1010);
    expect(evalResult.state.reserve1).toEqual(1980);

  });
```

### Removing liquidity

As the final step let us check if we could properly withdraw the initial liquidity from DEX and bring it back to the initial state.

```javascript
// File: tests/dex.spec.ts

it('should withdraw/burn dex liquidity when called by liquidity provider', async () => {
  dex.connect(ownerWallet);
  await dex.writeInteraction({
    function: 'burn',
  });

  let evalResult = await dex.readState();

  expect(evalResult.state.reserve0).toEqual(0);
  expect((await token0.balanceOf(dex.txId())).balance).toEqual(0);

  expect(evalResult.state.reserve1).toEqual(0);
  expect((await token1.balanceOf(dex.txId())).balance).toEqual(0);
});
```

## 🛑 Shut down `ArLocal`

It's a good idea

```javascript
// File: tests/dex.spec.ts

afterAll(async () => {
  await arlocal.stop();
});
```
