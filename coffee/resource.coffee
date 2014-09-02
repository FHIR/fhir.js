utils = require('./utils.coffee')

trim = utils.trim
tagsToHeader = utils.tagsToHeader
headerToTags = utils.headerToTags
gettype = utils.type

toJson = (resource)->
  if gettype(resource) == 'string'
    resource
  else if gettype(resource) == 'object'
    JSON.stringify(resource)

assert = (pred, mess)->
  throw mess unless pred?

# entry
#
# * category  - tags array
# * content   - resource json
# * cb - function(entry)
exports.create = (baseUrl, http, entry, cb, err)->
  tags = entry.category || []
  resource = entry.content
  assert(resource, 'entry.content with resource body should be present')

  type = resource.resourceType
  assert(type, 'entry.content.resourceType with resourceType should be present')

  headers = {}
  tagHeader = tagsToHeader(tags)
  headers["Category"] =  tagHeader if tagHeader.length > 0

  http
    method: 'POST'
    url: "#{baseUrl}/#{type}"
    data: toJson(resource)
    headers: headers
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = headerToTags(headers('Category')) || tags
      cb({id: id, category: (tags || []), content: (data || resource)}, config)
    error: err

exports.read = (baseUrl, http, id, cb, err)->
  http
    method: 'GET'
    url: id
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = headerToTags(headers('Category'))
      cb({id: id, category: (tags || []), content: data}, config)
    error: err

exports.update = (baseUrl, http, entry, cb ,err)->
  url = entry.id.split("/_history/")[0]
  tags = entry.tags
  resource = entry.content
  headers = {}
  tagHeader = tagsToHeader(tags)
  headers["Category"] =  tagHeader if tagHeader
  headers['Content-Location'] = url
  http
    method: 'PUT'
    url: url
    data: toJson(resource)
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      _tags = headerToTags(headers('Category'))
      cb({id: id, category: (_tags || tags || []), content: data}, config)
    error: err


exports.delete = (baseUrl, http, entry, cb, err)->
  http
    method: 'DELETE'
    url: entry.id
    success: (data, status, headers, config)->
      cb(entry, config)
    error: err

exports.vread = (baseUrl, http)->
  console.log('TODO')
