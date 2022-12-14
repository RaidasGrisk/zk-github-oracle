const {
  isReady,
  PrivateKey,
  Field,
  Signature,
  Int64,
  CircuitString,
  Bool,
} = require("snarkyjs")

const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

// express config
const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))
const PORT = 8080

// mina config
const PRIVATE_KEY = process.env.PRIVATE_KEY
console.log(PRIVATE_KEY)

const checkGithubUser = async (personal_access_token) => {

  // https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28
  const url = 'https://api.github.com/user'
  const headers_ = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${personal_access_token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }
  let response = await axios.request({
    method: 'get',
    url: url,
    headers: headers_,
  }).catch(err => {
    // this is not nice at all but will do for now
    return { data: {} }
  })

  return response
}

app.post('/auth', async (req, res) => {

  // make the request to Github API
  const personal_access_token = req.body.personal_access_token
  const response = await checkGithubUser(personal_access_token)

  // now the snarkyjs magick
  await isReady

  // Github's API response in a form of a JSON.
  // It needs to be properly encoded into circuit values.
  // Ideally, it would do the following conversion:
  //   string => CircuitString
  //   number => Int64
  //   boolean => Bool

  // But it will be inconveniant later on as encoded values will
  // have to be signed, and Signature.create accepts []Field only.
  // So it is inconveniant to have [] CircuitString | Int64 | Bool

  // Also how to properly encode string to Fields?
  // string -> CircuitString -> toFields() ? not convenient.

  // Therefore, if possible, convert every value to Field
  // else, just skip it until I figure out how to solve this.
  const data = response.data
  const keys = Object.keys(data)
  const response_ = {}

  for (let key of keys) {
    if (typeof data[key] == 'string') {
      // response_[key] = CircuitString.fromString(data[key]).toFields()
    } else if (typeof data[key] == 'number') {
      response_[key] = Field(data[key])
    } else if (typeof data[key] == 'boolean') {
      response_[key] = Field(data[key])
    }
  }

  // create a signature
  const privateKey = PrivateKey.fromBase58(PRIVATE_KEY)
  const publicKey = privateKey.toPublicKey()
  const signature = Signature.create(privateKey, Object.values(response_))

  // not the question is, can a smart contract consume this
  // whole json as an arg, instead of each separate value?
  // @method verify(response_: json?) ..?
  res.json({
    data: response_,
    signature: signature,
    publicKey: publicKey,
  })
})

app.get('/', async (req, res) => {
  res.send('Hey there!')
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
