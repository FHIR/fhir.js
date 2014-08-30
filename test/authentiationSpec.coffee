fhir = require('../coffee/fhir.js')
instance = new fhir()

auth = require('../coffee/authentication.coffee')
conf = instance.config

describe "authentication:", ->
  subject = auth(instance)

  it "no auth", ->
    conf.set auth: null
    authed = subject({a:1, b:2})
    expect(authed?.headers?.Authorization).toBeUndefined()


  it "bearer", ->
    conf.set
      auth: {
        bearer: "test-token"
      }
    authed = subject({a:1, b:2})
    expect(authed.headers.Authorization).toBe("Bearer test-token")

  it "basic", ->
    conf.set
      auth: {
        user: "test",
        pass: "123"
      }
    authed = subject({a:1, b:2})
    console.log "with authed", authed
    expect(authed.headers.Authorization).toBe("Basic dGVzdDoxMjM=")
