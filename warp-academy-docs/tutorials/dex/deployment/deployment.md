# Deploy your contracts

To launch a sample DEX and test the project we need to implement 3 contracts. We need two tokens that we can swap with each other and the main DEX contract.

## Deploying token contracts

The first step is to properly configure the `Warp` SDK and connect it to the local testing environment. We will use ArLocal to run a local Arweave instance. It is much faster than the real blockchain. And it allows us to test SmartWave contracts without spending AR tokens.

```javascript
arlocal = new ArLocal(1822, false);
await arlocal.start();
warp = WarpFactory.forLocal(1822);
```

Then we can generate test wallets:

```javascript
ownerWallet = await warp.testing.generateWallet();
owner = await warp.arweave.wallets.jwkToAddress(ownerWallet);

user1Wallet = await warp.testing.generateWallet();
user1 = await warp.arweave.wallets.jwkToAddress(user1Wallet);
```

Let's start by deploying the two ERC20 token contracts. We're going to use a helper library `bindings/erc20-js-binding` and ERC20 source code, which is already copied to the `erc20` folder for your convenience.

```javascript
import { deployERC20, ERC20State } from '../erc20/bindings/erc20-js-binding';
```

The first step is to define the initial state of the contract:

```javascript
initialERC20State = {
  settings: null,
  symbol: 'tkn0',
  name: 'Token 0',
  decimals: 18,
  totalSupply: 1000000,
  balances: {
    [owner]: 1000000,
    [user1]: 100,
  },
  allowances: {},
  owner: owner,
  canEvolve: true,
  evolve: '',
};
```

Then we can deploy the ERC20 token and print out its address in the console:

```javascript
let deployedERC20Contract = await deployERC20(
  warp,
  initialERC20State,
  ownerWallet
);
const token0TxId = deployedERC20Contract[1].contractTxId;
console.log('Deployed ERC20 contract: ', deployedERC20Contract);
```

The steps required to deploy the second token are the same. You just need to remember to change the `name` and the `symbol` of the token.

## Deploying DEX

Before we can deploy the contract it's necessary to build and package the source code calling the following script:

```sh
yarn build
```

We're going to reuse the same test environment.
The first step is to define the initial state:

```javascript
const initialDexState = {
  name: 'DEX',
  token0: token0.txId(),
  token1: token1.txId(),
  reserve0: 0,
  reserve1: 0,
};
```

Then we may grab the compiled code and order the SDK to perform deployment:

```javascript
const contractSrc = fs.readFileSync(
  path.join(__dirname, '../dist/contract.js'),
  'utf8'
);

const deployedDex = await warp.createContract.deploy({
  wallet: ownerWallet,
  initState: JSON.stringify(initialDexState),
  src: contractSrc,
});
```

We may print out the token address for our convenience:

```javascript
const dexContractTxId = deployedDex.contractTxId;
console.log('Deployed DEX: ' + dexContractTxId);
```
