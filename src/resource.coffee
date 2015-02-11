utils = require('./utils')

gettype = utils.type

toJson = (resource)->
  if gettype(resource) == 'string'
    resource
  else if gettype(resource) == 'object'
    JSON.stringify(resource)

assert = (pred, mess)->
  throw mess unless pred?

exports.create = ({baseUrl, http, resource, success, error})->
  type = resource.resourceType
  assert(type, 'resourceType should be present')
  headers = { Prefer: 'return=representation' }

  http
    method: 'POST'
    url: "#{baseUrl}/#{type}"
    headers: headers
    data: toJson(resource)
    success: (data, status, headers, config)->
      uri = headers('Content-Location')
      success(data, config)
    error: error

exports.validate = ({baseUrl, http, resource, success, error})->
  type = resource.resourceType
  assert(resource.resourceType, 'resourceType should be present')
  http
    method: 'POST'
    url: "#{baseUrl}/#{type}/_validate"
    data: toJson(resource)
    success: (data, status, headers, config)->
      success(data, config)
    error: error

exports.read = ({baseUrl, http, resourceType, id, success, error})->
  http
    method: 'GET'
    url: utils.absoluteUrl(baseUrl, "#{resourceType}/#{id}")
    success: (data, status, headers, config)->
      # this headers should be in meta
      # id = headers and headers('Location')
      # version_id = headers('ETag')
      # lastMod = headers('Last-Modified')
      success(data, config)
    error: error

exports.update = ({baseUrl, http, resource, success ,error})->
  console.log(resource)
  assert(resource.resourceType, 'resourceType expected')
  assert(resource.id, 'id expected')
  url = utils.absoluteUrl(baseUrl, "#{resource.resourceType}/#{resource.id}")
  headers = { Prefer: 'return=representation' }
  http
    method: 'PUT'
    url: url
    headers: headers
    data: toJson(resource)
    success: (data, status, headers, config)->
      uri = headers('Content-Location')
      success(data, config)
    error: error

exports.delete = ({baseUrl, http, resource, success, error})->
  url = utils.absoluteUrl(baseUrl, "#{resource.resourceType}/#{resource.id}")
  http
    method: 'DELETE'
    url: url
    success: (data, status, headers, config)->
      success(data, config)
    error: error

exports.vread = ({baseUrl, http})->
  console.log('TODO')
