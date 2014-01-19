var app = angular.module('NMJBrowser', []);

app.controller('MainIndexController', [
	'$scope',
	'$http',

	function ($scope, $http) {
		$http.get('/api/shows')
			.success(function (data) {

				$scope.objects = data;
			})
	}
])

.controller('ShowController', [
	'$scope',
	'$http',

	function ($scope, $http) {
		$http.get('/api/shows/' + window.location.href.split('/').slice(-1))
			.success(function (data) {
				$scope.object = data;
			})
	}
])

.controller('EpisodeController', [
	'$scope',
	'$http',

	function ($scope, $http) {
		
		var url = '/api' + window.location.pathname;

		$http.get(url)
			.success(function (data) {
				$scope.object = data;
			});

		$scope['delete'] = function (episode_id) {
			$http.delete('/api/episodes/' + episode_id)
				.success(function (data) {

				});
		};
	}
])

.controller('ShowSeasonController', [
	'$scope',
	'$http',
	'$location',

	function ($scope, $http, $location) {
		var parts = window.location.pathname.split('/');
		var url = '/api/shows/' + parts.slice(-3)[0] + '/seasons/' + parts.slice(-1)[0];

		$http.get(url)
			.success(function (data) {
				$scope.object = data;
			});

		$scope.updateEpisode = function (episode) {
			episode.SEARCH_TITLE = episode.TITLE;
			$http.put(url + '/episodes/' + episode.EPISODE, episode)
				.success(function () {
					console.log(arguments);
				})
				.error(function () {
					console.log(arguments);
				});
		};
	}
]);