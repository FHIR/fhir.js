adapter = require('./adapter.coffee')
conf = require('./configuration.coffee')

base = ()-> adapter.getAdapter()

# TODO: cache if configured

exports.conformance = (cb, err)->
  base().http
    method: 'GET'
    url: "#{conf.config.baseUrl}/metadata"
    success: cb
    error: err

exports.profile = (type, cb, err)->
  base().http
    method: 'GET'
    url: "#{conf.config.baseUrl}/Profile/#{type}"
    success: cb
    error: err
