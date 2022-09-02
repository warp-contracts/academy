# Contract deployment

## 🅰️ Setting up Warp

As mentioned earlier, we will deploy our contract to the Arweave mainnet, using Warp Sequencer and Warp bundled contracts deployment.
You will notice that it is very similar to how we deployed the contract to ArLocal.
We just need to write a NodeJS script which will generate Arweave wallet, read contract source and initial state files and deploy the contract to the mainnet.

Head to [challenge/src/tools/deploy-contract.ts](https://github.com/warp-contracts/warp-academy/blob/main/warp-academy-pst/challenge/src/tools/deploy-contract.ts) and add the following code.

* Exactly like the last time, we will set logging level to `error`:

```js
LoggerFactory.INST.logLevel('error');
```

* Initialize Warp:

```js
const warp = WarpFactory.forMainnet();
```

* Generate wallet:

```js
const jwk = await warp.arweave.wallets.generate();
const walletAddress = await warp.arweave.wallets.jwkToAddress(jwk);
```

Obviously you may also use your own "real" wallet instead. You don't need to have any ARs on such wallet.  
Remember to not make your jwk public!

* Read contract source and initial state files:

```js
const contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
const stateFromFile = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../dist/contracts/initial-state.json'), 'utf8')
);
```

* Override contract's owner address with the generated wallet address:

```js
const initialState = {
  ...stateFromFile,
  ...{
    owner: walletAddress,
  },
};
```

* Deploy contract using exactly the same method that is used in the tests. We will log the deployment result
  (which contains contract transaction id and contract source transaction id) as well as link to SonAR - that will
  navigate directly to the deployed contract.

```js
const contractTxId = await warp.createContract.deploy({
  wallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
});

console.log('Deployment completed: ', {
  ...result,
  sonar: `https://sonar.warp.cc/#/app/contract/${result.contractTxId}`
});
```

The script is ready!

## 🏃‍♀️ Running script

All we need to do now is run the prepared script. We will use a typescript execution engine for NodeJS - ts-node. Run the following script in the root folder:

```bash
yarn ts-node src/tools/deploy-contract.ts
```

:::tip
Remember that you need to bundle contract source file before deploying the contract. We've already done it in [**Writing PST contract** chapter](../writing-pst-contract/contract-source.md#-bundling-contract).
:::

Congratulations!
You've just deployed a contract to the Arweave mainnet. You should see the contract id in the console output.

## ➡️ Deploying to Warp testnet

There aren't many differences between deploying to testnet and mainnet. All you need to create a `Warp` instance like this:

```js
const warp = WarpFactory.forTestnet();
```

...and generate and fund the wallet using the `warp.testing.genereteWallet()` method - exactly the same as in the tests.

After deploying the contract to the testnet you can also view it in SonAR (remember to switch to 'testnet' in SonAR).

The full deployment script for Warp testnet is here [final/src/tools/deploy-test-contract.ts](https://github.com/warp-contracts/warp-academy/blob/main/warp-academy-pst/final/src/tools/deploy-test-contract.ts).
