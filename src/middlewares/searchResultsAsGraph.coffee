resolve = require('../resolve')
merge = require('merge')
utils = require('../utils')
ltype = utils.type


wrap = (cfg, search)->

  resourceBoundary = (stack) ->
    res = (acc, val) -> acc ? (if val?.resourceType and val?.contained then val else null)
    stack.reduce(res, null)

  (params) ->
    {type, success, graph} = params
    graphify = (bundle, content)->
      resolveRefs = (value, context) ->
        if value.reference
          mapto = resolve.sync(merge(true, params, {
                  reference:value,
                  bundle:bundle
                  resource: resourceBoundary(context)}))
          mapto?.content ? value
        else value
      utils.postwalk(resolveRefs, content, [])

    graphCb = if graph
                (bundle, status, xhr) ->
                  entries = bundle.entry.map((e)->e.content)
                  success(graphify(bundle, entries))
              else success

    search(merge(true, params, {success: graphCb}))

module.exports = wrap
