module.exports = {
    "resourceType": "Bundle",
    "title": "FHIR Atom Feed",
    "id": "BASE/Observation?name=55284-4&_count=1&_include=Observation.related.target",
    "link": [
        {
            "relation": "self",
            "url": "BASE/Observation?name=55284-4&_count=1&_include=Observation.related.target"
        },
        {
            "relation": "next",
            "url": "BASE/Observation?name=55284-4&_include=Observation.related.target&_count=1&_skip=1"
        },
        {
            "relation": "prev",
            "url": "BASE/Observation?name=55284-4&_include=Observation.related.target&_count=1&_skip=1"
        }
    ],
    "totalResults": 925,
    "updated": "2014-09-03T18:50:27.747-07:00",
    "author": [
        {
            "name": "groovy.config.atom.author-name",
            "uri": "groovy.config.atom.author-uri"
        }
    ],
    "entry": [
        {
            "title": "Observation/9574",
            "id": "BASE/Observation/9574",
            "updated": "2014-09-03T18:50:27.747-07:00",
            "content": {
                "resourceType": "Observation",
                "extension": [
                    {
                        "url": "http://fhir-registry.smartplatforms.org/Profile/vital-signs#encounter",
                        "valueResource": {
                            "reference": "Encounter/9558"
                        }
                    }
                ],
                "text": {
                    "status": "generated",
                    "div": "<div>1999-07-02: Blood pressure 109/44 mmHg</div>"
                },
                "name": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": "55284-4",
                            "display": "Blood pressure systolic and diastolic"
                        }
                    ]
                },
                "appliesDateTime": "1999-07-02",
                "status": "final",
                "subject": {
                    "reference": "Patient/1186747"
                },
                "related": [
                    {
                        "type": "has-component",
                        "target": {
                            "reference": "Observation/9572"
                        }
                    },
                    {
                        "type": "has-component",
                        "target": {
                            "reference": "Observation/9573"
                        }
                    }
                ]
            }
        },
        {
            "title": "Observation/9572",
            "id": "BASE/Observation/9572",
            "updated": "2014-09-03T18:50:27.747-07:00",
            "content": {
                "resourceType": "Observation",
                "text": {
                    "status": "generated",
                    "div": "<div>1999-07-02: Systolic blood pressure = 109 mm[Hg]</div>"
                },
                "name": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": "8480-6",
                            "display": "Systolic blood pressure"
                        }
                    ]
                },
                "valueQuantity": {
                    "value": 109,
                    "units": "mm[Hg]",
                    "system": "http://unitsofmeasure.org",
                    "code": "mm[Hg]"
                },
                "appliesDateTime": "1999-07-02",
                "status": "final",
                "subject": {
                    "reference": "Patient/1186747"
                }
            }
        }
    ]
}
