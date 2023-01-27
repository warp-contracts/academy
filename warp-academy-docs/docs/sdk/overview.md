# Overview

> ⚠️ Warp SDK library has been renamed from **[redstone-smartweave](https://www.npmjs.com/package/redstone-smartweave)** to **warp-contracts** from version **1.0.0**! If you are using older version please read [README-LEGACY](https://github.com/warp-contracts/warp/blob/main/README-LEGACY.md).

Warp SDK is the implementation of the SmartWeave [Protocol](https://github.com/warp-contracts/warp/blob/main/docs/SMARTWEAVE_PROTOCOL.md).

It works in both web and Node.js environment (requires Node.js 16.5+).

If you are interested in the main assumptions for Warp ecosystem as well as its key features go visit [our website](https://warp.cc).

⚠️ Do not use "Map" objects in the state of js/ts contracts - since maps by default are not serializable to JSON and won't be properly stored by the caching mechanism. Use "plain" objects instead.
[More info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#objects_vs._maps) - the "Serialization and parsing" row.