module.exports = function (app) {
	require('./api')(app);

	app.get('/shows/:id/seasons/:season', function (req, res) {
		return res.render('shows/season.jade');
	});

	app.get('/shows/:id', function (req, res) {
		return res.render('shows/show.jade');
	});

	app.get('/', function (req, res, next) {
    	return res.render('index.jade');
	})
};