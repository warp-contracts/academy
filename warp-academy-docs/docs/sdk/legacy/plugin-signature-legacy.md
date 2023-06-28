# Warp Contracts Signature plugin - legacy

:::caution
Please note, that you are viewing old Custom Signature plugin docs. Since `warp-contracts@1.4.13` this file does not apply. In order to read about current Warp Contracts Signature plugin, please head to [`Warp Contracts Signature plugin` section](../advanced/plugins/signature.md).
:::

Warp Signature is a tool to be used in [Warp](https://github.com/warp-contracts/warp) contracts. It allows to sign transactions using non-Arweave wallet. Currently, it is possible to connect to:

- EVM wallet using Metamask plugin in browser environment
- EVM wallet using [ethers.Signer](https://docs.ethers.org/v5/api/signer/) interface in Node.js

## MetaMask Signing transactions

```ts
import { evmSignature } from 'warp-contracts-plugin-signature';

await this.contract.connect({ signer: evmSignature, signatureType: 'ethereum' }).writeInteraction({
  function: 'function',
});
```

## ethers.Signer Signing transactions

```ts
import { buildEvmSignature } from 'warp-contracts-plugin-signature/server';
import { Wallet } from 'ethers';

// for example using ethers.Wallet
const signer = Wallet.createRandom();
const evmSignature = buildEvmSignature(signer);

await this.contract.connect({ signer: evmSignature, signatureType: 'ethereum' }).writeInteraction({
  function: 'function',
});
```

## Signature verification

In order to verify signatures for the given contract, one needs to use `EvmSignatureVerificationPlugin` while initializing Warp. Plugin will be then fired up when reading contract state and all interactions' signatures will be then verified. If incorrect signature will be detected, contract state will be evaluated without it.

```ts
const warp = await WarpFactory.forMainnet().use(new EvmSignatureVerificationPlugin());
```

## Future plans

1. Usage of other wallets (e.g. Solana) and plugins.

## Common problems

### Next.js server side imports

"Next.js requires that any code you import from `node_modules` need to be compatible with Node.js" - [discussed here](https://github.com/vercel/next.js/issues/31518). So to be able to import "only" `web` compatible lib like this one we have to use workaround with dynamic `import()`.

`const { evmSignature, EvmSignatureVerificationWebPlugin } = await import('warp-signature');`
