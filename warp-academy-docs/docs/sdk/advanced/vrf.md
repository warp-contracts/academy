# Verifiable randomness

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
In order to verify the transaction's VRF data:
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

:::info

The Warp Contracts SDK makes such [verification automatically](https://github.com/warp-contracts/warp/blob/main/src/core/modules/impl/DefaultStateEvaluator.ts#L107).

:::



