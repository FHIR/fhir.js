conformance = (baseUrl, http, cb, err)->
    http
      method: 'GET'
      url: "#{baseUrl}/metadata"
      success: cb
      error: err

profile = (baseUrl, http, type, cb, err)=>
  http
    method: 'GET'
    url: "#{baseUrl}/Profile/#{type}"
    success: cb
    error: err

exports.conformance = conformance
exports.profile = profile
