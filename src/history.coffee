history = ({baseUrl, http, type, id, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}/_history"
    success: success
    error: error

historyType = ({baseUrl, http, type, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/_history"
    success: success
    error: error

historyAll = ({baseUrl, http, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/_history"
    success: success
    error: error

module.exports = (q)->
  if q.id? and q.type?
    history(q)
  else if q.type?
    historyType(q)
  else
    historyAll(q)
