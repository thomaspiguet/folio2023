var origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function() {
  var args = arguments;

  // queue 25ms wait
  origFn.call(browser.driver.controlFlow(), function() {
    return protractor.promise.delayed(25);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Les compteur des demandes', function() {

  beforeEach(function() {
  });

  it('devraient contenir 1 demandes à traiter', function() {
    browser.get('https://grmweb-dev.logibec.com');
    browser.waitForAngular();

    // Locates credentials controls
    var username = element(by.model('model.username'));
    var password = element(by.model('model.password'));
    var login = element(by.id('login'));

    // Inject credentials
    username.sendKeys('grmwebtester');
    password.sendKeys('m2bx0JDYU');
    login.click().then(function() {
      console.log("...LOADING PAGE...");
    });

    // Wait for the web application to be loaded
    browser.wait(function() {
      return browser.isElementPresent(by.className('states-bar-item-count'));
    }, 5000).then(function() {
      console.log("PAGE LOADED!");

      // Extract first counter value
      element.all(by.className('states-bar-item-count')).then(function(elements) {
        console.log("Element counts = " + elements.length);
        
        expect(elements[0].getText()).toEqual('1');
        
      });
    });
  });

  it('devraient contenir de 1 demandes à compléter', function() {
    // Extract second counter value
    element.all(by.className('states-bar-item-count')).then(function(elements) {
      console.log("Element counts = " + elements.length);
      
      expect(elements[1].getText()).toEqual('1');
      
    });
  });

  
});