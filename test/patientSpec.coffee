fhir = require('../src/fhir')

subject = fhir({baseUrl: 'BASE', patient: "123"}, {})

describe "Search by patient:", ()->

  it  'Add pt param', (done)->
    http = (opt)->
      expect(opt.url).toEqual('BASE/Observation/_search?_id=5&subject:Patient._id=123')
      done()

    subject.search(type: 'Observation', query: {_id: 5}, http: http);

  it  'Add pt param', (done)->
    http = (opt)->
      expect(opt.url).toEqual('BASE/MedicationPrescription/_search?_id=5&patient:Patient._id=123')
      done()

    subject.search(type: 'MedicationPrescription', query: {_id: 5}, http: http);

  it 'Skip non relevant types', (done)->
    http = (opt)->
      expect(opt.url).toEqual('BASE/Organization/_search?_id=5')
      done()

    subject.search(type: 'Organization', query: {_id: 5}, http: http);
