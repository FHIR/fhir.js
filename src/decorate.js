(function() {
    var fhirAPI;
    var adapter;

    function getNext (bundle, process) {
        var i;
        var d = bundle.data.entry || [];
        var entries = [];
        for (i = 0; i < d.length; i++) {
            entries.push(d[i].resource);
        }
        process(entries);
        var def = adapter.defer();
        fhirAPI.nextPage({bundle:bundle.data}).then(function (r) {
            getNext(r, process).then(function (t) {
                def.resolve();
            });
        }, function(err) {def.resolve()});
        return def.promise;
    }
    
    function drain (searchParams, process, done, fail) {
        var ret = adapter.defer();
        
        fhirAPI.search(searchParams).then(function(data){
            getNext(data, process).then(function() {
                done();
            }, function(err) {
                fail(err);
            });
        }, function(err) {
            fail(err);
        });
    };
    
    function fetchAll (searchParams){
        var ret = adapter.defer();
        var results = [];
        
        drain(
            searchParams,
            function(entries) {
                entries.forEach(function(entry) {
                    results.push(entry);
                });
            },
            function () {
                ret.resolve(results);
            },
            function (err) {
                ret.reject(err);
            }
        );
          
        return ret.promise;
    };

    function fetchAllWithReferences (searchParams, resolveParams) {
        var ret = adapter.defer();
          
        fhirAPI.search(searchParams)  // TODO: THIS IS NOT CORRECT (need fetchAll, but it does not return a bundle yet)
            .then(function(results){

                var resolvedReferences = {};

                var queue = [function() {ret.resolve(results, resolvedReferences);}];
                
                function enqueue (bundle,resource,reference) {
                  queue.push(function() {resolveReference(bundle,resource,reference)});
                }

                function next() {
                  (queue.pop())();
                }

                function resolveReference (bundle,resource,reference) {
                    var referenceID = reference.reference;
                    fhirAPI.resolve({'bundle': bundle, 'resource': resource, 'reference':reference}).then(function(res){
                      var referencedObject = res.data || res.content;
                      resolvedReferences[referenceID] = referencedObject;
                      next();
                    });
                }

                var bundle = results.data;

                bundle.entry && bundle.entry.forEach(function(element){
                  var resource = element.resource;
                  var type = resource.resourceType;
                  resolveParams && resolveParams.forEach(function(resolveParam){
                    var param = resolveParam.split('.');
                    var targetType = param[0];
                    var targetElement = param[1];
                    var reference = resource[targetElement];
                    if (type === targetType && reference) {
                      var referenceID = reference.reference;
                      if (!resolvedReferences[referenceID]) {
                        enqueue(bundle,resource,reference);
                      }
                    }
                  });
                });

                next();

            }, function(){
                ret.reject("Could not fetch search results");
            });
          
        return ret.promise;
    };
    
    function decorate (client, newAdapter) {
        fhirAPI = client;
        adapter = newAdapter;
        client["drain"] = drain;
        client["fetchAll"] = fetchAll;
        client["fetchAllWithReferences"] = fetchAllWithReferences;
        return client;
    }
    
    module.exports = decorate;
}).call(this);