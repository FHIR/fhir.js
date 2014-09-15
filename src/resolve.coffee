utils = require('./utils')

CONTAINED = /^#(.*)/

resolveContained = (ref, resource)->
  cid = ref.match(CONTAINED)[1]
  match = (r for r in resource?.contained when (r.id or r._id) is cid)
  match[0] or null

# Resolve a reference synchronously, by looking in:
# 1. containing resource
# 2. containing bundle
# 3. local cache
# If anything goes wrong, return null.
sync = ({baseUrl, http, cache, reference, resource, bundle})->
  ref = reference
  console.log(ref)
  return null unless ref.reference

  if ref.reference.match(CONTAINED)
    return resolveContained(ref.reference, resource)

  abs = utils.absoluteUrl(baseUrl, ref.reference)
  bundled = (e for e in (bundle?.entry or []) when e.id is abs)
  bundled[0] or cache?[abs] or null

# Resolve a reference asynchronously, by:
# 1. Wrapping around the `sync` function if the data exists locally
# 2. Issing an HTTP get otherwise
async = (opt)->
  {baseUrl, http, cache, reference, resource, bundle, success, error} = opt
  ref = reference
  didSync = sync(opt)

  if didSync
    return setTimeout ()->
      success(didSync) if success

  unless ref.reference
    return setTimeout ()->
      error("No reference found") if error

  if ref.reference.match(CONTAINED)
    return setTimeout ()->
      error("Contained resource not found") if error

  abs = utils.absoluteUrl(baseUrl, ref.reference)

  http
    method: 'GET'
    url: abs,
    success: (data)-> success(data) if success
    error: (e)-> error(e) if error

module.exports.async = async
module.exports.sync = sync
