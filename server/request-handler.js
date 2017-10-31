var results = [];

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
    response.write(JSON.stringify(responseBody));
    response.end();
  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();
  } else if (request.method === 'POST') {
    var body = '';
    request.on('data', function (chunk) {
      body = JSON.parse(chunk);
    });
    request.on('end', function() {
      results.push(body);
      response.writeHead(201, headers); 
      console.log(results); 
      response.end(JSON.stringify(body));
    });  
  } else {
    //if the request.method is a get request
  //send back all our data
  //send status code var statusCode = 200;
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
    // response.writeHead(200, headers);
    response.writeHead(200, headers);  
    const responseBody = {headers, results};
    console.log('completed!');
    response.end(JSON.stringify(responseBody));

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  }
};


module.exports.requestHandler = requestHandler;

