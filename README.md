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

### Conformance & Profiles

### Resource's CRUD

### Tags Operations

### Search

`fhir.search()` function is used for [FHIR resource's search](http://www.hl7.org/implement/standards/fhir/search.html)

```javascript
fhir.search('Patient', queryObject, cb, err)
```

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

## Contribute

Join us by [github issues](https://github.com/FHIR/fhir.js/issues) or pull-requests
