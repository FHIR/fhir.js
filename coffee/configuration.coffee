class Configuration
  constructor: (fhir)->
    @config = {}
    @fhir = fhir

  set:  (m) => @config[k]=v for k,v of m
  get:  ()  => @config

module.exports = Configuration
