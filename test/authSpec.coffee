assert = require 'assert'
auth = require '../src/middlewares/auth'
mw = require '../src/middlewares/core'
configMW = require '../src/middlewares/config'
fhir = require '../src/fhir'

describe "Authentication", ->
  identity = (x) -> x

  describe "Authorization Header", ->
  it "Does not add header, when no auth config supplied", ->
    basicAuthMW = auth.$Basic identity
    authed = basicAuthMW a: 1, b: 2
    assert.equal authed?.headers?.Authorization, undefined

  it "adds bearer token to header when supplied", ->
    bearerAuthMW = auth.$Bearer identity
    authed = bearerAuthMW a: 1, b: 2, auth: bearer: "test-token"
    assert.deepEqual authed.headers.Authorization, "Bearer test-token"

  it "adds basic auth to header correctly when supplied", ->
    basicAuthMW = auth.$Basic identity
    authed = basicAuthMW a: 1, b: 2, auth: user: "test", pass: "123"
    assert.deepEqual authed.headers.Authorization, "Basic dGVzdDoxMjM="

  describe "Credentials", ->
    beforeEach ->
      @credentialsAuthMW = auth.$Credentials identity

    afterEach ->
      delete @credentialsAuthMW

    it "does not add credentials when not supplied", ->
      authed = @credentialsAuthMW {}
      assert.equal authed.credentials, ""

    it "sets credentials to same-origin, when same-origin is in config", ->
      authed = @credentialsAuthMW credentials: "same-origin"
      assert.equal authed.credentials, "same-origin"

    it "sets credentials to include, when include is in config", ->
      authed = @credentialsAuthMW credentials: "include"
      assert.equal authed.credentials, "include"

    it "does not set credentials when invalid config provided", ->
      authed = @credentialsAuthMW credentials: "invalid"
      assert.equal authed.credentials, ""

    it "does not set credentials when empty string is in config", ->
      authed = @credentialsAuthMW credentials: ""
      assert.equal authed.credentials, ""

    it "sets credentials to include, when true is in config", ->
      authed = @credentialsAuthMW credentials: true
      assert.equal authed.credentials, ""

    it "does not set credentials when false is in config", ->
      authed = @credentialsAuthMW credentials: false
      assert.equal authed.credentials, ""

  describe "End to End", ->
    beforeEach ->
      @adapter =
        http: ( (x) -> x.then = ( (f)-> f(x) ) )
        defer: ->
          reject: (e) ->
            console.log "Rejected Promise"
            throw new Error e

    describe "Authorization Header", ->
      it "takes basic auth config and correctly passes it to the adapter", ->
        cfg = baseUrl: 'BASE', auth: user: 'test', pass: '123'
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.headers.Authorization, "Basic dGVzdDoxMjM="
          assert.notDeepEqual args.headers.Authorization, "Basic bad-hash"

        fhirClient.conformance http: http

      it "takes bearer config and correctly passes it to the adapter", ->
        cfg = baseUrl: 'BASE', auth: bearer: 'test-token'
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.headers.Authorization, "Bearer test-token"
          assert.notDeepEqual args.headers.Authorization, "Bearer incorrect-token"

        fhirClient.conformance http: http

    describe "Credentials", ->
      it "takes 'include' string and correctly passes to the adapter", () ->
        cfg = baseUrl: 'BASE', credentials: "include"
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.credentials, 'include'
          # done()

        fhirClient.conformance http: http

      it "takes 'same-origin' string and correctly passes to the adapter", () ->
        cfg = baseUrl: 'BASE', credentials: "same-origin"
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.credentials, 'same-origin'

        fhirClient.conformance http: http

      it "takes invalid string and does not pass to the adapter", () ->
        cfg = baseUrl: 'BASE', credentials: "invalid"
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.credentials, ''

        fhirClient.conformance http: http

      it "takes boolean and does not pass to the adapter", () ->
        cfg = baseUrl: 'BASE', credentials: true
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.credentials,  ''

        fhirClient.conformance http: http
