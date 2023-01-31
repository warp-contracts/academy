# Custom Signing (Asia)

Either Arweave JWK can be used or a custom signing function of type.

```ts
(tx: Transaction) => Promise<void>;
```

```ts
wallet: { signer: customSigningFunction, signatureType: 'arweave' }
```

### Initial state and data

By default, initial state is posted in a stringified form as the data of the contract deployment transaction. If `data` argument is passed while deploying the contract (as an object containing `Content-Type` and body - see examples below), initial state is passed in the `Init-State` tag.



