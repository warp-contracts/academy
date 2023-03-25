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
