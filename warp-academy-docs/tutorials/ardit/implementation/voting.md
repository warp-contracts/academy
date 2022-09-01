# Voting

We will create two additional functions which let us upvote or downvote a message. Let's start with creating `upvoteMessage` function:

```ts
// src/contracts/actions/write/voting.ts

export const upvoteMessage = async (
  state: ArditState,
  { caller, input: { id } }: ArditAction
): Promise<ContractResult> => {};
```

As the last function, it takes state and action as parameters and return promise of type `ContractResult`. Let's fill in the body of the function.

```ts
// src/contracts/actions/write/voting.ts

const message = state.messages.find((m) => m.id == id);

if (!message) {
  throw new ContractError(`Message does not exist.`);
}

if (caller == message.creator) {
  throw new ContractError(`Message creator cannot vote for they own message.`);
}

if (message.votes.addresses.includes(caller)) {
  throw new ContractError(`Caller has already voted.`);
}

message.votes.status++;
message.votes.addresses.push(caller);

return { state };
```

We will search for the message based on `id` property given by the user in the input of the interaction. We will throw an error if the message does not exist or if the caller of the interaction is the message creator or if the caller has already voted. If none of these occurs - we will simply increase `votes` status by `1` and push caller's address to the `addresses` array.

As we are changing the state of the contract, we will then return this state.

Same applies to the second voting function - `downvoteMessage`. The only difference is that we will decrease status of the `votes` object.

```ts
// src/contracts/actions/write/voting.ts

export const downvoteMessage = async (
  state: ArditState,
  { caller, input: { id } }: ArditAction
): Promise<ContractResult> => {
  const message = state.messages.find((m) => (m.id = id));

  if (!message) {
    throw new ContractError(`Message does not exist.`);
  }

  if (caller == message.creator) {
    throw new ContractError(
      `Message creator cannot vote for they own message.`
    );
  }

  if (message.votes.addresses.includes(caller)) {
    throw new ContractError(`Caller has already voted.`);
  }

  message.votes.status--;
  message.votes.addresses.push(caller);

  return { state };
};
```
