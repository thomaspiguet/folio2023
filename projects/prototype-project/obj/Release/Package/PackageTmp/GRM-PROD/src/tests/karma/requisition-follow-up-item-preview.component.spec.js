'use strict';

describe('RequisitionFollowUpItemPreviewComponent controller tests', function() {

  // ng services
  var $componentController;
  var $q;
  var $rootScope;

  var requisitionFollowUpItemPreviewComponent;
  var dynamicLookupServiceMock;

  var items = [
    { requisitionItemId: 1, requisitionFollowUpItem : { id: 1, description: 'item #1' }},
    { requisitionItemId: 2, requisitionFollowUpItem : { id: 2, description: 'item #2' }},
    { requisitionItemId: 3, requisitionFollowUpItem : { id: 3, description: 'item #3' }},
    { requisitionItemId: 4, requisitionFollowUpItem : { id: 4, description: 'item #4', noteToBuyer: 'note', status: '1' }},
  ];

  var bindings = {
    resolve: {
      pos: 0,
      item: items[0],
      items: items
    }
  };

  // Target module
  beforeEach(module('app.layout.requisition-follow-up'));

  beforeEach(function() {
    module('app.dataservices.lookupservices', function($provide) {
      $provide.value('DynamicLookupService', {
        getRequisitionItemStatuses: function() {
          return {
            _1: {code: '1'},
            _2A: {code: '2A'},
            _2B: {code: '2B'},
            _2C: {code: '2C'}
          };
        }
      });
    });

    module('app.commons.popup', function($provide) {
      $provide.value('PopupService', {});
    });

    module('app.dataservices.requisition-follow-up', function($provide) {
      $provide.value('RequisitionFollowUpApiService', {
        getFollowUpItem: function(searchParams) {
          var res = _.find(items, function(i) {
            return i.id === searchParams.requisitionItemId;
          });
          return $q.when(res);
        }
      });
    });

    dynamicLookupServiceMock = {
      getRequisitionItemStatuses: function() {
        return [
          {code: '1'}, {code: '2A'}, {code: '2B'}, {code: '2C'}
        ];
      }
    };
  });

  // Inject ng services
  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('Should be initialized correctly', function() {
    // create component
    requisitionFollowUpItemPreviewComponent = $componentController('requisitionFollowUpItemPreview', undefined, bindings);
    // life cycle call
    requisitionFollowUpItemPreviewComponent.$onInit();

    // positioned at first element
    expect(requisitionFollowUpItemPreviewComponent.currentItem()).toEqual(items[0].requisitionFollowUpItem);

    // previous button should be disabled, next should be enabled and non catalogued section should be hidden
    expect(requisitionFollowUpItemPreviewComponent.isPreviousDisabled()).toBe(true);
    expect(requisitionFollowUpItemPreviewComponent.isNextDisabled()).toBe(false);
    expect(requisitionFollowUpItemPreviewComponent.showNonCataloguedInfo()).toBe(false);

    // go one element forward
    requisitionFollowUpItemPreviewComponent.onNext();

    // previous button should be enabled, next should be enabled and non catalogued section should be hidden
    expect(requisitionFollowUpItemPreviewComponent.currentItem()).toEqual(items[1].requisitionFollowUpItem);
    expect(requisitionFollowUpItemPreviewComponent.isPreviousDisabled()).toBe(false);
    expect(requisitionFollowUpItemPreviewComponent.isNextDisabled()).toBe(false);

    // go to end of element list
    for (var i = 0; i < items.length; i++) {
      requisitionFollowUpItemPreviewComponent.onNext();
    }

    // previous button should be disabled, next should be enabled and non catalogued section should be hidder
    expect(requisitionFollowUpItemPreviewComponent.currentItem()).toEqual(items[items.length - 1].requisitionFollowUpItem);
    expect(requisitionFollowUpItemPreviewComponent.isPreviousDisabled()).toBe(false);
    expect(requisitionFollowUpItemPreviewComponent.isNextDisabled()).toBe(true);

    // Non catalogued should be displayed for last item
    expect(requisitionFollowUpItemPreviewComponent.showNonCataloguedInfo()).toBe(true);

    $rootScope.$digest();
  });
});
