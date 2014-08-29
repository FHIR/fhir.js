adapter = require('./adapter.coffee')
queryBuider = require('./query.coffee')

base = ()-> adapter.getAdapter()

searchResource = (type, query, cb, err)->
  cfg = {baseUrl: 'baseurl'}
  queryStr = queryBuider.query(query)
  uri = "#{cfg.baseUrl}/#{type}/_search?#{queryStr}"
  base().xhr(method: 'GET', url: uri)

# search(type, query, cb, err)
# search resource
#
# * type - resource type string or profile object, if profile additional query validation will be done
# * query - query object, see example and tests for syntax
# * cb - callback function(bundle), bundle will be passed as first argument
# * err - errback function(error), this callback will be called if some error occurs
#
#
# ```
# search('Patient', {name: {$exact: 'maud'}}, cb, err)
# ```
#
search = ()->
  switch arguments.length
    when 3 then searchResource.apply(null, arguments)
    when 4 then searchResource.apply(null, arguments)
    else throw "wrong arity: expected (type,query,cb,err)"

exports.search = search
