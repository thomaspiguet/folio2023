'use strict';

describe('RequisitionTemplateApiService service:', function() {

  // Angular services
  var $q;
  var $log;
  var $rootScope;
  var $timeout;
  var service;
  var requisitionTemplateItemObjectServiceMock;

  beforeEach(module('app.dataservices.requisition-template'));

  beforeEach(function() {

    // Tells Angular to inject mockups to be used as dependencies
    // for the service being tested
    module('app.dataservices.requisition-template', function($provide) {
      $provide.value('Paths', Mocks.Paths.getPathsMock());
      $provide.value('RequisitionTemplateItemObjectService', requisitionTemplateItemObjectServiceMock);
    });

    // Defines service mockup
    requisitionTemplateItemObjectServiceMock = {};
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
    inject(function(_RequisitionTemplateApiService_) {
      service = _RequisitionTemplateApiService_;
    });
  });


  it('get search results as products', inject(function($httpBackend) {

    var headerResults = [
      {
        "templateId": 1,
        "templateDescription": "Template #1",
        "isActive": true,
        "isAutomaticGeneration": false,
        "site": {
          "id": 1,
          "code": "SITE1",
          "description": "Site #1"
        },
        "department": {
          "id": 2,
          "code": "DEP2",
          "description": "Department #2"
        },
        "address": {
          "id": 3,
          "code": "ADD3",
          "description": "Address #3"
        },
        "requester": {
          "id": 4,
          "code": "REQ4",
          "description": "Requester #4"
        }
      },
      {
        "templateId": 2,
        "templateDescription": "Template #2",
        "isActive": true,
        "isAutomaticGeneration": true,
        "site": {
          "id": 11,
          "code": "SITE11",
          "description": "Site #11"
        },
        "department": {
          "id": 22,
          "code": "DEP22",
          "description": "Department #22"
        },
        "address": {
          "id": 33,
          "code": "ADD33",
          "description": "Address #33"
        },
        "requester": {
          "id": 44,
          "code": "REQ44",
          "description": "Requester #44"
        }
      }
    ];

    // Mock search results
    var productResults = [
      {
        "templateId": 1,
        "templateDescription": "Template #1",
        "isActive": true,
        "isAutomaticGeneration": false,
        "site": {
          "id": 1,
          "code": "SITE1",
          "description": "Site #1"
        },
        "department": {
          "id": 2,
          "code": "DEP2",
          "description": "Department #2"
        },
        "isProductInvalid": false,
        "productCode": "1",
        "productDescription": "Product #1",
        "distributionUnit": {
          "id": 3,
          "code": "DIST3",
          "description": "Distribution Unit #3"
        },
        "store": {
          "id": 4,
          "code": "STORE4",
          "description": "Store #4"
        }
      },
      {
        "templateId": 2,
        "templateDescription": "Template #2",
        "isActive": true,
        "isAutomaticGeneration": true,
        "site": {
          "id": 11,
          "code": "SITE11",
          "description": "Site #11"
        },
        "department": {
          "id": 22,
          "code": "DEP22",
          "description": "Department #22"
        },
        "isProductInvalid": true,
        "productCode": "11",
        "productDescription": "Product #11",
        "distributionUnit": {
          "id": 33,
          "code": "DIST33",
          "description": "Distribution Unit #33"
        },
        "store": {
          "id": 44,
          "code": "STORE44",
          "description": "Store #44"
        }
      }
    ];

    // Make sure service is instanciated
    expect(service).toBeDefined();

    // Setup successfull GET response with any querystring
    var targetUrl = Mocks.Paths.getPathsMock().getApiPath() + "requisitionTemplates";
    var urlPattern = new RegExp("^" + targetUrl.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&") + "(?:\\?.*)?$");

    $httpBackend.whenGET(urlPattern).respond(productResults);
    $httpBackend.expectGET(urlPattern);

    // Call a search
    var criteria = {
      templateId: 1,
      templateName: "test template",
      siteId: 1,
      departmentId: 2,
      addressId: 3,
      requesterId: 4,
      isActive: true,
      isAutomaticGeneration: false,
      productCode: "0",
      productDescription: "test description",
      productStoreId: 5,
      isProductInvalid: false,
      paging: {},
      sorting: {}
    };

    var p = service.search(criteria, service.SEARCH_RESULTS_AS_PRODUCTS);

    // Assertions
    p.then(function success(response) {
        expect(response.data.items.length).toBe(2);
      },
      function failure(reason) {
      }
    );

    // Triggers a digest cycle (complete promises, etc.)
    $rootScope.$digest();
    $httpBackend.flush();

  }));

});
