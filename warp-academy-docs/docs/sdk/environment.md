# WarpEnvironment

`WarpEnvironment` is a helper type which can be used in scripts etc. to determine in which environment Warp has been initialized.

Possible options:

```typescript
'local' | 'testnet' | 'mainnet' | 'custom';
```

```typescript
  if (warp.environment == 'mainnet') {
    ...
  }
```