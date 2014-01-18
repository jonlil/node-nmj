var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Volumes/media/nmj_database/media.db', sqlite3.OPEN_READWRITE, function () {
    console.log(arguments);
});
db.on('error', console.log);
var basePath = '/Volumes/media';
var dbPath = '/nmj_database/media.db';

app['db'] = db;
app.configure(function () {
    this.use(express.favicon());
    this.use(express.cookieParser());
    this.use(express.json());
    this.use(express.urlencoded());
    this.use(express.methodOverride());
    this.use(express.logger('dev'));
	this.use(express.static(__dirname + '/public'));
	this.engine('jade', require('jade').__express);
	this.use(app.router);
});

require('./routes')(app);

app.get('/tables', function (req, res) {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", function () {
        return res.send(200, arguments[1]);
    })
});

app.get('/SHOW_GROUPS_SHOWS', function (req, res, next) {
    db.all('SELECT * FROM SHOW_GROUPS_SHOWS', function (err, groups) {
        return res.send(200, groups);
    });
});

app.get('/table/:name', function (req, res, next) {
    db.all("SELECT * FROM " + req.params.name + " WHERE ID = '13'", function (err, videos) {
        return res.send(200, videos);
    })
})

app.get('/VIDEO_POSTERS', function (req, res, next) {
    
    db.all("SELECT * FROM VIDEO_POSTERS", function (err, shows) {
        if (err) return next(err);
        return res.send(200, shows);
    })
});




app.listen(4000);