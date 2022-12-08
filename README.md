`https://zk-oracle-2qz4wkdima-uc.a.run.app/auth`

The oracle takes in a json with [Github personal access token](https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token):

```
{
    "personal_access_token": "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7Kd"
}
```

The oracle outputs a json, where `signature` and `publicKey` are part of predifined [response format](https://docs.minaprotocol.com/zkapps/tutorials/oracle#response-format) and `data.isValidUser` takes a value of `0` if the proof fails and `1` if it succeedes:
```
{
    "data": {
        "isValidUser": "0"
    },
    "signature": {
        "r": "14418804800898797628311357849207925474173906816897929354543906229995884485202",
        "s": "5657754305974974007567496344307607458003574771916766751203976185740910985173"
    },
    "publicKey": "B62qphyUJg3TjMKi74T2rF8Yer5rQjBr1UyEG7Wg9XEYAHjaSiSqFv1"
}
```

After using this oracle, do not forget to revoke / delete the `personal_access_token` used.
