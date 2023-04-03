# 🦀 Rust template

[This](<https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst>)
repository contains an example SmartWeave contracts in Rust and building them into WASM binaries which can be then processed by Warp SDK.

It contains an example implementation of a PST contract - which you can use as a base for implementing your own contract.
If you are not familiar with the concept of Profit Sharing Tokens, check out a [tutorial](/tutorials/pst/introduction/intro) for writing your first PST contract in our Warp Academy.

- [Installation](#-installation)
- [Typescript bindings](#typescript-bindings)
- [Tests](#-tests)
- [Deploy](#-deploy)
- [Using SDK](#-using-sdk)


### 📦 Installation

You will need:

- Rust :-) (https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (on Apple's M1s you may need Rosetta `softwareupdate --install-rosetta` for wasm-pack to run)
- [Node.js](https://nodejs.org/en/download/) version 16.5 or above
- [yarn](https://yarnpkg.com/getting-started/install) installed

To install all Node.js dependencies run the following command:

```bash
yarn install
```

### 👷 Build

Compile your contract to WASM binary by running following command:

```bash
yarn build
```

### Typescript bindings

Rust contract definitions can be compiled to Typescript:

1. Firstly JSON schemas are generated from Rust contract definitions using [schemars](https://github.com/GREsau/schemars).
2. Then, JSON schemas are compiled to Typescript using [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript).
3. Lastly, a helper class is generated from typescript bindings which allows to easily interact with the contract. Instead of using `writeInteraction` method each time, specific functions can be called within the contract, e.g.:

```ts
  async transfer(transfer: Transfer, options?: WriteInteractionOptions): Promise<WriteInteractionResponse | null> {
  return await this.contract.writeInteraction<BaseInput & Transfer>({ function: 'transfer', ...transfer }, options);
}
```

Generate JSON:

```bash
yarn gen-json
```

Compile JSON to Typescript:

```bash
yarn gen-ts
```

Gnerate JSON and compile to Typescript:

```bash
yarn gen-bindings
```

Files will be generated in [contract/definition/bindings](contract/definition/bindings).

### 🧪 Tests

Write tests for your contract (we will use Jest library for testing) - you can find a template in the [tests/](https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst/tests) folder.
Run tests with

```bash
yarn test
```

### 📜 Deploy

Deploy your contract to one of the networks (mainnet/Warp public testnet/localhost) by running following command (`network`: `mainnet` | `testnet` | `local`)

Please note that in case of local deployment, you need to have `ArLocal` instance running - `npx arlocal`.

```bash
yarn deploy:[network]
```

💡**NOTE**: If you want to deploy your contract locally you need to run Arlocal by typing following command:

```bash
npx arlocal
```

💡**NOTE**: When using mainnet please put your wallet key in [deploy/mainnet/.secrets/wallet-mainnet.json](deploy/mainnet/.secrets/wallet-mainnet.json). `.secrets` folder has been added to `.gitignore` so your key is kept securely.

You can view deploy script code [here](deploy/scripts/deploy.js).

### 🟥 Using SDK

Optionally - you can run one of the scripts which uses Warp SDK to interact with the contract. Using SDKs' methods works exactly the same as in case of a regular JS contract.

💡**NOTE** You will need to have a file with the wallet key and a file with the contract id to run these scripts. If you do not have them please run a [deploy](#-deploy) script.

1. `read` - reads contract state, check out the code in [deploy/scripts/read-contract-state.js](https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst/deploy/scripts/read-contract-state.js)

```bash
    npm run read:[network]
```

2. `balance` - get balance for a wallet address, check out the code in [deploy/scripts/interact-balance.js](https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst/deploy/scripts/interact-balance.js)

```bash
    npm run balance:[network]
```

3. `transfer` - transfer specific amount of tokens to the indicated wallet, check out the code in [deploy/scripts/interact-transfer.js](https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst/deploy/scripts/interact-transfer.js)
