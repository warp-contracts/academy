# Arweave client

Syncer uses its own REST API client for interfacing with Arweave nodes. It is heavily inspired by goar (https://github.com/everFinance/goar), but it's a complete rewrite.

Some notable features:

- golang context support
- retrying requests with different peers
- configurable rate limiting per each peer
