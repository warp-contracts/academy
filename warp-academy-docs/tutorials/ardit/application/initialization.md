# Initialization

After successful deployment of the contract, we can now create app dedicated to adding and viewing content from the contract state.
You can check Ardit application source code under this [link](https://github.com/warp-contracts/academy/tree/main/warp-academy-ardit/final/app)
You can also test live version [here](https://arditmsg.vercel.app/)

In order to interact with the contract in the application, we need to follow below steps:

## Warp initialization

Same as for [contract deploy](/tutorials/ardit/deployment/) we need to create Warp instance for the mainnet:

```js
//src/stores/contract.js

async initWarp() {
      this.warp = await WarpFactory.forMainnet();
    }
```

## Contract setup

Next step is to setup our contract, so we can read its state and later perform the interactions.

```js
//src/stores/contract.js

  async getContract() {
      this.contract = await this.warp.contract(this.contractId);
      const { cachedValue } = await this.contract.readState();
      this.contractState = cachedValue.state;
    },
```
## Wallet connection

Our application is prepared to be integrated with ArweaveWalletConnector. It is a tool which allows application to authorize users by their wallet without having to access the private keys directly. Users do not to install anything and are not restricted to specific device types or operating systems. It is easy to use for both parties - developers and users.
Currently, [`arweave.app`](https://arweave.app/) is a dedicated wallet provider, but other providers will be reachable from the connector module in the future.

To install ArweaveWalletConnector, follow the instructions from [this repository.](https://github.com/jfbeats/ArweaveWalletConnector)

Once we are finished, our code should look something like this:

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

And now, we can for example assign `connectWallet()` method to the button's click event.
If we have done everything correctly, after calling `connectWallet()` method we should see the popup, from which we can pick our wallet that we want to connect with.
