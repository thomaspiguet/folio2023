import { autobind } from 'core-decorators';
import { isUndefined } from 'lodash';
import { FormValidator, getValidationErrors } from './form-validator';

class FakeComponent {
  constructor() {
    this.props = {
      entry: {},
      setEntry: this.setEntry,
    };
  }

  @autobind
  setEntry(newEntry) {
    this.props.entry = { ...this.props.entry, ...newEntry };
  }

  setField(key, value) {
    this.props.entry[key] = value;
  }

  setSubField(parentKey, key, value) {
    const entry = this.props.entry;
    let sub = entry[parentKey];
    if (!sub) {
      sub = {};
      entry[parentKey] = sub;
    }
    sub[key] = value;
  }

  setTableField(parentKey, key, index, value) {
    const entry = this.props.entry;
    let table = entry[parentKey];
    if (isUndefined(table)) {
      table = [];
      entry[parentKey] = table;
    }
    let row = table[index];
    if (isUndefined(row)) {
      row = {};
      table.push(row);
    }
    row[key] = value;
  }

}

describe('form-validator', () => {
  describe('validateMandatoryFields', () => {

    it('non-mandatory field should not produce errors', () => {
      const formOptions = {
        tabs: {
          detail:
            {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(0);
    });

    it('mandatory field should produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: true,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.intlId).toBe('validation.mandatory-field');
    });

    it('non-mandatory noZero should produce an error for zero field', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: false,
            noZero: true,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', 0);

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.intlId).toBe('validation.zero-value');
    });

    it('non-mandatory noZero should not produce an error for empty field', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: false,
            noZero: true,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(0);
    });

    it('mandatory noZero should  produce an error for empty field', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: true,
            noZero: true,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.intlId).toBe('validation.mandatory-field');
    });

    it('mandatory noZero should  produce an error for zero field', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: true,
            noZero: true,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', 0);

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.intlId).toBe('validation.zero-value');
    });

    it('mandatory field with false predicate should not produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          name: {
            path: ['name'],
            tabId: 'detail',
            mandatory: true,
            predicate: () => false,
          },
        },
      };
      const component = new FakeComponent();
      component.setField('name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(0);
    });

    it('mandatory table field should produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          table: {
            metadata: 'Table',
            path: ['table'],
            tabId: 'detail',
            columns: [
              {
                id: 'name',
                path: ['name'],
                metadata: 'Name',
              }
            ],
          }
        },
      };
      const formMetadata = {
        children: {
          Table: {
            isCollection: true,
            children: {
              Name: {
                isRequired: true,
              }
            }
          }
        }
      };
      const component = new FakeComponent();
      component.setTableField('table', 'name', 0, '');

      const validator = new FormValidator(component, formOptions);
      validator.setMetadata(formMetadata) ;

      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.parentKey).toBe('table');
      expect(error.index).toBe(0);
      expect(error.intlId).toBe('validation.mandatory-field');
    });

    it('mandatory sub field should produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          table: {
            path: ['table'],
            tabId: 'detail',
            mandatory: true,
            columns: [
              {
                id: 'name',
                path: ['name'],
                mandatory: true,
              }
            ],
          }
        },
      };
      const component = new FakeComponent();
      component.setSubField('table', 'name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(1);

      const error = validator.errors[0];
      expect(error.key).toBe('name');
      expect(error.parentKey).toBe('table');
      expect(error.intlId).toBe('validation.mandatory-field');
    });

    it('mandatory sub field with false predicate should not produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          table: {
            path: ['table'],
            tabId: 'detail',
            mandatory: true,
            columns: [
              {
                id: 'name',
                path: ['name'],
                mandatory: true,
                predicate: () => false,
              }
            ],
          }
        },
      };
      const component = new FakeComponent();
      component.setSubField('table', 'name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(0);
    });

    it('mandatory sub field with noError should not produce an error', () => {
      const formOptions = {
        tabs: {
          detail: {},
        },
        fields: {
          table: {
            path: ['table'],
            tabId: 'detail',
            mandatory: true,
            columns: [
              {
                id: 'name',
                path: ['name'],
                mandatory: true,
                noError: true,
              }
            ],
          }
        },
      };
      const component = new FakeComponent();
      component.setSubField('table', 'name', '');

      const validator = new FormValidator(component, formOptions);
      validator.validateMandatoryFields(component.props.entry);
      expect(validator.errors.length).toBe(0);
    });

  });
  describe('getValidationErrors', () => {
    it('One confirmation message and two error messages should receive three errors message.', () => {

      const validationErrors = {
        "ValidationMessages":[
          {
            "Path":"Data.JobTitle.Id",
            "Message":"The job title 1105 has been deactivated since 2012-06-27. Do you want to continue?",
            "ActionType":4,
            "ExpectedUserResponse":1
          },
          {
            "Path":"Data.NatureOfExpense",
            "Message":"The nature is mandatory.",
            "ActionType":0,
            "ExpectedUserResponse":0
          },
          {
            "Path":"Data.Description",
            "Message":"The description is mandatory.",
            "ActionType":0,
            "ExpectedUserResponse":0
          },
          {
            "Path":"Data.Code",
            "Message":"The code is mandatory.",
            "ActionType":0,
            "ExpectedUserResponse":0
          }
        ],
        "VersionInconsistency":false,
        "error" : null,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages, expectedUserResponse, actionTypes } = getValidationErrors(validationErrors);

      expect(messages.length).toBe(3);
      expect(expectedUserResponse).toBe(false);
      expect(actionTypes.length).toBe(3);
    });
    it('Two error messages should receive two errors message.', () => {

      const validationErrors = {
        "ValidationMessages":[
          {
            "Path":"Data.NatureOfExpense",
            "Message":"The nature is mandatory.",
            "ActionType":1,
            "ExpectedUserResponse":0
          },
          {
            "Path":"Data.Description",
            "Message":"The description is mandatory.",
            "ActionType":2,
            "ExpectedUserResponse":0
          }
        ],
        "VersionInconsistency":false,
        "error" : null,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages, expectedUserResponse, actionTypes } = getValidationErrors(validationErrors);

      expect(messages.length).toBe(2);
      expect(expectedUserResponse).toBe(false);
      expect(actionTypes.length).toBe(2);
    });
    it('One confirmation message should receive one confirmation message.', () => {

      const validationErrors = {
        "ValidationMessages":[
          {
            "Path":"Data.JobTitle.Id",
            "Message":"The job title 1105 has been deactivated since 2012-06-27. Do you want to continue?",
            "ActionType":4,
            "ExpectedUserResponse":1
          }
        ],
        "VersionInconsistency":false,
        "error" : null,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages, expectedUserResponse, actionTypes } = getValidationErrors(validationErrors);

      expect(messages.length).toBe(1);
      expect(expectedUserResponse).toBe(1);
      expect(actionTypes.length).toBe(1);
    });
    it('Version inconsistency message should receive one message.', () => {
      const validationErrors = {
        "VersionInconsistency":true,
        "error" : null,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages } = getValidationErrors(validationErrors);
      expect(messages.length).toBe(1);
    });
    it('Error message should receivea an error.', () => {
      const validationErrors = {
        "VersionInconsistency":false,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages } = getValidationErrors(validationErrors);
      expect(messages.length).toBe(1);
    });
    it('ResponseError message should receive an error.', () => {
      const validationErrors = {
        "VersionInconsistency":false,
        "error" : null,
        "responseError":{
          "message":"Bad Request",
          "status":400
        }
      };

      const { messages } = getValidationErrors(validationErrors);
      expect(messages.length).toBe(1);
    });
    it('No error should not receive an error.', () => {
      const validationErrors = {};

      const { messages } = getValidationErrors(validationErrors);
      expect(messages.length).toBe(0);
    });
  });
});
