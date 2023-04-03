# Contract endpoint

**Note**: Please note that `/contracts/:id` has been deprecated.

Method: `GET`

`/gateway/contract?txId=<txId>&srcTxId=<srcTxId>` - returns contract and source transactions informations. By default original source transaction id is loaded. However, one can indicate another source transaction id as a parameter (when e.g. contract has been evolved, more about evolving process [here](/docs/sdk/basic/evolve)).

Parameters:

1. `txId` - id of the contract
2. `srcTxId` [optional] - id of the transaction with source code for the contract

Examples:

1. contract
   `https://gateway.warp.cc/gateway/contract?txId0_Y2CbO6o3uWZMRdq5cuoDQ5PpmzFRoZ77L3hYA8668`
2. contract with source
   `https://gateway.warp.cc/gateway/contract?txId=0_Y2CbO6o3uWZMRdq5cuoDQ5PpmzFRoZ77L3hYA8668&srcTxId=2a1-NQP6RSR4gVWp9UzonJPaH0tj-LzTnuGOvUNG0Wc`
