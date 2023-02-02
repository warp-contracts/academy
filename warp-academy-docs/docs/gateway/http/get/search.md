# Search

Method: `GET`

`/gateway/search/:phrase` - returns id of the contract (based on id, PST name or PST ticker), source (based on id) interactions (based on id) or creator (based on id). At least three characters are required as `phrase` in order to query the database using pattern matching

Examples:

1. `https://gateway.warp.cc/gateway/search/0_Y2C`
2. `https://gateway.warp.cc/gateway/search/0_Y2CbO6o3uWZMRdq5cuoDQ5PpmzFRoZ77L3hYA8668`