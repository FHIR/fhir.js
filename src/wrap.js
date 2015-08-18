(function() {
  var wrap = function(cfg, fn, middlewares) {
    if (typeof middlewares === 'function') {
      middlewares = [middlewares];
    }
    var next = function(wrapped, nextf) {
      return nextf(cfg, wrapped);
    };
    return [].concat(middlewares || []).reverse().reduce(next, fn);
  };

  module.exports = wrap;
}).call(this);
