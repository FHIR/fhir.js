transaction = (baseUrl, http, bundle, cb, err)=>
    http
      method: 'POST'
      url: baseUrl
      data: bundle
      success: cb
      error: err

module.exports = transaction
