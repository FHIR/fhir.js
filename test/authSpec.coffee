auth = require('../src/middlewares/auth')
assert = require('assert')


describe "authentication", ->

  identity = (x)-> x

  it "no auth", ->
    http = auth.$Basic(identity)
    authed = http(a:1, b:2)
    assert.equal(authed?.headers?.Authorization, undefined)

  it "bearer", ->
    http = auth.$Bearer(identity)
    authed = http(a:1, b:2, auth: { bearer: "test-token" })
    assert.deepEqual(authed.headers.Authorization, "Bearer test-token")

  it "basic", ->
    http = auth.$Basic(identity)
    authed = http(a:1, b:2, auth: { user: "test", pass: "123" })

    assert.deepEqual(authed.headers.Authorization, "Basic dGVzdDoxMjM=")
