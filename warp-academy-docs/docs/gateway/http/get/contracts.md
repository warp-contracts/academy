# Contracts endpoint

Method: `GET`

`/gateway/contracts?page=<page>` - returns the list of all the currently registered contracts.  
Result is ordered by `[last_interaction_height DESC, count(interaction) DESC]`

Parameters:

1. `contractType` [optional] - filter records by contract type. If not set, all types of contracts are returned.
   1. `pst`
   2. `other`
2. `sourceType` [optional] - filter records by contract source type. If not set, all contracts are returned.
   1. `application/wasm`
   2. `application/javascript`
3. `page` [optional] - page, e.g.: `gateway/contracts?page=3`. If not set, first page is returned by default.
4. `limit` [optional] - amount of interactions per single page

Examples:

1. `https://gateway.warp.cc/gateway/contracts`
2. `https://gateway.warp.cc/gateway/contracts?page=6`
