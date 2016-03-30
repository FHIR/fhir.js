http = require("http");

responces = {
 "GET /":  {body: "/", status: 200, headers: {"Content-Type": "application/json"}}
 "GET /Patient":  {body: "patients", status: 200, headers: {"Content-Type": "application/json"}}
 notFound: {status: 404, body: "Not found"}
}

server = http.createServer (request, response) ->
  require('fs').readFile 'node_tests/responces.json', 'utf8', (err, data)->
    if (err)
      console.log(err)
      return
    responces = JSON.parse(data);
    defaults = responces._defaults
    key = "#{request.method} #{request.url}"
    resp = responces[key] || {
      body: "#{key} not found"
      status: 404
    }
    console.log(resp)
    response.writeHead(resp.status || defaults.status, resp.headers || defaults.headers)
    response.write((resp.body && JSON.stringify(resp.body)) || "")
    response.end()

server.listen(8976)
