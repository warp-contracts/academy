# Interactions endpoint

**Note**: old interactions endpoint - `/interactions` and `/interactions-sort-key` are now considered deprecated. Please use `/v2/interactions-sort-key`. `/interactions-sonar` is an equivalent of the discussed interactions endpoint used in SonAR explorer app, however, total number of interactions is calculated differently due to performance cause.

Method: `GET`

`/gateway/v2/interactions-sort-key?contractId=<contract_id>&confirmationStatus=<confirmation_status>&from=<block_height_from>&to=<block_height_to>&page=<page>`

- returns a list of a given contract interactions, ordered by `[sort_key]`.

Parameters:

1. `contractId` - tx id of the contract to load the interactions for
2. `page` [optional] - page, e.g.: `gateway/interactions?page=3`. If not set, first page is returned by default.
3. `limit` [optional] - amount of interactions per single page
4. `confirmatinStatus` [optional], e.g.: `gateway/interactions?confirmationStatus=corrupted`. If not set, loads all the
   contract interactions.
   1. `confimed` - loads only the `confirmed` contract interactions
   2. `corrupted` - loads only the `corrupted` contract interactions
   3. `not_corrupted` - loads both `confirmed` and `not processed` interactions
5. `totalCount` [optional], e.g.: `gateway/interactions?totalCount=true`. If set to `true` endpoint returns
   interactions' count for each of confirmation statuses (confirmed | corrupted | forked | not_processed)
6. `source` [optional] - loads contract interactions based on their origin. If not set, interactions from all sources will be loaded
   1. `arweave`
   2. `redstone-sequencer`
7. `from` [optional] - sort key from which interactions should be loaded
8. `to` [optional] - sort key to which interactions should be loaded
9. `isFromSdk` [optional] - means that we're making a call from the SDK, this affects:
   1. the amount of returned data (we're trying to minimize amount of data in this case)
   2. sorting order (SDK requires ASC order, SonAR requires DESC order)

Examples:

1. `https://gateway.warp.cc/gateway/interactions?contractId=Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY` -
   loads all contract interactions
2. `https://gateway.warp.cc/gateway/interactions?contractId=Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY&page=2`
   - loads all contract interactions, shows 2nd. page
3. `https://gateway.warp.cc/gateway/interactions?contractId=Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY&page=2&confirmationStatus=confirmed`
   - loads only confirmed contract interactions, shows 2nd. page
4. `https://gateway.warp.cc/gateway/interactions?contractId=Daj-MNSnH55TDfxqC7v4eq0lKzVIwh98srUaWqyuZtY&confirmationStatus=confirmed&from=820000&to=831901`
   - loads only confirmed contract interaction from block height 820000 to block height 831901
