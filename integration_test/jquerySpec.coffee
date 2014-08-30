jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = jqFhir

describe "jqFhir", ->

  it "simplest", (done) ->
    fhir.config.set(baseUrl: 'https://ci-api.fhir.me')
    fhir.config.set(auth: {user: 'client', pass: 'secret'})
    fhir.search('Patient', {name: 'maud'})
    .then (d)->
       done()
