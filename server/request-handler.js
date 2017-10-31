
var results = [];
var index = 2;
var fs = require('fs');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    const responseBody = {headers, results};
    response.end();
  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();
  } else if (request.method === 'POST') {
    request.on('data', function (chunk) {
      body = JSON.parse(chunk);
      body.objectId = index;
      index++;
    });
    request.on('end', function() {
      results.push(body);
      response.writeHead(201, headers); 
      console.log(results); 
      response.end(JSON.stringify(body));
    });  
  } else {
    response.writeHead(200, headers);  
    const responseBody = {headers, results};
    console.log('completed!');
    response.end(JSON.stringify(responseBody));

  }
};


module.exports.requestHandler = requestHandler;

