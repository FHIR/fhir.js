# READ OPERATIONS
# =============================================================

tagsAll = ({baseUrl, http, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/_tags"
    success: success
    error: error

tagsResourceType = ({baseUrl, http, type, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/_tags"
    success: success
    error: error

tagsResource = ({baseUrl, http, type, id, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}/_tags"
    success: success
    error: error

tagsResourceVersion = ({baseUrl, http, type, id, vid, success, error})->
  http
    method: 'GET'
    url: "#{baseUrl}/#{type}/#{id}/_history/#{vid}/_tags"
    success: success
    error: error

# read tags
# tags() - read all tags
# tags(type: 'Patient') - read tags for all Patient resource
# tags(type: 'Patient', id: 'pt1111') - read tags for concrete resource
# tags(type: 'Patient', id: 'pt1111', vid: 'v1') - read tags for concrete version of resource

tags = (q)->
  if q.vid? and q.id? and q.type?
    tagsResourceVersion(q)
  else if q.id? and q.type?
    tagsResource(q)
  else if q.type?
    tagsResourceType(q)
  else
    tagsAll(q)

# Affix
# =============================================================

buildTags = (tags)->
  tags.filter((i)-> $.trim(i.term))
    .map((i)-> "#{i.term}; scheme=\"#{i.scheme}\"; label=\"#{i.label}\"")
    .join(",")

affixTagsToResource = ({baseUrl, http, type, id, tags, success, error})->
  headers = {}
  tagHeader = buildTags(tags)
  if tagHeader
    headers["Category"] =  tagHeader
    http
      method: 'POST'
      url: "#{baseUrl}/#{type}/#{id}/_tags"
      headers: headers
      success: success
      error: error
  else
    console.log('Empty tags')

affixTagsToResourceVersion = ({baseUrl, http, type, id, vid, tags, success, error})->
  headers = {}
  tagHeader = buildTags(tags)
  if tagHeader
    headers["Category"] =  tagHeader
    http
      method: 'POST'
      url: "#{baseUrl}/#{type}/#{id}/_history/#{vid}/_tags"
      headers: headers
      success: success
      error: error
  else
    console.log('Empty tags')

# affix tags
# affixTags(type: 'Patient', id: 'pt1111', tags: tags)
affixTags = (q)->
  if q.vid? and q.id? and q.type?
    affixTagsToResourceVersion(q)
  else if q.id? and q.type?
    affixTagsToResource(q)
  else
    throw 'wrong arguments'

# Remove
# =============================================================

removeTagsFromResource = ({baseUrl, http, type, id, success, error})->
  http
    method: 'POST'
    url: "#{baseUrl}/#{type}/#{id}/_tags/_delete"
    success: success
    error: error

removeTagsFromResourceVersion = ({baseUrl, http, type, id, vid, success, error})->
  http
    method: 'POST'
    url: "#{baseUrl}/#{type}/#{id}/_history/#{vid}/_tags"
    success: success
    error: error

# remove tags
# affixTags('Patient', 'pt1111', tags)
removeTags = (q)->
  if q.vid? and q.id? and q.type?
    removeTagsFromResourceVersion(q)
  else if q.id? and q.type?
    removeTagsFromResource(q)
  else
    throw 'wrong arguments'

# Exports
exports.tags = tags
exports.affixTags = affixTags
exports.removeTags = removeTags
