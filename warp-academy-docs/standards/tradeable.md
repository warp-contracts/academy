# Introduction

## What is tradeable?

Tradeable is standard. It describes the interface that makes trading easier on [decentralized exchanges](https://cointelegraph.com/learn/what-are-decentralized-exchanges-and-how-do-dexs-work). The idea is to allow other accounts to transfer our assets if we approve them to do so. This concept is mainly used with accounts that are contracts, so they can manage our assets in logic constrained by smart-contract code.

It exposes the same concept of allowance and approval known from [ERC20](https://eips.ethereum.org/EIPS/eip-20) or [ERC721](https://eips.ethereum.org/EIPS/eip-721).

### When to use?

If we want to make our asset tradable on platforms, which requires a `tradeable` interface. Contracts implementing `tradeable` assets should be composed with other standards like [atomic-asset](./atomic-asset.md).

# Behavior

- `allowance` per account can never be < 0

## Interface

### transferFrom

```ts
transferFrom(from: string, to: string, amount: uint) => void
```

- Transfers `amount` of tokens from address `from` to address `to`.
- The transferFrom method is used for a withdraw workflow, allowing contracts to transfer tokens on your behalf. This can be used for example to allow a contract to transfer tokens on your behalf and/or to charge fees in sub-currencies. The function SHOULD throw unless the `from` account has deliberately authorized the sender of the message via some mechanism
- Transfers of 0 values MUST be treated as normal transfers

### approve

```ts
approve(spender: string, amount: uint) => void
```

- Allows `spender` to withdraw from your account multiple times, up to the `amount`. If this function is called again it overwrites the current allowance with `amount`
- To prevent attack vectors like the one described [here](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit) clients SHOULD make sure to create user interfaces in such a way that they set the allowance first to 0 before setting it to another value for the same spender or use `increaseAllowance` or `decreaseAllowance` which are safe. TOUGH The contract itself shouldn’t enforce it

### allowance

```ts
allowance(owner: string, spender: string) => {allowance: uint, owner: string, spender: string}
```

- view state method - does not modify the state
- Returns the `allowance` which `spender` is still allowed to withdraw from `owner`

### increaseAllowance

```ts
increaseAllowance(spender: string, amountToAdd: uint) => void
```

- Increase allowance for `spender` by given `amountToAdd`
- `amountToAdd` can be equal to zero

### decreaseAllowance

```ts
decreaseAllowance(spender: string, amountToSubtract: uint) => void
```

- Decrease allowance for `spender` by given `amountToSubtract`
- MUST fail if `amountToSubtract > currentAllowance`
- `amountToSubtract` can be equal to zero
