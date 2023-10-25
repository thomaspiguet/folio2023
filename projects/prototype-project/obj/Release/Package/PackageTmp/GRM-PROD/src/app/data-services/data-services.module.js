(
  function() {
    'use strict';

    angular
      .module('app.dataservices', [
        'app.dataservices.account',
        'app.dataservices.application-parameters',
        'app.dataservices.authorization',
        'app.dataservices.classification',
        'app.dataservices.controllookup',
        'app.dataservices.delivery-location',
        'app.dataservices.department',
        'app.dataservices.distribution-unit',
        'app.dataservices.institution-parameter',
        'app.dataservices.lookupservices',
        'app.dataservices.product',
        'app.dataservices.requester',
        'app.dataservices.requisition',
        'app.dataservices.requisition-follow-up',
        'app.dataservices.requisition-template',
        'app.dataservices.statistics',
        'app.dataservices.unspsc-classification',
        'app.dataservices.userprofile',
        'app.dataservices.version',
        'app.dataservices.project-activity',
        'app.dataservices.requisition.authorizer',
      ])
    ;
  }
)();
