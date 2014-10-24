# this function return step builder fn
# q is promise constructor
# to create composable chains
# state is passed to each next function/step
# for usage see tests
exports.stepBuilder = (q)->
  (name, fn)->
    (state)->
      d = q.defer()
      console.log("Step [#{name}]: start")
      next = (newSt)->
        state[name] = newSt
        console.log("Step [#{name}]: complete")
        d.resolve(state)
      fn(next, state)
      d.promise

exports.checkStep = (q)->
  (name, fn)->
    (state)->
      d = q.defer()
      console.log("Step [#{name}]: check")
      fn(state, state[name])
      d.resolve(state)
      d.promise
