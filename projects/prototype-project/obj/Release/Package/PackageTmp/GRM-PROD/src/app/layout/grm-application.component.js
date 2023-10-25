(
  function() {
    'use strict';

    angular
      .module('app.layout')
      .component('grmApplication', grmApplication())
    ;

    function grmApplication() {
      var cdo = {
        templateUrl: 'grm-application.template.html',
        controller: GrmApplicationController
      };

      return cdo;
    }

    /* @ngInject */
    function GrmApplicationController(
        $document,
        $scope,
        Cultures,
        Paths,
        NavigationService,
        NotificationService,
        PopupService,
        SideMenuService,
        tmhDynamicLocale,
        Translate,
        VersionService,
        UserProfileService
    ) {

      var ctrl = this;

      ctrl.$onInit = function onInit() {
        ctrl.isLoading = false;
        ctrl.isInitialized = false;
        ctrl.isInitializing = false;
        ctrl.initializingProgress = 0;
        ctrl.sideMenuExpanded = false;
        ctrl.showModules = false;
      };

      ctrl.onLanguageChange = function onLanguageChange(localeId) {
        tmhDynamicLocale
          .set(localeId)
          .then(
            function success(response) {
              return Cultures.ensureLocale(localeId);
            }
          )
          .then(
            function success(response) {
              return Translate.use(localeId);
            }
          )
          .then(
            function success(response) {
              return NavigationService.switchCurrentRouteLanguage(localeId);
            }
          )
          .then(
            function success(response) {
              // Success - nothing to handle
            },
            function failure(reason) {
              NotificationService.error({ messageOrKey: reason, translate: false });
            }
          )
        ;
      };

      ctrl.onToggleSideMenu = function onToggleSideMenu($event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        ctrl.sideMenuExpanded = !ctrl.sideMenuExpanded;
      };

      ctrl.getLegacyUrl = function getLegacyUrl() {
        // Basic URL
        var legacyUrl = Paths.getGrmLegacyPath() + '_' + Translate.instant('grmLegacyMenuLinkLocalized');

        // User ID for simulating single sign on...
        legacyUrl += '&otherparams=p_rfrequer=' + UserProfileService.getCurrentProfile().id;

        return legacyUrl;
      };

      ctrl.linkFactory = function linkFactory(obj) {
        if (obj && obj.link) {
          var res;

          switch (obj.link) {
            case 'grmLegacy': {
              res = ctrl.getLegacyUrl();
              break;
            }
            default:
              res = '';
              break;
          }

          return res;
        }
      };

      ctrl.onShowVersion = function onShowVersion($event) {
        if ($event) {
          $event.preventDefault();
        }
        var modalInstance = PopupService.popup({
          templateUrl: 'version-info.html',
          backdrop: 'static',
          controller: /* @ngInject */function ($scope, $uibModalInstance, data, TraceService) {
            $scope.data = data;

            $scope.onClose = function() {
              $uibModalInstance.close($scope.model);
            };

            $scope.tracingEnabled = function tracingEnabled() {
              return TraceService.isTracingEnabled();
            };
            
            $scope.tracingDisabled = function tracingDisabled() {
              return TraceService.isTracingDisabled();
            };

            $scope.onStartTracing = function onStartTracing() {
              TraceService.enableTracing();
            };

            $scope.onStopTracing = function onStopTracing() {
              TraceService.disableTracing();
            };

          },
          resolve: {
            data: function() {
              return {
                apiVersion: VersionService.versionInformation.apiVersion,
                databaseVersion: VersionService.versionInformation.databaseVersion,
                databaseFixNumber: VersionService.versionInformation.databaseFixNumber,
                databaseName: VersionService.versionInformation.databaseName,
                webApplicationVersion: VersionService.versionInformation.webApplicationVersion
              };
            }
          }
        });
      };

      ctrl.onContextualAction = function onContextualAction(obj) {
        if (obj && obj.action) {
          $scope.$broadcast(obj.action);
        }
      };

      $scope.$on('appInitializationStarted', function(event, args) {
        if (args.blockUI) {
          angular.element($document[0].body).removeClass('with-pointer-events').addClass('without-pointer-events');
        }
        ctrl.initializingProgress = 0;
        ctrl.isInitializing = true;
      });

      $scope.$on('appInitializationProgress', function(event, args) {
        if (args.value) {
          ctrl.initializingProgress = args.value;
        }
      });

      $scope.$on('appInitializationFinished', function(event, args) {
        if (args.blockUI) {
          angular.element($document[0].body).removeClass('without-pointer-events').addClass('with-pointer-events');
        }
        ctrl.isInitializing = false;
        ctrl.isInitialized = args.initialized;
      });

      $scope.$on('loadingStarted', function(event, args) {
        if (args.blockUI) {
          angular.element($document[0].body).removeClass('with-pointer-events').addClass('without-pointer-events');
        }
        if (args.showSpinner) {
          ctrl.isLoading = true;
        }
      });

      $scope.$on('loadingFinished', function(event, args) {
        if (args.blockUI) {
          angular.element($document[0].body).removeClass('without-pointer-events').addClass('with-pointer-events');
        }
        ctrl.isLoading = false;
      });
    }
  }
)();
