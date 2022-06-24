# Bundled interactions

### bundleInteraction

In order to write an interaction to the contract, we can use `writeInteraction` method. Here's the API:

```js
  writeInteraction<Input = unknown>(
    input: Input,
    tags?: Tags,
    transfer?: ArTransfer,
    strict?: boolean
  ): Promise<string | null>;
```

To bundle our interaction we simply replace `writeInteraction` method with `bundleInteraction`, here is the API:

```ts
  bundleInteraction<Input = unknown>(
    input: Input,
    options?: {
      tags?: Tags;
      strict?: boolean;
      vrf?: boolean;
    }
  ): Promise<any | null>;
```

Let's tear it apart:

1. `input` - new input to the contract that will be assigned with this interactions transaction.
2. `tags` - additional tags that can be attached to the newly created interaction transaction.
3. `strict` - transaction will be posted on Arweave only if the dry-run of the input result is "ok".
4. `vrf` refers to verifiable randomness which can be verified on chain. Remember that we need to provide deterministic inputs to our contract? Randomness does not sound like one. However, with this vrf we are safe to generate randomness which is cryptographically verifiable.

Please note that is not possible to transfer ARs to another wallet using `bundleInteraction` method as Bundlr cannot do the transfer.

Here is how you can use `bundleInteraction` method:

```ts
await contract.bundleInteraction(
  {
    function: 'transfer',
    transfer: {
      target: 'xxxxxejg62L1gVBCTybQ2HPxXjCt2V0ZP8RFqvx7siY',
      qty: '1000000000',
    },
  },
  { vrf: true }
);
```

That's it! When we bundle the interaction, we can read the state instantly and it will be updated with what this interaction returns.
