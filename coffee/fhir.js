var adapter = require('./adapter.coffee');
var cfg = require('./configuration.coffee');

var search = require('./search.coffee');
var conf = require('./conformance.coffee');
var tags = require('./tags.coffee');

exports.setAdapter = adapter.setAdapter
exports.configure = cfg.configure
exports.config = cfg.config

exports.search = search.search;
exports.conformance = conf.conformance;
exports.profile = conf.profile;

exports.tags = tags.tags;
exports.affixTags = tags.affixTags;
exports.removeTags = tags.removeTags;
