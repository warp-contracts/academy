# Fetch Options Plugin

It is possible to customize `fetch` options using dedicated plugin. In order to change `fetch` options one needs to create an implementation of [WarpPlugin](https://github.com/warp-contracts/warp/blob/main/src/core/WarpPlugin.ts) interface. `process` method will receive following properties:

```ts
interface FetchRequest {
  input: RequestInfo | URL;
  init: Partial<RequestInit>;
}
```

...and it should return some `fetch` options which user wants to attach to the request. An example of such implementation:

```ts
class FetchOptionsPlugin implements WarpPlugin<FetchRequest, RequestInit> {
  process(request: FetchRequest): Partial<RequestInit> {
    const url = request.input;

    let fetchOptions: Partial<RequestInit> = {};

    if (url == `https://d1o5nlqr4okus2.cloudfront.net/gateway/sequencer/register`) {
      fetchOptions = {
        keepalive: true,
      };
    }

    return fetchOptions;
  }

  type(): WarpPluginType {
    return 'fetch-options';
  }
}
```

In order to use this plugin, it needs to be attached while creating `Warp` instance, e.g.:

```ts
const warp = WarpFactory.forMainnet().use(new FetchOptionsPlugin());
```
