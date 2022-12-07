const { isReady, PrivateKey, Field, Signature, CircuitString } = require("snarkyjs")
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
require('dotenv').config()

// express config
const app = express()
app.use(bodyParser.json())
const PORT = 8080

// mina config
const PRIVATE_KEY = process.env.PRIVATE_KEY
console.log(PRIVATE_KEY)

const checkRedditAccount = async (params) => {

  // redit auth:
  // https://gist.github.com/jpeckham/6555a410c4f29731b6bd41957dc196ad
  // https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example
  const url = 'https://www.reddit.com/api/v1/access_token'

  // the following is from reddit's user app
  // clientid: username
  // clientsecret: password
  const auth_details = {
    username: params.clientid,
    password: params.clientsecret,
  }

  // the following is reddit login details
  const user_details = {
    grant_type: 'password',
    username: params.username,
    password: params.password
  }

  let response = await axios.request({
    url: url,
    method: 'post',
    params: user_details,
    auth: auth_details
  }).catch(err => {
    // this is not nice at all but will do for now
    return {
      data: { access_token: false }
    }
  })

  return response
}

app.post('/auth', async (req, res) => {

  // make the request to the reddit API
  // and check if the response is valid:
  // INVALID - data: { access_token: 'kjhskjfhdskjfhsdkjfhsdf' }
  // VALID - data: { access_token: false }
  const response = await checkRedditAccount(req.body)
  const isRedditUser = response.data.access_token ? true : false

  // now the snarkyjs magick
  await isReady
  const isRedditUser_ = Field(isRedditUser)
  // TODO: lets rethink this, what do we need?
  // maybe account publicKey? This will be emitted in an event
  // const usernameHash = CircuitString.fromString(req.body.username).hash()
  const privateKey = PrivateKey.fromBase58(PRIVATE_KEY)
  const publicKey = privateKey.toPublicKey()
  const signature = Signature.create(privateKey, [isRedditUser_])

  res.json({
    data: {
      isRedditUser: isRedditUser_,
    },
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
