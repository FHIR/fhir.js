jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

describe "linearizeParams:", ->
  it "simplest", (done) ->
    xmlhttp=new XMLHttpRequest()
    xmlhttp.open("GET", 'http://try-fhirplace.hospital-systems.com/Profile/Patient', true)
    console.log(xmlhttp.toString())
    xmlhttp.onreadystatechange = ()->
      console.log('state change', xmlhttp)
      if xmlhttp.readyState==4
       console.log(xmlhttp.responseText)
       done()
    xmlhttp.send()
    setTimeout(done, 5000)
