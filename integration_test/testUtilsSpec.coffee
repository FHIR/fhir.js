jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

tu = require('../src/testUtils.coffee')

describe "ngFhir", ->
  $injector = angular.injector(['test'])

  q = null
  $injector.invoke ['$q', ($q)-> q=$q]

  buildStep =  tu.stepBuilder(q)
  checkStep =  tu.checkStep(q)

  step1 = buildStep 'step1', (next, state)->
    next("step1 done")

  checkStep1 = checkStep 'step1', (state, step)->
    expect(state.step1).toEqual('step1 done')
    expect(step).toEqual('step1 done')

  step2 = buildStep 'step2', (next, state)->
    next('step2 done')

  checkStep2 = checkStep 'step2', (_, step)->
    expect(step).toEqual('step2 done')

  step3 = buildStep 'step3', (next, state)->
    next('step 3 done')

  checkStep3 = checkStep 'step3',  (_, step)->
    expect(step).toEqual('step 3 done')


  it "search", (done) ->
    step1({})
      .then checkStep1
      .then step2
      .then checkStep2
      .then step3
      .then checkStep3
      .then done
