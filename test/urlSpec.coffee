subj = require('../src/middlewares/url')

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

    expect(apply(p0, {}).url).toEqual("BASE")
    expect(apply(p1, {type: 'Patient'}).url).toEqual("BASE/Patient")
    expect(apply(p2, {type: 'Patient',id: 5}).url).toEqual("BASE/Patient/5")
    expect(apply(p3, {type: 'Patient',id: 5}).url).toEqual("BASE/Patient/5/_history")
    expect(apply(p4, {type: 'Patient',id: 5, versionId: 6}).url).toEqual("BASE/Patient/5/_history/6")
    
    expect(apply(p5, {resource: {resourceType: 'Patient'}}).url).toEqual("BASE/Patient")
    expect(apply(p5, {type: 'Patient'}).url).toEqual("BASE/Patient")
