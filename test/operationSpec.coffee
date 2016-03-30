subj = require('../src/middlewares/core')
url = require('../src/middlewares/url')
assert = require('assert')

Middleware = subj.Middleware;
Path = url.Path;
Method = subj.Method;
Attribute = subj.Attribute;
$$Attr = subj.$$Attr;

p = (x)-> console.log(x)
id = (x)-> x
apply = (p,args)-> p.end(id)(args)

describe "Middleware",->
  it "build path & combine",->

    path = Path("BASE").slash(":type").slash(":id")

    GET = Method("GET")
    op = GET.and(path)


    res = apply(op, {type: 'Patient',id: 5})
    assert.equal(res.method, "GET")
    assert.equal(res.url, "BASE/Patient/5")

    POST = Method("POST")
    jsonify = Attribute('data',(args)-> JSON.stringify(args.resource))
    typePath = Path("BASE").slash(":type")
    xhr = (h)->
      (args)->
        opts  = h(args)
        opts.send = true
        return opts

    create = POST.and(typePath).and(jsonify).and(xhr)
    res = apply(create, {type: 'Patient',resource: {name: "Ivan"}})
    assert.equal(res.method, "POST")
    assert.equal(res.url, "BASE/Patient")
    assert.equal(res.send, true)
    assert.equal(res.data, '{"name":"Ivan"}')

describe "$$Attr",->
  it "create mw",->
    id = (x)-> x
    stack = $$Attr('a', (args)-> "a")
      .and($$Attr('b', "b"))
      .and($$Attr('c.d', (args)-> args.opt + "++"))
      .and($$Attr('c.e', -> "e"))
      .and($$Attr('headers.Content-Type', -> "application/json"))
      .and($$Attr('headers.Auth', -> "basic"))
      .end(id)

    res  = stack({a: "noa", opt: "d"})
    assert.equal(res.a, 'a')
    assert.equal(res.b, 'b')
    assert.equal(res.c.d, 'd++')
    assert.equal(res.c.e, 'e')
