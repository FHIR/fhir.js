queryBuider = require('./query')
utils = require('./utils')

doGet = (http, uri, success, error)->
  http
    method: 'GET',
    url: uri,
    success: success or ()->return
    error: error or ()->return

search = ({baseUrl, http, type, query, success, error}) =>
  # TODO: suport passing profile as type and query validation
  if utils.type(query) == 'object'
    queryStr = queryBuider.query(query)
  else if utils.type(query) == 'string'
    queryStr =  query
  else
    queryStr =  ''
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
