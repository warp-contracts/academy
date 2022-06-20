# Bundled interactions and deployment

### Write interactions

Let's start with explaining regular flow of writing interactions. If anyone wants to interact with our contract, he needs to post a transaction on **Arweave** which stores input for the contract. Here is the API:

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

1. `input` - new input to the contract that will be assigned with this interaction transaction.
2. `tags` - additional tags that can be attached to the newly created interaction transaction.
3. `transfer` - additional transfer data than can be attached to the interaction transaction - `target` address to which we want transfer tokens and `winstonQty` - amount of tokens we want to transfer.
4. `strict` - transaction will be posted on **Arweave** only if the dry-run of the input result is "ok".

`writeInteraction` method creates, signs and posts transaction on **Arweave**. Easy, right? The only problem with this approach is that we are posting our transaction directly to **Arweave** blockchain. And that means that we need to wait for our transaction to be mined, only then we can be sure our interaction is valid. In theory it can take up to 20 minutes. Now, imagine developing this cool dApp with magnificent UX. Would be quite disappointing if we would force our users to wait that long until they see the result of a contract interaction in the dApp.

That's way we introduced the **Warp Sequencer** which uses **Bundlr Network** underneath.

### Sequencer

At the core of bundling transactions lies the sequencer which bundles and assigns order to SmartWeave interactions. The algorithm responsible for ordering transactions is backwards compatible which means that interactions registered with sequencer can be used together with those sent directly to **Arweave**. The ordering follows the [FIFO approach](https://www.investopedia.com/terms/f/fifo.asp), taking into account the sequencer's timestamp, current **Arweave** network block height and is salted with sequencer's key - to prevent front running.

We also used [Budlr Network](https://docs.bundlr.network/) which guarantees data finality and data upload reliability. Bundlr assures that the transaction will be posted on **Arweave** (usually within a few hours). In the receipt which is rceived from the upload function we get `block` field which is set to maximum block the transaction will be in by.

Lastly, bundled transactions are indexed by [Warp gateway](https://github.com/warp-contracts/gateway) which then enables SmartWeave interactions loading.

These three pieces combined provide instant transactions availability. It means that we don't need to wait for our transaction 20 minutes, instead - it is available in milliseconds, enhancing overall user experience. Try for yourself how fast you can interact with the contract in our [Warp9 app](https://warp9.warp.cc/).

### bundleInteraction

To benefit from the solution we simply replace `writeInteraction` with `bundleInteraction`, here is the API:

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
2. `vrf` refers to verifiable randomness which can be verified on chain. Remember that we need to provide deterministic inputs to our contract? Randomness does not sound like one. However, with this vrf we are safe to generate randomness which is cryptographically verifiable.

That's it! When we bundle the interaction, we can read the state instantly and it will be updated with what this interaction returns.

### bundled deploy

It is also possible to use our sequencer when deploying contract. The API is trivial.

```ts
deploy(contractData: ContractData, useBundler?: boolean): Promise<string>;
```

We just need to set second argument of the `deploy` function to true. Here is the example:

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

### Conclusion

That's it. We strongly recommend using bundling while deploying or interacting with the contract. It allows faster retrievals on the **Arweave** blockchain and in the end - better scalling. We leverage transaction bundling, in the same way as the other chains use rollups to scale the throughput.
