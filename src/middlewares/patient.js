(function() {
    var keyFor = {
        "Observation": "subject",
        "MedicationPrescription": "patient"
    };

    var withPatient = function(h){
        return function(args){
            var type  = args.type;
            var param = keyFor[type];
            if (args.patient && param){
                args.query = args.query || {};
                args.query[param] = {
                    $type: "Patient",
                    _id: args.patient
                };
            }
            return h(args);
        };
    };

    exports.withPatient = withPatient;
}).call(this);
