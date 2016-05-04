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

  describe "credentials", ->
    beforeEach ->
      @http = auth.$Credentials identity

    afterEach ->
      delete @http

    it "same-origin", ->
      authed = @http a:1, b:2, credentials: "same-origin"
      assert.equal authed.credentials, "same-origin"


    it "include", ->
      authed = @http a:1, b:2, credentials: "include"
      assert.equal authed.credentials, "include"


    it "invalid", ->
      authed = @http a:1, b:2, credentials: "invalid"
      assert.equal authed.credentials, ""

    it "empty string", ->
      authed = @http a:1, b:2, credentials: ""
      assert.equal authed.credentials, ""

    it "true", ->
      authed = @http a:1, b:2, credentials: true
      assert.equal authed.credentials, ""

    it "false", ->
      authed = @http a:1, b:2, credentials: false
      assert.equal authed.credentials, ""
