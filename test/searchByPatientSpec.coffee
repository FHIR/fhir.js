searchByPatient = require('../coffee/middlewares/searchByPatient.coffee')

describe "Search by patient:", ()->
  pid = "123"
  justQuery = (a, b, c, query, d, e)-> query

  bound = searchByPatient({
      boundToPatient: true
      patient: "123"},
    justQuery)

  notbound = searchByPatient({
      boundToPatient: false
      patient: "123"},
    justQuery)

  byType = (toBind, type) ->
   fn = if toBind
     bound
   else
     notbound
   fn(null, null, type, {}, null, null)

  it "acts as a no-op when boundToPatient is falsy", ()->
    expect(byType(false, "Observation")).toEqual({})

  it "augments observations with 'subject'", ()->
    expect(byType(true, "Observation"))
      .toEqual({"subject":{$type:"Patient", _id:pid}})

  it "augments medication rx with 'patient'", ()->
    expect(byType(true, "MedicationPrescription"))
      .toEqual({"patient":{$type:"Patient", _id:pid}})

  it "ignores irrelevant types", ()->
    expect(byType(true, "IrrelevantType"))
      .toEqual({})
