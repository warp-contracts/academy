# Wallet connection

First step is to install ArweaveWalletConnector. To do this, follow the instructions from this [repository.](https://github.com/jfbeats/ArweaveWalletConnector)

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