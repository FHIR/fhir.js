searchResultsAsGraph = require('../src/middlewares/searchResultsAsGraph.coffee')
bpBundle = require('../fixtures/bpBundle.js')
medRx = require('../fixtures/medicationPrescription.js')

describe "search results as graph", ()->

  it "can handle a feed with inter-linked objects", ()->
    fakeSearch = ({success})->success(bpBundle)
    graphify = searchResultsAsGraph(null, fakeSearch)
    graphify({
      baseUrl: 'BASE',
      graph: true,
      success: (graph)->
        target = graph[0].related[0].target
        expect(target.resourceType).toEqual('Observation')
    })

  it "can handle a feed with contained objects", ()->
    fakeSearch = ({success})->success({entry: [content: medRx]})
    graphify = searchResultsAsGraph(null, fakeSearch)
    graphify({
      baseUrl: 'BASE',
      graph: true,
      success: (graph)->
        med = graph[0].medication
        expect(med.resourceType).toEqual('Medication')
    })


