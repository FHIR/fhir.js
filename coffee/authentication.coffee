btoa = require('Base64').btoa
merge = require('merge')

bearer = (cfg) ->
  (req) -> withAuth(req, "Bearer #{cfg.auth.bearer}")

basic = (cfg) ->
  (req) ->
    withAuth( req, "Basic " + btoa("#{cfg.auth.user}:#{cfg.auth.pass}"))

identity = (req)->req

withAuth = (req, a) ->
  headers = merge(true, req.headers or {}, {
    "Authorization": a
  })
  merge(true, req, {headers: headers})

module.exports = (fhir)->
  (req)->
    cfg = fhir.config.get()
    auth = switch
      when cfg?.auth?.bearer then bearer(cfg)
      when cfg?.auth?.user and cfg?.auth?.pass then basic(cfg)
      else identity
    auth req
