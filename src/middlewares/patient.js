(function() {
    var mw = require('./core');

    var keyFor = {
        "Observation": "subject",
        "MedicationPrescription": "patient",
        "Encounter": "patient"
        // TO DO: add remaining resource mappings here
    };

    exports.$WithPatient = mw.$$Simple(function(args){
        var type  = args.type;
        var param = keyFor[type];
        if (args.patient) {
            if (param){
                args.query = args.query || {};
                args.query[param] = {
                    $type: "Patient",
                    _id: args.patient
                };
            } else if (type === "Patient") {
                args.query = args.query || {};
                args.query["_id"] = args.patient;
                args["id"] = args.patient;
            }
        }
        return args;
    });
}).call(this);
