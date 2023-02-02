# Warp Contracts Subscription plugins

These plugins allow to subscribe for notifications to new interactions that are now being sent by the Warp Sequencer.  
The Warp Sequencer publishes a notification for each newly registered interaction to a `interaction/{contractTxId}` channel - so each contract
has its own channel.

Subscribers may use the incoming messages to locally update their state - without having to constantly poll
the Warp Gateway to check whether new interactions have been registered for a given contract.

In order to safely update the local state - a plugin must [verify](https://github.com/warp-contracts/warp-contracts-plugins/blob/main/warp-contracts-subscription-plugin/src/index.ts#L63) whether the local state is cached
at the sort key exactly "before" the sort key from the new interaction.  
That's why each message sent by the Warp Sequencer contains the `lastSortKey` field.

## Installation

`yarn add warp-contracts-plugin-subscription`

Requires `warp-contract` SDK ver. min. `1.2.19`.

## Incoming messages format

```ts
export interface InteractionMessage {
  contractTxId: string; // contract for which the interaction was registerd
  sortKey: string; // the sortKey of the new interaction
  lastSortKey: string; // the sortKey of the interaction exactly before this new interaction
  interaction: GQLNodeInterface; // the new interaction itself
}
```

The new `interaction` can be used to update the local state via the `contract.readStateFor([message.interaction])` method.

## WarpSubscriptionPlugin

This is an abstract implementation of the subscription plugin - a "base" that allows to create custom plugins.
The `R` generic type defines the return type of the plugin (already wrapped in a `Promise`).

Example custom plugin:

```ts
class CustomSubscriptionPlugin extends WarpSubscriptionPlugin<void> {
  async process(input: InteractionMessage): Promise<void> {
    logger.info('From custom plugin', input);
    // process the new message;
  }
}

const warp = WarpFactory.forMainnet();
warp.use(new CustomSubscriptionPlugin(contractTxId, warp));
```

Usage:

```ts
const warp = WarpFactory.forMainnet();
warp.use(new CustomSubscriptionPlugin(contractTxId, warp));
```

## StateUpdatePlugin

A `WarpSubscriptionPlugin` plugin implementation that contains logic for
updating the local state based on the incoming messages (e.g. it verifies whether the locally cached sort key and new interaction sort key allow to safely update the state based on the new interaction).

Usage:

```ts
const warp = WarpFactory.forMainnet();
warp.use(new StateUpdatePlugin(contractTxId, warp));
```

## Examples

Examples are available [here](https://github.com/warp-contracts/warp-contracts-plugins/blob/main/examples/subscription/contract.ts).
