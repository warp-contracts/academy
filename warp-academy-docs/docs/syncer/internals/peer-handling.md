# Peer Handling
Warp-Syncer minimizes reliance on a single arweave.net gateway to prevent block download issues if arweave.net goes down.

Warp-Syncer periodically asks arweave.net for a list of peers - Arweave network nodes. All of the returned peers are then checked for their availability and synchronization state.
If a peer is not available, it is blacklisted. If a peer is available and up to date it is added to the list of monitored peers. 
The list of peers is then sorted by their response times and synchronization state and first 15 peers are selected for future use. Occasionally oldest peers get removed from the blacklist and may get re-checked.

## Arweave requests

Initially, requests target arweave.net. If an error arises, the request cycles through the list of peers until a successful response is achieved.

## Picking next block

Warp-syncer monitors Arweave network info returned by [Warp-Gateway](/docs/gateway/overview). Upon detecting a new block height, it queries arweave.net and all the peers for the block. Each retrieved block undergoes validation, and its hash contributes to a consensus vote.  At least 2/3 of votes are required to accept a block for further processing. 

This mechanism is designed to prevent a situation where a malicious peer would send a fake block to the Syncer.
