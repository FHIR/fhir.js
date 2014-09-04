module.exports =  {
  "resourceType": "MedicationPrescription",
  "text": {
    "status": "generated",
    "div": "<div>\n      Nizatidine 15 MG/ML Oral Solution [Axid] (rxnorm: 582620)\n    </div>"
  },
  "contained": [
    {
      "resourceType": "Medication",
      "_id": "med",
      "name": "Nizatidine 15 MG/ML Oral Solution [Axid]",
      "code": {
        "coding": [
          {
            "system": "http://rxnav.nlm.nih.gov/REST/rxcui",
            "code": "582620",
            "display": "Nizatidine 15 MG/ML Oral Solution [Axid]"
          }
        ]
      }
    }
  ],
  "status": "active",
  "patient": {
    "reference": "Patient/1032702"
  },
  "medication": {
    "reference": "#med"
  },
  "dosageInstruction": [
    {
      "text": "10 mL bid",
      "timingSchedule": {
        "event": [
          {
            "start": "2008-04-05"
          }
        ],
        "repeat": {
          "frequency": 2,
          "duration": 1,
          "units": "d"
        }
      },
      "doseQuantity": {
        "value": 10,
        "units": "mL",
        "system": "http://unitsofmeasure.org",
        "code": "mL"
      }
    }
  ],
  "dispense": {
    "numberOfRepeatsAllowed": 1,
    "quantity": {
      "value": 1,
      "units": "mL",
      "system": "http://unitsofmeasure.org",
      "code": "mL"
    },
    "expectedSupplyDuration": {
      "value": 30,
      "units": "days",
      "system": "http://unitsofmeasure.org",
      "code": "d"
    }
  }
}
