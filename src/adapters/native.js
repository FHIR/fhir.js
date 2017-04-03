var mkFhir = require('../fhir');

// Fetch Helper JSON Parsing
function parseJSON(response) {

  // response.json() throws on empty body
  return response.text()
  .then(function(text) {
    return text.length > 0 ? JSON.parse(text) : "";
  });

}

// Fetch Helper for Status Codes
function checkStatus(httpResponse) {
  return new Promise(function (resolve, reject) {
    if (httpResponse.status < 200 || httpResponse.status > 399) {
      reject(httpResponse);
    }
    resolve(httpResponse);
  });
}

// Build a backwards compatiable defer object
var defer = function(){
  var def = {};
  def.promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  return def;
};

// Build Adapter Object
var adapter = {
  http: function (args) {
    var url = args.url;
    var debug = args.debug;

    // The arguments passed in aligh with the fetch option names.
    // There are are few extra values, but fetch will ignore them.
    var fetchOptions = args;

    // Pass along cookies
    fetchOptions.credentials = args.credentials || '';

    // data neeeds to map to body if data is populated and this is not a GET or HEAD request
    if (!['GET', 'HEAD'].includes(fetchOptions.method) && fetchOptions.data) {
      fetchOptions.body = fetchOptions.data;
    }

    debug && console.log("DEBUG[native](fetchOptions)", fetchOptions);

    return new Promise(function (resolve, reject) {
      var returnableObject = {};

      fetch(url, fetchOptions).then(function (response) {
        debug && console.log("DEBUG[native](response)", response);
        // This object is in the shape required by fhir.js lib
        Object.assign(returnableObject, {
          status: response.status,
          headers: response.headers,
          config: args,
        });
        return response;
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(function (fhirObject) {
        // Merge the
        Object.assign(returnableObject, {
          data: fhirObject,
        });
        debug && console.log('DEBUG[native]: (success response)', returnableObject); // eslint-disable-line
        resolve(returnableObject);
      })
      .catch(function(error) {
        Object.assign(returnableObject, {
          error: error,
        });
        debug && console.log('DEBUG[native]: rejecting fetch promise');
        reject(returnableObject);
      });
    });
  },
};

var buildfhir = function buildfhir(config) {
  // debugger;
  return mkFhir(config, adapter);
};

buildfhir.defer = defer;
module.exports = buildfhir;
