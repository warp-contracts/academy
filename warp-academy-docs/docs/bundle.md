### Write interactions

Let's start with explaining regular flow of writing interactions. If anyone wants to interact with our contract, he needs to post a transaction on Arweave which stores input for the contract. Here is the API:

```ts
async function writeInteraction<Input>(
  input: Input,
  tags?: Tags,
  transfer?: ArTransfer,
  strict?: boolean
): Promise<string>;
```

Here is an example:

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

Let's tear it apart.

1. `input` - new input to the contract that will be assigned with this interaction transaction
2. `tags` - additional tags that can be attached to the newly created interaction transaction
3. `transfer` - additional transfer data than can be attached to the interaction transaction - `target` address to which we want transfer tokens and `winstonQty` - amount of tokens we want to transfer
4. `strict` - transaction will be posted on Arweave only if the dry-run of the input result is "ok"

`writeInteraction` method create, sign and post transaction on Arweave. Easy, right? The only problem with this approach is that you are posting your transaction directly to Arweave blockchain. And that means that you need to wait for your transaction to be mined, only then you can be sure your interaction is valid. In theory it can take around 20 minutes. Now, imagine developing this cool app with magnificent UX. Would be quite if you would force your users to wait that long until they see the result of a contract interaction in the app.

That's way we introduced the Warp Sequencer and used Bundlr Network.

### Sequencer

At the core of bundling transactions lies the sequencer which bundles and assigns order to SmartWeave interactions. The algorithm responsible for ordering transactions is backwards compatible which means that interactions registered with sequencer can be used together with those sent directly to Arweave. The ordering follows the [FIFO approach](https://www.investopedia.com/terms/f/fifo.asp), taking into account the sequencer's timestamp, current Arweave network block height and is salted with sequencer's key - to prevent front running.

We also used [Budlr Network](https://docs.bundlr.network/) which guarantees data finality and data upload reliability. Bundlr assures that the transaction will be posted on Arweave (usually within a few hours).

Lastly, bundled transactions are indexed in [Warp gateway](https://github.com/warp-contracts/gateway).

These three pieces combined provide instant transactions availability. It means that you don't need to wait for your transaction 20 minutes, instead - it is available in milliseconds enhancing overall user experience. Try for yourself how fast you can interact with the contract in our [Warp9 app](https://warp9.warp.cc/).

### bundleInteraction

To benefit from the solution you simply replace `writeInteraction` with `bundleInteraction`, here is the API:

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

Here is an example:

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

Two words of explanation:

1. It is not possible to transfer ARs to another wallet using `bundleInteraction` method as Bundlr cannot do the transfer.
2. `vrf` is a topic for another chapter, but in general it refers to verifiable randomness which can be verified randomness. Remember that you neet to provide deterministic inputs to your contract? Randomness does not sound like one. However, with this vrf you are safe to generate randomness which is cryptographically verifiable.

That's it! When you bundle the interaction, you can read the state instantly and it will be updated with what this interaction returns.

### bundled deploy

It is also possible to use our sequencer when deploying contract. The API is trivial.

```ts
  deploy(contractData: ContractData, useBundler?: boolean): Promise<string>;
```

You just need to set second argument of the `deploy` function to true. Here is the example:

```ts
await warp.createContract.deploy(
  {
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  },
  true
);
```
