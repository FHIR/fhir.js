wrapAuth = require('../src/middlewares/httpAuthentication.coffee')

describe "authentication:", ->
  identity = (x)-> x

  it "no auth", ->
    http = wrapAuth({auth: false}, identity)
    authed = http(a:1, b:2)
    expect(authed?.headers?.Authorization).toBeUndefined()

  it "bearer", ->
    cfg = { auth: { bearer: "test-token" }}
    http = wrapAuth(cfg, identity)
    authed = http(a:1, b:2)
    expect(authed.headers.Authorization).toBe("Bearer test-token")

  it "basic", ->
    cfg = { auth: { user: "test", pass: "123" }}
    http = wrapAuth(cfg, identity)
    authed = http(a:1, b:2)
    expect(authed.headers.Authorization).toBe("Basic dGVzdDoxMjM=")
