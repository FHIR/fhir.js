adapter = require('./adapter.coffee')
conf = require('./configuration.coffee')

base = ()-> adapter.getAdapter()

exports.transaction = (bundle, cb, err)->
  base().http
    method: 'POST'
    url: conf.config.baseUrl
    data: bundle
    success: cb
    error: err