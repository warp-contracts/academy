# VRF

**VRF (Verifiable Random Function)** is a random number generator which is more secure than a typical randomness generator as it is verifiable on chain.

So how does it work? Each randomly generated value is assigned with a cryptographic proof of how this value has been created. This proof uses as a seed the sequence generated by **Warp Sequencer** for a given interaction. The cryptographic proof assigned with the generated value gives users some more guarantee that the result has not been tampered or manipulated by a user or smart contract developer.

VRF shows its power in blockchain games (eg. lottery drawing) and NFTs (eg. generating random assets). It is also useful in contracts which need random assignment of duties. Every time your contract needs to rely on unpredictable results, VRF is the function you are seeking.

### How to use VRF?

Firstly, VRF is generated in Warp Sequencer while creating a new interaction. Then, it's verified in the Warp SDK (if you are interested in how it's done see [this method in our SDK](https://github.com/warp-contracts/warp/blob/main/src/core/modules/impl/DefaultStateEvaluator.ts#L257)).

In order to generate random number in the contract, we should use VRF following way:

```ts
const random = SmartWeave.vrf.randomInt(99);
```

We are using `SmartWeave` global object and its vrf property. We just need to set the number range (in this case it is set to 1 - 99).

When interacting with the contract we need to ask sequencer to generate vrf for us. To do this we need to pass `options.vrf` set to `true` to `bundleInteraction` method.

Here's thr API:

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

...and this is how we use it to interact with the contract:

```ts
const result = await contract.bundleInteraction(
  {
    function: 'vrf',
  },
  { vrf: true }
);
```

Please note that we need to use `bundleInteraction` instead of `writeInteraction` as we are using Warp Sequencer.
