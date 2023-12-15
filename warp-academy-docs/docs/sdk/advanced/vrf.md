# Verifiable randomness

:::caution
Random values will be handled in a new way once the decentralized sequencer is launched.
More details can be found [here](/docs/sequencer/lifecycle/ordering#random-values).
For backward compatibility, the function `SmartWeave.vrf.randomInt(maxValue)` will still work, but it will use the new function `SmartWeave.randomNumber(maxValue)` under the hood.
:::

You have an option to use random values in contracts via Verifiable Random Functions.  
This may be a very useful feature in gaming, dynamic NFT generation, etc.

We're using the Google Key Transparency VRF implementation.

### Interaction creation
In order to use the VRF, the Warp Sequencer must be used with the `vrf` option set to `true`:

```javascript
await contract.writeInteraction(
      { function: 'generateNFT' },
      { vrf: true });
```

### Contract code
An interaction transaction generated with `vrf` option gives access to specific methods via the `SmartWeave` global object:
- `SmartWeave.vrf.data`
- `SmartWeave.vrf.value`
- `SmartWeave.vrf.randomInt(maxValue: number)`

The last method (`randomInt`) allows to [generate](https://github.com/warp-contracts/pokemons/blob/master/contract/src/contracts/actions/write/questions.ts#L12) a pseudo-random (but deterministic) value based on the VRF data generated
during interaction transaction registration.
It generates a random integer value in a range `[1, maxValue]`.

### Example
A full example of using a VRF in a simple guessing game is available [here](https://github.com/warp-contracts/pokemons).


### Verification
If you want the `warp-contracts` SDK to verify the VRF's proof:
1. up until version `1.4.3` it is done automatically by the SDK 
2. from version `1.4.4` - you need to attach the [VRF plugin](plugins/vrf) first.

The verification code itself:
```ts
function verifyVrf(vrf: VrfData, sortKey: string, arweave: Arweave): boolean {
    const keys = EC.keyFromPublic(vrf.pubkey, 'hex');

    let hash;
    try {
      // ProofHoHash throws its own 'invalid vrf' exception
      hash = ProofHoHash(
        keys.getPublic(),
        arweave.utils.stringToBuffer(sortKey),
        arweave.utils.b64UrlToBuffer(vrf.proof)
      );
    } catch (e: any) {
      return false;
    }

    return arweave.utils.bufferTob64Url(hash) == vrf.index;
}
```



