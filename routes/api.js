var async = require('async');

module.exports = function (app) {

	function getShow (id, cb) {
		return app.db.get("SELECT * FROM SHOWS WHERE ID = '" + id+ "'", cb);
	}

	function getSynopsises (id, cb) {
		return app.db.get("SELECT * FROM SYNOPSISES WHERE ID = '" + id+ "'", cb);
	}
	app.get('/api/shows/:id/seasons/:season/episode_id/:episode_id', function (req, res, next) {
		
		async.waterfall([
			function (cb) {
				return app.db.get("SELECT e.*, s.* FROM EPISODES as e \
					INNER JOIN SHOWS as s ON (s.ID = e.EPISODE_ID) \
				 	WHERE e.EPISODE_ID = $episode_id", 
				 	{ $episode_id: req.params.episode_id }, 
				 	function (err, episode) {
						if (err) return cb(err);
						if (!episode) return cb(new Error('No episode found'));
						return cb(null, episode);
					}
				);
			},
			function (episode, cb) {
				return app.db.get('SELECT v.* FROM SHOWS_VIDEOS as sv \
					INNER JOIN VIDEOS AS v ON (v.ID = sv.VIDEOS_ID) \
					WHERE sv.SHOWS_ID = $id', 
					{ $id: episode.EPISODE_ID }, 
					function (err, video) {
						if (err) return cb(err);
						if (!video) return cb(new Error('No video found'));

						return cb(null, episode, video);
					}
				);
			},
			function (episode, video, cb) {
				return app.db.get('SELECT * FROM VIDEO_PROPERTIES WHERE ID = $id', 
					{ $id: video.ID }, 
					function (err, properties){
						video.properties = properties;

						cb(null, { video: video, episode: episode });
					}
				);
			}
		],
		function (err, results) {
			return res.send(200, results);		
		});
	});

	app.put('/api/shows/:id/seasons/:season/episodes/:episode', function (req, res, next) {
		if (req.body.EPISODE != req.params.episode) {
			return res.send(400, {
				error: 'ID\'s must match'
			});
		}
		return app.db.run('UPDATE SHOWS SET SEARCH_TITLE = $search_title, TITLE = $title WHERE ID = $id', {
			$search_title: req.body.SEARCH_TITLE,
			$title: req.body.TITLE,
			$id: req.body.EPISODE_ID
		},
		function (){
			console.log(arguments);
			return res.send(200);
		});
	});

	app.get('/api/shows/:id/seasons/:season', function (req, res, next) {
		async.parallel({
			show: function (cb) {
				return getShow(req.params.id, cb);
			},
			episodes: function (cb) {
				return app.db.all("SELECT e.*,s.*, sy.* FROM EPISODES as e \
					INNER JOIN SHOWS as s ON (s.ID = e.EPISODE_ID) \
					INNER JOIN SYNOPSISES as sy ON (sy.ID = e.EPISODE_ID) \
					WHERE e.SERIES_ID = '" + req.params.id+ "' AND e.SEASON = '" + req.params.season + "' \
					ORDER BY e.EPISODE ", cb);
			}
		}, function (err, results) {
			if (err) return next(err);
			return res.send(200, results);
		})
		
	});

	app.delete('/api/episodes/:id', function (req, res, next) {
		app.db.get('SELECT v.* FROM SHOWS_VIDEOS as sv \
			INNER JOIN VIDEOS AS v ON (v.ID = sv.VIDEOS_ID) \
			WHERE sv.SHOWS_ID = $id', 
			{ $id: req.params.id }, 
			function (err, video) {
				if (err) return next(err);
				if (!video) {
					return res.send(404);
				}		
				console.log(video);
				return res.send(200);
			});
	});

	app.get('/api/shows/:id', function (req, res, next) {
		async.parallel({
			show: function (cb) {
				return getShow(req.params.id, cb);
			},
			synopsises: function (cb) {
				return getSynopsises(req.params.id, cb);
			},
			poster: function (cb) {
				return app.db.get("SELECT * FROM VIDEO_POSTERS WHERE ID = '" + req.params.id+ "'", cb);
			},
			seasons: function (cb) {
				return app.db.all("SELECT SEASON, COUNT(*) as EPISODES, SEASON_ID FROM EPISODES WHERE SERIES_ID = '" + req.params.id+ "' GROUP BY SEASON", cb);
			}
		},
		function (err, results) {
			return res.send(200, results);
		});
	});

	app.get('/api/shows', function (req, res, next) {
	    app.db.all("SELECT s.*,vp.* FROM SHOWS as s INNER JOIN VIDEO_POSTERS as vp ON (vp.id = s.id) WHERE s.TITLE_TYPE = '2' ORDER BY s.TITLE ASC", 
	        function (err, shows) {
	            if (err) return next(err);
	            return res.send(200, shows);
	        }
	    );
	});
};