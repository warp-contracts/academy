# Contracts by tags endpoint

Method: `GET`

`/gateway/contracts-by-tags?tags=<tags>&owner=<owner>&srcId=<srcId>limit=<limit>&page=<page>&testnet<testnet>` - lists all the contracts that contain indicated tags, additionally - owner or source transaction id can be passed to narrow the search

Parameters:

1. `tags` - list of tags, maximum 5 tags with different names can be passed, for each of these tags - up to 5 values can be assigned, example list: `tags=[{"name":"Contract-Src","values":["rbAQI1R9m5eWwExR5fiAgepQvyuUpUf1-DbGAEETmXc","2j7rlIzlt4WQFIfDPomvu4dq7tZ8mJKPTsrY3xwtong","-TBbRLWsP8wAlj8y5bh7RHRdwGJ7kT9urFvEbn1UomQ"]},{"name":"Content-Type","values":["application/json"]}]`
2. `owner` [optional] - only contracts which were deployed by this owner will be listed
3. `srcId` [optional] - only contracts which were deployed based on this source transaction will be listed
4. `limit` [optional] - limits records to specific number
5. `page` [optional] - lists contracts for specific page number

Examples:

`https://gw.warp.cc/gateway/contracts-by-tags?tags=[{"name":"Contract-Src","values":["2nFNFs9YWIfj2k3BV2IR3XkC_F4V4gZiRDj60HilZzU","L2k7QI2kg-aSwXg7owgzV9gqXoG0jjRsWJ9Nm4RImrE","WnxZnhLclP_4B1yZpGDVAgtNuJV2klzY-B_-Io0QMTg"]},{"name":"Content-Type","values":["application/json"]}]`

Response:

```json
{
  "paging": {
    "total": 3,
    "limit": 100,
    "items": 3,
    "page": 1,
    "pages": 1
  },
  "contracts": [
    {
      "contract": "TZk31WrAGpjIUAWb8y6rU8FIAVRoEr7qcOz5uqsIda0",
      "srctxid": "2nFNFs9YWIfj2k3BV2IR3XkC_F4V4gZiRDj60HilZzU",
      "owner": "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA",
      "testnet": null,
      "contracttx": {
        "tags": [
          {
            "name": "App-Name",
            "value": "SmartWeaveContract"
          },
          {
            "name": "App-Version",
            "value": "0.3.0"
          },
          {
            "name": "Contract-Src",
            "value": "2nFNFs9YWIfj2k3BV2IR3XkC_F4V4gZiRDj60HilZzU"
          },
          {
            "name": "SDK",
            "value": "Warp"
          },
          {
            "name": "Nonce",
            "value": "1679856025700"
          },
          {
            "name": "Content-Type",
            "value": "application/json"
          },
          {
            "name": "Contract-Manifest",
            "value": "{\"evaluationOptions\":{\"useConstructor\":true}}"
          }
        ]
      },
      "synctimestamp": null,
      "total": "3"
    },
    {
      "contract": "F6M_D4d3bdKreFv-Q1FxlgcRwVYb0yPXZzb1wvwCbB8",
      "srctxid": "WnxZnhLclP_4B1yZpGDVAgtNuJV2klzY-B_-Io0QMTg",
      "owner": "jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M",
      "testnet": null,
      "contracttx": {
        "tags": [
          {
            "name": "App-Name",
            "value": "SmartWeaveContract"
          },
          {
            "name": "App-Version",
            "value": "0.3.0"
          },
          {
            "name": "Contract-Src",
            "value": "WnxZnhLclP_4B1yZpGDVAgtNuJV2klzY-B_-Io0QMTg"
          },
          {
            "name": "SDK",
            "value": "Warp"
          },
          {
            "name": "Nonce",
            "value": "1699634605917"
          },
          {
            "name": "Content-Type",
            "value": "application/json"
          },
          {
            "name": "Contract-Manifest",
            "value": "{\"evaluationOptions\":{\"useKVStorage\":true}}"
          }
        ]
      },
      "synctimestamp": "1699634606419",
      "total": "3"
    },
    {
      "contract": "n5hE54enkEAyzyEOP0tbolCTuT47piSa-tX5TvF4dCE",
      "srctxid": "L2k7QI2kg-aSwXg7owgzV9gqXoG0jjRsWJ9Nm4RImrE",
      "owner": "0xc84f421658dabC69Ee0440649f2f17b98D284CCC",
      "testnet": null,
      "contracttx": {
        "tags": [
          {
            "name": "App-Name",
            "value": "SmartWeaveContract"
          },
          {
            "name": "App-Version",
            "value": "0.3.0"
          },
          {
            "name": "Contract-Src",
            "value": "L2k7QI2kg-aSwXg7owgzV9gqXoG0jjRsWJ9Nm4RImrE"
          },
          {
            "name": "SDK",
            "value": "Warp"
          },
          {
            "name": "Nonce",
            "value": "1692188736414"
          },
          {
            "name": "Content-Type",
            "value": "application/json"
          }
        ]
      },
      "synctimestamp": "1692188737275",
      "total": "3"
    }
  ]
}
```
