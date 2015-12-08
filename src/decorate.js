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
    
    function decorate (client, newAdapter) {
        fhirAPI = client;
        adapter = newAdapter;
        client["drain"] = drain;
        client["fetchAll"] = fetchAll;
        return client;
    }
    
    module.exports = decorate;
}).call(this);