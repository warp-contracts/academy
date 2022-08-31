# Handle

The main function of our contract is `handle` function which calls specific function interaction based on what user indicated in the `input`.

```json
"clean": "rimraf ./dist",
"build-ts": "node build.js",
"build": "yarn run clean && yarn run build-ts",
```

In order to compile our contract we will firstly reove `dist` folder and run building script. You can check out `dist` folder to see compiled Javascript version of our contract.

Ok, a lot of work done. Time to write some tests!
