# Custom SmartWeave extension plugin

Warp Contracts SDK enables custom SmartWeave extension plugin configuration. It will attach desired extension to global object accessible from inside a contract - `SmartWeave.extensions` (more about SmartWeave global API in [this section](https://academy.warp.cc/docs/sdk/basic/smartweave-global)).

### Implementation

Plugin can be created by implementing [`WarpPlugin` interface](https://github.com/warp-contracts/warp/blob/main/src/core/WarpPlugin.ts#L13):

```ts
export interface WarpPlugin<T, R> {
  type(): WarpPluginType;

  process(input: T): R;
}
```

It is required to set plugin type to a string starting with `smartweave-extension-`.

An example of such plugin can be seen below:

```ts
import { WarpPlugin, WarpPluginType } from 'warp-contracts';
import { custom } from 'custom-library';

class CustomExtension implements WarpPlugin<any, void> {
  process(input: any): void {
    input.custom = custom;
  }

  type(): WarpPluginType {
    return 'smartweave-extension-custom';
  }
}
```

Extension can be later used inside the contract as follow:

```ts
SmartWeave.extensions.custom.someCustomMethod();
```

Example of SmartWeave extensions plugins are [`EthersPlugin`](https://docs.warp.cc/docs/sdk/advanced/plugins/ethers) and [`NlpPlugin`](https://docs.warp.cc/docs/sdk/advanced/plugins/nlp).

### Rust contracts compatible plugins

Writing extension plugins to be usable from rust contract requires a couple of additional steps.
Let's describe those steps with an example. Let's assume we want to create a plugin
that provides the answer to the ultimate question of the universe via the 'theAnswer'
function and some variations on it and expose those functions to rust contracts.

### The plugin logic

Let's define four methods we want to expose in our plugin
```js
const theAnswer = () => 42;
const multiplyTheAnswer = (multiplier: number) => multiplier * theAnswer();
const concatenateTheAnswer = (prefix: string) => return prefix + theAnswer();
const wrapTheAnswer = (context: unknown) => {
  return { answer: theAnswer(), context};
};
```

Those four simple methods will show us a couple of aspects of exposing plugin logic to rust.

First, to allow accessing our extension functions from rust code we need to provide
`wasm_bindgen` mapping.

```rust
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::from_value;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_name = "theAnswer")]
    pub fn the_answer() -> u8;

    #[wasm_bindgen(js_name = "multiplyTheAnswer")]
    pub fn multiply_the_answer(times: u8) -> u8;

    #[wasm_bindgen(js_name = "concatenateTheAnswer")]
    pub fn concatenate_the_answer(prefix: String) -> String;

    #[wasm_bindgen(js_name = "wrapTheAnswer")]
    pub fn the_answer_wrapped(wrapper: JsValue) -> JsValue;
}

// convenient rust-typed wrapper for the_answer_wrapped method
// It would be unhumanitarian to expose our users to JsValue directly
#[derive(Serialize, Deserialize, Default)]
pub struct TheAnswerWrapper {
    pub context: String,
    pub answer: u8,
}

pub fn wrap_the_answer(context: &str) -> TheAnswerWrapper {
  // see how you can create JsValue from &str
  from_value::<TheAnswerWrapper>(the_answer_wrapped(JsValue::from_str(context))).unwrap_or_default()
}
```

The above rust code can be either published as a separate crate to `crates.io` or just put in plugin documentation to be copy-pasted somewhere into the contract's code.

Now we need to write some boilerplate in JS to allow SDK to map rust calls to correct plugin methods. We do this by defining `rustImports`
method on our extension object. It should return an object that contains the mapping from `js_name`s to the JS method to be called.

:::note
Notice that `js_name` from wasm_bindgen mapping MUST match the identifier added to `rustImports` object below to tie methods together. Also please make sure to pick
your `js_name`s so that they do not collide with other methods defined by SDK or by
`wasm_bindgen` itself, preferably prefix them with the plugin name.
:::

### The plugin code - a simple case

If the only method we want to expose was `wrapTheAnswer` we would need to do it like this in the plugin's `process` method:

```js
  process(input: any): void {
    // pick our namespace ...
    input.theAnswer = {
      // ... and expose our plugin logic to JS contracts
      wrapTheAnswer,
      // the following line exposes wrapTheAnswer method to WASM module
      rustImports: (_) : {
        return {
          wrapTheAnswer
        };
      }
    };
  }
```

This will work for all the methods having rust signature `JsValue -> JsValue`, i.e. methods taking a single
parameter of type `JsValue` and similarly returning a `JsValue`.

:::note
You can transform any method to a method having signature `JsValue -> JsValue` by
creating an 'Arguments' type combining all (possibly zero) of your parameters into
a single object.
:::

:::tip
If you have `String -> String` method `my_method` you can make it `JsValue -> JsValue` and call it like this:
`let ret = my_method(JsValue::from_str("my_string")).as_string().unwrap();`, of course make sure to handler errors
properly.
:::

## The plugin code - a not-so-simple case
Due to the way SDK deals with `wasm_bindgen` glue code, using other signatures
than `JsValue -> JsValue` directly requires a deeper understanding of `wasm_bindgen`
internals. Don't be afraid we made some effort to simplify your work a little.
The `wasm_bindgen` mapping above generates glue code similar to the following


```js

// ...

module.exports.__wbg_theAnswer_3e66d69c7240d108 = typeof theAnswer == 'function' ? theAnswer : notDefined('theAnswer');

module.exports.__wbg_multiplyTheAnswer_a91da7a8d0852aff = typeof multiplyTheAnswer == 'function' ? multiplyTheAnswer : notDefined('multiplyTheAnswer');

module.exports.__wbg_concatenateTheAnswer_874fdc72853ab32f = function() { return logError(function (arg0, arg1, arg2) {
    try {
        const ret = concatenateTheAnswer(getStringFromWasm0(arg1, arg2));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    } finally {
        wasm.__wbindgen_free(arg1, arg2);
    }
}, arguments) };

module.exports.__wbg_wrapTheAnswer_6ec90790e154ae2e = function() { return logError(function (arg0) {
    const ret = wrapTheAnswer(takeObject(arg0));
    return addHeapObject(ret);
}, arguments) };

// ...
```

Based on that we can provide a full implementation of our plugin.

```ts
import { WarpPlugin, WarpPluginType } from "warp-contracts";

// complicated logic of our plugin
const theAnswer = () => 42;
const multiplyTheAnswer = (p: number) => p * theAnswer();
const concatenateTheAnswer = (s: string) => return s + theAnswer();
const wrapTheAnswer = (context: unknown) => {
  return { answer: theAnswer(), context};
};

// ugly rust imports
const rustImports = (helpers) => {
  return {
    __wbg_theAnswer: typeof theAnswer == 'function' ? theAnswer : helpers.notDefined('theAnswer'),
    __wgb_multiplyTheAnswer:
      typeof multiplyTheAnswer == 'function' ? multiplyTheAnswer : helpers.notDefined('multiplyTheAnswer'),
    __wbg_concatenateTheAnswer: function () {
      return helpers.logError(function (arg0, arg1, arg2) {
        try {
          const ret = concatenateTheAnswer(helpers.getStringFromWasm0(arg1, arg2));
          const ptr0 = helpers.passStringToWasm0(
            ret,
            helpers.wasm().__wbindgen_malloc,
            helpers.wasm().__wbindgen_realloc
          );
          const len0 = helpers.WASM_VECTOR_LEN();
          helpers.getInt32Memory0()[arg0 / 4 + 1] = len0;
          helpers.getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        } finally {
          helpers.wasm().__wbindgen_free(arg1, arg2);
        }
      }, arguments);
    },
    wrapTheAnswer
  };
};

export class TheAnswerExtension implements WarpPlugin<any, void> {
  process(input: any): void {
    // pick our namespace and expose our plugin logic to JS contracts
    input.theAnswer = {
      theAnswer,
      multiplyTheAnswer,
      concatenateTheAnswer,
      wrapTheAnswer,
      // the following line effectively exposes your glue code imports to WASM module
      rustImports,
    };
  }

  type(): WarpPluginType {
    return 'smartweave-extension-the-answer';
  }
}
```

The crucial part here is the `rustImports` method taking a single object containing utility methods.
The `rustImports` method should return an object containing a 'smart' copy-paste of `wasm_bindgen` glue code.
The 'smart' copy-paste algorithm:

- in generated wasm_bindgen glue code search for your methods definitions and copy-paste them to the returned object
- change `module.exports.__wbg_theAnswer_3e66d69c7240d108 =` to `__wbg_theAnswer:` to create proper property name
- all the glue code methods used in glue code like `passStringToWasm0` or `getInt32Memory0` are delivered
  to your `rustImports` in the `helpers` object so you need to prepend calls to them with `helpers.` (examples above)
- similarly, all the accessed properties should be replaced with method calls from `helpers` object,
  e.g. replace `WASM_VECTOR_LEN` with `helpers.WASM_VECTOR_LEN()`
- if `__wbg_adapter_XXX` is used in your glue code replace it with `helpers.__wbg_adapter_3` or `helpers.__wbg_adapter_4`
  depending on the number of arguments passed to the function, e.g. replace `__wbg_adapter_143(a, state0.b, arg0, arg1)` with
  `helpers.__wbg_adapter_4(a, state0.b, arg0, arg1)` because there are four arguments passed to that function.

You can think of the two cases above in the following way:

- if you want to create methods of signature
`JsValue -> JsValue` then SDK will take care of creating `wasm_bindgen` boilerplate
for you
- if you want to use other method signatures you have to provide `wasm_bindgen`
glue code yourself
