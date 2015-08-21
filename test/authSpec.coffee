auth = require('../src/middlewares/auth')

describe "authentication", ->

  identity = (x)-> x

  it "no auth", ->
    http = auth.Basic(identity)
    authed = http(a:1, b:2)
    expect(authed?.headers?.Authorization).toBeUndefined()

  it "bearer", ->
    http = auth.Bearer(identity)
    authed = http(a:1, b:2, auth: { bearer: "test-token" })
    expect(authed.headers.Authorization).toBe("Bearer test-token")

  it "basic", ->
    http = auth.Basic(identity)
    authed = http(a:1, b:2, auth: { user: "test", pass: "123" })
    expect(authed.headers.Authorization).toBe("Basic dGVzdDoxMjM=")
