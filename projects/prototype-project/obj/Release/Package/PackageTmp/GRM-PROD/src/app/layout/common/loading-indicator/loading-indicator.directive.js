(
  function() {
    'use strict';

    angular
      .module('app.layout.common.loading-indicator')
      .directive('loadingIndicator', loadingIndicator);

    /* @ngInject */
    function loadingIndicator($parse, $timeout, $compile, $log) {
      var cdo = {
        restrict: 'A',
        priority: 0,
        scope: {
          loadingIndicator: '=',
          loadingIndicatorRunning: '=',
        },
        link: LoadingIndicatorLink
      };

      function LoadingIndicatorLink(scope, element, attrs) {
        var cfg = {
          loadingTemplate: '<span class="btn-spinner"></span>',
          loadingClass: 'btn-spinner-is-loading',
          completedClass: 'btn-spinner-is-completed'
        };
        var promiseWatcher;        
        var promiseDone;

        if (_.isNil(attrs.loadingIndicator)) {
          $log.error('loading-indicator : promise must be provided.');
        }

        //Handles everything to be triggered when the button is set to loading state.
        function initLoadingState(btnEl) {
          if (attrs.loadingIndicatorRunning) {
            scope.loadingIndicatorRunning = true;
          }
          btnEl.addClass(cfg.loadingClass);         
        }

        //Handles everything to be triggered when loading is finished
        function handleLoadingFinished(btnEl) {
          if (promiseDone) {
            btnEl.addClass(cfg.completedClass);
            $timeout(function() {
                btnEl.removeClass(cfg.completedClass);
                btnEl.removeClass(cfg.loadingClass);
                if (attrs.loadingIndicatorRunning) {
                  scope.loadingIndicatorRunning = false;
                }            
              },
              500);
          }
        }

        //Initializes a watcher for the promise.
        function initPromiseWatcher(watchExpressionForPromise, btnEl) {
          // watch promise to resolve or fail
          scope.$watch(watchExpressionForPromise,
            function (mVal) {
              if (scope.loadingIndicatorRunning) {
                $log.error('loading-indicator : use ng-disabled or manage-field-state to disabled the control.');
                return;
              }

              promiseDone = false;

              // for regular promises
              if (mVal && mVal.then) {
                initLoadingState(btnEl);
                mVal.finally(function() {
                  promiseDone = true;
                  handleLoadingFinished(btnEl);
                });
              }
              // for $resource
              else if (mVal && mVal.$promise) {
                initLoadingState(btnEl);
                mVal.$promise.finally(function() {
                  promiseDone = true;
                  handleLoadingFinished(btnEl);
                });
              }
            });
        }

        //Compile and append the spinner template to the button.
        function appendSpinnerTemplate(btnEl) {
          btnEl.append($compile(cfg.loadingTemplate)(scope));
        }

        appendSpinnerTemplate(element);
        // handle promise passed directly via attribute as variable
        initPromiseWatcher(function() { return scope.loadingIndicator; }, element);

        // cleanup
        scope.$on('$destroy',
          function() {
            $timeout.cancel(0);
          });
      }

      return cdo;
    }

  }
)();
