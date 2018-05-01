var express = require('express');
var favicon = require('serve-favicon');
var join = require('path').join;
var proxy = require('http-proxy-middleware');
var http = require('http');
var binaryjs = require('binaryjs');
var fs = require('fs');

eval(fs.readFileSync('htmol/local/config.js') + '');

var port = process.env.PORT || 8080;

var app = express();
var distDir = __dirname + "/dist/";
app.use(express.static(join(distDir)));
app.use(favicon(__dirname + "/src/favicon.ico"));

app.use('/static', express.static(join('/htmol/')));
app.use('/api', proxy('http://192.168.0.10:8000/api'));

var server = app.listen(port, () => {
    var server_port = server.address().port;
    console.log("App now running on port " + server_port);
});

var binaryServer = binaryjs.BinaryServer({
    server: server
});

binaryServer.on('connection', client => {
    client.on('stream', (stream, meta) => {
        if (meta.reqsize == true) {
            var path = TRJDIR + meta.fpath;
            fs.exists(path, function (exists) {
                if (exists) {
                    var stats = fs.statSync(path);
                    var fileSizeInBytes = stats["size"];
                    client.send("size" + fileSizeInBytes);
                } else {
                    client.send('error');
                }
            });
        } else {
            var path = TRJDIR + meta.fpath;
            fs.exists(path, function (exists) {
                if (exists) {
                    if (meta.verif == true) {
                        var file = fs.createReadStream(path, {
                            start: 4,
                            end: 7
                        });
                        client.send(file, {
                            natoms: true
                        });
                    } else {
                        var file = fs.createReadStream(path, {
                            start: meta.start,
                            end: meta.end
                        });

                        client.send(file, {
                            natoms: false
                        });
                    }
                } else {
                    client.send('error');
                }
            });
        }
    });
});