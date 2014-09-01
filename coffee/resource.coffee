RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
trim = (text)->
  if text? then  (text + "" ).replace(RTRIM, "" ) else ""

buildTags = (tags)->
  (tags || []).filter((i)-> trim(i.term))
    .map((i)-> "#{i.term}; scheme=\"#{i.scheme}\"; label=\"#{i.label}\"")
    .join(",")

addKey = (acc, str)->
  return unless str
  pair = str.split("=").map(trim)
  val = pair[1].replace(/(^"|"$)/g,'')
  acc[pair[0]] = val if val
  acc

extractTags = (categoryHeader)->
  return [] unless categoryHeader
  categoryHeader.split(',').map (x)->
    parts = trim(x).split(';').map(trim)
    if parts[0]
      acc = {term: parts[0]}
      addKey(acc, parts[1])
      addKey(acc, parts[2])
      acc

# entry
#
# * category  - tags array
# * content   - resource json
# * cb - function(entry)
exports.create = (baseUrl, http, entry, cb, err)->
  tags = entry.category
  resource = entry.content
  type = resource.resourceType
  headers = {}
  tagHeader = buildTags(tags)
  headers["Category"] =  tagHeader if tagHeader
  http
    method: 'POST'
    url: "#{baseUrl}/#{type}"
    data: resource
    headers: headers
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = extractTags(headers('Category')) || tags
      cb({id: id, category: (tags || []), content: (data || resource)}, config)
    error: err

exports.read = (baseUrl, http, type, id, cb, err)->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}"
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = extractTags(headers('Category'))
      cb({id: id, category: (tags || []), content: data}, config)
    error: err

exports.update = (baseUrl, http, entry, cb ,err)->
  url = entry.id
  tags = entry.tags
  headers = {}
  tagHeader = buildTags(tags)
  headers["Category"] =  tagHeader if tagHeader
  headers['Content-Location'] = id
  http
    method: 'PUT'
    url: url
    success: (data, status, headers, config)->
      id = headers('Content-Location')
      tags = extractTags(headers('Category'))
      cb({id: id, category: (tags || []), content: data}, config)
    error: err


exports.delete = (baseUrl, http)->
  uri = "#{BASE_PREFIX}#{rt}/#{id}"
  http(method: "DELETE", url: uri).success(cb)

exports.vread = (baseUrl, http)->
  console.log('TODO')
