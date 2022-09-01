# Contract deployment

## 🅰️ Setting up Arweave

As mentioned earlier, we will deploy our contract to the Warp public testnet. You will notice that it is very similiar to how we deployed the contract to ArLocal. We just need to write a NodeJS script which will generate and fund the Arweave wallet, read, contract source and initial state files and deploy the contract to the testnet. At the end of this chapter, I'll show you how to repeat all these steps in order to deploy contract to Arweave mainnet.

Like the last time - firstly, we will need to declare variables that will be needed in the script. Head to [challenge/src/tools/deploy-test-contract.ts](https://github.com/warp-contracts/warp-academy/blob/main/warp-academy-pst/challenge/src/tools/deploy-test-contract.ts) and add the following code:

```js
let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: PstState;

let arweave: Arweave;
let warp: Warp;
let pst: PstContract;
```

Then, we need to initialize Arweave, this time we will point to the Warp testnet. Write the following code in the asynchronous callback

```js
arweave = Arweave.init({
  host: 'testnet.redstone.tools',
  port: 443,
  protocol: 'https',
});
```

Exactly like the last time, we will set logging level to `error`:

```js
LoggerFactory.INST.logLevel('error');
```

Initialize Warp:

```js
warp = WarpNodeFactory.memCached(arweave);
```

Generate wallet and add some funds using our helper functions:

```js
wallet = await arweave.wallets.generate();
walletAddress = await arweave.wallets.jwkToAddress(wallet);
await addFunds(arweave, wallet);
```

Read contract source and initial state files:

```js
contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
const stateFromFile: PstState = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../dist/contracts/initial-state.json'), 'utf8')
);
```

Override contract's owner address with the generated wallet address:

```js
initialState = {
  ...stateFromFile,
  ...{
    owner: walletAddress,
  },
};
```

And deploy contract using exactly the same method that is used in the tests. We will log the contract id to the console, so we can relate to it while writing interactions.

```js
const contractTxId = await warp.createContract.deploy({
  wallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
});

console.log(contractTxId);
```

The script is ready!

## 🏃‍♀️ Running script

All we need to do now is run the prepared script. We will use a typescript execution engine for NodeJS - ts-node. Run the following script in the root folder:

```bash
yarn ts-node src/tools/deploy-test-contract.ts
```

:::tip
Remember that you need to bundle contract source file before deploying the contract. We've already done it in [**Writing PST contract** chapter](../writing-pst-contract/contract-source.md#-bundling-contract).
:::

Congratulations!
You've just deployed a contract to the Warp testnet. You should see the contract id in the console output. You can also visit [SonAR](htttps://sonar.warp.cc), switch to the testnet and search your contract :)

## ➡️ Deploying to Arweave mainnet

There aren't many differences between deploying to testnet and mainnet. All you need to do is point to the right host:

```js
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});
```

...and instead of using dynamically generated wallet you will need to use your real one. One way of doing that is using [ArConnect browser extension](https://www.arconnect.io/). You will receive your wallet's key in json format which you will need to put in your project. Remember to secure it correctly, e.g. by putting in `.secrets` folder and adding the folder to `.gitignore` file.

Now, the only thing you need to do is import the file with the wallet key and point to it when deploying your contract:

```js
  const contractTxId = await warp.createContract.deploy({
    wallet: jwk as ArWallet,
    initState: initialState,
    src: contractSrc
  });
```

Remember to not make your jwk public!
After deploying the contract to the mainnet you can also view it in SonAR. You just need to wait for the blocks to be mined. It can take up to 20 minutes.
