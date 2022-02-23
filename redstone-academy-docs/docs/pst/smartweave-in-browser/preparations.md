# Preparations

### Setting up Arweave and SmartWeave

As always, we will start by setting up Arweave and SmartWeave clients. Head to [challenge/src/pst-contract.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/pst-contract.ts) and initialize both of them.

```js
export const arweave: Arweave = Arweave.init({
  host: 'testnet.redstone.tools',
  port: 443,
  protocol: 'https',
});

export const smartweave: SmartWeave =
  SmartWeaveWebFactory.memCachedBased(arweave).build();
```

This time, we are using `SmartWeaveWebFactory` instead of `SmartWeaveNodeFactory` which will be safe to use in web environment.
Remember to export them as we will use them in a store for our app.

### Indicating contract id

Head to [challenge/src/deployed-contracts.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/deployed-contracts.ts) and paste the id of your deployed contract.

### Generating wallet and adding funds

Head to [challenge/src/store/index.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/store/index.ts). Generate Arweave wallet, get wallet address and add some funds to it in dedicated places:

```js
const wallet = await arweave.wallets.generate();

const walletAddress = await arweave.wallets.getAddress(wallet);
await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
```

### Connecting contract and wallet to SmartWeave client

Connect your deployed contract and wallet to the SmartWeave client

```js
smartweave.pst(deployedContracts.fc).connect(wallet);
```

### Set the state of the contract

You can get the state of your contract by destructuring the result of the PST method we already know - `currentState`. Thanks to having this object in the store, we will have constant access to current state of the contract and we will be able to display all the addresses and their balances.

```js
const { state } = await contract.currentState();
```

That's it for the preparations! As you may notice, we used some things we've already learned while writing tests and deploying our contract.
