adapter = require('./adapter.coffee')

class Http
  constructor: (fhir)->
    @fhir = fhir
    @httpDecorators = [require('./authentication.coffee')(fhir)]
  search: (type, query, cb, err) ->
 
  addDecorator: (d) ->
    @removeDecorator(d)
    @httpDecorators.push(d)

  removeDecorator: (d) ->
    @httpDecorators = @httpDecorators.filter((dd)->(dd != d))

  request: (args) ->
    @fhir.adapter.get().http(
      @httpDecorators.reduce(
        ((req, d) -> d(req)),
        args))

module.exports = Http
