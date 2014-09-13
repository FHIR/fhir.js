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
sync = (baseUrl, http, cache, ref, resource, bundle)->
  unless ref.reference
    return null

  if ref.reference.match(CONTAINED)
    return resolveContained(ref.reference, resource)

  abs = utils.absoluteUrl(baseUrl, ref.reference)
  bundled = (e for e in (bundle?.entry or []) when e.id is abs)
  bundled[0] or cache?[abs] or null

# Resolve a reference asynchronously, by:
# 1. Wrapping around the `sync` function if the data exists locally
# 2. Issing an HTTP get otherwise
async = (baseUrl, http, cache, ref, resource, bundle, cb, err)->
  didSync = sync(baseUrl, http, cache, ref, resource, bundle)

  if didSync
    return setTimeout ()->
      cb(didSync) if cb

  unless ref.reference
    return setTimeout ()->
      err("No reference found") if err
   
  if ref.reference.match(CONTAINED)
    return setTimeout ()->
      err("Contained resource not found") if err

  abs = utils.absoluteUrl(baseUrl, ref.reference)

  http
    method: 'GET'
    url: abs,
    success: (data)-> cb(data) if cb
    error: (e)-> err(e) if err

module.exports.async = async
module.exports.sync = sync
