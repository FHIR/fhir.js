history = (baseUrl, http, type, id, cb, err)->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}/_history"
    success: cb
    error: err

historyType = (baseUrl, http, type, cb, err)->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/_history"
    success: cb
    error: err

historyAll = (baseUrl, http, cb, err)->
  http
    method: 'GET'
    url: "#{baseUrl}/_history"
    success: cb
    error: err

module.exports = ()->
  switch arguments.length
    when 4 then historyAll.apply(null, arguments)
    when 5 then historyType.apply(null, arguments)
    when 6 then history.apply(null, arguments)
    else throw "wrong arity: expected (baseUrl, http, type?, id?, cb, err)"