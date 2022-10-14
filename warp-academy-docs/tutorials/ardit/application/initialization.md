# Wallet connection

After successful deployment of the contract, we can now create app dedicated to adding and viewing content from contract state.
There you can check our app source code: [link](https://github.com/warp-contracts/academy/tree/main/warp-academy-ardit/final/app)
You can also test live version here: [https://arditmsg.vercel.app/](https://arditmsg.vercel.app/)

Before we integrate wallet connector with our app, we need to do few things:

## 1. Warp initialization

Same as for [contract deploy](https://academy.warp.cc/tutorials/ardit/deployment/) we need to create Warp instance

```js
//src/stores/contract.js

async initWarp() {
      this.warp = await WarpFactory.forMainnet();
    },
```

## 2. Contract setup

Next step is to setup our contract, so we can read its state and later perform the interactions.

```js
//src/stores/contract.js

  async getContract() {
      this.contract = await this.warp.contract(this.contractId);
      const { cachedValue } = await this.contract.readState();
      this.contractState = cachedValue.state;
    },
```
## 3. Finally - wallet connector

Now our app is prepared to be integrated with ArweavWalletConnector. It is a tool which allows application to authorize users by their wallet without having to access the private keys directly. Users do not to install anything and are not restricted to specific device types or operating systems. It is easy to use for both parties - developers and users.
Currently, ['arweave.app' ](https://arweave.app/) is a dedicated wallet provider, but other providers will be reachable from the connector module in the future.

To install ArweaveWalletConnector, follow the instructions from this [repository.](https://github.com/jfbeats/ArweaveWalletConnector)

Once we are finished, our code should be similiar to this:

```js
//src/stores/contract.js

   async connectWallet() {
      let arweaveWebWallet = new ArweaveWebWallet({
        name: 'Ardit',
      });
      await arweaveWebWallet.setUrl('arweave.app');
      await arweaveWebWallet.connect();
      this.wallet = arweaveWebWallet;
      await this.contract.connect('use_wallet');
    }
```

And now, for example, we can assign `connectWallet()` method to the button.
If we have done everything correctly, after calling `connectWallet()` method we should see popup, from which we can pick our wallet, that we want to connect with.
