(
  function() {
    'use strict';

    angular
      .module('app.states')
      .provider('StatesInitializer', StatesInitializerProvider);

    /* @ngInject */
    function StatesInitializerProvider($stateProvider, $urlRouterProvider, SideMenuServiceProvider) {
      var provider = this;

      // Define required $get function on provider
      this.$get = angular.noop;

      // Main initialization function
      this.initialize = function initialize() {

        //
        // An array for top level application states - top level states
        // are used to define the application navigation menu items
        //
        var topLevelStates = [];

        //
        // An array containing all defined application states
        //
        var states = [];

        //
        // The locale id regex definition
        //
        var localeRegex = '{localeId:[a-z]{2}-[a-z]{2}|[a-z]{2}}';

        //
        // The default route url - targets root context
        //
        var defaultUrl = '/';

        //
        // Define state template objects
        //
        var defaultState = {
          name: 'default',
          url: '/' + localeRegex,
          params: {
            localeId: { value: null, squash: true }
          },
          redirectTo: '',
          redirectParams: {
            clearState: true
          }
        };
        var errorState = {
          name: 'error',
          url: '/' + localeRegex + '/error',
          params: {
            localeId: /*@ngInject*/ function (Cultures) {
              return Cultures.getCurrentCultureLanguageIdLowerCase();
            },
            error: { value: undefined, squash: true }
          },
          views: {
            'facet-view-container@': {
              templateUrl: 'error.template.html',
              controller: ErrorStateController,
              controllerAs: 'ctrl',
            }
          }
        };

        var trace = {
          name: 'traceOn',
          url: '/trace',
          resolve: rootResolvers(),
          restricted: true,
          tracing: true
        };

        //
        // Define a "home" state - distinguish from the default state by the fact that this is
        // intended to be invoked once the user is logged in and the application is fully initialized
        //
        // Used in the breadcrumbs implementation
        //
        var home = {
          name: 'home',
          url: '/' + localeRegex,
          params: {
            localeId: {
              value: /* @ngInject */function(Cultures) {
                return Cultures.getCurrentCultureLanguageIdLowerCase();
              }
            }
          },
          redirectTo: '',
          redirectParams: {
            statusGroup: 'toBeProcessed',
          }
        };
        var root = {
          name: 'root',
          abstract: true,
          // root state needs to resolve authentication and app. data initialization.
          resolve: rootResolvers(),
          url: '/' + localeRegex,
          params: {
            localeId: {value: null, squash: true}
          },
          views: {
            // application menu
            'side-menu-view-container': {
              templateUrl: 'application-navigation.template.html'
            },
            // application breadcrumbs
            'application-breadcrumbs-view-container': {
              templateUrl: 'application-breadcrumbs.template.html'
            },
            // application static actions
            'application-static-actions-view-container': {
              templateUrl: 'application-static-actions.template.html'
            }
          }
        };
        var requisitionFollowUps = {
          name: '.requisition-follow-up',
          url: '/requisition-follow-up?requesterId&statusGroup&status',
          params: {
            clearState: {
              value: false,
              squash: true
            },
            // statusGroup: {
            //   value: 'ToBeProcessed',
            //   squash: true
            // }
          },
          restricted: true,
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-follow-up-contextual-action-bar.template.html'
            },
            'facet-view-container@': {
              template: '<requisition-follow-up state-change-handler="$ctrl.onStateChange(obj)" state-model="$ctrl.getStateModel()"></requisition-follow-up>',
              controller: /* @ngInject */function RequisitionFollowUpStateController($scope, RequisitionFollowUpStateHelper) {
                RequisitionFollowUpStateHelper.initialize($scope);
              }
            },
            'right-side-menu@{stateName}': {
              templateUrl: 'requisition-follow-up-filter-criteria.template.html'
            }
          },
          data: {
            label: '{{ "requisitionFollowUp" | translate }}'
          },
          sideMenu: {
            label: 'requisitionFollowUp',
            icon: 'side-menu-icon-requisition-follow-up'
          }
        };
        var requisitionSearch = {
          name: '.requisition-search',
          url: '/requisition-search',
          params: {
            clearState: {
              value: false,
              squash: true
            }
          },
          restricted: true,
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-search-contextual-action-bar.template.html'
            },
            'facet-view-container@': {
              templateUrl: 'requisition-search.template.html',
              controller: /* @ngInject */function RequisitionSearchStateController($scope, RequisitionSearchStateHelper) {
                RequisitionSearchStateHelper.initialize($scope);
              },
            },
            'layout@{stateName}': {
              templateUrl: 'layout-horizontal-33-66.template.html'
            },
            'left-section@{stateName}': {
              templateUrl: 'requisition-search-left.template.html'
            },
            'right-section@{stateName}': {
              templateUrl: 'requisition-search-right.template.html'
            }
          },
          data: {
            label: '{{ "searchRequisitions" | translate }}'
          },
          sideMenu: {
            label: 'searchRequisitions',
            icon: 'side-menu-icon-requisition-search'
          }
        };
        var requisitionTemplateSearch = {
          name: '.requisition-template-search',
          url: '/requisition-template-search',
          params: {
            clearState: {
              value: false,
              squash: true
            }
          },
          restricted: true,
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-template-search-contextual-action-bar.template.html'
            },
            'facet-view-container@' : {
              templateUrl: 'requisition-template-search.template.html',
              controller: /* @ngInject */function RequisitionTemplateSearchStateController($scope, RequisitionTemplateSearchStateHelper) {
                RequisitionTemplateSearchStateHelper.initialize($scope);
              },
            },
            'layout@{stateName}': {
              templateUrl: 'layout-horizontal-33-66.template.html'
            },
            'left-section@{stateName}': {
              templateUrl: 'requisition-template-search-left.template.html'
            },
            'right-section@{stateName}': {
              templateUrl: 'requisition-template-search-right.template.html'
            }
          },
          data: {
            label: '{{ "searchRequisitionTemplates" | translate }}'
          },
          sideMenu: {
            label: 'searchRequisitionTemplates',
            icon: 'side-menu-icon-requisition-template-search'
          }
        };
        var requisition = {
          name: '.requisition',
          url: '/requisition',
          abstract: true,
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-contextual-action-bar.template.html'
            },
            'facet-view-container@': {
              templateUrl: 'requisition.template.html',
              controller: /* @ngInject */function RequisitionStateController($scope, RequisitionStateHelper) {
                RequisitionStateHelper.initialize($scope);
              },
            },
            'layout@{stateName}': {
              templateUrl: 'layout-horizontal-33-66.template.html'
            },
            'left-section@{stateName}': {
              templateUrl: 'requisition-left.template.html'
            },
            'right-section@{stateName}': {
              templateUrl: 'requisition-right.template.html'
            }
          }
        };
        var requisitionCreate = {
          name: '.create',
          url: '/create',
          restricted: true,
          onEnter: /* @ngInject */function onEnter($stateParams, RequisitionStateHelper) {
            RequisitionStateHelper.reset(true, $stateParams);
          },
          data: {
            label: '{{ "requisition" | translate }} [{{ "newFeminine" | translate }}]'
          }
        };
        var requisitionUpdate = {
          name: '.update',
          url: '/update?id&iid',
          params: {
            uncataloguedProductSavedValues: {
              value: undefined,
              squash: true
            }
          },
          restricted: true,
          onEnter: /* @ngInject */function onEnter($stateParams, RequisitionStateHelper) {
            RequisitionStateHelper.reset(false, $stateParams);
          },
          resolve: {
            requisitionId: /* @ngInject */function($stateParams) {
              return $stateParams.id;
            }
          },
          data: {
            label: '{{ "requisition" | translate }} [{{ requisitionId }}]'
          }
        };
        var requisitionTemplate = {
          name: '.requisition-template',
          abstract: true,
          url: '/requisition-template',
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-template-contextual-action-bar.template.html'
            },
            'facet-view-container@': {
              templateUrl: 'requisition-template.template.html',
              controller: /* @ngInject */function RequisitionTemplateStateController($scope, RequisitionTemplateStateHelper) {
                RequisitionTemplateStateHelper.initialize($scope);
              },
            },
            'layout@{stateName}': {
              templateUrl: 'layout-horizontal-33-66.template.html'
            },
            'left-section@{stateName}': {
              templateUrl: 'requisition-template-left.template.html'
            },
            'right-section@{stateName}': {
              templateUrl: 'requisition-template-right.template.html'
            }
          }
        };
        var requisitionTemplateCreate = {
          name: '.create',
          url: '/create',
          restricted: true,
          onEnter: /* @ngInject */function onEnter($stateParams, RequisitionTemplateStateHelper) {
            RequisitionTemplateStateHelper.reset(true, $stateParams);
          },
          data: {
            label: '{{ "requisitionTemplate" | translate }} [{{ "newMasculine" | translate }}]'
          }
        };
        var requisitionTemplateUpdate = {
          name: '.update',
          url: '/update?id&iid',
          restricted: true,
          onEnter: /* @ngInject */function onEnter($stateParams, RequisitionTemplateStateHelper) {
            RequisitionTemplateStateHelper.reset(false, $stateParams);
          },
          resolve: {
            requisitionTemplateId: /* @ngInject */function($stateParams) {
              return $stateParams.id;
            }
          },
          data: {
            label: '{{ "requisitionTemplate" | translate }} [{{ requisitionTemplateId }}]'
          }
        };
        var requisitionAuthorization = {
          name: '.requisition-authorization',
          url: '/requisition-authorization?amountRangeId',
          params: {
            clearState: {
              value: false,
              squash: true
            }
          },
          restricted: true,
          views: {
            'application-contextual-actions-view-container@': {
              templateUrl: 'requisition-authorization-contextual-action-bar.template.html'
            },
            'facet-view-container@': {
              templateUrl: 'requisition-authorization.template.html',
              controller: /* @ngInject */function RequisitionAuthorizationStateController($scope, RequisitionAuthorizationStateHelper) {
                RequisitionAuthorizationStateHelper.initialize($scope);
              }
            },
            'right-side-menu@{stateName}': {
              templateUrl: 'requisition-authorization-filter-criteria.template.html'
            }
          },
          data: {
            label: '{{ "authorizeRequisitions" | translate }}'
          },
          sideMenu: {
            label: 'authorizeRequisitions',
            icon: 'side-menu-icon-requisition-authorization'
          }
        };
        var productSearch = {
          name: '.product-search',
          url: '/product-search',
          params: {
            productParamModel: undefined
          },
          restricted: true,
          views: {
            //
            // Populates the parent state's overlay container with the overlay layout, which will itself contain
            // the complete product search facet - this is the trick to keep the parent state alive and displayed
            //
            'overlay@{ancestorStateName}': { // <== named view from parent state referenced here
              templateUrl: 'overlay-container.template.html',
              controller: /* @ngInject */function ProductSearchStateController($scope, ProductSearchStateHelper) {
                ProductSearchStateHelper.initialize($scope);
              }
            },
            'overlay-layout@{stateName}': {
              templateUrl: 'layout-horizontal-33-66-top-bar-right-panel.template.html'
            },
            'application-bar-container@{stateName}': {
              templateUrl: 'product-application-bar-overlay.template.html'
            },
            'left-section@{stateName}': {
              templateUrl: 'product-left.template.html'
            },
            'right-section@{stateName}': {
              templateUrl: 'product-right.template.html'
            },
            'right-side-menu@{stateName}': {
              templateUrl: 'product-cart-container.template.html'
            }
          },
          data: {
            label: '{{ "searchForProducts" | translate }}'
          }
        };

        //
        // Assemble top level states
        //
        topLevelStates.push(requisitionFollowUps);
        topLevelStates.push(requisitionAuthorization);
        topLevelStates.push(requisitionSearch);
        topLevelStates.push(requisitionTemplateSearch);

        states.push(_.extend({}, root));
        states.push(_.extend({}, defaultState, { redirectTo: root.name + requisitionFollowUps.name }));
        states.push(_.extend({}, errorState));
        states.push(_.extend({}, home));
        states.push(_.extend({}, trace));

        var requisitionModule = {
          iconClass: 'side-menu-icon-requisitions',
          label: 'requisitions',
          stateName: undefined,
          states: [],
          staticLinks: [
            {
              label: 'grmLegacyMenuLink',
              iconClass: 'side-menu-icon-grm-legacy',
              link: 'grmLegacy'
            }
          ]
        };
        _.forEach(topLevelStates, function(stateObj) {
          var state = _.extend({}, stateObj);
          state.name = root.name + state.name;

          var views = {};
          _.forEach(state.views, function(viewObj, key) {
            var newKey = key.replace('{stateName}', state.name);
            views[newKey] = viewObj;
          });
          state.views = views;
          states.push(state);

          //
          // Application navigation menu items are registered here!!!
          //
          var navigationItem = {
            iconClass: state.sideMenu.icon,
            label: state.sideMenu.label,
            stateName: state.name
          };
          requisitionModule.states.push(navigationItem);
        });

        //
        // Register only one module for side meny at the moment
        //
        SideMenuServiceProvider.registerModule(requisitionModule);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++
        // Main requisition state for the followup entry point
        //
        var requisitionFollowUpsState = _.extend({}, requisition);
        requisitionFollowUpsState.name = root.name + requisitionFollowUps.name + requisition.name;
        var views = {};
        _.forEach(requisitionFollowUpsState.views, function(viewObj, key) {
          var newKey = key.replace('{stateName}', requisitionFollowUpsState.name);
          views[newKey] = viewObj;
        });
        requisitionFollowUpsState.views = views;
        states.push(requisitionFollowUpsState);

        // Create/edit requisition states
        states.push(_.extend({}, requisitionCreate, { name: requisitionFollowUpsState.name + requisitionCreate.name }));
        states.push(_.extend({}, requisitionUpdate, { name: requisitionFollowUpsState.name + requisitionUpdate.name }));

        // Product search for requistion create/edit states
        var productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionFollowUps.name + requisition.name + requisitionCreate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionFollowUps.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionFollowUps.name + requisition.name + requisitionUpdate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionFollowUps.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Main requisition states for the authorization entry point
        //
        var requisitionAuthorizationState = _.extend({}, requisition);
        requisitionAuthorizationState.name = root.name + requisitionAuthorization.name + requisition.name;
        views = {};
        _.forEach(requisitionAuthorizationState.views, function(viewObj, key) {
          var newKey = key.replace('{stateName}', requisitionAuthorizationState.name);
          views[newKey] = viewObj;
        });
        requisitionAuthorizationState.views = views;
        states.push(requisitionAuthorizationState);

        // Create/edit requisition states
        states.push(_.extend({}, requisitionCreate, { name: requisitionAuthorizationState.name + requisitionCreate.name }));
        states.push(_.extend({}, requisitionUpdate, { name: requisitionAuthorizationState.name + requisitionUpdate.name }));

        // Product search for requistion create/edit states
        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionAuthorization.name + requisition.name + requisitionCreate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionAuthorization.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionAuthorization.name + requisition.name + requisitionUpdate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionAuthorization.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Main requisition state for the requisition search entry point
        //
        var requisitionState = _.extend({}, requisition);
        requisitionState.name = root.name + requisitionSearch.name + requisition.name;
        views = {};
        _.forEach(requisitionState.views, function(viewObj, key) {
          var newKey = key.replace('{stateName}', requisitionState.name);
          views[newKey] = viewObj;
        });
        requisitionState.views = views;
        states.push(requisitionState);

        // Create/edit requisition states
        states.push(_.extend({}, requisitionCreate, { name: requisitionState.name + requisitionCreate.name }));
        states.push(_.extend({}, requisitionUpdate, { name: requisitionState.name + requisitionUpdate.name }));

        // Product search for requistion create/edit states
        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionSearch.name + requisition.name + requisitionCreate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionSearch.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionSearch.name + requisition.name + requisitionUpdate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionSearch.name + requisition.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Main requisition template state for the followup entry point
        //
        var requisitionTemplateState = _.extend({}, requisitionTemplate);
        requisitionTemplateState.name = root.name + requisitionFollowUps.name + requisitionTemplateState.name;
        views = {};
        _.forEach(requisitionTemplateState.views, function(viewObj, key) {
          var newKey = key.replace('{stateName}', requisitionTemplateState.name);
          views[newKey] = viewObj;
        });
        requisitionTemplateState.views = views;

        // Create/edit requistiion template states
        states.push(requisitionTemplateState);
        states.push(_.extend({}, requisitionTemplateCreate, { name: requisitionTemplateState.name + requisitionTemplateCreate.name }));
        states.push(_.extend({}, requisitionTemplateUpdate, { name: requisitionTemplateState.name + requisitionTemplateUpdate.name }));

        // Product search for the create state
        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionFollowUps.name + requisitionTemplate.name + requisitionTemplateCreate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionFollowUps.name + requisitionTemplate.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionFollowUps.name + requisitionTemplate.name + requisitionTemplateUpdate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionFollowUps.name + requisitionTemplate.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Main requisition template state for the requisition template search entry point
        //
        requisitionTemplateState = _.extend({}, requisitionTemplate);
        requisitionTemplateState.name = root.name + requisitionTemplateSearch.name + requisitionTemplate.name;
        views = {};
        _.forEach(requisitionTemplateState.views, function(viewObj, key) {
          var newKey = key.replace('{stateName}', requisitionTemplateState.name);
          views[newKey] = viewObj;
        });
        requisitionTemplateState.views = views;
        states.push(requisitionTemplateState);

        // Create/edit requistion template states
        states.push(_.extend({}, requisitionTemplateCreate, { name: requisitionTemplateState.name + requisitionTemplateCreate.name }));
        states.push(_.extend({}, requisitionTemplateUpdate, { name: requisitionTemplateState.name + requisitionTemplateUpdate.name }));

        // Product search for the create/edit requisition template states
        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionTemplateSearch.name + requisitionTemplate.name + requisitionTemplateCreate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionTemplateSearch.name + requisitionTemplate.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        productSearchState = _.extend({}, productSearch);
        productSearchState.name = root.name + requisitionTemplateSearch.name + requisitionTemplate.name + requisitionTemplateUpdate.name + productSearch.name;
        views = {};
        _.forEach(productSearchState.views, function(viewObj, key, index) {
          var newKey = key.replace('{ancestorStateName}', root.name + requisitionTemplateSearch.name + requisitionTemplate.name).replace('{stateName}', productSearchState.name);
          views[newKey] = _.extend({}, viewObj);

          // Product search is used in an overlay state - replace default controller with overlay controller
          if (newKey.indexOf('overlay@') > -1) {
            views[newKey].controller = /* @ngInject */function OverlayProductSearchStateController($scope, OverlayProductSearchStateHelper) {
              OverlayProductSearchStateHelper.initialize($scope);
            };
          }
        });
        productSearchState.views = views;
        states.push(productSearchState);

        //
        // Loop over defined state objects and register them againts the $stateProvider service
        //
        _.forEach(states, function iterator(stateObj) {
          /*
            Extends the authentication resolver for each state marked as "restricted".
            We inject as dependency the authentication resolver of the root state, to
            prevent issuing two login process simultaneously.
          */
          if (stateObj.restricted) {
            stateObj.resolve = _.extend({
              // Injected "authentication" is a resolver of the root state. We want to wait after it is resolved before executing the resolver.
              authentication: /* @ngInject */function(authentication, $q, AuthenticationManager) {
                return authenticationResolver($q, AuthenticationManager);
              }
            }, stateObj.resolve);
          }
          $stateProvider.state(stateObj);
        });

        //
        // Provide default application url
        //
        $urlRouterProvider.otherwise(defaultUrl);

        // ////////////////////////
        // Helper functions - begin
        //

        function rootResolvers() {
          return {
            authentication: authenticationResolver,
            initialize: /* @ngInject */function initialize(authentication, $q, $stateParams, Initializer, AuthenticationManager, $state) {
              var isAppDataInitialized = Initializer.isInitialized();

              if (!isAppDataInitialized && _.isNil($stateParams.localeId)) {
                /*
                  If root state is accessed without a locale specified in url, we must get authentified user locale from IDS token user profile.
                  At this step, we are sure that user is authentified and token is stored.
                  Once token gathered, redirects to default state, providing locale.
                  note : issuing a state.go in a resolve is ok, as it returns a promise.
                */
                return $state.go('default', { localeId: AuthenticationManager.getLocaleIdFromAuthenticatedUser() }, { location: 'replace' });
              }
              // fix : isInitialized, to prevent multiple app initialization, if reloading complete state tree from root.
              return $q.when(isAppDataInitialized ? true : Initializer.initialize($stateParams.localeId));
            }
          };
        }

        /* @ngInject */
        function authenticationResolver($q, AuthenticationManager) {
          var deferred = $q.defer();
          if (!AuthenticationManager.authenticationInfos.authenticated) {
            if (!AuthenticationManager.isUserIdentified()) {
              AuthenticationManager.login();
            } else if (AuthenticationManager.willTokenBeRenewed()) {
              AuthenticationManager.deferredTokenObtention.promise.then(function success() {
                deferred.resolve();
              }, function failure() {
                deferred.reject();
              });
            } else {
              deferred.resolve();
            }
          } else {
            deferred.resolve();
          }
          return deferred.promise;
        }

        /* @ngInject */
        function ErrorStateController($state, AuthenticationManager, $stateParams) {
          this.isRedirecting = false;
          this.error = $stateParams.error || {};
          this.unauthorized = 401 === this.error.status;
          this.authenticationInfos = AuthenticationManager.authenticationInfos;
          this.backToHomePage = function($event) {
            if ($event) {
              $event.preventDefault();
            }
            this.isRedirecting = true;
            // go to default app page, replace history record.
            $state.go('default', { localeId: $stateParams.localeId}, {location: 'replace' });
          };
          this.login = function($event) {
            if ($event) {
              $event.preventDefault();
            }
            this.isRedirecting = true;
            AuthenticationManager.login();
          };
        }

        //
        // Helper functions - end
        // //////////////////////
      };
    }
  }
)();
