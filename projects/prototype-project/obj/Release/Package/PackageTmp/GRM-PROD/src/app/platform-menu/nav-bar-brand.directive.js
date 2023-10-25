(function() {
	'use strict';

	/* eslint angular/prefer-component: 0 */
	angular
		.module('app.platform')
		.directive('navBarBrand', navBarBrand)
		.controller('navBarBrandController' , navBarBrandController);

	/* @ngInject */
	function navBarBrand() {
		return {
			restrict: 'E',
			templateUrl: 'platform-menu.nav-bar-brand.template.html',
			controller: 'navBarBrandController',
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				animType: '@'
			}
		};
	}

  /* @ngInject */
	function navBarBrandController($rootScope, navBarService) {
		/*jshint validthis:true */
		var vm = this;
		vm.brandConfig = {
			iconClass: '',
			appName: '',
			appInstance: ''
		};

		vm.isMenuOpen = false;

		vm.toggleAppMenu = function() {
			$rootScope.$broadcast('toggle-app-menu');
		};

		var toggleAppMenuListener = $rootScope.$on('toggle-app-menu', function () {
			vm.isMenuOpen = !vm.isMenuOpen;
		});

		var closeAppMenuListener = $rootScope.$on('close-app-menu', function() {
			vm.isMenuOpen = false;
		});

		$rootScope.$on('$destroy', function () {
			toggleAppMenuListener();
			closeAppMenuListener();
		});

		function setBrandConfig(config) {
			vm.brandConfig.iconClass = config.icon;
			vm.brandConfig.appName = config.appName;
      vm.brandConfig.env = config.env;
			vm.brandConfig.appInstance = config.appInstance;
		}

		vm.$onInit = function() {
			navBarService
				.getBrandConfig()
				.then(function(response) {
					setBrandConfig(response);
				});
		};
	}
})();
