var express = require('express');
var app = express();



app['config'] = require('./config/config.json');

var sqlite3 = require('sqlite3').verbose();
app['db'] = new sqlite3.Database(app.config.db, sqlite3.OPEN_READWRITE, function () {
    console.log(arguments);
});

app.configure(function () {
    this.use(function (req, res, next) {
        res.locals.imageserver = app.config.imageserver.hostname + ":" + (app.config.imageserver.port || 80);
        next();
    });

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


app.listen(app.config.webserver.port);