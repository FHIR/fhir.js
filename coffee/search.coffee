adapter = require('./adapter.coffee')
query = require('./query.coffee')

searchResource = (type, query, cb, err)->
  console.log('impl me')

search = ()->
  switch arguments.length
    when 4 then searchResource.apply(null, arguments)
    else throw "wrong arity: expected (type,query,cb,err)"

exports.search = search
