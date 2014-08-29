adapter = require('./adapter.coffee')
queryBuider = require('./query.coffee')
cfg = require('./configuration.coffee')

base = ()-> adapter.getAdapter()

# TODO: suport passing profile as type and query validation

searchResource = (type, query, cb, err)->
  queryStr = queryBuider.query(query)
  uri = "#{cfg.config.baseUrl}/#{type}/_search?#{queryStr}"
  base().http
    method: 'GET',
    url: uri,
    success: (data)->
      cb(data) if cb
    error: (e)->
      err(e) if err

# search(type, query, cb, err)
# search resource
#
# * `type` - resource type string or profile object, if profile additional query validation will be done
# * `query` - query object, see example and tests for syntax
# * `cb` - callback function(bundle), bundle will be passed as first argument
# * `err` - error callback function(error), this callback will be called if some error occurs
#
#
# ```
# search('Patient', {name: {$exact: 'maud'}}, cb, err)
# ```
#
exports.search = searchResource
