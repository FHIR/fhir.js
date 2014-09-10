btoa = require('Base64').btoa
merge = require('merge')

bearer = (cfg) ->
  (req) -> withAuth(req, "Bearer #{cfg.auth.bearer}")

basic = (cfg) ->
  (req) -> withAuth( req, "Basic " + btoa("#{cfg.auth.user}:#{cfg.auth.pass}"))

identity = (x)-> x

withAuth = (req, a) ->
  headers = merge(true, req.headers or {}, { "Authorization": a })
  merge(true, req, {headers: headers})

wrapWithAuth = (cfg, http)->
  requestProcessor = switch
      when cfg?.auth?.bearer then bearer(cfg)
      when cfg?.auth?.user and cfg?.auth?.pass then basic(cfg)
      else identity
  (req)-> http(requestProcessor(req))

module.exports = wrapWithAuth
