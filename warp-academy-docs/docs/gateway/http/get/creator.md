# Creator endpoint

Method: `GET`

`/gateway/creator?id=<id>&limit=<limit>&page=<page>&txType=<txType>` - lists all the transactions (interactions, contracts) which created by specific address

Parameters:

1. `id` - id of the wallet address
2. `limit` [optional] - limits records to specific number
3. `page` [optional] - lists contracts for specific page number
4. `txType` [optional] - lists only transactions of specific type - either `contract` or `interaction`, when no type is indicated, all transactions will be loaded

Examples:

1. `https://gateway.warp.cc/gateway/creator?id=aDeOsZuiu74fejWIsXAHCGPAW0KSRzINAsRxJFpCH6A`
2. transactions created by specific address limited to 15, page 1
   `https://gateway.warp.cc/gateway/creator?id=yTDyzCCEwTwBJc2gWRHQ-mogowpvk2IB5v82mo73gpI&limit=15&page=1`
3. transactions of type `contract` created by specific address
   `https://gateway.warp.cc/gateway/creator?id=yTDyzCCEwTwBJc2gWRHQ-mogowpvk2IB5v82mo73gpI&txType=contract`
