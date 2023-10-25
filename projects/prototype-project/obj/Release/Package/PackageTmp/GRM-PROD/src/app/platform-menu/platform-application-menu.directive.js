(function () {
	'use strict';

	/* eslint angular/prefer-component: 0 */
	angular
		.module('app.platform')
		.directive('platformApplicationMenu', platformApplicationMenu)
		.controller('platformApplicationMenuController', platformApplicationMenuController);

	/* @ngInject */
	function platformApplicationMenu() {
		return {
			restrict: 'E',
			templateUrl: 'platform-menu.platform-application-menu.template.html',
			controller: 'platformApplicationMenuController',
			scope: {
				animType: '@'
			},
			controllerAs: 'vm',
			bindToController: true
		};
	}

	function platformApplicationMenuController($rootScope, $document, $log, navBarService) {
		/*jshint validthis:true */
		var vm = this;
		vm.isMenuOpen = false;
		vm.menuContentVisible = true;
		vm.collapseId = -1;
		vm.menuConfig = {
			domains: []
		};

		//region == Menu behavior ==
		var toggleAppMenuListener = $rootScope.$on('toggle-app-menu', function () {
			vm.isMenuOpen = !vm.isMenuOpen;
			syncAppMenu();
		});

		var closeAppMenuListener = $rootScope.$on('close-app-menu', function () {
			vm.isMenuOpen = false;
			syncAppMenu();
		});

		$rootScope.$on('$destroy', function () {
			toggleAppMenuListener();
			closeAppMenuListener();
		});
		
		vm.closeAppMenu = function () {
			$rootScope.$broadcast('close-app-menu');
		};

		vm.collapseMenu = function (id) {
			vm.collapseId = (vm.collapseId === id) ? -1 : id;
		};

		/**
		 * Synchronizes the application menu state according to `vm.isMenuOpen` value.
		 */
		function syncAppMenu() {

			var overlay = angular.element('#overlay');
			var mainContent = angular.element('main-content');
			if (vm.isMenuOpen) {
				overlay.addClass('active');
				mainContent.addClass('blur-content');
			}
			else {
				overlay.removeClass('active');
				mainContent.removeClass('blur-content');
			}
		}
		//endregion

		//region == Configuration ==
		function setMenuConfig(config) {
			config.domains.forEach(function (domain) {
				vm.menuConfig.domains.push(domain);
			});
			// $log.log(angular.toJson(vm.menuConfig));
		}

		navBarService
			.getMenuConfig()
			.then(function (response) {
				setMenuConfig(response);
			});
		//endregion
	}
}
)();
