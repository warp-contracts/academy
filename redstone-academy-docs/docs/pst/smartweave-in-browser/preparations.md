# Preparations

To run your application just execute following command:

```bash
yarn serve
```

in the root of the `challenge` folder. As for now, you will not see much when running the app.

![PST-screen-app-before](./assets/screen-app-before.png)

Let's fill it up with some content!

## 🗼 Setting up Arweave and SmartWeave

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

This time, we are using SDK's `SmartWeaveWebFactory` instead of `SmartWeaveNodeFactory` which will be safe to use in web environment.
Remember to export them as we will use them in a store for our app.

## 🆔 Indicating contract id

Head to [challenge/src/deployed-contracts.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/deployed-contracts.ts) and paste the id of your deployed contract.

## 💰 Generating wallet and adding funds

Head to [challenge/src/store/index.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/store/index.ts). Generate Arweave wallet, get wallet address and add some funds to it in dedicated places:

```js
const wallet = await arweave.wallets.generate();

const walletAddress = await arweave.wallets.getAddress(wallet);
await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
```

## 🔌 Connecting contract and wallet to SmartWeave client

Connect your deployed contract and wallet to the SmartWeave client

```js
const contract = smartweave.pst(deployedContracts.fc).connect(wallet);
```

## ⛏️ Set the state of the contract

You can get the state of your contract by destructuring the result of the PST method we already know - `currentState`. Thanks to having this object in the store, we will have constant access to current state of the contract and we will be able to display all the addresses and their balances.

```js
const { state } = await contract.currentState();
```

That's it for the preparations! As you may notice, we used some things we've already learned while writing tests and deploying our contract.

## 🇦 Preparing Arweave mainnet environment

If you want to create an application which enables interacting with mainnet contract the only things you need to change in this section is indicating correct `host` in Arweave initialization (exactly like the last time - `arweave.net`) and pointing to the real wallet. This time it is best to detect if user has ArConnect already installed. If yes - `arweaveWallet` object will be available in `window` object and therefore you will be able to use ArConnect `connect` method. You can see its API in [ArConnect docs](https://docs.th8ta.org/arconnect/functions). You can also request necessary permissions. You can check list of available permissions [here](https://docs.th8ta.org/arconnect/permissions).

```js
await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
```

This time we don't need generating wallet and funding it. Just remember that if the user of your app will want to interact with the contract, some AR tokens will be needed on his account.

After you connect user wallet to the application you will need to use `use_wallet` hook when initializing contract. It will connect contract to user's wallet. You can acheive that by writing following code:

```js
const contract = smartweave.pst(deployedContracts.fc).connect('use_wallet`);
```
