const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var fileA, jsonA;
var memoryDataJSON = [];

//### Configurable port
const port = fs.readFileSync('./data/port.txt', 'utf8');
if (!(port > 0) || !(port < 65536)) {
    port = 3456;
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

//### Starting server using express;
app.listen(port, function () {
    console.log('Listening on port: ' + port);
    //### GET /file-a endpoint - part 1
    fs.readFile('data/files/file-a.txt', function (err, data) {
        fileA = data;
        // console.log('Have fileA in a memory. Total heap memory used: ' + process.memoryUsage().heapUsed);
    });

    //### GET /json-a endpoint - part 1
    fs.readFile('data/files/json-a.json', function (err, data) {
        jsonA = data;
        // console.log('Have jsonA in a memory. Total heap memory used: ' + process.memoryUsage().heapUsed);
    });
});

//### GET /test;
app.get('/test', function (req, res) {
    var testJSON = {
        test: {
            ok: true
        }
    };
    res.send(testJSON);
    console.log('Sent test as response.')
});

//### GET /file-a endpoint - part 2
app.get('/file-a', function (req, res) {
    res.send(fileA);
    console.log('Sent fileA as response.')
});

//### GET /json-a endpoint - part 2
app.get('/json-a', function (req, res) {
    res.json(JSON.parse(jsonA));
    console.log('Sent jsonA as response.')
});

//### GET /file-b endpoint
app.get('/file-b', function (req, res) {
    var fileB = fs.readFileSync('data/files/file-b.txt', 'utf-8')
    res.send(fileB);
    // console.log('Sent fileB as response. Total heap memory used: ' + process.memoryUsage().heapUsed);
});

//### GET /json-b endpoint
app.get('/json-b', function (req, res) {
    var jsonB = fs.readFileSync('data/files/json-b.json')
    res.json(JSON.parse(jsonB));
    // console.log('Sent jsonB as response. Total heap memory used: ' + process.memoryUsage().heapUsed);
});

//### GET /file endpoint
app.get('/file/:file', function (req, res) {
    try {
        var fileParams = fs.readFileSync('data/files/' + req.params.file + '.txt', 'utf-8');
        res.send(fileParams);
    } catch (err) {
        console.log(err);
        res.send(404);
    };
});

//### GET /size endpoint
app.get('/size/:file', function (req, res) {
    try {
        var sizeParams = fs.statSync('data/files/' + req.params.file + '.txt').size.toString();
        var jsonSize = {
            "size": sizeParams
        };
        res.send(jsonSize);
    } catch (err) {
        console.log(err);
        res.send(404);
    };
});

//### GET /filenames endpoint
app.get('/filenames', function (req, res) {
    var fileArray = [];
    fs.readdirSync(__dirname + '/data/files').forEach(function (file) {
        fileArray.push({
            "name": file
        });
    })
    res.send(fileArray);
});

//### GET /sizes endpoint
//Have no idea how to get data from those HTTP requests.
app.get('/sizes', function (req, res) {
    var fileNamesUrl = req.protocol + '://' + req.get('host') + '/filenames';
    var fileSizeUrl = req.protocol + '://' + req.get('host') + '/size';

    console.log(fileNamesUrl);
    console.log(fileSizeUrl);
});

//### GET /txt
app.get('/txt', function (req, res) {
    var textString = '';
    fs.readdirSync(__dirname + '/data/files').forEach(function (file) {
        if (path.extname(file) === ".txt") {
            var text = fs.readFileSync(__dirname + '/data/files/' + file, 'utf-8');
            textString += text;
        }
    });
    res.send(textString);
});


//### GET /strings
//No idea how to do it.

//### PUT /data/{id}
//Had very many issues with this one. I think, I've used PUT method badly. I'm iterating and updating if needed ( O(n) ) if not in array, i'm adding new json object.
//I've assumed my JSON object build is constant - used second key as not changable in my code.
app.put('/data/:id', function (req, res) {
    try {
        var isInArray = false;
        memoryDataJSON.map(function (data) {
            if (data.id == req.params.id) {
                isInArray = true;
                data.name = req.body.name;
                console.log("Object changed");
            }
        });
        if (!isInArray) {
            var name = req.body.name;
            memoryDataJSON.push({ id: parseInt(req.params.id), name });
            console.log('Object added');
        }
        res.send({ "ok": true });
    } catch (err) {
        res.send({ "error": true });
    }
    console.log(JSON.stringify(memoryDataJSON));
});

//### GET /data/{id}
app.get('/data/:id', function (req, res) {
    var isInArray = false;
    memoryDataJSON.forEach(function (data) {
        if (data.id == req.params.id) {
            res.send(JSON.stringify(data));
            isInArray = true;
            console.log('Object sent');
        }
    });
    if (!isInArray) {
        res.send({ "error": true })
    }
});

//### DELETE /data/{id}
app.delete('/data/:id', function (req, res) {
    var isInArray = false;
    for (var i = 0; i < memoryDataJSON.length; i++) {
        if (memoryDataJSON[i].id == req.params.id) {
            res.send({ "ok": true });
            memoryDataJSON.splice(i, 1);
            isInArray = true;
            console.log("Object removed");
        }
    }
    if (!isInArray) {
        res.send({ "error": true });
    }
});

//### GET /linked/callback
//Tried to do everything async - res.send when finished.
app.get('/linked/callback', function (req, res, callback) {
    var jsonArray = [];
    fs.readdir(__dirname + '/data/linked/names/', function (err, fileNames) {
        if (err) {
            console.log(err);
            throw err;
        };
        fileNames.forEach(function (filename) {
            fs.readFile(__dirname + '/data/linked/names/' + filename, 'utf-8', function (err, content) {
                if (err) {
                    console.log(err);
                    throw err;
                };

                //I have changed files data in names dir. They've got 2 rows, had errors, just deleted empty row.
                fs.readFile(__dirname + '/data/linked/values/' + content + '.txt', 'utf-8', function (err, values) {
                    if (err) {
                        console.log(err);
                        throw err;
                    };
                    jsonArray.push({ name: filename, id: content, value: values })

                    if (jsonArray.length === fileNames.length) {
                        res.send(jsonArray);
                    };
                });
            });
        });
    });
});

//### GET /linked/promise

//### GET /linked/await

//### Tests