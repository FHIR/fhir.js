document = ({baseUrl, http, bundle, success, error})=>
    http
      method: 'POST'
      url: baseUrl + '/Document'
      data: bundle
      success: success
      error: error

module.exports = document
