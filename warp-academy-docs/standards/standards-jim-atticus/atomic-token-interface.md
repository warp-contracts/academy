# Introduction

## Atomic Tokens

Often, creators or owners of Atomic Assets may want to introduce mechanisms similar to [ERC-20](https://eips.ethereum.org/EIPS/eip-20) either to represent shared ownership of the overall Atomic Asset, or to create a concept of token
holdership within the atomic asset to mean something else.

# Behavior
- `balances` should never be negative

## Interface

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

## Implementation

### State

- `balances`
  - `Map<string,uint>`
  - Represent the mapping from user address to current balance
  `address => balance`