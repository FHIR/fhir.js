module.exports = {
    "resourceType": "SecurityEvent",
    "event": {
        "type": {
            "coding": [{
                "system": "http://nema.org/dicom/dcid",
                "code": "110114",
                "display": "User Authentication"
            }]
        },
        "subtype": [{
            "coding": [{
                "system": "http://nema.org/dicom/dcid",
                "code": "110122",
                "display": "Login"
            }]
        }],
        "action": "E",
        "dateTime": "2014-09-13T13:48:42Z",
        "outcome": "0"
    },
    "participant": [{
        "userId": "service",
        "network": {
            "identifier": "service",
            "type": "2"
        }
    }],
    "source": {
        "site": "Cloud",
        "identifier": "Health Intersections",
        "type": [{
            "system": "http://hl7.org/fhir/security-source-type",
            "code": "3",
            "display": "Web Server"
        }]
    }
}
