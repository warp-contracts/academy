# Custom Signing - legacy

:::caution
Please note, that you are viewing old Custom Signing docs. Since `warp-contracts@1.4.13` this file does not apply. In order to read about current custom signing format, please head to [Custom Signing](../advanced/custom-signing.md).
:::

By default in order to sign any transactions, user's wallet of type [`JWKInterface`](https://github.com/ArweaveTeam/arweave-js/blob/master/src/common/lib/wallet.ts#L7) needs to be passed as an argument for the method.

There are some other ways to sign the transaction.

It is also possible to pass as wallet property object of type `CustomSignature`. Interface for the discussed below:

```ts
type SignatureType = 'arweave' | 'ethereum';
type SigningFunction = (tx: Transaction) => Promise<void>;

type CustomSignature = {
  signer: SigningFunction;
  type: SignatureType;
  getAddress?: () => Promise<string>;
};
```

- `signer` - accept arweave transaction sign it and attach proper tags
- `type` - type of signature
- `getAddress` - optional field, if set it will be used to determine owner of transaction.
  Very useful

  [More info about example implementation of custom signatures](/docs/sdk/advanced/plugins/signature)

An example of a method which uses custom signing functionality:

```ts
const customSigningFunction = async (tx: Transaction) => {
  await sign(tx);
};

await contract.connect({ signer: customSigningFunction, type: 'arweave' }).writeInteraction({
  function: 'function',
});
```

Custom signing function is then used to sign the transaction.

:::tip

The most common use case for that is signing transaction with EVM wallet.
More about it in the [`Signature plugin` section](/docs/sdk/advanced/plugins/signature).

:::
