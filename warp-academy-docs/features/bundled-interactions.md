# Bundled interactions

### writeInteraction

To bundle our interaction (i.e. post the interaction via our Sequencer), simply call the `writeInteraction`.

```js
 writeInteraction<Input = unknown>(
  input: Input,
  options?: WriteInteractionOptions
): Promise<WriteInteractionResponse | null>;
```

Let's tear it apart:

1. `input` - new input to the contract that will be assigned with this interaction transaction.
2. `options` - [optional] options to be passed, the most common are:
   1. `tags` - additional tags that can be attached to the newly created interaction transaction.
   2. `strict` - transaction will be posted on Arweave only if the dry-run of the input result is "ok".
   3. `vrf` - refers to verifiable randomness which can be verified on chain. Remember that we need to provide deterministic inputs to our contract? Randomness does not sound like one. However, with this vrf we are safe to generate randomness which is cryptographically verifiable. 
   4. `disableBundling` - `false` by default. If set to `true`, the transaction will be posted 'directly' to Arweave - without using our Warp Sequencer.

Here is how you can use the `writeInteraction` method:

```ts
await contract.writeInteraction(
  {
    function: 'transfer',
    transfer: {
      target: 'xxxxxejg62L1gVBCTybQ2HPxXjCt2V0ZP8RFqvx7siY',
      qty: '1000000000',
    },
  },
  { strict: true }
);
```
That's it! When we bundle the interaction, we can read the state instantly, and it will be updated with what this interaction returns.

If you don't want to use the Sequencer, simply set the `options.disableBundling` to `true`. Keep in mind though that it will take few minutes 
to mine the interaction - and additional 20-30 minutes for the proper transaction confirmation.

