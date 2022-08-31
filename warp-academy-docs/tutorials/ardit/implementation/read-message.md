# Read message

Let's create last function for our Ardit contract. This one will be a view function and it will simply return message object based on its `id` which will be given by the user in the input of the interaction.

```ts
export const readMessage = async (state: ArditState, { input: { id } }: ArditAction): Promise<ContractResult> => {
  const message = state.messages.find((m) => m.id == id);

  if (!message) {
    throw new ContractError(`Message with id: ${id} does not exist`);
  }

  return { result: message };
};
```

This time, we will search for the `message` in the state of the contract. If it doesn't exist - we will throw an error, otherwise - we will return the message as a result of the interaction.

```ts
export async function handle(state: ArditState, action: ArditAction): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'postMessage':
      return await postMessage(state, action);
    case 'upvoteMessage':
      return await upvoteMessage(state, action);
    case 'downvoteMessage':
      return await downvoteMessage(state, action);
    case 'readMessage':
      return await readMessage(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}
```

We will take the name of the function from the `action.input.function` property and return the result of this function. If function is not recognized, we will throw an error.

Smartweave protocol requires the contract to be written the Javascript. Therefore, we need to compile our Typescript contract to Javascript. You can use any building tool available. In our case - we will compile the contract using ESBuild. You can check the building script in `build.js` file. Additionally, we need to add some scripts command to our `package.json` file.