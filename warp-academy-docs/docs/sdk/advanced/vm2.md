# VM2

It is possible to provide an isolated execution environment in the JavaScript implementation thanks to [VM2](https://github.com/patriksimek/vm2) - a sandbox that can run untrusted code with whitelisted Node's built-in modules. It works only in a NodeJS environment and enhances security at a (slight) cost of performance, so it should be used it for contracts one cannot trust.

In order to use VM2, set `useVM2` evaluation option to `true` (defaults to `false`).

```js
contract = warp.contract(contractTxId).setEvaluationOptions({
  useVM2: true,
});
```
