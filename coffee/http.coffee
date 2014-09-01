adapter = require('./adapter.coffee')
auth = require('./authentication.coffee')

# here we use classical FP pattern for decorating functions
# see clojure ring for example
wrap = (cfg, http)->
   auth(cfg, http)

module.exports = wrap
