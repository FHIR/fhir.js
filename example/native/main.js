const Fhir = require('../../src/adapters/native');
var client = Fhir({
  baseUrl: 'http://localhost:8888'
});

function getName(r) {
  let name = '';
  if (r.name && r.name.length > 0) {
    if (r.name[0].given && r.name[0].given.length > 0) {
      name += `${r.name[0].given[0]} `;
    }
    if (r.name[0].family) {
      name += r.name[0].family;
    }
  }

  return name;
}

window.getPatients = function (page = 1, limit = 5) {
  const pDoc = document.querySelector('#pagination');
  const ptDoc = document.querySelector('#patients');
  client.search({
    type: 'Patient',
    query: {
      _count: limit,
      _page: page,
      $include: {
        RelatedPerson: "patient"
      }
    }
  })
    .then((res) => {
      const bundle = res.data;
      ptDoc.innerHTML = '';
      bundle.entry.forEach((patient) => {
        const name = getName(patient.resource);
        const li = document.createElement('li');
        li.innerText = name;
        ptDoc.appendChild(li)
      });
      pDoc.innerHTML = `Page: ${page}<br>${limit} of ${bundle.total}`;
    })
    .catch((err) => {
      ptDoc.innerHTML = '';
      pDoc.innerHTML = 'Error';
      // Error responses
      if (err.status) {
        console.log(err);
        console.log('Error', err.status);
      }
      // Errors
      if (err.data && err.data) {
        console.log('Error', err.data);
      }
    });
}
