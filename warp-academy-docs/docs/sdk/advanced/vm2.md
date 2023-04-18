# VM2

To see the reasonig for using VM2 and how to execute the contract code in a sandboxed environment provided by VM2, please refer to the [VM2 plugin section](../advanced/plugins/vm2.md).

:::caution
`VM2 plugin` has been introduced in `warp-contracts@1.4.1`. If you are using `warp-contracts` version < 1.4.1 please set `useVM2` evaluation option to `true` in order to execute the contract within VM2. `useVM2` evaluation option has been deprecated in `warp-contracts@1.4.1`.

```js
contract = warp.contract(contractTxId).setEvaluationOptions({
  useVM2: true,
});
```

:::
