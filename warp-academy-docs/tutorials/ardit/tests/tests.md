# Execution

We will write a couple of tests which will help us understand some basics about interacting with the contract. After writing each test you should run the correct script from the previous section to see if it works correctly.

## ⚖️ Checking the deployment and current state of the contract

Let's start with checking if the contract has been deployed correctly and we are able to read the contract's state.

```js
it('should properly deploy contract', async () => {
  const contractTx = await warp.arweave.transactions.get(contractId);

  expect(contractTx).not.toBeNull();
});

it('should read Ardit state', async () => {
  expect((await ardit.readState()).cachedValue.state).toEqual(initialState);
});
```

We are using SDK's `readState` method which reads the current state of our contract.

## 💸 Post a message

Let's test if we can post a message by calling Warp's `writeInteraction` method. As an argument we simply pass name of the function and the message content as the input of our interaction. We then read the contract state and check if the new message has been added to the state.

```js
it('should properly post message', async () => {
  await ardit.writeInteraction({ function: 'postMessage', content: 'Hello world!' });

  const { cachedValue } = await ardit.readState();
  expect(cachedValue.state.messages[0]).toEqual({
    id: 1,
    creator: owner,
    content: 'Hello world!',
    votes: { addresses: [], status: 0 },
  });
});
```

It is always good to check if function throws proper error if the input is incorrect.

```js
it('should not post message with no content', async () => {
  await expect(ardit.writeInteraction({ function: 'postMessage' }, { strict: true })).rejects.toThrow(
    'Cannot create interaction: Creator must provide a message content.'
  );
});
```

## 💸 Voting for the messages

Let's check if voting functions work properly. Firstly, let's verify that creator of the message cannot vote for their own message and that we cannot vote for the message that does not exist.

```js
it('should not be possible for creator to vote for they message', async () => {
  await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    'Cannot create interaction: Message creator cannot vote for they own message.'
  );

  await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    'Cannot create interaction: Message creator cannot vote for they own message.'
  );
});

it('should not be possible to vote for non-existing message', async () => {
  ardit = warp.contract < ArditState > contractId.connect(user2Wallet);

  await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 5 }, { strict: true })).rejects.toThrow(
    'Cannot create interaction: Message does not exist.'
  );
});
```

Now, let's check if we can upvote the message properly...

```js
it('should properly upvote message', async () => {
  ardit = warp.contract < ArditState > contractId.connect(user2Wallet);

  await ardit.writeInteraction({ function: 'upvoteMessage', id: 1 });

  const { cachedValue } = await ardit.readState();
  expect(cachedValue.state.messages[0].votes.status).toEqual(1);
});
```

...and that we are not able to vote for the same message twice.

```js
it('should not be possible to vote for the same message twice', async () => {
  ardit = warp.contract < ArditState > contractId.connect(user2Wallet);

  await expect(ardit.writeInteraction({ function: 'upvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    'Cannot create interaction: Caller has already voted.'
  );

  await expect(ardit.writeInteraction({ function: 'downvoteMessage', id: 1 }, { strict: true })).rejects.toThrow(
    'Caller has already voted.'
  );
});
```

Let's verify if downvoting works as expected

```js
it('should properly downvote message', async () => {
  ardit = warp.contract < ArditState > contractId.connect(user3Wallet);

  await ardit.writeInteraction({ function: 'downvoteMessage', id: 1 });

  const { cachedValue } = await ardit.readState();
  expect(cachedValue.state.messages[0].votes.status).toEqual(0);
});
```

## Reading messages

Finally, let's verify our read function which should read the message based on its id. We will use `viewState` method from the Warp SDK which simply returns the result of the interaction.

```js
it('should properly view message', async () => {
  const { result } = await ardit.viewState({ function: 'readMessage', id: 1 });

  expect(result).toEqual({
    id: 1,
    creator: owner,
    content: 'Hello world!',
    votes: { addresses: [user2, user3], status: 0 },
  });
});
```

## 🎊 Conclusion

We have just learned some key SmartWeave concepts. We have also ascertained that our contract will work correctly. We are ready to deploy the contract!
