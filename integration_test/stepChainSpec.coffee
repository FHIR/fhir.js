jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe "ngFhir", ->
  $injector = angular.injector(['test'])

  q = null
  $injector.invoke ['$q', ($q)-> q=$q]

  buildStep = (fn)->
    (state)->
      d = q.defer()
      fn(d.resolve, state)
      p = d.promise
      p

  step1 = buildStep (resolve, state)->
    console.log('step1')
    state.step1 = '1'
    resolve(state)

  step2 = buildStep (resolve, state)->
    console.log('step2')
    state.step2 = '2'
    resolve(state)

  step3 = buildStep (resolve, state)->
    console.log('step3')
    state.step3 = '3'
    resolve(state)

  it "search", (done) ->
    step1({})
      .then step2
      .then step3
      .then done
