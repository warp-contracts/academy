# API methods

Every sequencer node provides endpoints through a REST API that allows querying the network state or sending new interactions. 
Below are listed the methods directly related to the functionality of the sequencer.

:::tip
In addition to the methods listed below, sequencer nodes offer endpoints related to the framework and consensus algorithm. 
For example, a list of these methods for the testnet network can be found at: https://sequencer-0.testnet.warp.cc.
:::

## Submits a new interaction to the sequencer
```
/api/v1/data-item
```
This method is used to submit a new interaction to the sequencer.
The request payload should contain the interaction in the form of a DataItem, conforming to the [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) format. 
Upon receiving such a request, the node validates the interaction. 
If it is valid, the node encapsulates it in a message, adds a sequencer transaction to its mempool, and broadcasts it to the other nodes in the network.

### Possible responses

| Code | Description                                | Example value                    |
| ---- | ------------------------------------------ | -------------------------------- |
| 200  | The interaction was successfully submitted |<pre>{data_item_id: 'GHBDu8MoQcTSrvTHF_5LGwe_YEXb6dgMfGuWgIgcK-U',<br /> nonce: 1,<br /> sender: 'warp16ayu6zt7pxlmgf708agsxv2qmnfpfrh0pay3e0'}</pre> |
| 400  | The request was invalid                    |<pre>{type: 'broadcast response with non-zero code',<br /> message:<br />  {Code: 1110,<br />   RawLog: 'data item does not have "Contract" tag:<br />            no contract tag'},<br /> status: { code: 400, text: 'Bad Request'}}</pre>|
| 409  | Invalid `Nonce` value for the given sender |<pre>{type: 'broadcast response with non-zero code',<br /> message:<br />  {Code: 32,<br />   RawLog: 'account sequence mismatch, expected 3, got 4:<br />            incorrect account sequence'},<br /> status: { code: 409, text: 'Conflict'}}</pre>|
| 503  | Mempool is full                            |<pre>{type: 'broadcast response with non-zero code',<br /> message:<br />  {Code: 20,<br />   RawLog: 'mempool is full'},<br /> status: { code: 503, text: 'Service Unavailable'}}</pre>|

## Expected nonce value
```
/api/v1/nonce
```
This method returns the expected next nonce value for a given sender.

### Request
The request body should be in the form of JSON:
```json
{
    "signature_type":1,
    "owner":"..."
}
```
Where:
- `signature_type` - the integer that specifies the type of signature that the sender uses. Possible values that are currently supported by the sequencer:
  - `1` - Arweave signature
  - `3` - Ethereum signature
- `owner` - the public key of the owner

### Possible responses

| Code | Description                                | Example value                    |
| ---- | ------------------------------------------ | -------------------------------- |
| 200  | The nonce was successfully returned        |<pre>{address: 'warp17jupac353t0euh95f70thl5vs8xcs4m0ydjq5q',<br /> nonce: 0}</pre> |
| 400  | The request was invalid                    |<pre>{type: 'invalid request',<br /> message: '...',<br /> status: {code: 400,text: 'Bad Request'}}</pre>|

## Get transaction by data item id
```
/api/v1/tx-data-item-id
```

This method returns the hash of the sequencer transaction that contains interactions with the given ID.
The request body must contain JSON with the following field:
- `data_item_id` - the ID of the interaction.

The response body contains the following field:
- `tx_hash` - the hash of the sequencer transaction.

### Possible responses

| Code | Description                                    | Example value                    |
| ---- | ---------------------------------------------- | -------------------------------- |
| 200  | The transaction hash was successfully returned |<pre>{tx_hash:'...'}</pre> |
| 400  | The request was invalid                        |<pre>{type: 'invalid request',<br /> message: '...',<br /> status:{ code: 400, text: 'Bad Request'}}</pre>|
| 404  | No transaction found                           |<pre>{type: 'not found',<br /> message: 'transaction not found for the given data item id',<br /> status:{code:404,text: 'Not Found'}}</pre>|


:::tip
With the hash of a transaction, querying the sequencer node for transaction details is possible using the following endpoint: `/cosmos/tx/v1beta1/txs/{hash}`.
:::

## Get transaction by sender and nonce
```
/api/v1/tx-sender-nonce
```

This method returns the hash of the sequencer transaction for a given sender address and nonce. 
The request body must contain JSON with the following fields:
- `sender` - the address of the sender.
- `nonce` - the nonce of the interaction.

The response body contains the following field:
- `tx_hash` - the hash of the sequencer transaction.

### Possible responses

| Code | Description                                    | Example value                    |
| ---- | ---------------------------------------------- | -------------------------------- |
| 200  | The transaction hash was successfully returned |<pre>{tx_hash:'...'}</pre> |
| 400  | The request was invalid                        |<pre>{type: 'invalid request',<br /> message: '...',<br /> status:{ code: 400, text: 'Bad Request'}}</pre>|
| 404  | No transaction found                           |<pre>{type: 'not found',<br /> message: 'transaction not found for the given sender and nonce',<br /> status:{code:404,text: 'Not Found'}}</pre>|
