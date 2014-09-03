merge = require('merge')

RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

trim = (text)->
  if text? then  (text + "" ).replace(RTRIM, "" ) else ""

exports.trim = trim

tagsToHeader = (tags)->
  (tags || [])
    .filter((i)-> i && trim(i.term))
    .map((i)-> "#{i.term}; scheme=\"#{i.scheme}\"; label=\"#{i.label}\"")
    .join(",")

exports.tagsToHeader = tagsToHeader

addKey = (acc, str)->
  return unless str
  pair = str.split("=").map(trim)
  val = pair[1].replace(/(^"|"$)/g,'')
  acc[pair[0]] = val if val
  acc

headerToTags = (categoryHeader)->
  return [] unless categoryHeader
  categoryHeader.split(',').map (x)->
    parts = trim(x).split(';').map(trim)
    if parts[0]
      acc = {term: parts[0]}
      addKey(acc, parts[1])
      addKey(acc, parts[2])
      acc

exports.headerToTags = headerToTags

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

argsArray = ()->
  ret = []
  for a in arguments
    ret.push a
  ret

exports.argsArray = argsArray

mergeLists = ()->
  reduce = (merged, nextMap) ->
    ret = merge(true, merged)
    for k, v of nextMap
      ret[k] = (ret[k] || []).concat(v)
    ret

  argsArray.apply(null, arguments).reduce(reduce, {})

exports.mergeLists = mergeLists
