merge = require('merge')

keyFor =
  "Observation": "subject"
  "MedicationPrescription": "patient"
  # TODO: complete with all resources

withPatient = (cfg, type, q) ->

  if !cfg.boundToPatient or !cfg.patient or !keyFor[type]
    return q
    
  query = merge(true, q)
  query[keyFor[type]] = {$type: "Patient", _id: cfg.patient}
  query

wrap = (cfg, search)->
  (baseUrl, http, type, query, cb, err) ->
    search(baseUrl, http, type, withPatient(cfg, type, query), cb, err)

module.exports = wrap
