fhir = require('../src/middlewares/search')
assert = require('assert')

describe "linearizeParams:", ->
  subject = fhir._query

  it "simplest", ->
    assert.deepEqual(subject(a:1,b:2) , [{param: 'a', value: [1]},{param: 'b',value: [2]}])

  it "modifier", ->
    assert.deepEqual(subject(a: {$exact: 2}) , [{param: 'a', modifier: ':exact', value: [2]}])

  it "operator", ->
    assert.deepEqual(subject(a: {$lt: 2}) , [{param: 'a', operator: '<', value: [2]}])

  it "and", ->
    assert.deepEqual(subject(a: {$and: [1, 2]}) , [{param: 'a', value: [1]}, {param: 'a',value: [2]}])

  it "compound", ->
    assert.deepEqual(subject(a: [1, 2]) , [{param: 'a', value: ['1|2']}])

  it "or", ->
    assert.deepEqual(subject(a: {$or: [1, 2]}) , [{param: 'a', value: [1,2]}])

  it "operator & or", ->
    assert.deepEqual(subject(a: {$exact: {$or: [1,2]}}) , [{param: 'a', modifier: ':exact', value: [1,2]}])

  it "chained params", ->
    assert.deepEqual(subject(subject: {name: {$exact: 'abu'}, birthDate: {$gt: '2000'}}), [
        {param: 'subject.name', modifier: ':exact', value: ['abu']}
        {param: 'subject.birthDate', operator: '>', value: ['2000']}
      ])

describe "test params builder", ->
  subject = fhir.query

  it "simple cases", ->
    assert.deepEqual(subject(name: 'buka'), 'name=buka')

    assert.deepEqual(subject(name: {$exact: 'buka'}), 'name:exact=buka')

    assert.deepEqual(subject(birthDate: {$gt: '2011'}), 'birthDate=>2011')

    assert.deepEqual(subject(birthDate: {$gt: '2011', $lt: '2014'}), 'birthDate=>2011&birthDate=<2014')


    assert.deepEqual(subject('subject.name': {$exact: 'maud'}), 'subject.name:exact=maud')

    assert.deepEqual(subject(subject: {$type: 'Patient', name: 'maud',
    birthDate: {$gt: '1970'}}), 'subject:Patient.name=maud&subject:Patient.birthDate=>1970')

    assert.deepEqual(subject('uri': 'http://test'), 'uri=http%3A%2F%2Ftest')

  it "sort", ->
    assert.deepEqual(subject(
      $sort: [['name','asc'],['birthDate','desc'], 'vip']),
      '_sort:asc=name&_sort:desc=birthDate&_sort=vip')

  it "include", ->
    assert.deepEqual(subject($include: {Observation: "related.component", Patient: ["link.other", "careProvider"]}),
      '_include=Observation.related.component&_include=Patient.link.other&_include=Patient.careProvider')

  it "or", ->
    assert.deepEqual(subject(name: {$or: ['bill', 'ted']}),
      'name=bill%2Cted')


