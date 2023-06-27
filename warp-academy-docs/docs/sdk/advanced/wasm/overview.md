# Overview

WASM provides a secure and properly sandboxed execution environment for contracts execution.
As for now - **Rust** is being supported.

:::info
Historically Warp Contracts SDK had a support for Go and AssemblyScript.
Because of some technical issues, immaturity and lack of interest in the community -
we've decided to focus on Rust.
The support for AS and Go has been removed in this [PR](https://github.com/warp-contracts/warp/issues/348).
:::

WASM contracts templates containing example PST contract implementation within tools for compiling contracts to WASM, testing, deploying
(locally, on testnet and mainnet) and writing interactions are available [here](https://github.com/warp-contracts/warp-wasm-templates/tree/main/rust/pst).

Using SDKs' methods works exactly the same as in case of a regular JS contract. While deploying the contract, you just need to pass some additional arguments:

```ts
const contractTxId = await warp.deploy({
  wallet,
  initState: JSON.stringify(initialState),
  src: contractSrc,
  wasmSrcCodeDir: path.join(__dirname, '../data/wasm/rust/src'),
  wasmGlueCode: path.join(__dirname, '../data/wasm/rust/rust-pst.js'),
});
```

Additionally, it is possible to set gas limit for interaction execution in order to e.g. protect a contract against infinite loops. Defaults to `Number.MAX_SAFE_INTEGER` (2^53 - 1).

```js
contract = smartweave.contract(contractTxId).setEvaluationOptions({
  gasLimit: 14000000,
});
```

## Warp-contracts crate

To help writing rust contracts SDK delivers convenient rust crate called [warp-contracts](https://crates.io/crates/warp-contracts). See docs on [docs.rs](https://docs.rs/warp-contracts/latest/warp_contracts/) for details of provided API.

## The simplest rust contract

The simplest rust contract using [warp-contracts](https://crates.io/crates/warp-contracts) crate may look like this:

Source https://github.com/warp-contracts/warp-wasm-templates/blob/main/rust/toy-contract/Cargo.toml

```toml
[package]
name = "toy-contract"
version = "0.1.0"
edition = "2021"
description = "test"
repository = "not applicable"
license = "MIT"

[lib]
crate-type = ["cdylib"]

[dependencies]
warp-contracts = "0.1.2"
wasm-bindgen = "=0.2.84"
wasm-bindgen-futures = { version = "0.4.34" }
serde = { version = "1.0", features = ["derive"] }
serde-wasm-bindgen = "0.5"
js-sys = "0.3.61"
```

Source <https://github.com/warp-contracts/warp-wasm-templates/blob/main/rust/toy-contract/src/lib.rs>

```rust
use serde::{Serialize, Deserialize};
use warp_contracts::{warp_contract, handler_result::{WriteResult, ViewResult}};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct State {
    x: u8,
}

#[derive(Debug, Deserialize)]
pub struct Action {
    x: u8,
}

#[derive(Debug, Serialize)]
pub struct View {
    x: u8,
}

#[warp_contract(write)]
pub fn handle(mut state: State, action: Action) -> WriteResult<State, ()> {
    state.x = action.x;
    WriteResult::Success(state)
}

#[warp_contract(view)]
pub fn view(state: &State, _action: Action) -> ViewResult<View, ()> {
    ViewResult::Success(View { x: state.x })
}
```
