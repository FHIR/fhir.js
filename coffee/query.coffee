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

assertArray = (a)->
  throw 'not array' unless type(a) == 'array'
  a
assertObject = (a)->
  throw 'not object' unless type(a) == 'object'
  a

reduceMap = (m, fn, acc)->
  acc ||= []
  assertObject(m)
  ([k,v] for k,v of m).reduce(fn, acc)


identity = (x)-> x

OPERATORS =
  $gt: '>'
  $lt: '<'
  $lte: '<='
  $gte: '>='

MODIFIERS=
  $asc: ':asc'
  $desc: ':desc'
  $exact: ':exact'
  $missing: ':missing'
  $null: ':missing'
  $text: ':text'

isOperator = (v)->
  v.indexOf('$') == 0

expandParam = (k,v)->
  reduceMap v,  (acc, [kk,vv])->
    acc.concat if kk == '$and'
      assertArray(vv)
        .reduce(((a,vvv)-> a.concat(linearizeOne(k,vvv))), [])
    else if kk == '$type'
      []
    else if isOperator(kk)
      o = {param: k}
      if kk == '$or'
        o.value = vv
      else
        o.operator = OPERATORS[kk] if OPERATORS[kk]
        o.modifier = MODIFIERS[kk] if MODIFIERS[kk]
        if type(vv) == 'object' && vv.$or
          o.value = vv.$or
        else
          o.value = [vv]
      [o]
    else
      res = ":#{v.$type}" if v.$type
      linearizeOne("#{k}#{res || ''}.#{kk}", vv)

handleSort = (xs)->
  assertArray(xs)
  for x in xs
    switch type(x)
      when 'array'
        param: '_sort', value: x[0], modifier: ":#{x[1]}"
      when 'string'
        param: '_sort', value: x

handleInclude = (includes)->
  reduceMap includes, (acc, [k,v])->
    acc.concat switch type(v)
      when 'array'
        v.map (x)-> {param: '_include', value: "#{k}.#{x}"}
      when 'string'
        [{param: '_include', value: "#{k}.#{v}"}]

linearizeOne = (k,v)->
  if k == '$sort'
    handleSort(v)
  else if k == '$include'
    handleInclude(v)
  else
    switch type(v)
      when 'object'
        expandParam(k,v)
      when 'string'
        [{param: k, value: [v]}]
      when 'number'
        [{param: k, value: [v]}]
      when 'array'
        [{param: k, value: [v.join("|")]}]
      else throw "could not linearizeParams #{type(v)}"

linearizeParams = (query)->
  reduceMap query, (acc, [k,v])-> acc.concat(linearizeOne(k,v))

buildSearchParams = (query)->
  ps = for p in linearizeParams(query)
   [p.param, p.modifier, '=', p.operator, encodeURIComponent(p.value)]
     .filter(identity).join('')
  ps.join "&"

exports._query = linearizeParams
exports.query = buildSearchParams
