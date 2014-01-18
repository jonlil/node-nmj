var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');


var config = require('./config/config.json').imageserver;


http.createServer(function (request, response) {
	var uri = url.parse(request.url).pathname
    	, filename = path.join(config.mediaPath, decodeURIComponent(uri));

	fs.stat(filename, function (err, stats) {
		if (err || stats.isDirectory()) {
			console.log(err);
			response.writeHead(404, {"Content-Type": "text/plain"});
  			response.write("404 Not Found\n");
			return response.end();
		}

		var readStream = fs.createReadStream(filename);

		readStream.on('open', function () {
			readStream.pipe(response);
		});

		readStream.on('error', function (err) {
			response.writeHead(500, {"Content-Type": "text/plain"});
        	response.write(err + "\n");
        	return response.end();
    	});

	});

}).listen(config.port);