# Preparations

To run your application just execute the following command:

```bash
yarn serve
```

in the root of the `challenge` folder. As for now, you will not see much when running the app.

![PST-screen-app-before](./assets/screen-app-before.png)

Let's fill it up with some content!

## 🗼 Setting up Warp

As always, we will start by setting up Warp and Arweave clients.
Head to [challenge/src/environment.ts](https://github.com/warp-contracts/academy/blob/main/warp-academy-pst/challenge/src/environment.ts) and initialize both of them.

```js
// initialize Warp instance for use with Arweave mainnet
LoggerFactory.INST.logLevel('info');
export const warp: Warp = WarpFactory.forMainnet();

// you don't need to initialize Arweave instance manually - just use the Arweave instance from Warp
export const arweave: Arweave = warp.arweave;
```

Remember to export them as we will use them in a store for our app.

## 🆔 Indicating contract id

Head to [challenge/src/deployed-contracts.ts](https://github.com/warp-contracts/academy/blob/main/warp-academy-pst/challenge/src/deployed-contracts.ts) and paste the id of your deployed contract.

## 💰 Generating wallet and adding funds

Head to [challenge/src/store/index.ts](https://github.com/warp-contracts/academy/blob/main/warp-academy-pst/challenge/src/store/index.ts).
Generate Arweave wallet and get wallet address.

```js
const wallet = await arweave.wallets.generate();
const walletAddress = await arweave.wallets.getAddress(wallet);
```

## 🔌 Connecting contract and wallet to Warp client

Connect your deployed contract and wallet to the Warp client

```js
const contract = warp.pst(deployedContracts.fc).connect(wallet);
```

## ⛏️ Set the state of the contract

You can get the state of your contract by destructuring the result of the PST method we already know - `currentState`. Thanks to having this object in the store, we will have constant access to the current state of the contract and we will be able to display all the addresses and their balances.

```js
const { state } = await contract.currentState();
```

That's it for the preparations! As you may notice, we used some things we've already learned while writing tests and deploying our contract.

## 🅰️ Using real wallet

To use the real wallet, it is best to detect if the user has ArConnect already installed.
If yes - `arweaveWallet` object will be available in the `window` object, and therefore you will be able to use ArConnect `connect` method.
You can see its API in [ArConnect docs](https://docs.th8ta.org/arconnect/functions).
You can also request necessary permissions. You can check a list of available permissions [here](https://docs.th8ta.org/arconnect/permissions).

```js
await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
```

This time we don't need a generating wallet or to fund it.
After you connect user wallet to the application you will need to use the `use_wallet` hook when initializing the contract.
It will then connect the contract to the user's wallet. You can achieve this by writing following code:

```js
const contract = warp.pst(deployedContracts.fc).connect('use_wallet`);
```
