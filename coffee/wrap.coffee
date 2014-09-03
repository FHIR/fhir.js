wrap = (cfg, fn, middlewares)->

  if typeof middlewares == 'function'
    middlewares = [middlewares]
  
  next = (wrapped, nextf)->
    nextf(cfg, wrapped)

  [].concat(middlewares or []).reverse().reduce(next, fn)

module.exports = wrap
