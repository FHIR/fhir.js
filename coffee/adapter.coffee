class Adapter
  constructor: (fhir)->
    @adapter = null
    @fhir = fhir
  set:  (x) -> @adapter = x
  get:  ()  -> @adapter

module.exports = Adapter
