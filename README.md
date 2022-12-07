`https://zk-oracle-2qz4wkdima-uc.a.run.app/auth`

The oracle takes in a json with reddit credentials:

```
// username & password are reddit login credentials
// clientid & clientsecret reddit app login data
{
  "username": "ioWxss6",
  "password": "KJHIASd875as6da",
  "clientid": "LGObhaoiF614kjhads-j9a7dsG",
  "clientsecret": "KJhkaghdaf7ghkJHgs8alwerkhfs76"
}
```

![example](https://i.imgur.com/fkPvlOp.png)

The oracle outputs a json, where `signature` and `publicKey` are part of predifined [response format](https://docs.minaprotocol.com/zkapps/tutorials/oracle#response-format) and `data.isRedditUser` takes a value of `0` if the proof fails and `1` if it succeedes:
```
{
    "data": {
        "isRedditUser": "0"
    },
    "signature": {
        "r": "14418804800898797628311357849207925474173906816897929354543906229995884485202",
        "s": "5657754305974974007567496344307607458003574771916766751203976185740910985173"
    },
    "publicKey": "B62qphyUJg3TjMKi74T2rF8Yer5rQjBr1UyEG7Wg9XEYAHjaSiSqFv1"
}
```

You can get `clientid` and `clientsecret` by creating a [reddit app here](https://www.reddit.com/prefs/apps) (see img below).

![example](https://i.imgur.com/Kkzym9a.png)
