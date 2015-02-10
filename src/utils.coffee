merge = require('merge')

RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

trim = (text)->
  if text? then  (text + "" ).replace(RTRIM, "" ) else ""

exports.trim = trim


addKey = (acc, str)->
  return unless str
  pair = str.split("=").map(trim)
  val = pair[1].replace(/(^"|"$)/g,'')
  acc[pair[0]] = val if val
  acc

type = (obj) ->
    if obj == undefined or obj == null
      return String obj
    classToType =
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regexp',
      '[object Object]': 'object'
    return classToType[Object.prototype.toString.call(obj)]

exports.type = type

assertArray = (a)->
  throw 'not array' unless type(a) == 'array'
  a

exports.assertArray = assertArray

assertObject = (a)->
  throw 'not object' unless type(a) == 'object'
  a

exports.assertObject = assertObject

reduceMap = (m, fn, acc)->
  acc ||= []
  assertObject(m)
  ([k,v] for k,v of m).reduce(fn, acc)

exports.reduceMap = reduceMap


identity = (x)-> x

exports.identity = identity

argsArray = (args...)-> args

exports.argsArray = argsArray

mergeLists = ()->
  reduce = (merged, nextMap) ->
    ret = merge(true, merged)
    for k, v of nextMap
      ret[k] = (ret[k] || []).concat(v)
    ret

  argsArray.apply(null, arguments).reduce(reduce, {})

exports.mergeLists = mergeLists

absoluteUrl = (baseUrl, ref)->
  if (ref.slice(ref, baseUrl.length+1) != baseUrl+"/")
    "#{baseUrl}/#{ref}"
  else
    ref

exports.absoluteUrl = absoluteUrl

relativeUrl = (baseUrl, ref)->
  if (ref.slice(ref, baseUrl.length+1) == baseUrl+"/")
    ref.slice(baseUrl.length+1)
  else
    ref

exports.relativeUrl = relativeUrl

# entry id sometimes id sometimes url
# this method will normalize id to url
exports.resourceIdToUrl = (id, baseUrl, type)->
  baseUrl = baseUrl.replace(/\/$/, '')
  id = id.replace(/^\//, '')
  if id.indexOf('/') < 0
    "#{baseUrl}/#{type}/#{id}"
  else if id.indexOf(baseUrl) != 0
    "#{baseUrl}/#{id}"
  else
    id

walk = (inner, outer, data, context) ->
  switch type(data)
    when 'array'
      outer(data.map((item)->inner(item, [data, context])), context)
    when 'object'
      keysToMap = (acc, [k, v])->
        acc[k] = inner(v, [data].concat(context))
        acc
      remapped = reduceMap(data, keysToMap, {})
      outer(remapped, context)
    else
      outer(data, context)

exports.walk = walk

postwalk = (f, data, context) ->
  if (!data)
    ((data, context)-> postwalk(f, data, context))
  else walk(postwalk(f), f, data, context)

exports.postwalk = postwalk
