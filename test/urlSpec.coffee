subj = require('../src/middlewares/url')
assert = require('assert')

Path = subj.Path;

p = (x)-> console.log(x)
id = (x)-> x
apply = (p,args)-> p.end(id)(args)

describe "Path",->
  it "build path & combine",->

    p0 = Path("BASE")
    p1 = p0.slash(":type")
    p2 = p1.slash(":id")
    p3 = p2.slash("_history")
    p4 = p3.slash(":versionId")

    p5 = p0.slash(":type || :resource.resourceType")

    assert.deepEqual(apply(p0, {}).url, "BASE")
    assert.deepEqual(apply(p1, {type: 'Patient'}).url, "BASE/Patient")
    assert.deepEqual(apply(p2, {type: 'Patient',id: 5}).url, "BASE/Patient/5")
    assert.deepEqual(apply(p3, {type: 'Patient',id: 5}).url, "BASE/Patient/5/_history")
    assert.deepEqual(apply(p4, {type: 'Patient',id: 5, versionId: 6}).url, "BASE/Patient/5/_history/6")
    
    assert.deepEqual(apply(p5, {resource: {resourceType: 'Patient'}}).url, "BASE/Patient")
    assert.deepEqual(apply(p5, {type: 'Patient'}).url, "BASE/Patient")
