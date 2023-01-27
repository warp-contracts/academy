# Handle

The main function of our contract is `handle` function which calls specific function interaction based on what user indicated in the `input`.

```ts
// src/contracts/contract.ts

export function handle(
  state: ArditState,
  action: ArditAction
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'postMessage':
      return postMessage(state, action);
    case 'upvoteMessage':
      return upvoteMessage(state, action);
    case 'downvoteMessage':
      return downvoteMessage(state, action);
    case 'readMessage':
      return readMessage(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`
      );
  }
}
```

We will take the name of the function from the `action.input.function` property and return the result of this function. If function is not recognized, we will throw an error.

Smartweave protocol requires the contract to be written the Javascript. Therefore, we need to compile our Typescript contract to Javascript. You can use any building tool available. In our case - we will compile the contract using ESBuild. You can check the building script in `build.js` file. Additionally, we need to add some scripts command to our `package.json` file. Just remember that you need to have `rimraf` installed - either globally or as a `devDependency`.

```json
// package.json

"clean": "rimraf ./dist",
"build-ts": "node build.js",
"build": "yarn run clean && yarn run build-ts",
```

In order to compile our contract we will firstly remove `dist` folder and run building script. You can check out `dist` folder to see compiled Javascript version of our contract.

Ok, a lot of work done. Time to write some tests!
