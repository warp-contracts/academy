# 🦀 Staking

This repo contains a sample contracts that implement an Automatic Market Maker based on the Uniswap model.

## Install dependencies

Run:
`yarn`

## Build contract

```
yarn build
```

## Run tests

```
yarn test
```

## Deploy and test contract on different networks

To run advanced mainnet scripts which demonstrate staking flow simply run:

```
yarn advanced:mainnet
```

...or follow these steps:

1. Deploy the erc20 contract:

```
node ./integration/deployERC20 --network mainnet
```

2. Deploy the staking contract:

```
node ./integration/deployStaking --network mainnet
```

3. Run sample script with approvals, staking and withdrawals:

```
node ./integration/approveAndStake --network mainnet
```

## Functions

- [`stakeOf`](#stakeof)
- [`stake`](#stake)
- [`stakeAll`](#stakeall)
- [`reStake`](#restake)
- [`withdraw`](#withdraw)

#### `stakeOf`

```typescript
async function stakeOf(target: string): Promise<StakeResult>;
```

Returns the stake of the given wallet.

```typescript
interface StakeResult {
  stake: number;
}
```

- `target` - target for stake

<details>
  <summary>Example</summary>

```typescript
const result = await contract.stakeOf('ADDRESS_ID');
```

</details>

#### `stake`

```typescript
async function stake(amount: number): Promise<WriteInteractionResponse | null>;
```

Stakes ERC0 tokens.

```typescript
interface WriteInteractionResponse {
    bundlrResponse?: BundlrResponse;
    originalTxId: string;
}
```

- `amount` - amount of tokens to be staked

<details>
  <summary>Example</summary>

```typescript
const result = await contract.stake(100);
```

</details>

#### `stakeAll`

```typescript
async function stakeAll(): Promise<WriteInteractionResponse | null>;
```

Stakes all the ERC0 tokens owned.

```typescript
interface WriteInteractionResponse {
    bundlrResponse?: BundlrResponse;
    originalTxId: string;
}
```

<details>
  <summary>Example</summary>

```typescript
const result = await contract.stakeAll();
```

</details>

#### `reStake`

```typescript
async function reStake(): Promise<WriteInteractionResponse | null>;
```

Returns staked tokens and stake all tokens owned.

```typescript
interface WriteInteractionResponse {
    bundlrResponse?: BundlrResponse;
    originalTxId: string;
}
```

<details>
  <summary>Example</summary>

```typescript
const result = await contract.reStake();
```

</details>

#### `withdraw`

```typescript
async function withdraw(amount: number): Promise<WriteInteractionResponse | null>;
```

Withdraws ERC20 tokens.

```typescript
interface WriteInteractionResponse {
    bundlrResponse?: BundlrResponse;
    originalTxId: string;
}
```

- `amount` - amount of tokens to withdraw

<details>
  <summary>Example</summary>

```typescript
const result = await contract.withdraw(100);
```

</details>
