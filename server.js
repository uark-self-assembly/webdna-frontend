var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

var port = process.env.PORT || 8081;

var app = express();
var distDir = __dirname + "/dist/";
app.use(express.static(path.join(distDir)));
app.use(favicon(__dirname + "/src/favicon.ico"));

var server = app.listen(port, () => {
    var server_port = server.address().port;
    console.log("App now running on port " + server_port);
});
