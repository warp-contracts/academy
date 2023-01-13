# Read message

Let's create last function for our Ardit contract. This one will be a view function and it will simply return message object based on its `id` which will be given by the user in the input of the interaction.

```ts
// src/contracts/actions/read/readMessage.ts

export const readMessage = (
  state: ArditState,
  { input: { id } }: ArditAction
): ContractResult => {
  const message = state.messages.find((m) => m.id == id);

  if (!message) {
    throw new ContractError(`Message with id: ${id} does not exist`);
  }

  return { result: message };
};
```

This time, we will search for the `message` in the state of the contract. If it doesn't exist - we will throw an error, otherwise - we will return the message as a result of the interaction.
