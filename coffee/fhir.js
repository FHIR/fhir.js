var query = require('./query.coffee');
var tags = require('./tags.coffee');
var search = require('./search.coffee');
var adapter = require('./adapter.coffee');
var cfg = require('./configuration.coffee');

// exports.query = query.query;
// exports._query = query._query;
exports.setAdapter = adapter.setAdapter
exports.configure = cfg.configure
exports.config = cfg.config
// exports.getAdapter = adapter.getAdapter

exports.tags = tags.tags;
exports.affixTags = tags.affixTags;
exports.removeTags = tags.removeTags;
exports.search = search.search;
