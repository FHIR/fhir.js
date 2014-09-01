queryBuider = require('./query.coffee')

search = (baseUrl, http, type, query, cb, err) =>
  # TODO: suport passing profile as type and query validation
  queryStr = queryBuider.query(query)
  uri = "#{baseUrl}/#{type}/_search?#{queryStr}"
  http
    method: 'GET',
    url: uri,
    success: (data)->
      cb(data) if cb
    error: (e)->
      err(e) if err

module.exports = search
