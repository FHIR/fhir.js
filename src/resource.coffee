utils = require('./utils')

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
# * success - function(entry)
exports.create = ({baseUrl, http, entry, success, error})->
  tags = entry.category || []
  resource = entry.content
  assert(resource, 'entry.content with resource body should be present')

  type = resource.resourceType
  assert(type, 'entry.content.resourceType with resourceType should be present')

  headers = {}
  tagHeader = tagsToHeader(tags)
  headers["Category"] = tagHeader if tagHeader.length > 0

  http
    method: 'POST'
    url: "#{baseUrl}/#{type}"
    data: toJson(resource)
    headers: headers
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = headerToTags(headers('Category')) || tags
      success({id: id, category: (tags || []), content: (data || resource)}, config)
    error: error

exports.read = ({baseUrl, http, id, success, error})->
  console.log("[read] ", id)
  http
    method: 'GET'
    url: id
    success: (data, status, headers, config)->
      id = headers and headers('Content-Location') or '??'
      tags = headers and headerToTags(headers('Category')) or '??'
      success({id: id, category: (tags || []), content: data}, config)
    error: error

exports.update = ({baseUrl, http, entry, success ,error})->
  console.log("[update] ", entry)
  url = entry.id.split("/_history/")[0]
  tags = entry.tags
  resource = entry.content
  headers = {}
  tagHeader = tagsToHeader(tags)
  headers["Category"] =  tagHeader if tagHeader
  headers['Content-Location'] = entry.id
  http
    method: 'PUT'
    url: url
    data: toJson(resource)
    headers: headers
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      _tags = headerToTags(headers('Category'))
      success({id: id, category: (_tags || tags || []), content: data}, config)
    error: error

exports.delete = ({baseUrl, http, entry, success, error})->
  console.log("[delete] ", entry)
  url = entry.id.split('_history')[0]
  http
    method: 'DELETE'
    url: url
    success: (data, status, headers, config)->
      success(entry, config)
    error: error

exports.vread = ({baseUrl, http})->
  console.log('TODO')
