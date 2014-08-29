adapter = require('./adapter.coffee')

# READ OPERATIONS
# =============================================================

tagsAll = ()->
  console.log('impl me')

tagsResourceType = (type)->
  console.log('impl me')

tagsResource = (type, id)->
  console.log('impl me')

tagsResourceVersion = (type, id, vid)->
  console.log('impl me')


# read tags
# tags() - read all tags
# tags('Patient') - read tags for all Patient resource
# tags('Patient', 'pt1111') - read tags for concrete resource
# tags('Patient', 'pt1111', 'v1') - read tags for concrete version of resource
tags = ()->
  switch arguments.length
    when 0 then tagsAll()
    when 1 then tagsResourceType.apply(null, arguments)
    when 2 then tagsResource.apply(null, arguments)
    when 3 then tagsResourceVersion.apply(null, arguments)
    else throw "wrong arity"

# Affix
# =============================================================

affixTagsToResource = (type, id, tags)->
  console.log('impl me')

affixTagsToResourceVersion = (type, id, vid, tags)->
  console.log('impl me')

# affix tags
# affixTags('Patient', 'pt1111', tags)
affixTags = ()->
  switch arguments.length
    when 3 then affixTagsToResource.apply(null, arguments)
    when 4 then affixTagsToResourceVersion.apply(null, arguments)
    else throw "wrong arity: expected (type,id,tags) or (type,id,vid,tags)"

# Remove
# =============================================================

removeTagsFromResource = (type, id)->
  console.log('impl me')

removeTagsFromResourceVerson = (type, id, vid)->
  console.log('impl me')

# remove tags
# affixTags('Patient', 'pt1111', tags)
removeTags = ()->
  switch arguments.length
    when 2 then removeTagsFromResource.apply(null, arguments)
    when 3 then removeTagsFromResourceVerson.apply(null, arguments)
    else throw "wrong arity: expected (type,id) or (type,id,vid)"

# Exports
exports.tags = tags
exports.affixTags = affixTags
exports.removeTags = removeTags
