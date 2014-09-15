buildParams = (count, since)->
  prm = {}
  prm._since = since if since?
  prm._count = count if count?
  prm

history = ({baseUrl, http, type, id, success, error, count, since})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}/_history"
    params: buildParams(count, since)
    success: success
    error: error

historyType = ({baseUrl, http, type, success, error, count, since})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/_history"
    params: buildParams(count, since)
    success: success
    error: error

historyAll = ({baseUrl, http, success, error, count, since})->
  http
    method: 'GET'
    url: "#{baseUrl}/_history"
    params: buildParams(count, since)
    success: success
    error: error

module.exports = (q)->
  if q.id? and q.type?
    history(q)
  else if q.type?
    historyType(q)
  else
    historyAll(q)
