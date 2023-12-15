# Creating and Sending Interactions

At the inception of the interaction lifecycle, the creation of an interaction is initiated by a user or application. 
The interaction is created using the [Warp SDK](/docs/sdk/overview), which provides a set of methods for interacting with the contract.

## Format

The interaction can be in the form of a DataItem or an Arweave transaction. 
By default, interactions are sent to the Warp Sequencer, which guarantees fast processing. 
In this case, the interaction is created as a DataItem that conforms to the [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) standard. 
However, it is also possible to send interactions directly to Arweave. 
In this case, the interaction will be created as an [Arweave transaction](https://docs.arweave.org/developers/arweave-node-server/http-api#transaction-format).
Details about the structure of interactions can be found in the section on the [SmartWeave](/docs/sdk/advanced/smartweave-protocol#contract-interactions) protocol.

## Nonce

A crucial security feature implemented in the interaction submission process to the Warp Sequencer is the use of a *nonce* — a counter incremented with each interaction sent by a particular sender. 
This counter must be set in the interaction using a tag.
Consequently, successive interactions from the same address must contain progressively incremented nonce values. 
The nonce serves two primary purposes:
* **Protection Against Replay Attacks** - the nonce acts as a defense mechanism against replay attacks, thwarting malicious actors from resubmitting a valid interaction.
* **Ensuring Sequential Order** - additionally, the nonce provides assurance that interactions with sequentially incremented nonce values will enter into a contract in precisely the same order.

The Warp Sequencer offers an [API method](/docs/sequencer/api-methods#expected-nonce-value) enabling the verification of the expected nonce value for the next interaction from a specific sender address. 
The Warp SDK first queries the sequencer for this value, but when creating subsequent interactions within the same contract and sender, it simply increments the counter.

## Signing

The constructed interaction, now including the nonce, is signed by a compatible wallet type to ensure its authenticity and integrity.
Warp SDK supports signatures from Arweave and Ethereum wallets, providing flexibility in authentication methods
(see [Warp Signature plugin](/docs/sdk/advanced/plugins/signature)).

## Submission and confirmation

Once signed, the interaction is ready for submission to the Warp Sequencer.
This step marks the completion of the interaction creation process from the SDK perspective.
The SDK process can conclude at this point, especially if immediacy is the primary concern.
However, for scenarios requiring confirmation that the interaction has been indexed by the gateway and is ready for processing during contract state evaluation, the option `waitForConfirmation = true` can be set. The confirmation wait time for Warp Sequencer and Warp Gateway is approximately 1 second. In the case of confirmation of submission to Arweave, this duration is significantly longer.

:::tip
Setting the `waitForConfirmation` option is done as follows:
```typescript
const contract = warp.contract('CONTRACT_TX_ID').setEvaluationOptions({
  waitForConfirmation: true,
});
```
By default, this option is enabled for interactions sent to the Warp Sequencer and disabled for interactions sent directly to Arweave.
:::

:::info
Version 1.5.0 of the SDK will support the transition period. This means that it will be compatible with both the current centralized sequencer and the new decentralized network. Because the process of creating interactions for these two solutions differs (for example, with the nonce tag), the SDK will first query the Warp Gateway to determine which version of the sequencer is currently running and then use the appropriate method. This also means that this version of the SDK will handle the switchover between sequencers.
:::
