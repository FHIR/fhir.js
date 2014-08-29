cfg = require('./configuration.coffee').config
adapter = require('./adapter.coffee')
btoa = require('Base64').btoa
merge = require('merge')

base = ()-> adapter.getAdapter()

bearer = (req)-> withAuth(req, "Bearer #{cfg.auth.bearer}")

basic = (req)-> 
  console.log "do req with auth", req,  btoa("#{cfg.auth.user}:#{cfg.auth.pass}")
  withAuth(
    req,
    "Basic " + btoa("#{cfg.auth.user}:#{cfg.auth.pass}"))

identity = (req)->req

withAuth = (req, a) ->
  headers = merge(true, req.headers or {}, {
    "Authorization": a
  })
  merge(true, req, {headers: headers})

module.exports = (req)->
  auth = switch
    when cfg?.auth?.bearer then bearer
    when cfg?.auth?.user and cfg?.auth?.pass then basic
    else identity
  console.log "woth auth fn", req, auth
  auth req
