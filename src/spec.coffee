tu = require('../src/testUtils')
assert = require('assert')
Chance = require('chance')

exports.spec_for = (title, impl, baseUrl)->
  chance = new Chance()
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

  describe title, ->
    @timeout(10000)

    q = {defer: impl.defer}
    buildStep =  tu.stepBuilder(q)
    checkStep =  tu.checkStep(q)

    subject = impl(baseUrl: baseUrl)

    it "search", (done) ->
      subject.search(type: 'Patient', query: {name: 'maud'}).then((-> done()))

    it "CRUD", (done) ->
      console.log("#{title} SPEC")

      fail = (err)-> done(new Error(JSON.stringify(err)))

      preparePt = buildStep 'pt', (next, st)-> next(genPatient())

      createPt = buildStep 'createPt', (next, st)->
        success = (resp)->
          id = resp.data.id.split("/_history/")[0]
          st.pid = id
          next(resp)

        subject.create(resource: st.pt).then(success,fail)

      checkCreatePt = checkStep 'createPt', (st, resp)->
        cpt = resp.data
        assert.notEqual(cpt.id, null)
        assert.deepEqual(cpt.name[0].family, st.pt.name[0].family)

      readPt = buildStep 'readPt', (next, st)->
        subject.read(type: 'Patient', id: st.pid).then(next,fail)

      checkReadPt = checkStep 'readPt', (st, resp)->
        readPt = resp.data
        assert.deepEqual(readPt.name[0].family[0], st.pt.name[0].family[0])

      updatePt = buildStep 'updatePt', (next, st)->
        pt = st.createPt.data
        pt.name[0].family[0] = chance.last()
        subject.update(resource: pt).then(next, fail)

      checkUpdatePt = checkStep 'updatePt', (st, resp)->
        updatePt = resp.data
        createPt = st.createPt.data
        assert.deepEqual(updatePt.name[0].family[0], createPt.name[0].family[0])

      deletePt = buildStep 'deletePt', (next, st)->
        createPt = st.createPt.data
        subject.delete(resource: {resourceType: 'Patient', id: createPt.id}).then(next, fail);

      preparePt({})
        .then createPt
        .then checkCreatePt
        .then readPt
        .then checkReadPt
        .then updatePt
        .then checkUpdatePt
        .then deletePt
        .then (-> done())
