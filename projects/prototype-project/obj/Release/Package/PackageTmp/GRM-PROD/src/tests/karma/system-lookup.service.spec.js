'use strict';

describe('SystemLookupService service:', function() {

  // Angular services
  var $q;
  var $log;
  var $rootScope;
  var $timeout;
  var service;
  var lookupCatalogApiServiceMock;

  beforeEach(module('app.dataservices.lookupservices'));

  beforeEach(function() {

    // Tells Angular to inject mockups to be used as dependencies
    // for the service being tested
    module('app.dataservices.lookupservices', function($provide) {
      $provide.value('LookupCatalogApiService', lookupCatalogApiServiceMock);
    });

    // Defines service mockup
    lookupCatalogApiServiceMock = {
      // Defines mockup function to return specific JSON content whenever it gets called
      getSystemEntriesCatalog: function() {
        var json = readJSON('json/systemLookupCatalog.json');
        return $q.when(json);
      }
    };
  });

  // Make available Angular services
  beforeEach(inject(function (_$q_, _$log_, _$rootScope_, _$timeout_) {
    $q = _$q_;
    $log = _$log_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));


  // Creates instance of the service being tested
  beforeEach(function() {
    inject(function(_SystemLookupService_) {
      service = _SystemLookupService_;
    });
  });


  it('returns mocked_path', function() {

    // Make sure service is instanciated
    expect(service).toBeDefined();

    // Initialize the service
    var p = service.initialize();

    // Assertions
    p.then(function success(response) {
        expect(service.accountAccessTypes.length).toBe(3);
        expect(service.productTypeUsages.length).toBe(4);
        expect(service.requisitionManagementScopes.length).toBe(3);
        expect(service.requisitionAuthorizationLevels.length).toBe(3);
        expect(service.languages.length).toBe(2);
      },
      function failure(reason) {
      }
    );

    // Triggers a digest cycle (complete promises, etc.)
    $rootScope.$digest();
  });

});
