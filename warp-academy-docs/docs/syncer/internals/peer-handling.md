# Peer Handling
Warp-Syncer tries not to depend on arweave.net too much. This is to avoid a situation where the syncer is unable to download blocks because arweave.net is down.

Warp-Syncer periodically asks arweave.net for a list of peers. All of the returned peers are then checked for their availability and synchronization state.
If a peer is not available, it is blacklisted. If a peer is available and up to date it is added to the list of monitored peers. 
The list of peers is then sorted by their response times and synchronization state and first 15 peers are selected for future use. Occasionally oldest peers get removed from the blacklist and may get re-checked.

## Arweave requests

Most of the requests are first sent to arweave.net. If arweave.net returns an error, the request is sent sequentially to the next peer on the list until a successful response is received.

## Picking next block

Warp-syncer monitors Arweave network info returned by Warp-Gateway. When a new block height is detected arweave.net and all of the peers are asked for the block. Each of the  blocks is validated and its hash is used in a vote. At least 2/3 of votes are required to accept a block for further processing. 

This mechanism is designed to prevent a situation where a malicious peer would send a fake block to the syncer.
