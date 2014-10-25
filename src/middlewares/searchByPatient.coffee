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
  (params) ->
    {baseUrl, http, type, query, success, error} = params
    search(merge(true, params, {query: withPatient(cfg, type, query)}))

module.exports = wrap
