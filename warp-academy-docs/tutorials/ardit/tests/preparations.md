# Preparations

It is more than important to carefully test your contract before deploying it to the blockchain. We will write a few tests and execute them in a server environment as well as in a browser using Jest. Throughout this process you will get to know a couple of important **ArweaveJS** and **Warp SDK** methods.

## 🔤 Declaring variables

Head to [tests/ardit.test.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/tests/contract.test.ts) and start by declaring all necessary variables in `beforeAll` - a callback which will be executed before all the tests. Remeber to import all the interfaces!

```js
let ownerWallet: JWKInterface;
let owner: string;
let user2Wallet: JWKInterface;
let user2: string;
let user3Wallet: JWKInterface;
let user3: string;
let initialState: ArditState;
let arlocal: ArLocal;
let warp: Warp;
let ardit: Contract<ArditState>;
let contractSrc: string;
let contractId: string;
```

## 🅰️ Setting up ArLocal

```js
arlocal = new ArLocal(1820);
await arlocal.start();
```

We initialize ArLocal - a local server resembling the real Arweave network - on port 1820 (the default one is 1984) and start the instance.

## 🎛️ LoggerFactory

```js
LoggerFactory.INST.logLevel('error');
```

Logging is helpful not only during the development process but also when interacting with the contract as it gives some indication of what is happening and what errors have occured. Warp SDK has seven levels of logging, you can view all logging implementations in the SDK [https://github.com/warp-contracts/warp/tree/main/src/logging](https://github.com/warp-contracts/warp/tree/main/src/logging). It is advisable to use only `fatal` or `error` logging levels in production as using other ones may slow down the evaluation. You can also use different logging levels for each module. Names of the modules are derived from Typescript classes in the SDK. Here is an example of such an implementation:

```js
LoggerFactory.INST.logLevel('fatal');
LoggerFactory.INST.logLevel('debug', 'ArweaveGatewayInteractionsLoader');
```

For the tutorial purposes we will set logging level to `error`.

## 🪡 Setting up Warp

```js
warp = WarpFactory.forLocal(1820);
```

Warp class in SDK is a base class that supplies the implementation of SmartWeave protocol. Check it out in SDK [https://github.com/warp-contracts/warp/blob/main/src/core/Warp.ts](https://github.com/warp-contracts/warp/blob/main/src/core/Warp.ts). Warp allows to plug-in different module implementations (like interactions loader or state evaluator) but as it is just the first tutorial, we will go with the most basic implementation. We will create a Warp instance by using `WarpFactory`. We will also use `forLocal` method factory - designed for local environment - and indicate Arlocal port.

## 👛 Generating wallet and adding funds

```js
ownerWallet = await warp.testing.generateWallet();
owner = await warp.arweave.wallets.jwkToAddress(ownerWallet);

user2Wallet = await warp.testing.generateWallet();
user2 = await warp.arweave.wallets.jwkToAddress(user2Wallet);

user3Wallet = await warp.testing.generateWallet();
user3 = await warp.arweave.wallets.jwkToAddress(user3Wallet);
```

In order for tests to run properly we need to create wallets. We will create 3 as we will be testing our contract for different wallets. We can simply use `await warp.testing.generateWallet()` - Warp method which creates random wallet and funds it. Additionally, we will get the address for each of these wallets.

## 📰 Reading contract source and initial state files

Ok, back to the test. Now, we need to find a way to read files with contract source we've prepared in the last section. In order to do that we will use NodeJS method `readFileSync`. Remember to import `fs` and `path` modules. We are pointing to the file we've prepared in [the last section](../writing-pst-contract/contract-source#-bundling-contract) using esbuild and prepared scripts.

```js
contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');
```

## ✍🏻 Setting initial state

We need to set the initial state of the contract which will be updated during interactions.

```js
initialState = {
  messages: [],
};
```

## 🪗 Deploying contract

Now, the moment we were all waiting for!

```js
({ contractTxId: contractId } = await warp.createContract.deploy({
  wallet: ownerWallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
}));
```

We are using Warp SDK's `deploy` method to deploy the contract. You can view the implementation here [https://github.com/warp-contracts/warp/blob/main/src/core/modules/impl/DefaultCreateContract.ts](https://github.com/warp-contracts/warp/blob/main/src/core/modules/impl/DefaultCreateContract.ts#L12).

What it does is take object with **wallet**, **initial state** and **contract source** as contract data, create transaction using ArweaveJS SDK, add tags specific for Warp contract (we will discuss tags in the next paragraph), sign transaction using generated Arweave wallet and post it to the Arweave blockchain. If your are not familiar with creating transactions on Arweave we strongly recommend reading ArweaveJS documentation, it's the key part to understand transactions flow, you can read more about it [here](https://github.com/ArweaveTeam/arweave-js#transactions).

## 🔌 Connecting to the contract

```js
ardit = warp.contract(contractTxId).connect(wallet);
```

In order to perform any operation on the contract we need to connect to it. You can connect to any contract using SDK's `contract` method. You can view `connect` method in [`Warp` class](https://github.com/warp-contracts/warp/blob/main/src/core/Warp.ts#L47).

We then connect our wallet to the Ardit contract. Please remember that connecting a wallet MAY be done before `viewState` (depending on contract implementation, ie. whether called contract's function required `caller` info). Connecting a wallet MUST be done before `writeInteraction`. Therefore, it is not required when we just want to read the state.

## 🛑 Stopping ArLocal

After all tests will be executed, we will need to stop ArLocal instance. Add following code to the `afterAll` function:

```js
await arlocal.stop();
```

### Conclusion

Ok, a ton of work done! Let's write some tests!
