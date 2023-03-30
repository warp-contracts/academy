# Introduction

## What is atomic asset?

An atomic asset is the concept, where **asset** (like an image) and **smart contract** are deployed atomically - in one logical transaction.
It is possible, thanks to unique properties of Arweave blockchain. Typically, a blockchain asset is stored on a storage system (for example - IPFS), and only a smart contract is deployed on-chain (for example - the ERC721 standard).

### Why to choose atomic asset:

- Standards like ERC-721 on Ethereum usually point to the external links of the NFT’s asset, and are stored outside of the Ethereum Virtual Machine, thus you have no guarantee that it will be stored there permanently. In scenario where storage provider is centralized you could wake up empty-handed (NFT contract pointing to a non-existing URI). However, even if you use a decentralized means of storage like IPFS, it doesn't offer the same level of assurance regarding data availability as Arweave. (you can read more [here](https://arweave.news/nfts-storage-arweave-vs-ipfs/)). In one example an artist named [neitherconfirm](https://twitter.com/neitherconfirm/status/1369285946198396928?s=20) changed the media files referenced by 26 of his NFTs to stock images of rugs. The artist later commented, “All discussions about the value of NFTs are meaningless as long as the token is not inseparable from the artwork itself"
- With atomic assets, there is no possibility to create two (or more) contracts pointing to the same data, definition of the ownership is bounded to the asset not the other way around. "With Atomic NFTs, the address of the NFT smart contract _is_ the address of the NFT’s data. Permanent, on-chain assets, and no external metadata. One address. How NFTs were supposed to be" - Sam Williams, Arweave founder.
- Take the red pill 💊! Be the owner of your data, not the link to the data! 😎

## What is atomic-asset standard?

As we described earlier Atomic asset is a general idea, like [NFT](https://en.wikipedia.org/wiki/Non-fungible_token), this kind of definition is great, however, not specific enough for composability (example: Let's imagine, that you want to build `atomic asset` marketplace, you have to know how to consume existing `atomic assets` - which method to call on a contract to transfer it and what parameters should be passed).
\*\*atomic-asset&& standard is here to help, by determining the interface describing the smart contract behind atomic-asset. So when building a new marketplace (or other any product), you don't have to think about multiple implementations, per project.

# Behavior

- An atomic asset can be [fungible](https://www.blockchain-council.org/blockchain/a-quick-guide-to-fungible-vs-non-fungible-tokens/) or [non fungible token](https://en.wikipedia.org/wiki/Non-fungible_token).
- If the contract is `NFT` then `totalSupply == 1` and `owner` field is set
- If the contract is fungible token, then `totalSupply > 1` and `owner` field is empty
- `atomic-asset` is always binded to only one asset. This standard doesn't support multiple assets per one contract
- Unique id of asset is its transaction id
- `balance` per account can never be < 0

## Interface

### transfer

```ts
transfer(to: string, amount: uint) => void
```

- Transfers `amount` of tokens to address `to`. The function SHOULD throw if the message caller’s account balance does not have enough tokens to spend
- Transfers of 0 values MUST be treated as normal transfers

### balanceOf

```ts
balanceOf(target: string) => {balance: uint, target: string}
```

- view state method - does not modify state
- Returns the account balance of another account with address `target`

### totalSupply

```ts
totalSupply() => {value: uint}
```

- view state method - does not modify state
- Returns `value` of totalSupply of atomic-asset

### owner

```ts
owner() => {value?: string}
```

- view state method - does not modify state
- If the contract is `NFT` then `totalSupply == 1` and `owner` field is set
- If the contract is fungible token, then `totalSupply > 1` and `owner` field is empty
- If the contract is fungible token, and `totalSupply` is owned by one account then `owner` field is set to this account
- Returns `value` that is address of atomic asset owner, if it exists

### Implementations

- [Warp team rust and typescript implementation](./atomic-asset-impl.md)

Citations:

1. Fabian Vogelsteller <fabian@ethereum.org>, Vitalik Buterin <vitalik.buterin@ethereum.org>, "ERC-20: Token Standard," Ethereum Improvement Proposals, no. 20, November 2015. [Online serial]. Available: https://eips.ethereum.org/EIPS/eip-20.
