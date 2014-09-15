queryBuider = require('./query')

doGet = (http, uri, cb, err)->
  http
    method: 'GET',
    url: uri,
    success: (args...)->
      cb.apply(null, args) if cb
    error: (args...)->
      err.apply(null, args) if err

search = ({baseUrl, http, type, query, success, error}) =>
  # TODO: suport passing profile as type and query validation
  queryStr = queryBuider.query(query)
  uri = "#{baseUrl}/#{type}/_search?#{queryStr}"
  doGet http, uri, success, error

getRel = (rel)->
  ({baseUrl, http, bundle, success, error}) ->
    urls = (l.href for l in bundle?.link when l.rel is rel)
    if urls.length != 1
      error "No #{rel} link found in bundle"
    else
      doGet http, urls[0], success, error

module.exports.search = search
module.exports.next = getRel "next"
module.exports.prev = getRel "prev"
