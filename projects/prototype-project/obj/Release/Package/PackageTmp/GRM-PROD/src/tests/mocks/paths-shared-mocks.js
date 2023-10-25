(
  function (window) {
    'use strict';

    var mocks = window.Mocks || (window.Mocks = {});
    var config = {
      BACKEND_BASE_ADDRESS: 'http://logibec.testunit.com/'
    };
    mocks.Paths = {

      // Defines a generic Mockup for the Paths service
      getPathsMock: function getPathsMock() {

        var pathsMock = {
          getApiPath: function () {
            return config.BACKEND_BASE_ADDRESS;
          }
        };

        return pathsMock;
      }
    };

    // window.Mocks = {
    //
    //   Config: {
    //     BACKEND_BASE_ADDRESS: 'http://logibec.testunit.com/'
    //   },
    //
    //   Paths: {
    //
    //     // Defines a generic Mockup for the Paths service
    //     getPathsMock: function getPathsMock() {
    //
    //       var pathsMock = {
    //         getApiPath: function () {
    //           return Mocks.Config.BACKEND_BASE_ADDRESS;
    //         }
    //       };
    //
    //       return pathsMock;
    //     }
    //   }
    // }
  }
)(window);
