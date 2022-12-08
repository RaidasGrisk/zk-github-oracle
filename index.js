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

  // make the request to the API
  // and check if the response is valid:
  // INVALID - { data: {} }
  // VALID   - { data: { id: 10008368,, ... }
  const personal_access_token = req.body.personal_access_token
  const response = await checkGithubUser(personal_access_token)
  const isValidUser = response.data.id ? true : false

  // now the snarkyjs magick
  await isReady
  const isValidUser_ = Field(isValidUser)
  // TODO: lets rethink this, does signature with data
  // as simple as this is enough for security..?
  const privateKey = PrivateKey.fromBase58(PRIVATE_KEY)
  const publicKey = privateKey.toPublicKey()
  const signature = Signature.create(privateKey, [isValidUser_])

  res.json({
    data: {
      isValidUser: isValidUser_,
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
