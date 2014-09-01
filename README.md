fhir.js
=======

[![Build Status](https://travis-ci.org/FHIR/fhir.js.svg)](https://travis-ci.org/FHIR/fhir.js)

JavaScript client for FHIR

## Goals:

 - Support FHIR CRUD operations
 - Friendly and expressive query syntax
 - Support for adapters that provide idiomatic interfaces in angular, jQuery, extjs, etc
 - Support for access control (HTTP basic, OAuth2)
 - ...

## Development

`nodejs` is required for build.

We recommend install it using [nvm](https://github.com/creationix/nvm/blob/master/README.markdown)

Build & test:

```
git clone https://github.com/FHIR/fhir.js
cd fhir.js
npm install
`npm bin`/bower install

# buld fhir.js
`npm bin`/grunt

# run all tests
node_modules/karma/bin/karma start --single-run

# watch tests while development
node_modules/karma/bin/karma start

# run concrete test
node_modules/karma/bin/karma start

# run integration tests
`npm bin`/bower install
node_modules/karma/bin/karma start karma-itegration.conf.js --single-run
```

## API


### Create instalce of fhir service

To communicate with concrete FHIR server, you should create
instance of api, passing configuration object & adapter object.
Adapters are implemented for concrete frameworks/libs (see below).

```
var cfg = {
  // FHIR server base url
  baseUrl: 'http://myfhirserver.com',
  auth: {
     bearer: 'tocken',
     // OR for basic auth
     user: 'user',
     pass: 'secret'
  }
}

myFhir = fhir(cfg, adapter)

```

### Adapter implementation

### Conformance & Profiles

### Resource's CRUD

To create FHIR resource you call `myFhir.create(entry, callback, errback)` passing entry object,
which contain resource json in content attribute and tags in category attribute.
In case of success in callback function will be passed resulting entry
with following attributes:

* `id` - url of created resource
* `content` - resource json
* `category` - list of tags

```javascript

var entry = {
  category: [{term: 'TAG term', schema: 'TAG schema', label: 'TAG label'}, ...]
  content: {
    resourceType: 'Patient',
    //...
  }
}

myFhir.create(entry,
 function(entry){
    console.log(entry.id)
 },
 function(error){
   console.error(error)
 }
)

```

### Tags Operations

### Search

`fhir.search('Patient', queryObject, callback, errback)` function is used
for [FHIR resource's search](http://www.hl7.org/implement/standards/fhir/search.html).

If success callback will be called with resulting [bundle](http://www.hl7.org/implement/standards/fhir/json.html#bundle).

For queryObject syntax `fhir.js` adopts
mongodb-like query syntax ([see](http://docs.mongodb.org/manual/tutorial/query-documents/)):

```javascript
{name: 'maud'}
//=> name=maud

{name: {$exact: 'maud'}}
//=> name:exact=maud

{name: {$or: ['maud','dave']}}
//=> name=maud,dave

{name: {$and: ['maud',{$exact: 'dave'}]}}
//=> name=maud&name:exact=Dave

{birthDate: {$gt: '1970', $lte: '1980'}}
//=> birthDate=>1970&birthDate=<=1980

{subject: {$type: 'Patient', name: 'maud', birthDate: {$gt: '1970'}}}
//=> subject:Patient.name=maud&subject:Patient.birthDate=>1970

{'subject.name': {$exact: 'maud'}}
//=> subject.name:exact=maud

```

For more information see [tests](https://github.com/FHIR/fhir.js/blob/master/test/querySpec.coffee)

## AngularJS adapter: `ng-fhir`

AngularJS adapter after `grunt build` could be found at `dist/ngFhir.js`


Usage:

```coffeescript
angular.module('app', ['ng-fhir'])
  # configure base url
  .config ($fhirProvider)->
     $fhirProvider.baseUrl = 'http://try-fhirplace.hospital-systems.com'
  .controller 'mainCtrl', ($scope, $fhir)->
     $fhir.search('Patient', {name: {$exact: 'Maud'}})
       .error (error)->
         $scope.error = error
       .success (bundle)->
         $scope.patients = bundle.entry
```

Here jsfiddle to play with [ng-fhir](http://jsfiddle.net/niquola/6Ltgynnf/4/)

## jQuery adapter:

TODO...

## TODO

* bower package
* OAuth2 & Base authorization

## Contribute

Join us by [github issues](https://github.com/FHIR/fhir.js/issues) or pull-requests
