# Preparing frontend environment

As it is not a frontend tutorial, we've already got you covered. We will be working with Vue v.2 with typescript support.

Here are two basic commands which will help you build your project and running it in development environment.

```bash
yarn build
yarn serve
```

To quickly walk you through the structure of the project:

1. [challenge/src/main.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/main.ts) - is a starting point for the application.

2. [challenge/src/pst-contract.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/pst-contract.ts) - here we define Arweave and SmartWeave instances and export them.

3. [challenge/src/deployed-contracts.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/deployed-contracts.ts) - here we indicate deployed contract id.

4. [challenge/src/constants.ts](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/constants.ts) - all the constants (including urls).

5. [challenge/src/assets](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/assets) - all the assets used in the application.

6. [challenge/src/components](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/components) - all the components which are key Vue features to encapsulate reusable code.

7. [challenge/src/router](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/router) - router of the application build with vue-router.

8. [challenge/src/store](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/store) - store for the application build with Vuex which is a state management pattern and library for Vue. It serves as a centralized store for all the components in an application.

9. [challenge/src/views](https://github.com/redstone-finance/redstone-academy/blob/main/redstone-academy-pst/challenge/src/views) - view layer of the application.

You don't need any frontend skills to complete the next chapter as we've already prebuilt the application. You will just need to write code solely connected to SmartWeave implementation. However, I encourage you to play with code a bit to make the application more personal by changing the assets or some css.

Ok, let's start interacting with our contract in the application!
