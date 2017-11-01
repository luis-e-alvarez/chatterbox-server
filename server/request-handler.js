
var fs = require('fs');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var results = [];
  // See the note below about CORS headers.
  const headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();
  } else if (request.method === 'POST') {
    request.on('data', function (chunk) {
      body = JSON.parse(chunk);
      var date = new Date();
      var id = date.getMilliseconds();
      body.objectId = id;
    });
    request.on('end', function() {
      fs.appendFile('./server/data.json', ('/n' + JSON.stringify(body)));
      response.writeHead(201, headers); 
      console.log(results); 
      response.end(JSON.stringify(body));
    });  
  } else {
    const contents = fs.readFileSync('./server/data.json', 'utf-8');
    // fs.writeFile('./server/data.json', JSON.stringify({username: 'shawndrost',text: 'trololo',roomname: '4chan'}));
    var arrayContents = contents.split('/n');
    arrayContents.forEach(function(item) {
      var jsonContents = JSON.parse(item);
      results.push(jsonContents);
    });
    response.writeHead(200, headers);  
    const responseBody = {headers, results};
    console.log('completed!');
    response.end(JSON.stringify(responseBody));
  }
};


module.exports.requestHandler = requestHandler;

