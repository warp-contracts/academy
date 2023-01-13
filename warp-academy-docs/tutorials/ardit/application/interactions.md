# Interactions

Since our wallet is connected, we can make interactions (posting messages, voting) with the contract.
To do this, firstly we need to connect to the contract and in the next step - write interaction.

```js
//src/stores/contract.js

await this.contract.connect('use_wallet').writeInteraction({
  function: 'postMessage',
  content: payload,
});
```

You need to remember, that we can't vote on our own content, and we can't vote on single content more than once. If we try to do this, we would see errors in console.
To check the above conditions, we can write simple `if condition`.

If message votes contains our wallet address in its addresses, that means we've already voted on this content.
Also, if message creator is equivalent to our wallet address, that means we are trying to add vote to our own content.
There is how this condition can look like:

```js
//src/stores/contract.js

 async voteInteraction(functionType, message) {
      try {
        if (message.votes.addresses.includes(this.wallet.address)) {
          //already voted on this content
        } else if (message.creator == this.wallet.address) {
          //prevent from vote on your own content
        } else {
          //if all good, make an interaction
          await this.contract.connect('use_wallet').writeInteraction({
            function: functionType,
            id: message.id,
          });
          this.getContract(); //update ui, co we can immediately see effect of our interaction
        }
      } catch (error) {
        console.log(error);
        //for example - wallet not connected
      }
    },
```

We are calling `getContract()` method to view the updated contract state after successfull interaction.

`postMessage` interaction looks very similair:

```js
//src/stores/contract.js

    async addContent(payload) {
      try {
        await this.contract.connect('use_wallet').writeInteraction({
          function: 'postMessage',
          content: payload,
        });
      } catch (error) {
        console.log(error);
        //for example - wallet not connected
      }
    },
```
