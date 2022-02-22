# Deployment

### Setting up Arweave

As mentioned earlier, we will deploy our contract to RedStone public testnet. You will notice that is very similair to how we deployed contract to ArLocal. We just need to write a NodeJS script which will generate and fund Arweave wallet read, contract source and initial state files and deploy contract to the testnet. At the end of this chapter, I'll show you how to repeat all these steps in order to deploy contract to Arweave mainnet.

Like the last time - firstly, we will need to declare variables that will be needed in the script. Head to [challenge/src/tools/deploy-test-contract.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/tools/deploy-test-contract.ts) and add following code:

```js
let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: PstState;

let arweave: Arweave;
let smartweave: SmartWeave;
let pst: PstContract;
```

Then, we need to initialize Arweave, this time we will point to the RedStone testnet. Write following code in the asynchronous callback

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

Initialize Smartweave:

```js
smartweave = SmartWeaveNodeFactory.memCached(arweave);
```

Generate wallet and add some funds using our helper functions:

```js
wallet = await arweave.wallets.generate();
walletAddress = await arweave.wallets.jwkToAddress(wallet);
await addFunds(arweave, wallet);
```

Read contract sourcr and initial state source files:

```js
contractSrc = fs.readFileSync(
  path.join(__dirname, '../../dist/contract.js'),
  'utf8'
);
const stateFromFile: PstState = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../dist/contracts/initial-state.json'),
    'utf8'
  )
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

And deploy contract using exactly the same method that in tests. We will log contract id to the console, so we can relate to it while writing interactions.

```js
const contractTxId = await smartweave.createContract.deploy({
  wallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
});

console.log(contractTxId);
```

The script is ready!

### Running script

All we need to do now is run the prepared script. We will use typescript execution engine for NodeJS - ts-node. Run following script in the root folder:

```bash
ts-node src/tools/deploy-test-contract.ts
```

:::tip
Remember that you need to bundle contract source file before deploying the contract. We've already done it in tests chapter.

Congratulations!
You've just deployed contract to the RedStone testnet. You should see contract id in the console output. You can also visit [SonAR](htttps://sonar.redstone.tools), switch to the testnet and search your contract :)

### Deploying to Arweave mainnet

There aren't many differences between deploying to testnet and mainnet. All you need to do is point to the right host:

```js
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});
```

...and point to the real wallet while calling `deploy` method (it means that you don't need to generate any wallet in the script):

```js
  const contractTxId = await smartweave.createContract.deploy({
    wallet: jwk as ArWallet,
    initState: initialState,
    src: contractSrc
  });
```

You should put wallet jwk in a dedicated folder (e.g. `.secrets` folder) and import it in the script. Remember to not make your jwk public!
After deploying the contract to the mainnet you can also view it in SonAR. You just need to wait for blocks to be mined. It can take up to 20 minutes.
