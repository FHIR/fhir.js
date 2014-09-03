wrap = require('../coffee/wrap.coffee')

describe "wrap:", ()->
  identity = (x)-> x

  cfg = {plus: 1, times:3}

  plus = (cfg, fplus)->
    () -> fplus.call(null, arguments[0]+cfg.plus)

  times = (cfg, ftimes)->
    () -> ftimes.call(null, arguments[0]*cfg.times)

  identity = (x)-> x

  it "wraps when no wrappers are supplied", ()->
    wrapped = wrap(cfg, identity)
    expect(wrapped(0)).toBe(0)

    wrapped = wrap(cfg, identity, [])
    expect(wrapped(0)).toBe(0)

  it "wraps a single (bare) fn", ()->
    wrapped = wrap(cfg, identity, plus)
    expect(wrapped(0)).toBe(1)

  it "wraps a single (list) fn", ()->
    wrapped = wrap(cfg, identity, [plus])
    expect(wrapped(0)).toBe(1)

  it "wraps a list of fns, applying first, then second, and on", ()->

    wrapped = wrap(cfg, identity, [plus, plus, times])
    expect(wrapped(0)).toBe(6)

    wrapped = wrap(cfg, identity, [times, plus, plus])
    expect(wrapped(0)).toBe(2)
