# unsafeClient

`unsafeClient` is available to use on `Smartweave` global object. It gives access to whole `Arweave` instance.
Example of usage:

```typescript
const result = await SmartWeave.unsafeClient.transactions.getData('some_id');
```

However, we do not recommend using it as it can lead to non-deterministic results. Therefore, we do not support it by default in Warp. If you want to use it anyway, you need to explicitely set `EvaluationOptions.allowUnsafeClient` flag to `true`.
