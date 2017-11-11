module.exports = {
  "resourceType": "Bundle",
  "title": "FHIR Atom Feed",
  "id": "BASE/Patient?_count=1",
  "link": [
    {
      "relation": "self",
      "url": "BASE/Patient?_count=1"
    },
    {
      "relation": "next",
      "url": "BASE/Patient?_count=1&_skip=1"
    },
    {
      "relation": "previous",
      "url": "BASE/Patient?_count=1&_skip=1"
    }
  ],
  "totalResults": 58,
  "updated": "2014-09-03T16:12:57.963-07:00",
  "author": [
    {
      "name": "groovy.config.atom.author-name",
      "uri": "groovy.config.atom.author-uri"
    }
  ],
  "entry": [
    {
      "title": "Patient/1032702",
      "id": "BASE/Patient/1032702",
      "updated": "2014-09-03T16:12:57.963-07:00",
      "content": {
        "resourceType": "Patient",
        "text": {
          "status": "generated",
          "div": "<div>\n        \n            <p>Amy Shaw</p>\n      \n          </div>"
        },
        "identifier": [
          {
            "use": "usual",
            "label": "SMART Hospiptal MRN",
            "system": "urn:oid:0.1.2.3.4.5.6.7",
            "value": "1032702"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": [
              "Shaw"
            ],
            "given": [
              "Amy",
              "V."
            ]
          }
        ],
        "telecom": [
          {
            "system": "phone",
            "value": "800-782-6765",
            "use": "mobile"
          },
          {
            "system": "email",
            "value": "amy.shaw@example.com"
          }
        ],
        "gender": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/v3/AdministrativeGender",
              "code": "F",
              "display": "Female"
            }
          ]
        },
        "birthDate": "2007-03-20",
        "address": [
          {
            "use": "home",
            "line": [
              "49 Meadow St"
            ],
            "city": "Mounds",
            "state": "OK",
            "zip": "74047",
            "country": "USA"
          }
        ],
        "active": true
      }
    }
  ]
}
