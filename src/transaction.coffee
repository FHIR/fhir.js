transaction = ({baseUrl, http, bundle, success, error})=>
    http
      method: 'POST'
      url: baseUrl
      data: bundle
      success: success
      error: error

module.exports = transaction
