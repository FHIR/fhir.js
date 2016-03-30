searchResultsAsGraph = require('../src/middlewares/searchResultsAsGraph')
bpBundle = require('../fixtures/bpBundle.js')
medRx = require('../fixtures/medicationPrescription.js')

assert = require("assert")

describe "search results as graph", ()->

  it "can handle a feed with inter-linked objects", ()->
    fakeSearch = ({success})->success(bpBundle)
    graphify = searchResultsAsGraph(null, fakeSearch)
    graphify({
      baseUrl: 'BASE',
      graph: true,
      success: (graph)->
        target = graph[0].related[0].target
        assert.deepEqual(target.resourceType, 'Observation')
    })

  it "can handle a feed with contained objects", ()->
    fakeSearch = ({success})->success({entry: [content: medRx]})
    graphify = searchResultsAsGraph(null, fakeSearch)
    graphify({
      baseUrl: 'BASE',
      graph: true,
      success: (graph)->
        med = graph[0].medication
        assert.deepEqual(med.resourceType, 'Medication')
    })


