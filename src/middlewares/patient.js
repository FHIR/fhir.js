(function() {
    var mw = require('./core');

    // List of resources with 'patient' or 'subject' properties (as of FHIR DSTU2 1.0.0)
    var targets = [
        "Account",
        "AllergyIntolerance",
        "BodySite",
        "CarePlan",
        "Claim",
        "ClinicalImpression",
        "Communication",
        "CommunicationRequest",
        "Composition",
        "Condition",
        "Contract",
        "DetectedIssue",
        "Device",
        "DeviceUseRequest",
        "DeviceUseStatement",
        "DiagnosticOrder",
        "DiagnosticReport",
        "DocumentManifest",
        "DocumentReference",
        "Encounter",
        "EnrollmentRequest",
        "EpisodeOfCare",
        "FamilyMemberHistory",
        "Flag",
        "Goal",
        "ImagingObjectSelection",
        "ImagingStudy",
        "Immunization",
        "ImmunizationRecommendation",
        "List",
        "Media",
        "MedicationAdministration",
        "MedicationDispense",
        "MedicationOrder",
        "MedicationStatement",
        "NutritionOrder",
        "Observation",
        "Order",
        "Procedure",
        "ProcedureRequest",
        "QuestionnaireResponse",
        "ReferralRequest",
        "RelatedPerson",
        "RiskAssessment",
        "Specimen",
        "SupplyDelivery",
        "SupplyRequest",
        "VisionPrescription"
    ];

    exports.$WithPatient = mw.$$Simple(function(args){
        var type = args.type;
        if (args.patient) {
            if (type === "Patient") {
                args.query = args.query || {};
                args.query["_id"] = args.patient;
                args["id"] = args.patient;
            } else if (targets.indexOf(type) >= 0){
                args.query = args.query || {};
                args.query["patient"] = args.patient;
            }
        }
        return args;
    });
}).call(this);
