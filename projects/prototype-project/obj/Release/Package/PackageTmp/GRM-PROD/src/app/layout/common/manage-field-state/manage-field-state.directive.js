(
  function() {
    'use strict';

    angular
      .module('app.layout.common.manage-field-state')
      .directive('manageFieldState', manageFieldState);

    /* @ngInject */
    function manageFieldState($timeout, $log, $q, InteractionModes) {
      var cdo = {
        restrict: 'A',
        priority: -100,
        link: {
          pre: ManageFieldStateLink
        }
      };

    function ManageFieldStateLink(scope, element, attrs) {

      var supportedFieldStates = ['hidden', 'disabled']; //Supported field states
      var supportedTags = ['INPUT', 'TEXTAREA', 'A', 'BUTTON', 'DIV']; //Supported tags (others than material design tags) for state managing.

      //attrs will be evaluated and stored in this config object.
      var config = {
        global: { //"manage-field-state"
          state: undefined,
          flag: undefined,
          type: undefined
        },
        onNew: { //"manage-state-on-new"
          state: undefined,
          flag: undefined,
          type: undefined
        },
        onEdit: {//"manage-state-on-edit"
          state: undefined,
          flag: undefined,
          type: undefined
        }
      };

      if (!_.isNil(attrs.ngDisabled)) {
        $log.error('manage-field-state : do not use ng-disabled when using this directive');
      }
      if (_.isNil(attrs.mode)) {
        $log.error('manage-field-state : mode attribute must be provided. see requisition-edit-mode.constant.js');
      }

      //initialize each mode of the config object with element attrs.
      function initializeConfig() {
        if (!_.isNil(attrs.manageFieldState)) {
          validateAndSetAttributes(attrs.manageFieldState, 'global');
        }
        else {
          config.global = undefined;
        }

        if (!_.isNil(attrs.manageStateOnEdit)) {
          validateAndSetAttributes(attrs.manageStateOnEdit, 'onEdit');
        }
        else {
          config.onEdit = undefined;
        }

        if (!_.isNil(attrs.manageStateOnNew)) {
          validateAndSetAttributes(attrs.manageStateOnNew, 'onNew');
        }
        else {
          config.onNew = undefined;
        }
        return true;
      }

      function setFlag (parsedAttr, mode) {
        if (!_.isUndefined(config[mode]) && !_.isUndefined(config[mode].type)) {
          //Object
          if (config[mode].type === 'Object') {
            config[mode].flag = parsedAttr.hasOwnProperty('condition') ? Boolean(parsedAttr.condition) : undefined;
          }
          //Expression
          else {
            config[mode].flag = Boolean(parsedAttr);
          }
          return config[mode].flag;
        } else {
          return undefined;
        }
      }

      function validateAndSetAttributes (attr, mode) {
        var parsedAttr = scope.$eval(attr);
        if (_.isObject(parsedAttr)) {
          config[mode].state = !_.isNil(parsedAttr.state) ? parsedAttr.state : 'disabled';
          config[mode].flag = setFlag(parsedAttr, mode);
          config[mode].type = 'Object';
          //valid if attribute "state" of the targeted mode config is supported.
          if (supportedFieldStates.indexOf(config[mode].state) === -1) {
            $log.warn('manage-field-state : attribute is not valid. value for state are ; "hidden" or "disabled". value "disabled" defaulted.');
            config[mode].state = 'disabled';
          }
        }
        //if attr not evaluated expression is not empty
        else if (attr !== '') {
          config[mode].flag = Boolean(parsedAttr);
          config[mode].state = 'disabled';
          config[mode].type = 'Expression';
        }
        //if attr not evaluated expression is empty (attr has been explicitly set to "empty" (no condition, no state))
        else {
          config[mode].state = 'disabled';
        }
      }

      function setState(flag, fieldState) {
        //Manage the state in evalAsync, just for precaution.
        scope.$evalAsync(function() {
          var el;
          if (!_.isEmpty(element[0].firstChild) && element[0].firstChild.tagName.indexOf('MD-') > -1) {
            el = element[0].firstChild;
          }
          else {
            el = element[0];
          }
          setNodeState(el, flag, fieldState);
        });
      }

      function toggleState(node, fieldState, flag, ignoreLabel) {
        var label;
        if (!ignoreLabel) {
          var id = angular.element(node).attr('md-input-id') ?
                    angular.element(node).attr('md-input-id') : angular.element(node).attr('id');
          label = angular.element('label[for="' + id + '"]');
          label = label.length > 0 ? label : undefined;
        }
        if (fieldState === 'hidden') {
          if (!flag) {
            angular.element(node).css({opacity: 1, transition: 'opacity 0.5s linear', 'pointer-events':'inherit'});
            if (!_.isUndefined(label)) {
              label.css({opacity: 1, transition: 'opacity 0.5s linear'});
            }
          }
          else {
            angular.element(node).css({opacity: 0, 'pointer-events':'none'});
            if (!_.isUndefined(label)) {
              label.css('opacity', 0);
            }
          }
        }
        else {
          if (!flag) {
            angular.element(node).removeAttr('disabled');
            angular.element(node).attr('aria-disabled', 'false');
          }
          else {
            angular.element(node).attr('disabled', 'disabled');
            angular.element(node).attr('aria-disabled', 'true');
          }
        }
      }

      function setNodeState(node, flag, fieldState) {
        //specific instructions for "material design" elements.
        if (node.tagName.indexOf('MD-') > -1) {
          if (fieldState === 'disabled') {
            var mdController = angular.element(node.firstChild).controller(_.camelCase(node.tagName));
            if (!_.isNil(mdController) && mdController.hasOwnProperty('isDisabled')) {
              mdController.isDisabled = flag;
            }
            toggleState(node, fieldState, flag, true);
            //Scan all children element for "Material Design)
            var children = node.querySelectorAll('*:not(div):not(md-virtual-repeat-container):not(ul)'); /*fix for IE. dont disabled ul and md-virtual-repeat-container*/
            _.each(children, function (child) {
              toggleState(child, fieldState, flag, true);
            });
          }
          else {
            toggleState(node, fieldState, flag, false);
          }
        }
        //instructions for supported HTML elements.
        else if (supportedTags.indexOf(node.tagName) > -1) {
          toggleState(node, fieldState, flag, false);
        }
      }

      //called when toggling from readOnly mode to edit or new.
      function restoreState() {
        if (angular.element(element[0]).css('opacity') === 0) {
          setState(false, 'hidden');
        }
        else if (angular.element(element[0]).attr('aria-disabled') === 'true' ||
                  angular.element(element[0].lastElementChild).attr('aria-disabled') === 'true') {
          setState(false, 'disabled');
        }
      }

      //function called when evaluating the "manage-field-state" (global mode) attribute.
      function manageFieldStateOnGlobalFlagChanged(value, mode) {
        //is manage in edit or new set on the element.
        if (!_.isUndefined(config[mode])) {
          //is manage-field-state set with a condition, and manage in edit or new set with a condition too.
          //if manage in edit or new is set without condition, do nothing and keep the current state.
          if (!_.isNil(setFlag(scope.$eval(attrs['manageState' + _.upperFirst(mode)]), mode)) &&
              !_.isNil(setFlag(value, 'global'))) {
              //If state for 'global' mode is hidden, always evaluate it before.
              if (config.global.state === 'hidden') {
                setState(config.global.flag, config.global.state);
                setState(config[mode].flag, config[mode].state);
              }
              else { //If state for 'global' mode is not hidden, merge the two condition.
                //TODO: review this behavior ..
                setState(config[mode].flag || config.global.flag, config[mode].state);
              }
            }
        }
        //is manage-field-state set with condition.
        else if (!_.isNil(setFlag(value, 'global'))) {
          setState(config.global.flag, config.global.state);
        }
      }

      //function called when evaluating the "mode" attribute.
      function manageFieldStateOnModeChanged(mode) {
        //if manage in edit or new, and condition is not set. (always force state on mode)
        if (!_.isUndefined(config[mode]) && _.isUndefined(config[mode].type)) {
          setState(true, config[mode].state);
        }
        //is manage-field-state set with a condition, and manage in edit or new is set with a condition too.
        else if (!_.isUndefined(config[mode]) &&
                (!_.isNil(setFlag(scope.$eval(attrs['manageState' + _.upperFirst(mode)]), mode)) &&
                 !_.isNil(setFlag(scope.$eval(attrs.manageFieldState), 'global')))) {
          //If state for 'global' mode is hidden, always evaluate it before.
          if (config.global.state === 'hidden') {
            setState(config.global.flag, config.global.state);
            setState(config[mode].flag, config[mode].state);
          }
          else { //If state for 'global' mode is not hidden, merge the two condition.
            //TODO: review this behavior ..
            setState(config[mode].flag || config.global.flag, config[mode].state);
          }
        }
        //is manage in edit or new is set with a condition.
        else if (!_.isUndefined(config[mode]) &&
                !_.isNil(setFlag(scope.$eval(attrs['manageState' + _.upperFirst(mode)]), mode))) {
          setState(config[mode].flag, config[mode].state);
        }
        //is manage-field-state is set with a condition.
        else if (!_.isNil(setFlag(scope.$eval(attrs.manageFieldState), 'global'))) {
          setState(config.global.flag, config.global.state);
        }
        //is no attribute is set, only manage-field-state without any condition.
        else {
          restoreState();
        }
      }

      //function called when evaluating the "manage-state-on-new" or "manage-state-on-edit" attribute.
      function manageFieldStateOnEditOrNewFlagChanged(value, mode) {
        //if manage in edit or new, and condition is not set. (always force state on mode)
        if (!_.isUndefined(config[mode]) && _.isUndefined(config[mode].type)) {
          setState(true, config[mode].state);
        }
        //is manage in edit or new is set with possible condition.
        else if (!_.isNil(setFlag(value, mode))) {
          setState(config[mode].flag, config[mode].state);
        }
      }

      //------WATCHERS DEFINITIONS------

      //security: just in case async code is added in configuration. wait for it to complete before initialize the watchers.
      $q.when(initializeConfig(), function () {
        //"mode" attribute evaluation
        scope.$watch(attrs.mode, function (value) {
            //we want this watcher to be executed at initialization phase.
            switch (value) {
              case InteractionModes.ReadOnly:
                //Always disabled all in readonly
                //TO DO: manage hidden state, optimize state restore to restore only hidden fields.
                //restoreState();
                setState(true, config.global.state);
                break;
              case InteractionModes.New:
                manageFieldStateOnModeChanged('onNew');
                break;
              case InteractionModes.Edit:
                manageFieldStateOnModeChanged('onEdit');
                break;
              default:
                break;
            }
        });

        //"manage-field-state" attribute evaluation
        scope.$watch(attrs.manageFieldState, function (value, oldValue) {
          //prevent watcher from being executed on initialization phase.
          if (value !== oldValue) {
            if (scope.$eval(attrs.mode) === InteractionModes.New) {
              manageFieldStateOnGlobalFlagChanged(value, 'onNew');
            }
            else if (scope.$eval(attrs.mode) === InteractionModes.Edit) {
              manageFieldStateOnGlobalFlagChanged(value, 'onEdit');
            }
          }
        }, _.isObject(scope.$eval(attrs.manageFieldState))); //Object-equalty depending of attribute type.

        //"manage-state-on-new" attribute evaluation
        scope.$watch(attrs.manageStateOnNew, function (value, oldValue) {
          //prevent watcher from being executed on initialization phase.
          if (value !== oldValue) {
            if (scope.$eval(attrs.mode) === InteractionModes.New) {
              manageFieldStateOnEditOrNewFlagChanged(value, 'onNew');
            }
          }
        }, _.isObject(scope.$eval(attrs.manageStateOnNew))); //Object-equalty depending of attribute type.

        //"manage-state-on-edit" attribute evaluation
        scope.$watch(attrs.manageStateOnEdit, function (value, oldValue) {
          //prevent watcher from being executed on initialization phase.
          if (value !== oldValue) {
            if (scope.$eval(attrs.mode) === InteractionModes.Edit) {
              manageFieldStateOnEditOrNewFlagChanged(value, 'onEdit');
            }
          }
        }, _.isObject(scope.$eval(attrs.manageStateOnEdit))); //Object-equalty depending of attribute type.
      });
    }
    return cdo;
  }
 }
)();
