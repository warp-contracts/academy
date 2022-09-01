# Post message function

Let's start by creating our first function - `postMessage` which will allow us to post a message with specific content.

```ts
// src/contracts/actions/write/postMessage.ts

export const postMessage = async (
  state: ArditState,
  { caller, input: { content } }: ArditAction
): Promise<ContractResult> => {};
```

As we are using Typescript, let's prepare some types first. Firstly - state of the contract which will be updated when users will interact with it. It's just an array of messages posted by users, each of the message needs its own `id`, `creator`, `content` and `votes` object with current `status` and list of `addresses` which have voted for the message.

```ts
// src/contracts/types/types.ts

export interface ArditState {
  messages: Message[];
}

interface Message {
  id: number;
  creator: string;
  content: string;
  votes: {
    addresses: string[];
    status: number;
  };
}
```

Then, we need to create action object - `ArditAction` which will hold all the possible inputs that user can write to our contract - including name of the `function` and some additional input - in our case message `id` and message `content`. Lastly, we need to indicate what possible functions can be called from our contract (`ArditFunction`).

```ts
// src/contracts/types/types.ts

export interface ArditAction {
  input: ArditInput;
  caller: string;
}

export interface ArditInput {
  function: ArditFunction;
  id: number;
  content: string;
}

export type ArditFunction =
  | 'postMessage'
  | 'upvoteMessage'
  | 'downvoteMessage'
  | 'readMessage';
```

Let's finish typing by adding `ContractResult` type which indicates what can be returned from our contract. According to the protocol each of the interaction functions must end with either returning the state (when interaction changes the state of the contract), returning result (when it does not change the state) or throwing an error.

```ts
// src/contracts/types/types.ts

export type ArditResult = Message;

export type ContractResult = { state: ArditState } | { result: ArditResult };
```

Ok, typing done! Let's get back to the function. Write following content as a body of our `postMessage` function.

```ts
// src/contracts/actions/write/postMessage.ts

const messages = state.messages;
if (!content) {
  throw new ContractError(`Creator must provide a message content.`);
}

const id = messages.length == 0 ? 1 : messages.length + 1;

state.messages.push({
  id,
  creator: caller,
  content,
  votes: {
    addresses: [],
    status: 0,
  },
});

return { state };
```

Easy, right? If no content is provided we will throw a `ContractError`. In other case - it will add a new message to the state by provifing its `id`, `creator`, `content` and empty `votes` object.

Seems ready!
