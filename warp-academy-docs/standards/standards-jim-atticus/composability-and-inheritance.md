# Introduction

Now that we have defined interfaces for both
[Atomic Asset](./atomic-asset-interface.md) and
[Atomic Token](./atomic-token-interface.md) we are able to discuss how to
compose them.

Whether or not the Atomic Asset Interface must be strictly inherited from is up
for debate, as there are pros and cons of both approaches.

Below is an example of how the two aforementioned interfaces would look when
combined to create an Atomic Token (inheritance) or an Ownable Atomic Token
(composed).  Both implementations are identical.

## Combined State

This state accounts for all necessary state of both the Atomic Asset and Atomic
Token interfaces.

- `owner`
  - `?string`
  - Should be a 43 character base64url string representing the owner of the
    atomic asset
  - Can be `undefined` to signal ownership has been delegated to token holders
    or the public domain
- `balances`
  - `Map<string,uint>`
  - Represent the mapping from user address to current balance
    `address => balance`

## Combined Interface

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

```ts
balanceOf(address: string) => uint
```

- View state method - does not modify state
- Returns the token balance for address `address` (base64url) as a `uint`

```ts
transfer(to: string, amount: uint) => void
```

- Transfers `amount` of tokens to address `to`
- SHOULD throw if caller does not have enough balance
- Transfers of 0 MUST be treated as normal transfers

## Going Forward

- More interfaces beyond what is proposed here can be added and composed with
the base Standard Interface
  - For example, ERC-721, PST, Verto Flex, Warp Tradeable, AFTER Interop
