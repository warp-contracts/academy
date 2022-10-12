# Interactions

Since our wallet is connected, we can make interactions (posting messages, voting).
We can't vote on our own content, and we can't vote on single content more than once. If we try to do this, we would see errors in console. 
To check the above conditions, we can write simple `if condition`.

If message votes contains our wallet address in its addresses, that means we've already voted on this content.
Also, if message creator is equivalent to our wallet address, that means we are trying to add vote to our own content.

```js
//src/stores/contract.js

 async voteInteraction(functionType, message) {
      try {
        if (message.votes.addresses.includes(this.wallet.address)) {
          //already voted on this content
        } else if (message.creator == this.wallet.address) {
          //prevent from vote on your own content
        } else {
          await this.contract.connect('use_wallet').writeInteraction({
            function: functionType,
            id: message.messageId,
          });
          this.getContract();
        }
      } catch (error) {
        console.log(error);
        //for example - wallet not connected
      }
    },
```
We are calling `getContract()` method to view updated contract state after successfull interaction.

And the postMessage interaction look very similiar:

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
