authentication = require('../coffee/authentication.coffee')
conf = require('../coffee/configuration.coffee')

describe "authentication:", ->
  subject = authentication

  it "no auth", ->
    conf.configure {auth: null}
    authed = subject({a:1, b:2})
    expect(authed?.headers?.Authorization).toBeUndefined();


  it "bearer", ->
    conf.configure
      auth: {
        bearer: "test-token"
      }
    authed = subject({a:1, b:2})
    expect(authed.headers.Authorization).toBe("Bearer test-token")

  it "basic", ->
    conf.configure
      auth: {
        user: "test",
        pass: "123"
      }
    authed = subject({a:1, b:2})
    console.log "with authed", authed
    expect(authed.headers.Authorization).toBe("Basic dGVzdDoxMjM=")
