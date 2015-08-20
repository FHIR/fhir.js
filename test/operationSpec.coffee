subj = require('../src/operation')

Operation = subj.Operation;
Path = subj.Path;
Method = subj.Method;
Attribute = subj.Attribute;

p = (x)-> console.log(x)
id = (x)-> x
apply = (p,args)-> p.end(id)(args)

describe "Path",->
  it "build path & combine",->

    p0 = Path("Base")
    p1 = p0.slash(":type")
    p2 = p1.slash(":id")
    p3 = p2.slash("_history")
    p4 = p3.slash((args)-> args.versionId)

    expect(apply(p0, {}).url).toEqual("/Base")
    expect(apply(p1, {type: 'Patient'}).url).toEqual("/Base/Patient")
    expect(apply(p2, {type: 'Patient',id: 5}).url).toEqual("/Base/Patient/5")
    expect(apply(p3, {type: 'Patient',id: 5}).url).toEqual("/Base/Patient/5/_history")
    expect(apply(p4, {type: 'Patient',id: 5, versionId: 6}).url).toEqual("/Base/Patient/5/_history/6")

describe "Operation",->
  it "build path & combine",->

    path = Path("Base").slash(":type").slash(":id")

    GET = Method("GET")
    op = GET.and(path)


    res = apply(op, {type: 'Patient',id: 5})
    expect(res.method).toEqual("GET")
    expect(res.url).toEqual("/Base/Patient/5")

    POST = Method("POST")
    jsonify = Attribute('data',(args)-> JSON.stringify(args.resource))
    typePath = Path("Base").slash(":type")
    xhr = (h)->
      (args)->
        opts  = h(args)
        opts.send = true
        return opts

    create = POST.and(typePath).and(jsonify).and(xhr)
    res = apply(create, {type: 'Patient',resource: {name: "Ivan"}})
    expect(res.method).toEqual("POST")
    expect(res.url).toEqual("/Base/Patient")
    expect(res.send).toEqual(true)
    expect(res.data).toEqual('{"name":"Ivan"}')
