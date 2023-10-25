(function () {
	'use strict';

	angular
		.module('app.platform')
		.factory('navBarService', navBarService);

	/* @ngInject */
	function navBarService($q, $timeout, $location, $http, Paths, $rootScope, buildMenuService, AuthenticationManager) {
		var path = Paths.getPlatformApiPath() + 'tenant';
		var authenticated = $q.defer();
		var deferredTenantConfig = $q.defer();
		var isUserAuthenticated = false;

		var openidLoginListener = $rootScope.$on('openid:login_succeeded', function () {
			authenticated.resolve();
		});

		var openidObtainedListener = $rootScope.$on('openid:obtained', function () {
			authenticated.resolve();
		});

		$rootScope.$on('$destroy', function () {
			openidLoginListener();
			openidObtainedListener();
		});

		var service = {
			getTenantConfig: getTenantConfig,
			getBrandConfig: getBrandConfig,
			getUserConfig: getUserConfig,
			getMenuConfig: getMenuConfig
		};

		return service;

		function saveTenant(tenantConfig) {
			deferredTenantConfig.resolve(tenantConfig);
		}

		function getTenant() {
			return deferredTenantConfig.promise;
		}

		function getHost() {
			return (encodeURIComponent($location.host()));
		}

		function getAuthentication() {
			return authenticated.promise;
		}

		function getTenantConfig() {
			var fullPath = path + '/' + getHost();
			return getAuthentication().then(function () {
				return $http
					.get(fullPath)
					.then(onSuccess, onError);
			});
		}

		function getBrandConfig() {
			//Get params from tenant config
			return getTenant().then(function (response) {
				//Manage Brand
				var brand = buildMenuService.setBrand(response, getHost());
				return brand;
			});
		}

		function getUserConfig() {
			var deferred = $q.defer();
			
			getAuthentication().then(function () {
				var user = buildMenuService.getUser();
				deferred.resolve(user);
			});

			return deferred.promise;
		}

		function getMenuConfig() {
			return getTenant().then(function (response) {
				//Manage Menu
				var menu = buildMenuService.setMenu(response, getHost());
				return menu;
			});
		}

		function onSuccess(response) {
			saveTenant(response.data);
			return $q.resolve(response.data);
//			return api.success(response);
		}

		function onError(e) {
			return $q.reject(e);
//			return api.error(e);
		}
	}
})();
