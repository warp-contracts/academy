# EVM wallet connection

In the [last tutorial](https://academy.warp.cc/tutorials/ardit/application/initialization#wallet-connection) we learned how to connect Arweave wallet to the contract using [ArweaveWalletConnector](https://github.com/jfbeats/ArweaveWalletConnector).

Apart from Arweave wallet, you can connect EVM wallet to your contract. By reading this tutorial, you will know how to use a non-Arweave wallet in your application but before that - keep in mind following limits of the feature:

1. You can connect EVM wallet only in browser environment.
2. User needs to have Metamask plugin installed.
3. Wallet can be used for signing the interactions but not for deploying the contract.
4. It is possible to use EVM wallet only when bundling transaction. See [this feature](https://academy.warp.cc/features/bundled-interactions).

Most importantly - these obstacled will not last forever as Warp team is planning to develop the feature further. For now, treat is an experimental feature which can expand the capabilities of your application by inviting users from other blockchain than Arweave. As always - if you find it useful or would like to make a suggestion, please reach to the Warp team on [on Discord](https://discord.com/invite/PVxBZKFr46).

You can find the code of final application which signs Warp transactions with EVM wallet [here](https://github.com/warp-contracts/academy/tree/main/warp-academy-ardit/final/app).

Application has been already deployed. [Check it out!](link)

### `warp-signature`

In order to connect to the wallet external to the Arweave ecosystem we will install [`warp-signature`](https://www.npmjs.com/package/warp-signature) package in our project.

```sh
yarn add warp-signature
```

### `evmSignature`

`warp-signature` package exposes a `evmSignature` function which can be passed to the `connect` method of the Warp SDK. If you pass a signing function (it's our case!) instead of Arweave wallet, you also need to specify `signatureType`. Currently, it is possible to indicate `arweave` or `ethereum` signature type. So the final connection method should look like this:

```ts
await this.contract.connect({ signer: evmSignature, signatureType: 'ethereum' });
```

You can connect EVM wallet by creating a special `Connect` and attaching proper event handler or directly in the `writeInteraction` method like this:

```ts
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

### Tags

A special tag is added to all bundled transactions which were signed using EVM wallet:

```ts
{ 'Signature-Type`: 'ethereum' }
```
