fhir = require('../src/query')
describe "linearizeParams:", ->
  subject = fhir._query

  it "simplest", ->
    expect(subject(a:1,b:2))
      .toEqual([{param: 'a', value: [1]},{param: 'b',value: [2]}])

  it "modifier", ->
    expect(subject(a: {$exact: 2}))
      .toEqual([{param: 'a', modifier: ':exact', value: [2]}])

  it "operator", ->
    expect(subject(a: {$lt: 2}))
      .toEqual([{param: 'a', operator: '<', value: [2]}])

  it "and", ->
    expect(subject(a: {$and: [1, 2]}))
      .toEqual([{param: 'a', value: [1]}, {param: 'a',value: [2]}])

  it "compound", ->
    expect(subject(a: [1, 2]))
      .toEqual([{param: 'a', value: ['1|2']}])

  it "or", ->
    expect(subject(a: {$or: [1, 2]}))
      .toEqual([{param: 'a', value: [1,2]}])

  it "operator & or", ->
    expect(subject(a: {$exact: {$or: [1,2]}}))
      .toEqual([{param: 'a', modifier: ':exact', value: [1,2]}])

  it "chained params", ->
    expect(subject(subject: {name: {$exact: 'abu'}, birthDate: {$gt: '2000'}}))
      .toEqual([
        {param: 'subject.name', modifier: ':exact', value: ['abu']}
        {param: 'subject.birthDate', operator: '>', value: ['2000']}
      ])

describe "test params builder", ->
  subject = fhir.query

  it "simple cases", ->
    expect(subject(name: 'buka'))
      .toBe('name=buka')

    expect(subject(name: {$exact: 'buka'}))
      .toBe('name:exact=buka')

    expect(subject(birthDate: {$gt: '2011'}))
      .toBe('birthDate=>2011')

    expect(subject(birthDate: {$gt: '2011', $lt: '2014'}))
      .toBe('birthDate=>2011&birthDate=<2014')


    expect(subject('subject.name': {$exact: 'maud'}))
      .toBe('subject.name:exact=maud')

    expect(subject(subject: {$type: 'Patient', name: 'maud', birthDate: {$gt: '1970'}}))
      .toBe('subject:Patient.name=maud&subject:Patient.birthDate=>1970')

    expect(subject('uri': 'http://test'))
      .toBe('uri=http%3A%2F%2Ftest')

  it "sort", ->
    expect(subject(
      $sort: [['name','asc'],['birthDate','desc'], 'vip']))
      .toBe('_sort:asc=name&_sort:desc=birthDate&_sort=vip')

  it "include", ->
    expect(subject($include: {Observation: "related.component", Patient: ["link.other", "careProvider"]}))
      .toBe('_include=Observation.related.component&_include=Patient.link.other&_include=Patient.careProvider')

  it "or", ->
    expect(subject(name: {$or: ['bill', 'ted']}))
      .toBe('name=bill%2Cted')


