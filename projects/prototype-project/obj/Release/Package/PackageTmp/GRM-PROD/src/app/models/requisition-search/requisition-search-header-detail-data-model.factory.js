(
  function() {
    'use strict';

    angular
      .module('app.models')
      .factory('RequisitionSearchHeaderDetailDataModel', RequisitionSearchHeaderDetailDataModelFactory)
    ;

    /* @ngInject */
    function RequisitionSearchHeaderDetailDataModelFactory() {
      return RequisitionSearchHeaderDetailDataModel;
    }

    function RequisitionSearchHeaderDetailDataModel(obj) {
      var that = _.extend({
        id: undefined,
        department: undefined,
        type: undefined,
        repetitiveContractNumber: undefined,
        requester: undefined,
        originStatusCode: undefined,
        interface: undefined,
        client: undefined,
        externalReferenceNumber: undefined,
        interfaceSequenceNumber: undefined,
        installationSite: undefined,
        requisitionTemplate: undefined
      }, obj);

      this.id = that.id;
      this.department = that.department;
      this.type = that.type;
      this.repetitiveContractNumber = that.repetitiveContractNumber;
      this.requester = that.requester;
      this.originStatusCode = that.originStatusCode;
      this.interface = that.interface;
      this.client = that.client;
      this.externalReferenceNumber = that.externalReferenceNumber;
      this.interfaceSequenceNumber = that.interfaceSequenceNumber;
      this.installationSite = that.installationSite;
      this.requisitionTemplate = that.requisitionTemplate;

      this.clone = function clone() {
        return new RequisitionSearchHeaderDetailDataModel(this);
      };

    }
  }
)();
