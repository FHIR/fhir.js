(function() {
    var mw = require('./core');
    
    var keyFor = [
        "Observation",
        "MedicationPrescription",
        "Encounter"
        // TO DO: add remaining resources with Patient here
    ];

    exports.$WithPatient = mw.$$Simple(function(args){
        var type = args.type;
        if (args.patient) {
            if (type === "Patient") {
                args.query = args.query || {};
                args.query["_id"] = args.patient;
                args["id"] = args.patient;
            } else if (keyFor.indexOf(type) >= 0){
                args.query = args.query || {};
                args.query["patient"] = args.patient;
            }
        }
        return args;
    });
}).call(this);
