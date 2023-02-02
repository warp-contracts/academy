# Overview

Warp Contracts Plugins can be used with Warp Contracts SDK to extend its capabilities.

Each plugin can be attached via `warp.use` method, e.g.

```ts
import { WarpFactory } from 'warp-contracts';
import { SomeWarpPlugin } from 'some-warp-plugin';

WarpFactory.forMainnet().use(new SomeWarpPlugin());
```

Specification for each of the released plugins can be found further. Example usage for each of the specified plugins can be viewed in [`examples` folder in `warp-contracts-plugins` repository](https://github.com/warp-contracts/warp-contracts-plugins/tree/main/examples).
