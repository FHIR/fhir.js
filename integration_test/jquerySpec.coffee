jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = jqFhir

describe "jqFhir", ->

  it "simplest", (done) ->
    fhir.configure(baseUrl: 'http://try-fhirplace.hospital-systems.com')
    fhir.search('Patient', {name: 'maud'})
    .then (d)->
       console.log('Search by patients', d)
       done()
