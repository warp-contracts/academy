We are displaying all the balances in `BalancesList` component. We have access to the list thanks to `state` property we defined in the store in the Preparations section. Now all we need to do is find a way to properly mint some tokens to the wallet and transfer tokens between addresses.

### Mint tokens

We need to add `mint` function so it will be possible to fill up the wallet with some tokens.
Head to [challenge/src/components/Header/Header.vue](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/components/Header/Header.vue) and add declaration to `txId` variable in `mint` function by calling SDK's `writeInteraction` method:

```js
const txId = await this.contract.writeInteraction({
  function: 'mint',
  qty: parseInt(this.$refs.balanceMint.value),
});
```

Mine a block:

```js
await this.arweave.api.get('mine');
```

...and set the balances by calling SDK's `currentState` method:

```js
const newResult = await this.contract.currentState();
```

### Transfer tokens

Head to [challenge/src/components/BalancesList/BalancesList.vue](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/components/BalancesList/BalancesList.vue) and add declaration to `tx` variable by calling SDK's `transfer` method:

```js
const tx = await this.contract.transfer({
  target: address,
  qty: parseInt(qty),
});
```

Right after writing above interaction, mine a block:

```js
await this.arweave.api.get('mine');
```

Finally, set new balances list by calling `currentState` method:

```js
let newResult = await this.contract.currentState();
```
