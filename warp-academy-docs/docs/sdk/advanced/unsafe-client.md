# Unsafe client

`unsafeClient` is available to use on `Smartweave` global object. It gives access to whole `Arweave` instance.
Example of usage:

```typescript
const result = await SmartWeave.unsafeClient.transactions.getData('some_id');
```

However, we do not recommend using it as it can lead to non-deterministic results. Therefore, we do not support it by default in Warp.

### `unsafeClient` evaluation option

The `unsafeClient` evaluation option can accept one of three values:

- `throw` - the default - will cause the evaluation to stop and throw an exception when a contract with unsafeClient will be detected.
- `allow` - allows for evaluation of unsafe contract
- `skip` - skips the evaluation of an unsafe contract. It allows to skip evaluation of a foreign contract that is using unsafe client; in such case the validity of the parent contract interaction will be set to false and the error message will contain error like `[SkipUnsafeError] Using unsafeClient is not allowed by default`.

**NOTE:** contract's evolves are also being tracked - e.g. if contract evolves from safe to unsafe - its evaluation will be skipped from that point.  
**NOTE:** if contract evolves back to safe code (from unsafe code) - it still will be skipped. The reason is that we're unable to determine the state of the contract when it returns to the safe version.