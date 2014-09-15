jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/angularjs.coffee')

Chance = require('chance')
chance = new Chance()

angular.module('test', ['ng-fhir'])
  .config ($fhirProvider)->
     $fhirProvider.baseUrl = 'http://try-fhirplace.hospital-systems.com'

pt = ()->
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


  it "search", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       $fhir.search(type: 'Patient', query: {name: 'maud'})
         .then (d)-> done()
     ]

  # it "crud2", (done) ->
  #   $injector.invoke ['$q', '$fhir', ($q, $fhir)->
  #    entry =
  #      tags: [{term: 'fhir.js', schema: 'fhir.js', label: 'fhir.js'}],
  #      content: pt()

  #    fail = (err)-> console.error(err)

  #    create = ()-> $fhir.create(entry: entry, error: fail)

  #    update = (p)->
  #      def = $q.defer()
  #      p.success (res)->
  #        res.content.name[0].family[0] = chance.last
  #        $fhir.update(entry: res, error: fail).success(def.resolve)
  #      def
  #   ]

  it "crud", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       patient = pt()
       entry =
         tags: [{term: 'fhir.js', schema: 'fhir.js', label: 'fhir.js'}],
         content: patient
       success = (res)->
         expect(res.content.name[0].family).toEqual(patient.name[0].family)
         id = res.id.split("/_history/")[0]

         readSuccess = (res)->
           expect(res.content.name[0].family).toEqual(patient.name[0].family)
           family = chance.last() + '-test'
           res.content.name[0].family[0] = family
           updateSuccess = (res)->
             expect(res.content.name[0].family[0]).toEqual(family)
             updateReadSuccess = (res)->
               expect(res.content.name[0].family[0]).toEqual(family)
               deleteSuccess = (res)->
                 deleteReadSuccess = (res)->
                   console.log(JSON.stringify(res))
                   done()
                 deleteReadError = ()->
                   console.log(JSON.stringify(res))
                   done()
                 $fhir.read(id: id, success: deleteReadSuccess, error: deleteReadError)

               deleteError = (res)->
                 console.log(JSON.stringify(res))
                 done()
               $fhir.delete(entry: {id: id}, success: deleteSuccess, error: deleteError)

             updateReadError = (res)->
               console.log(JSON.stringify(res))
               done()

             $fhir.read(id: id, success: updateReadSuccess, error: updateReadError)

           updateError = (res)->
             console.log(JSON.stringify(res))
             done()
           $fhir.update(entry: res, success: updateSuccess, error: updateError)

         readError = (res)->
           console.log('Error Patient read', JSON.stringify(res))
           done()

         $fhir.read(id: id, success: readSuccess, error: readError)
       error = (res)->
         console.log('Error Patient create', JSON.stringify(res))
         done()

       $fhir.create(entry: entry, success: success, error: error)
     ]

  # bundle = '{"resourceType":"Bundle","entry":[]}'

  # it "transaction", (done) ->
  #   $injector.invoke ['$fhir', ($fhir)->
  #      $fhir.transaction(bundle)
  #        .then (d)->
  #          # console.log('Transaction', d)
  #          done()
  #    ]

  it "history", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       $fhir.history {}
         .success (d)-> done()
         .error (err)->
           console.error('History', err)
     ]
