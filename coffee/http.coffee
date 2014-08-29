adapter = require('./adapter.coffee')
base = ()-> adapter.getAdapter()

httpDecorators = [require('./authentication.coffee')]

dohttp =  (args) ->
  base().http(
    httpDecorators.reduce(
      ((req, d) -> d(req)),
      args))

dohttp.addDecorator = (d) ->
  dohttp.removeDecorator(d)
  httpDecorators.push(d)

dohttp.removeDecorator = (d) ->
  httpDecorators = httpDecorators.filter((dd)->(dd != d))

module.exports = dohttp
