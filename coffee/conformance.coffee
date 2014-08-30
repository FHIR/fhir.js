class Conformance

# TODO: cache if configured
  constructor: (fhir)->
    @fhir = fhir
    @conf = () -> @fhir.config.get()

  conformance: (cb, err)=>
    @fhir.http.request
      method: 'GET'
      url: "#{@conf().baseUrl}/metadata"
      success: cb
      error: err

  profile: (type, cb, err)=>
    @fhir.http.request
      method: 'GET'
      url: "#{@conf().baseUrl}/Profile/#{type}"
      success: cb
      error: err

module.exports = Conformance
