(function() {
    var mw = require('./core');

    exports.$WithPatient = mw.$$Simple(function(args){
        if (args.patient) {
            if (args.type === "Patient") {
                args.query = args.query || {};
                args.query["_id"] = args.patient;
                args["id"] = args.patient;
            } else {
                args.query = args.query || {};
                args.query["patient"] = {
                    $type: "Patient",
                    _id: args.patient
                };
            }
        }
        return args;
    });
}).call(this);
