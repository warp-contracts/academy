# Introduction

## Technical Definition
An **Atomic Asset** is both the SmartWeave Contract and its data initialized in
the same transaction posted to Arweave.

The SmartWeave Contract and data share a *single transaction ID*.

For more information see:
- [What is an Atomic Asset?](/standards/atomic-asset#what-is-atomic-asset)
- [Why choose Atomic Asset?](/standards/atomic-asset#why-to-choose-atomic-asset)

## Provenance
*1) origin, source*

*2) the history of ownership of a valued object [...]*

### Arweave Provenance Flow
An example Arweave Provenance Flow might look like the one below where a single
address publishes an Atomic Asset to arweave and is the single owner of the
Transaction.  With Atomic Assets, this single owner may signal delegation to
other owners through the Atomic Asset's contract state.

1) Immutable Transaction Owner [may signal delegation to]

2) Contract State Owner [may signal delegation to]

3) Multiple Contract Owners [may signal delegation to]

4) Single State Owner, Public Domain, Different Owners, etc.

# Behavior

While an Atomic Asset’s contract implementation can be anything, a **Standard
Interface** is proposed in order to maintain composability.

As assets are *things that are owned*, the base Standard Interface of an Atomic
Asset is concerned only with the concept of **ownership**.

- The base Atomic Asset Standard Interface is concerned with a single `owner`
meant to represent ownership of the asset & contract.
- `owner` can be `undefined` in order to signal ownership delegation to
alternative ownership schemes (e.g. Atomic Token, Atomic NFT, Public Domain)
- The unique ID of the Atomic asset is its transaction ID

## Interface

```ts
owner() => string | undefined
```
- View state method - does not modify state
- Returns the address of the current owner of the Atomic Asset (base64url)

```ts
transferOwnership(to: string) => 
```

- Transfers ownership of the Atomic Asset to address `to` (base64url)
- SHOULD throw if the caller is not the `owner`

## Implementation

### Discoverability

To find existing contracts implementing the atomic-asset standard, we can use `tags` that are part of every Arweave transaction.
Tags can be specified [during deployment](../docs/sdk/advanced/register-contract) of atomic-asset.

- During deployment following tag should be added : `{name: 'Indexed-By', value: 'atomic-asset'}`
  - This tag is supported by [warp-aggregate-node](../docs/aggregate-node/overview.md). Thus allow to query assets by its owner - [documentation](../docs/aggregate-node/overview.md#nft-by-owner)

### State

- `owner`
  - `?string`
  - Should be a 43 character base64url string representing the owner of the
  atomic asset
  - Can be `undefined` to signal alternative ownership mechanisms or public
  domain ownership
