conformance = ({baseUrl, http, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/metadata"
    success: success
    error: error

profile = ({baseUrl, http, type, success, error})=>
  http
    method: 'GET'
    url: "#{baseUrl}/Profile/#{type}"
    success: success
    error: error

exports.conformance = conformance
exports.profile = profile
