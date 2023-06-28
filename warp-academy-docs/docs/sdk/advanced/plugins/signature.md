# Warp Signature

> :warning: **`warp-contracts-plugin-signature` works with `warp-contracts` version at least 1.4.13. To sign transactions when using `warp-contracts` <= 1.4.12, please use `warp-contracts-plugin-signature` version <= 1.0.12.**

This package allows to sign data items with some specific Signer's implementations. Currently, it is possible to sign data items using following signers:

- InjectedArweaveSigner - ArweaveSigner for browser
- EthereumSigner
- InjectedEthereumSigner - EthereumSigner for browser

All the implementations are based on [`arbundles` package](https://github.com/Bundlr-Network/arbundles).

Example usage:

**Injected Arweave Signer**

```ts
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { WarpFactory } from 'warp-contracts';

const wallet = new ArweaveWebWallet({
  name: 'Your application name',
  logo: 'URL of your logo to be displayed to users',
});

wallet.setUrl('arweave.app');
await wallet.connect();
const userSigner = new InjectedArweaveSigner(wallet);
await userSigner.setPublicKey();

const warp = WarpFactory.forMainnet();
const contract = warp.contract(contract_id).connect(userSigner);
```

**InjectedEthereumSigner**

```ts
import { EthereumSigner } from 'warp-contracts-plugin-signature';
import { WarpFactory } from 'warp-contracts';

const warp = WarpFactory.forMainnet();
const contract = warp.contract(contract_id).connect(new EthereumSigner(private_key));
```

**InjectedEthereumSigner**

```ts
import { InjectedEthereumSigner } from 'warp-contracts-plugin-signature';
import { WarpFactory } from 'warp-contracts';
import { providers } from 'ethers';

await window.ethereum.enable();

const wallet = new providers.Web3Provider(window.ethereum);

const userSigner = new InjectedEthereumSigner(wallet);
await userSigner.setPublicKey();

const warp = WarpFactory.forMainnet();
const contract = warp.contract(contract_id).connect(userSigner);
```
