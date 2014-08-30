var adapter = require('./adapter.coffee');
var cfg = require('./configuration.coffee');
var http = require('./http.coffee');
var search = require('./search.coffee');
var conf = require('./conformance.coffee');
var tran = require('./transaction.coffee');
var tags = require('./tags.coffee');

function fhir(){

  if (!(this instanceof arguments.callee)) {
    return new arguments.callee();
  }
  

  var _ = this._ = {
    config: new cfg(this),
    search: new search(this),
    conformance: new conf(this),
    transaction: new tran(this),
    adapter: new adapter(this),
    http: new http(this),
    tags: tags
  };

  this.adapter = _.adapter;
  this.config = _.config;
  this.http = _.http;
  this.conformance = _.conformance.conformance;
  this.profile = _.conformance.profile;
  this.search = _.search.search;
  this.transaction = _.transaction.transaction;
  this.tags = _.tags.tags;
  this.affixTags = _.tags.affixTags;
  this.removeTags = _.tags.removeTags;
};
module.exports = fhir;

