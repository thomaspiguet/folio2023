'use strict';

describe('DateHelperService service:', function() {

  // Angular services
  var $log;
  var service;

  beforeEach(module('app.commons.utils'));

  // Make available Angular services
  beforeEach(inject(function (_$q_, _$log_, _$rootScope_, _$timeout_) {
    $log = _$log_;
  }));


  // Creates instance of the service being tested
  beforeEach(function() {
    inject(function(_DateHelperService_) {
      service = _DateHelperService_;
    });
  });


  fit('Should calculate in charge delays correctly', function() {

    // Make sure service is instanciated
    expect(service).toBeDefined();
        
    var firstDate = '2017-01-01T09:00:00-04:00';
    var secondDate = new Date('2017-01-01T09:00:00-04:00');

    // Check with same dates and times
    var delay = service.getDelayBetweenDates(firstDate, secondDate);
        
    // Check delays...
    expect(delay.days).toEqual(0);
    expect(delay.hours).toEqual(0);
    expect(delay.minutes).toEqual(0);
    expect(delay.seconds).toEqual(0);

    // Check with 1 unit of each...
    secondDate = new Date('2017-01-02T10:01:01-04:00');
    delay = service.getDelayBetweenDates(firstDate, secondDate);

    // Check delays...
    expect(delay.days).toEqual(1);
    expect(delay.hours).toEqual(1);
    expect(delay.minutes).toEqual(1);
    expect(delay.seconds).toEqual(1);

    // Check with 23h59:59 year...
    secondDate = new Date('2017-01-02T08:59:59-04:00');
    delay = service.getDelayBetweenDates(firstDate, secondDate);
    
    // Check delays...
    expect(delay.days).toEqual(0);
    expect(delay.hours).toEqual(23);
    expect(delay.minutes).toEqual(59);
    expect(delay.seconds).toEqual(59);

    // Check with 1 day...
    secondDate = new Date('2017-01-02T09:00:00-04:00');
    delay = service.getDelayBetweenDates(firstDate, secondDate);
    
    // Check delays...
    expect(delay.days).toEqual(1);
    expect(delay.hours).toEqual(0);
    expect(delay.minutes).toEqual(0);
    expect(delay.seconds).toEqual(0);

    // Check with no second date...
    var firstDate = '2017-01-01T09:00:00-04:00';
    secondDate = undefined;
    delay = service.getDelayBetweenDates(firstDate, secondDate);
    
    // Check delays...
    expect(delay.days).toBeGreaterThan(1);

    // Check with no second date...
    secondDate = new Date('2017-01-02T09:00:00-04:00');
    delay = service.getDelayBetweenDates(undefined, secondDate);
    
    // Check delays...
    expect(delay).not.toBeDefined();

    // Check with no dates
    delay = service.getDelayBetweenDates();
    
    // Check delays...
    expect(delay).not.toBeDefined();
});
});
