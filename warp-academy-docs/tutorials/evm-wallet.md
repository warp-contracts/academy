# EVM wallet connection

In the [last tutorial](/tutorials/ardit/application/initialization#wallet-connection) we learned how to connect Arweave wallet to the contract using [ArweaveWalletConnector](https://github.com/jfbeats/ArweaveWalletConnector).

Apart from Arweave wallet, you can connect EVM wallet to your contract. By reading this tutorial, you will know how to use a non-Arweave wallet in your application but before that - keep in mind following limits of the feature:

1. You can connect EVM wallet only in browser environment.
2. User needs to have Metamask plugin installed.
3. It is possible to use EVM wallet only when bundling transaction. See [this feature](/docs/sdk/advanced/bundled-interaction).

Most importantly - these obstacles will not last forever as Warp team is planning to develop the feature further. For now, treat is an experimental feature which can expand the capabilities of your application by inviting users from other blockchain than Arweave. As always - if you find it useful or would like to make a suggestion, please reach to the Warp team on [on Discord](https://discord.com/invite/PVxBZKFr46).

You can find the code of final application which signs Warp transactions with EVM wallet [here](https://github.com/warp-contracts/academy/tree/main/warp-academy-ardit/final/metamask-app).

Application has been already deployed. [Check it out!](https://evm-metamask.vercel.app/)

### `warp-contracts-plugin-signature`

In order to connect to the wallet external to the Arweave ecosystem we will install [`warp-contracts-plugin-signature`](https://www.npmjs.com/package/warp-contracts-plugin-signature) package in our project.

```sh
yarn add warp-contracts-plugin-signature
```

### `evmSignature`

`warp-contracts-plugin-signature` package exposes a `evmSignature` function which can be passed to the `connect` method of the Warp SDK. This method is responsible for signing the transaction with your EVM wallet. If you pass a signing function (it's our case!) instead of Arweave wallet, you also need to specify `signatureType`. Currently, it is possible to indicate `arweave` or `ethereum` signature type. So the final connection method should look like this:

```ts
import { evmSignature } from 'warp-contracts-plugin-signature';

await this.contract.connect({ signer: evmSignature, signatureType: 'ethereum' });
```

You can connect EVM wallet by creating a special `Connect` button and attaching proper event handler or directly in the `writeInteraction` method like this:

```ts
import { evmSignature } from 'warp-contracts-plugin-signature';

await this.contract.connect({ signer: evmSignature, signatureType: 'ethereum' }).writeInteraction({
  function: 'function',
});
```

Metamask plugin will then pop up and asks user to sign the transaction. If Metamask is not installed, `evmSignature` function will throw an error. However, if you want to attach `evmSignature` method to the `Connect` button - it is best to firstly check if Metamask is installed:

```sh
yarn add @metamask/onboarding
```

```ts
if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
  ...
}
```

### evmSignatureVerification

All the evm-signed transactions can be verified during contract state evaluation in order to avoid potential malicious actors trying to manipulate the state. In order to verify all the contract interactions, you need to use a special plugin exposed by `warp-contracts-plugin-signature` library. The plugin will check each interaction and if the transaction fails the verification it is omitted while evaluating the state. `ethers` library is used to verify the interaction based on its signature.

This is how you use the plugin in your contract:

```ts
import { EvmSignatureVerificationWebPlugin } from 'warp-contracts-plugin-signature';

const warp = await WarpFactory.forMainnet().use(new EvmSignatureVerificationWebPlugin());
```

### Tags

A special tag is added to all bundled transactions which were signed using EVM wallet, this helps us identify all evm-signed transactions. Remember that you can mix transactions signed with EVM wallet or Arweave wallet and even make these wallets interact with each other (eg. transfer tokens between them).

```ts
{ 'Signature-Type': 'ethereum' }
```
