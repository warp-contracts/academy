# Installation

### Using npm

`npm install warp-contracts`

### Using yarn

`yarn add warp-contracts`

:::caution
Warp Contracts SDK requires Node.js version 16.5+.
:::caution

## Import

You can import the full API or individual modules.

The SDK is available in both the ESM and CJS format - to make it possible for web bundlers (like webpack) to effectively
perform tree-shaking.

**ESM**

```typescript
import * as WarpSdk from 'warp-contracts';
```

```typescript
import { Warp, Contract, ... } from 'warp-contracts'
```

**CJS**

```javascript
const Warp = require('warp-contracts');
```

```javascript
const { Warp, Contract, ... } = require('warp-contracts');
```

#### Using web bundles

Bundle files are possible to use in web environment only. Use minified version for production. It is possible to use latest or specified version.

```html
<!-- Latest -->
<script src="https://unpkg.com/warp-contracts/bundles/web.bundle.js"></script>

<!-- Latest, minified-->
<script src="https://unpkg.com/warp-contracts/bundles/web.bundle.min.js"></script>

<!-- Specific version -->
<script src="https://unpkg.com/warp-contracts@1.0.0/bundles/web.bundle.js"></script>

<!-- Specific version, minified -->
<script src="https://unpkg.com/warp-contracts@1.0.0/bundles/web.bundle.min.js"></script>
```

All exports are stored under `warp` global variable.

```html
<script>
  const warp = warp.WarpFactory.forMainnet();
</script>
```

#### Web bundlers and meta-frameworks
Different meta-frameworks (like Next.js, Vite) and web-bundlers (like webpack 4,5, esbuild, etc.) have different
requirements re. code packaging.  

:::tip
Examples of using the Warp Contracts SDK with different meta-frameworks and web bundles are available [here](https://github.com/warp-contracts/bundlers#bundlers).
:::