jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/angularjs.coffee')
merge = require('merge')

Chance = require('chance')
chance = new Chance()

tu = require('../src/testUtils.coffee')

angular.module('test', ['ng-fhir'])
  .config ($fhirProvider)->
     $fhirProvider.baseUrl = 'http://try-fhirplace.hospital-systems.com'

genPatient = ()->
  resourceType: "Patient"
  text:{ status: "generated", div: "<div>Generated</div>"}
  identifier: [
    use: "usual"
    label: "MRN"
    system: "urn:oid:1.2.36.146.595.217.0.1"
    value: chance.ssn()
    period: { start: "2001-05-06"}
    assigner: { display: "Acme Healthcare"}
  ]
  name: [
    {use: "official", family: [chance.last()], given: [chance.first(), chance.first()]}
  ]


describe "ngFhir", ->

  $injector = angular.injector(['test'])
  q = null
  subject = null
  $injector.invoke ['$q','$fhir', ($q, $fhir)-> q=$q; subject=$fhir]

  buildStep =  tu.stepBuilder(q)
  checkStep =  tu.checkStep(q)

  it "search", (done) ->
    console.log('ng spec')
    subject.search(type: 'Patient', query: {name: 'maud'})
      .then (d)-> done()

  it "CRUD", (done) ->
    fail = (err)->
      console.error(err)
      done()

    console.log('ng spec')
    preparePt = buildStep 'pt', (next, st)-> next(genPatient())

    createPt = buildStep 'createPt', (next, st)->
       subject.create
         entry:
           tags: [{term: 'fhir.js', schema: 'fhir.js', label: 'fhir.js'}],
           content: st.pt
         error: fail
         success: (res)->
           id = res.id.split("/_history/")[0]
           st.pid = id
           next(res)

    checkCreatePt = checkStep 'createPt', (st, cpt)->
      expect(cpt.pid).not.toBe(null)

      expect(cpt.content.name[0].family)
        .toEqual(st.pt.name[0].family)

    readPt = buildStep 'readPt', (next, st)->
      subject.read id: st.pid, error: fail, success: next

    checkReadPt = checkStep 'readPt', (st, readPt)->
      expect(readPt.content.name[0].family[0])
        .toEqual(st.pt.name[0].family[0])

    updatePt = buildStep 'updatePt', (next, st)->
      pt = st.createPt
      pt.content.name[0].family[0] = chance.last()
      subject.update entry: pt, error: fail, success: next

    checkUpdatePt = checkStep 'updatePt', (st, updatePt)->
      expect(updatePt.content.name[0].family[0])
        .toEqual(st.createPt.content.name[0].family[0])

    deletePt = buildStep 'deletePt', (next, st)->
      subject.delete entry: {id: st.createPt.id}, error: fail, success: next

    preparePt({})
      .then createPt
      .then checkCreatePt
      .then readPt
      .then checkReadPt
      .then updatePt
      .then checkUpdatePt
      .then deletePt
      .then done

  # it "history", (done) ->
  #   console.log('ng spec')
  #   fail = (err)->
  #     console.error(err)
  #     done()

  #   subject.history {}
  #    .success done
  #    .error fail

  # it "transaction", (done) ->
  #      subject.transaction(bundle)
  #        .then (d)->
  #          # console.log('Transaction', d)
  #          done()
