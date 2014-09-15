jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/angularjs.coffee')
merge = require('merge')

Chance = require('chance')
chance = new Chance()

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
  fail = (err)-> console.error(err)
  q = null
  subject = null
  $injector.invoke ['$q','$fhir', ($q, $fhir)-> q=$q; subject=$fhir]
  buildStep = (title, fn)->
    (state)->
      console.log(title)
      d = q.defer()
      next = (data)->
        console.log("#{title} done!")
        d.resolve(merge(true, state, data))
      fn(next, state)
      p = d.promise
      p

  it "search", (done) ->
    subject.search(type: 'Patient', query: {name: 'maud'})
      .then (d)-> done()

  it "CRUD", (done) ->
    createPt = buildStep 'Create Pt', (next, st)->
       _pt = genPatient()
       subject.create
         entry:
           tags: [{term: 'fhir.js', schema: 'fhir.js', label: 'fhir.js'}],
           content: _pt
         error: fail
         success: (res)->
           expect(res.content.name[0].family).toEqual(_pt.name[0].family)
           id = res.id.split("/_history/")[0]
           expect(id).not.toBe(null)
           next(pt: _pt, pid: id, createdPt: res)

    readPt = buildStep 'Read Pt', (next, st)->
      subject.read
        id: st.pid
        error: fail
        success: (res)->
          expect(res.content.name[0].family[0])
            .toEqual(st.pt.name[0].family[0])
          next(readPt: res)

    updatePt = buildStep 'Update Pt', (next, st)->
      pt = st.createdPt
      name = chance.last()
      pt.content.name[0].family[0] = name
      subject.update
        entry: pt
        error: fail
        success: (res)->
          expect(res.content.name[0].family[0]).toEqual(name)
          next(updatedPt: res)

    createPt({})
      .then(readPt)
      .then(updatePt)
      .then done

  it "history", (done) ->
    subject.history {}
     .success (d)-> done()
     .error (err)->
       console.error('History', err)

  # it "crud", (done) ->
  #    patient = genPatient()
  #    entry =
  #      tags: [{term: 'fhir.js', schema: 'fhir.js', label: 'fhir.js'}],
  #      content: patient
  #    success = (res)->
  #      expect(res.content.name[0].family).toEqual(patient.name[0].family)
  #      id = res.id.split("/_history/")[0]

  #      readSuccess = (res)->
  #        expect(res.content.name[0].family).toEqual(patient.name[0].family)
  #        family = chance.last() + '-test'
  #        res.content.name[0].family[0] = family
  #        updateSuccess = (res)->
  #          expect(res.content.name[0].family[0]).toEqual(family)
  #          updateReadSuccess = (res)->
  #            expect(res.content.name[0].family[0]).toEqual(family)
  #            deleteSuccess = (res)->
  #              deleteReadSuccess = (res)->
  #                console.log(JSON.stringify(res))
  #                done()
  #              deleteReadError = ()->
  #                console.log(JSON.stringify(res))
  #                done()
  #              subject.read(id: id, success: deleteReadSuccess, error: deleteReadError)

  #            deleteError = (res)->
  #              console.log(JSON.stringify(res))
  #              done()
  #            subject.delete(entry: {id: id}, success: deleteSuccess, error: deleteError)

  #          updateReadError = (res)->
  #            console.log(JSON.stringify(res))
  #            done()

  #          subject.read(id: id, success: updateReadSuccess, error: updateReadError)

  #        updateError = (res)->
  #          console.log(JSON.stringify(res))
  #          done()
  #        subject.update(entry: res, success: updateSuccess, error: updateError)

  #      readError = (res)->
  #        console.log('Error Patient read', JSON.stringify(res))
  #        done()

  #      subject.read(id: id, success: readSuccess, error: readError)
  #    error = (res)->
  #      console.log('Error Patient create', JSON.stringify(res))
  #      done()

  #    subject.create(entry: entry, success: success, error: error)



  # bundle = '{"resourceType":"Bundle","entry":[]}'

  # it "transaction", (done) ->
  #      subject.transaction(bundle)
  #        .then (d)->
  #          # console.log('Transaction', d)
  #          done()
