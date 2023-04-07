# Warp Contracts Plugin - Blacklist

Following plugin allows to skip evaluation process for specific contract based on its id. A `SkipUnsafeError` will be thrown when trying to execute the contract. A callback function returning boolean statement whether contract should be blacklisted needs to be passed to the plugin's constructor.

## Installation and Usage

```sh
npm install warp-contracts-plugin-blacklist

or

yarn add warp-contracts-plugin-blacklist
```

```ts
import { WarpFactory } from 'warp-contracts';
import { ContractBlacklistPlugin } from 'warp-contracts-plugin-blacklist';

const warp = WarpFactory.forMainnet().use(new ContractBlacklistPlugin((input: string) => Promise<boolean>));
```

## getDreBlacklistFunction

Plugin exposes also a function dedicated to D.R.E. nodes which allows to get blacklisting function which can be then passed to the plugin's constructor.

```ts
import { ContractBlacklistPlugin, getDreBlacklistFunction } from 'warp-contracts-plugin-blacklist';

new ContractBlacklistPlugin(async (input) => {
  const blacklistFunction = await getDreBlacklistFunction(getFailures, connect(), config.workersConfig.maxFailures);
  return await blacklistFunction(input);
});
```
