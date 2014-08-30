adapter = require('./adapter.coffee')

class Transaction

  constructor: (fhir)->
    @fhir = fhir

  transaction: (bundle, cb, err)=>
    @fhir.http.request
      method: 'POST'
      url: @fhir.config.get().baseUrl
      data: bundle
      success: cb
      error: err

module.exports = Transaction
