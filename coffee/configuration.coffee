config = {}
exports.config = config
exports.configure = (m)->
  config[k]=v for k,v of m
