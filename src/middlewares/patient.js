(function() {
    var mw = require('./core');

    var keyFor = {
        "Observation": "subject",
        "MedicationPrescription": "patient"
    };

    exports.$WithPatient = mw.$$Simple(function(args){
        var type  = args.type;
        var param = keyFor[type];
        if (args.patient && param){
            args.query = args.query || {};
            args.query[param] = {
                $type: "Patient",
                _id: args.patient
            };
        }
        return args;
    });
}).call(this);
