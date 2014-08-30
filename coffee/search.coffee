queryBuider = require('./query.coffee')

class Search

  constructor: (fhir)->
    @fhir = fhir

  search: (type, query, cb, err) =>
    # TODO: suport passing profile as type and query validation
    queryStr = queryBuider.query(query)
    uri = "#{@fhir.config.get().baseUrl}/#{type}/_search?#{queryStr}"
    @fhir.http.request
      method: 'GET',
      url: uri,
      success: (data)->
        cb(data) if cb
      error: (e)->
        err(e) if err

module.exports = Search
