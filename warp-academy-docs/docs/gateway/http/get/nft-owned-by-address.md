# NFTs owned by address

Method: `GET`

`/nft/owner/:address` - returns wallet balance for specific NFT based on its source transaction id (wallet balance needs to equal `1` in order to classify it as owned).

Parameters:

1. `srcTxId` - id of the transaction with source code for the contract

Examples:

1. `https://gateway.warp.cc/gateway/nft/owner/jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M?srcTxId=-IAz1J496D_a745Yb0x2jplSMfwHcbvtmm5OEBmpvZY`
