var http = require('http');
var https = require('https');
var url = require('url');
//var port = 3100;
var port = process.env.PORT || 3100;

var express = require("express");
var app = express();
app.use(express.logger());

//Basic express js proxy
app.get('/', function(request, response) {
   
    var params = url.parse(request.url, true);
    var URL = "https://" + params.query.src;

    var destParams = url.parse(URL);

    var reqOptions = {
        host : destParams.host,
        port : 443,
        path : destParams.pathname,
        method : "GET"
    };

    var req = https.request(reqOptions, function(res) {
        var headers = res.headers;
        headers['Access-Control-Allow-Origin'] = 'http://fogify.herokuapp.com';
        headers['Access-Control-Allow-Headers'] = 'X-Requested-With';
        response.writeHead(200, headers);

        res.on('data', function(chunk) {
            response.write(chunk);
        });

        res.on('end', function() {
            response.end();
        });
    });

    req.on('error', function(e) {
        console.log('An error occured: ' + e.message);
        response.writeHead(503);
        response.write("Error!");
        response.end();
    });	
    req.end();

});


app.listen(port, function() {
  console.log("Listening on " + port);
});

