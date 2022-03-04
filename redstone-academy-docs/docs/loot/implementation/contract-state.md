# Implement the smart contract

💡 You can find the ready-made implementation of the smart contract in [the repository](https://github.com/redstone-finance/redstone-academy/tree/main/redstone-academy-loot/src/contracts/loot).

## ✔️ Start with a state

The first 2 things you should think about before implementing a SmartWeave contract are

- what you need to store in the contract state
- how to store it there in the most efficient and easy-to-use way

In our case the state can have 2 properties:

- `name` - name of the loot pool
- `assets` - object with assets ({ "assetName": "ownerAddress", ... })

Initially the `assets` object will be empty. But it will be filling with the newly generated assets, pointing to their owners. This state structure allows to quickly understand who owns an asset or switch the ownership.

Let's save the initial state in JSON format to `initial-state.json` file

```json
{
  "name": "SmartWeave loot",
  "assets": {}
}
```
