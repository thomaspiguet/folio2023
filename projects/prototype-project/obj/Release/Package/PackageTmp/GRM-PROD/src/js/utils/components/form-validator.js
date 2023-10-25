import {
  assign,
  cloneDeep,
  each,
  filter,
  head,
  isEmpty,
  isEqual,
  isString,
  isUndefined,
  sortBy,
  values,
  merge,
} from 'lodash';

import fillDefaults from 'json-schema-fill-defaults';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';

import { getElement, isEmptyElement, setElementByPath, unformatNumber } from '../selectors/currency';
import { PopupActionKind, PopupStyle } from '../../components/general/popup/constants';
import { isEmptyField, isEmptyObject, isFullInvalidDate, makeArray, omitUndefinedProps } from '../utils';

defineMessages({
  confirmDelete: {
    id: 'form.confirm-delete',
    defaultMessage: 'Delete row?',
  },
  modify: {
    id: 'form.modify',
    defaultMessage: 'You are attempting to modify the {field}. Do you want to accept the change?',
  },
  mandatory: {
    id: 'validation.mandatory-field',
    defaultMessage: 'Mandatory field',
  },
  versionInconsistency: {
    id: 'validation.version-inconsistency',
    defaultMessage: 'Version inconsistency',
  },
  maximumValue: {
    id: 'validation.maximum-value',
    defaultMessage: 'The field should be less then {maxValue}',
  },
  minimumValue: {
    id: 'validation.minimum-value',
    defaultMessage: 'The field should be more then {minValue}',
  },
  zeroValue: {
    id: 'validation.zero-value',
    defaultMessage: 'The field should not be zero',
  },
  invalidDate: {
    id: 'validation.invalid-date',
    defaultMessage: 'The date field should have yyyy-mm-dd format',
  },
  duplicateValue: {
    id: 'validation.duplicated-value',
    defaultMessage: 'Duplicated value',
  },
  startDate: {
    id: 'validation.start-date',
    defaultMessage: 'The start date must be before the end date.',
  },
  endDate: {
    id: 'validation.end-date',
    defaultMessage: 'The end date must be after the start date.',
  },
  startPeriod: {
    id: 'validation.start-period',
    defaultMessage: 'The start period must be before the end period.',
  },
  endPeriod: {
    id: 'validation.end-period',
    defaultMessage: 'The end period must be after the start period.',
  },
  reloadPage: {
    id: 'validation.reload-page',
    defaultMessage: 'Please reload the page.',
  },
});

const FLASH_COUNT = 5;
const FLASH_TRUE_TIMEOUT = 250;
const FLASH_FALSE_TIMEOUT = 250;

export function fillSubEntry(entry, section, sectionValues, rootValues) {
  return {
    ...entry,
    [section]: isEmpty(sectionValues) ? undefined : {
      ...entry[section],
      ...sectionValues,
    },
    ...(rootValues || {}),
  };
}

function lowFirstLetter(str) {
  return `${ str.substr(0, 1).toLowerCase() }${ str.substr(1) }`;
}

function getErrorPath(pathStr) {
  const result = [];
  let index;
  const path = pathStr.split('.');
  path.shift();

  each(path, (item) => {
    const chunk = lowFirstLetter(item);
    const res = chunk.match(/(\w+)\[(\d+)\]/);
    if (res) {
      result.push(res[1]);
      index = +res[2];
    } else {
      result.push(chunk);
    }
  });

  return {
    result,
    index,
  };
}

export function getValidationErrors(validationErrors) {
  let result = [];
  let expectedUserResponse = false;
  let actionTypes = [];
  if (validationErrors) {
    const { VersionInconsistency, ValidationMessages, error, responseError, Message: headerMessage } = validationErrors;
    if (VersionInconsistency) {
      result.push({ intlId: 'validation.version-inconsistency' });
    }
    if (headerMessage) {
      result.push({ message: headerMessage });
    }
    each(ValidationMessages, ({ Message, Path, ExpectedUserResponse, ActionType }) => {
      const errorPath = getErrorPath(Path);
      if (isUndefined(errorPath.index)) {
        result.push({ message: Message, path: errorPath.result, expectedUserResponse: ExpectedUserResponse, actionType: ActionType });
      } else {
        result.push({ message: `${ Message } (line ${ errorPath.index + 1 })`, path: errorPath.result, index: errorPath.index, expectedUserResponse: ExpectedUserResponse, actionType: ActionType });
      }
    });
    if (!result.length) {
      if (responseError) {
        result.push({ message: `(${ responseError.status }): ${ responseError.message }` });
      }
      if (error) {
        result.push({ message: error });
      }
    }
    if (result.length > 0) {
      const sorted = sortBy(result, (item) => {
        return [item.actionType, item.expectedUserResponse, item.message, item.index];
      });

      if (sorted[0].expectedUserResponse) {
        expectedUserResponse = sorted[0].expectedUserResponse;
      }

      actionTypes = [];
      result = [];
      each(sorted, (item) => {
        if (item.expectedUserResponse === sorted[0].expectedUserResponse) {
          result.push(item);
          actionTypes.push(item.actionType);
        }
      });
    }
  }
  return {
    messages: result,
    expectedUserResponse,
    actionTypes,
  };
}

export const defaultValidator = {
  getError: () => undefined,
  getErrors: () => undefined,
  onChange: (value, index, update, done) => { if (done) done(); },
  setValue: () => undefined,
  onClear: (index, update, done) => { if (done) done(); },
  onRestoreField: () => {},
  onChangeProps: () => {},
  mandatory: false,
  getMandatory: () => false,
  isChanged: () => false,
  onAddRow: () => {},
  onDeleteRow: () => {},
  onChangeCell: () => {},
  onModify: () => {},
  getColumnValidator: () => (defaultValidator),
  metadata: { endpoints: [] },
  isEditMode: () => false,
  onRef: () => () => {},
};

const defaultMetadata = {
  mandatory: false,
};

const defaultIntl = {
  formatMessage() {
  },
};

function defaultPopupOpen() {
}

const defaultNumberOptions = {
  decimal: '.',
};

export class FormValidator {
  constructor(instance, options, intl, popupOpen, numberOptions) {
    this.instance = instance;
    this.options = options;
    this.intl = intl || defaultIntl;
    this.popupOpen = popupOpen || defaultPopupOpen;
    this.numberOptions = numberOptions || defaultNumberOptions;
    this.isDirty = false;
    this.flashCount = FLASH_COUNT;
    this.errors = [];
    this.setEntry = instance.props.setEntry;
    this.reset();
    this.init();
  }

  setMetadata(metadata) {
    this.metadata = metadata;
    this.init();
  }

  reset() {
    this.errors = [];
    this.valid = true;
    this.flashCount = FLASH_COUNT;
    each(this.tabs, (tab) => {
      tab.valid = true;
      tab.invalid = false;
    });
  }

  init() {

    this.tabs = {};
    each(this.options.tabs, (tab, id) => {
      this.tabs[id] = {
        valid: true,
      };
    });

    this.fields = {};
    each(this.options.fields, (optField, key) => {
      const field = this.fillField(optField, key);
      this.fields[key] = field;
      const { columns } = optField;
      each(columns, (column) => {
        const id = column.id;
        field.columns[id] = { ...this.fillField(column, id, key), tabId: field.tabId };
      });
    });
  }

  @autobind
  setSubEntry(section, sectionValues, rootValues) {
    const { entry } = this.instance.props;
    this.setEntry(fillSubEntry(entry, section, sectionValues, rootValues));
  }

  @autobind
  setEntryFields(rootValues) {
    const { entry } = this.instance.props;
    this.setEntry({
      ...entry,
      ...(rootValues || {}),
    });
  }

  haveChangedEntryProps(props, ...names) {
    if (props === this.instance.props) {
      return true;
    }
    let changed = false;
    each(names, (name) => {
      if (this.instance.props.entry[name] !== props.entry[name]) {
        changed = true;
      }
    });
    return changed;
  }

  getMetadata(metadataName, parentKey, metadataDefault) {
    if (!this.metadata && !metadataDefault) {
      return defaultMetadata;
    }

    let root;
    if (parentKey) {
      const { metadata: parentMetadata } = this.fields[parentKey];
      root = parentMetadata.children;
    } else {
      root = this.metadata ? this.metadata.children : null;
    }

    const metadata = getElement(root, metadataName);

    return metadata ? { ...metadataDefault, ...metadata } : { ...defaultMetadata, ...metadataDefault };
  }

  @autobind
  fillField(field, key, parentKey) {
    const { path, errorPath, schema, tabId, mandatory, metadata: metadataName
      , predicate, itemValue, confirmDeleteRow, isUniq, startDate, endDate, startPeriod, endPeriod, clearError
      , uniqIntlId, effect, noError, editable, canRemoveRow, deletionRowConfirmMessage, noZero, zeroToEmpty
      , isDate, metadataDefault } = field;
    const metadata = this.getMetadata(metadataName, parentKey, metadataDefault);
    return {
      mandatory: metadata.isRequired || mandatory,
      metadata,
      path,
      errorPath,
      schema,
      key,
      parentKey,
      columns: {},
      tabId,
      predicate,
      editable,
      effect,
      itemValue,
      confirmDeleteRow,
      isUniq,
      uniqIntlId,
      startDate,
      endDate,
      startPeriod,
      endPeriod,
      clearError,
      noError,
      canRemoveRow,
      deletionRowConfirmMessage,
      noZero,
      zeroToEmpty,
      isDate,
      isEditMode: this.isEditMode.bind(this),
      onChange: this.onChange.bind(this, key, parentKey),
      setValue: this.setValue.bind(this, key, parentKey),
      onClear: this.onClear.bind(this, key, parentKey),
      getError: this.getError.bind(this, key, parentKey),
      getErrors: this.getErrors.bind(this, key, parentKey),
      getMandatory: this.getMandatory.bind(this, key, parentKey),
      isChanged: this.isChangedField.bind(this, key, parentKey),
      onAddRow: this.onAddRow.bind(this, key, parentKey),
      onDeleteRow: this.onDeleteRow.bind(this, key, parentKey),
      onModify: this.onModify.bind(this, key, parentKey),
      getColumnValidator: this.getColumnValidator.bind(this, key, parentKey),
      onRef: this.onRef,
      validate: this.validate,
    };
  }

  @autobind
  onRef({ editMode, isFirst }) {
    return (editMode && isFirst) ? this.onRefFirstNode : null;
  }

  @autobind
  getColumnValidator(key, parentKey, id) {
    const columns = this.getValidator(key, parentKey).columns;
    return columns[id];
  }

  @autobind
  getValidator(key, parentKey) {
    let root = this.fields;
    if (parentKey) {
      const base = this.fields[parentKey];
      root = base ? base.columns : {};
    }
    const validator = root[key];
    return validator || defaultValidator;
  }

  @autobind
  isChangedField(key, parentKey) {
    const { path } = this.getValidator(key, parentKey);
    const { entry, oldEntry } = this.instance.props;
    const val = getElement(entry, path);
    const oldVal = getElement(oldEntry, path);
    return !isEqual(val, oldVal);
  }

  @autobind
  onChangeProps({ editMode, metadata, validationErrors, entry }) {
    this.metadata = metadata;
    this.validationErrors = [];
    const errorsNotEmpty = this.errors && this.errors.length;
    if (validationErrors && !this.isDirty) {
      const { messages } = getValidationErrors(validationErrors);
      const fieldsValues = values(this.fields);
      each(messages, ({ message, path, intlId, intlValues, index }) => {
        each(fieldsValues, (field) => {
          if (isEqual(path, field.path)) {
            this.validationErrors.push({ key: field.key, path: field.path, message, intlId, intlValues });
          }
          each(field.columns, (column) => {
            const fullPath = [...field.path, ...(column.errorPath ? column.errorPath : column.path)];
            if (isEqual(path, fullPath)) {
              this.validationErrors.push({
                parentKey: field.key,
                key: column.key,
                index,
                path: fullPath,
                message,
                intlId,
                intlValues,
              });
            }
          });
        });
      });
    }
    this.reset();
    this.init();
    const isNewEntry = entry !== this.validatedEntry;
    if (this.validationErrors.length || errorsNotEmpty || isNewEntry) {
      this.validate(entry);
    }
    if (editMode) {
      this.disableChangeRoute();
    } else {
      this.enableChangeRoute();
    }
  }

  @autobind
  onChange(key, parentKey, val, index, entryUpdates, done) {
    this.changeEntry(key, parentKey, val, index, entryUpdates, done, false);
  }

  @autobind
  onClear(key, parentKey, index, entryUpdates, done) {
    this.changeEntry(key, parentKey, undefined, index, entryUpdates, done, true);
  }

  @autobind
  setValue(key, parentKey, entry, val, index) {
    const validator = this.getValidator(key, parentKey);
    const { schema, path, zeroToEmpty } = validator;
    this.setEntryValue(entry, parentKey, path, schema, zeroToEmpty, val, index);
    return entry;
  }

  @autobind
  changeEntry(key, parentKey, val, index, entryUpdates, done, clear) {
    if (this.instance.props.isSaving) {
      return;
    }
    const newEntry = cloneDeep(this.instance.props.entry);
    if (entryUpdates) {
      merge(newEntry, entryUpdates);
    }
    this.isDirty = true;
    const validator = this.getValidator(key, parentKey);
    const { schema, path, clearError, zeroToEmpty } = validator;
    const fullPath = this.setEntryValue(newEntry, parentKey, path, schema, zeroToEmpty, val, index, clear);

    // clear validation errors for changed field
    this.validationErrors = filter(this.validationErrors, ({ key: fieldKey }) => (fieldKey !== key));
    if (clearError) {
      each(clearError, (errorKey) => {
        this.validationErrors = filter(this.validationErrors, ({ key: fieldKey }) => (fieldKey !== errorKey));
      });
    }
    this.validate(newEntry);
    this.setEntry(newEntry, { key, parentKey, index, fullPath, value: val });
    if (entryUpdates) {
      assign(entryUpdates, newEntry);
    }
    if (done) {
      setTimeout(done, 0);
    }
  }

  @autobind
  setEntryValue(newEntry, parentKey, path, schema, zeroToEmpty, val, index, clear) {
    let fullPath;
    if (parentKey) {
      const { path: parentPath } = this.getValidator(parentKey);
      fullPath = [...parentPath, ...path];
    } else {
      fullPath = [...path];
    }
    if (!clear && !isUndefined(val) && schema) {
      val = fillDefaults(val, schema);
    }
    if (zeroToEmpty) {
      if (val === 0) {
        val = '';
      }
    }
    setElementByPath(newEntry, val, index, fullPath);
    return fullPath;
  }

  @autobind
  onRestoreField({ key, parentKey }) {
    const { oldEntry } = this.instance.props;
    const { path } = this.getValidator(key, parentKey);
    const val = getElement(oldEntry, path);
    this.onChange(key, parentKey, val);
  }

  @autobind
  onModify(key, parentKey, labelIntlId, labelIntlValues) {
    const { popupOpen, intl } = this;
    let name = key;
    if (labelIntlId) {
      name = intl.formatMessage({ id: labelIntlId }, labelIntlValues);
      if (name && name.length && name[name.length - 1] === ':') {
        name = name.substr(0, name.length - 1);
      }
    }

    popupOpen({
      style: 'warning',
      message: intl.formatMessage({ id: 'form.modify' }, { field: name }),
      actions: [
        { kind: 'yes' },
        { kind: 'no', func: this.onRestoreField, arg: { key, parentKey } },
      ],
    });
  }

  getErrors(key, parentKey, index) {
    if (!this.errors.length) {
      return undefined;
    }
    const det = omitUndefinedProps({ key, parentKey, index });
    return filter(this.errors, det);
  }

  getError(key, parentKey, index) {
    if (!this.errors.length) {
      return undefined;
    }
    let errors = [];
    if (isUndefined(index)) {
      if (parentKey) {
        errors = filter(this.errors, error => error.key === key && error.parentKey === parentKey && error.index === undefined);
      } else {
        errors = filter(this.errors, error => error.key === key && error.parentKey === undefined);
      }
    } else {
      errors = filter(this.errors, { key, parentKey, index });
    }
    const result = [];
    each(errors, ({ message, intlId, intlValues }) => {
      if (message) {
        result.push(message);
      }
      if (intlId) {
        result.push(this.intl.formatMessage({ id: intlId }, intlValues));
      }
    });
    return result.join(', ');
  }

  getMandatory(key, parentKey) {
    const { entry } = this.instance.props;
    const { predicate, mandatory, metadata } = this.getValidator(key, parentKey);
    if (mandatory || (metadata && metadata.mandatory) || (metadata && metadata.isRequired)) {
      if (predicate) {
        if (!predicate(entry, this.instance)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  @autobind
  doDeleteRow({ key, rowInfo }) {
    const { path } = this.fields[key];
    const { index, onDeleteRow } = rowInfo;
    const { entry: newEntry } = this.instance.props;
    const tableName = head(path);
    const table = makeArray(newEntry[tableName]);
    table.splice(index, 1);
    const modifiedEntry = {
      ...newEntry,
      [tableName]: [...table],
    };
    this.validate(modifiedEntry);
    this.setEntry(modifiedEntry);
    if (onDeleteRow) {
      onDeleteRow();
    }
  }

  @autobind
  onDeleteRow(key, parentKey, rowInfo) {
    const { confirmDeleteRow, deletionRowConfirmMessage } = this.getValidator(key, parentKey);

    if (confirmDeleteRow) {
      this.popupOpen({
        style: 'warning',
        message: this.intl.formatMessage({ id: deletionRowConfirmMessage || 'form.confirm-delete' }),
        actions: [
          { kind: PopupActionKind.yes, func: this.doDeleteRow, arg: { key, rowInfo } },
          { kind: PopupActionKind.no },
        ],
      });
    } else {
      this.doDeleteRow({ key, rowInfo });
    }
  }

  @autobind
  onAddRow(key, parentKey, entryUpdate) {
    const { schema, path } = this.getValidator(key, parentKey);
    const { entry: newEntry } = this.instance.props;
    const tableName = head(path);
    const table = makeArray(newEntry[tableName]);
    const row = fillDefaults({}, schema);
    const newRow = { ...row, ...entryUpdate };
    table.push(newRow);
    this.setEntry({
      ...newEntry,
      [tableName]: [...table],
    });
  }

  @autobind
  onEdit() {
    this.disableChangeRoute();
    this.reset();
    this.isDirty = false;
    this.setFirstFocus();
  }

  @autobind
  onSave() {
    this.validate();
    if (this.valid) {
      this.reset();
      this.isDirty = false;
      this.enableChangeRoute();
    } else {
      this.flashErrors();
    }
    return this.valid;
  }

  @autobind
  onFlashTimeout() {
    let flashErrors = this.flashState;
    if (this.flashCount < FLASH_COUNT) {
      setTimeout(this.onFlashTimeout, flashErrors ? FLASH_TRUE_TIMEOUT : FLASH_FALSE_TIMEOUT);
      this.flashCount++;
      this.flashState = !this.flashState;
    } else {
      this.flashCount = FLASH_COUNT;
      this.flashState = false;
      flashErrors = false;
    }
    this.instance.setState({ flashErrors });
  }

  flashErrors() {
    if (this.flashCount < FLASH_COUNT) {
      return;
    }
    this.instance.setState({ flashErrors: true });
    this.flashState = true;
    this.flashCount = 0;
    this.onFlashTimeout();
  }

  @autobind
  confirmChangeRoute({ id = 'required-attendance.disable-change-route', func } = {}) {
    const { popupOpen, intl } = this;
    const message = intl.formatMessage({ id });
    popupOpen({
      style: PopupStyle.confirm,
      message,
      actions: [
        { kind: PopupActionKind.ok, func, arg: false },
      ],
    });
  }

  disableChangeRoute() {
    if (this.unblock) {
      return;
    }
    const { intl, history, editModeStart } = this.instance.props;
    if (history) {
      const { block } = history;
      const message = intl.formatMessage({ id: 'required-attendance.disable-change-route' });
      this.unblock = block(message);
    }
    if (editModeStart) {
      editModeStart();
    }
  }

  enableChangeRoute() {
    const { editModeEnd } = this.instance.props;
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
      if (editModeEnd) {
        editModeEnd();
      }
    }
  }

  isEditMode() {
    return this.instance.props.editMode;
  }

  @autobind
  onRefFirstNode(node) {
    this.firstNode = node;
  }

  @autobind
  onDidMount() {
    if (this.instance.props.editMode) {
      this.disableChangeRoute();
    }
    this.setFirstFocus();
    this.validate();
  }

  @autobind
  setFirstFocus() {
    if (this.firstNode) {
      this.firstNode.focus();
    }
  }

  @autobind
  onWillUnmount() {
    this.enableChangeRoute();
  }

  @autobind
  onCancel(continueAction, cancelAction) {
    this.reset();
    this.popupOpen({
      style: 'warning',
      message: this.intl.formatMessage({ id: 'required-attendance.edit-cancel' }),
      actions: [
        { kind: 'continue', action: continueAction, func: this.doOnCancel }, // continue cancelling
        { kind: 'cancel', action: cancelAction }, // cancel cancelling
      ],
    });
  }

  @autobind
  doOnCancel() {
    this.reset();
    this.enableChangeRoute();
  }

  setValid(valid, tabId) {
    this.valid = false;
    this.invalid = !this.valid;
    const tab = this.tabs[tabId];
    if (tab) {
      tab.valid = valid;
      tab.invalid = !tab.valid;
    }
  }

  addMandatoryErrorMessage(value, itemValue, key, parentKey, path, index, mandatory, noZero) {
    if (value && itemValue) {
      value = value[itemValue];
    }
    if ((isEmptyField(value) || isEmptyObject(value)) && mandatory) {
      const error = { key, parentKey, index, path, intlId: 'validation.mandatory-field' };
      if (!isUndefined(index)) {
        error.index = index;
      }
      this.errors.push(error);
    } else if (noZero) {
      if (isString(value)) {
        if (value === '' && !mandatory) {
          return;
        }
        value = unformatNumber(value, this.numberOptions);
      }
      if (!value) {
        this.errors.push({ key, parentKey, intlId: 'validation.zero-value' });
      }
    }
  }

  validateMandatoryFields(newEntry) {
    each(this.fields, (field, key) => {
      const { path, mandatory, itemValue, predicate, metadata: { isCollection }, columns, parentKey, noZero } = field;
      if (mandatory || isCollection || noZero) {
        if (predicate && !predicate(newEntry, this.instance)) {
          return;
        }

        if (!isEmpty(columns)) {
          each(columns, ({ key, parentKey, itemValue, mandatory, noError, predicate, path: chieldPath, noZero }) => {
            if ((mandatory || noZero) && !noError) {
              if (predicate && !predicate(newEntry, this.instance)) {
                return;
              }

              const fullPath = [...path, ...chieldPath];
              if (isCollection) {
                const rows = getElement(newEntry, parentKey);
                each(rows, (row, index) => {
                  const value = row[key];
                  this.addMandatoryErrorMessage(value, itemValue, key, parentKey, fullPath, index, mandatory, noZero);
                });
              } else {
                const value = getElement(newEntry, fullPath);
                this.addMandatoryErrorMessage(value, itemValue, key, parentKey, fullPath, undefined, mandatory, noZero);
              }
            }
          });
        } else {
          const value = getElement(newEntry, path);
          this.addMandatoryErrorMessage(value, itemValue, key, parentKey, path, undefined, mandatory, noZero);
        }
      }
    });
  }

  addMaxValueErrorMessage(value, itemValue, maxValue, key, parentKey, invert, index) {
    if (value && itemValue) {
      value = value[itemValue];
    }
    if (isString(value)) {
      value = unformatNumber(value, this.numberOptions);
    }
    if (isString(maxValue)) {
      maxValue = unformatNumber(maxValue, this.numberOptions);
    }
    let error;
    if (!invert && value > maxValue) {
      error = { key, parentKey, intlId: 'validation.maximum-value', intlValues: { maxValue } };
    } else if (invert && value < maxValue) {
      error = { key, parentKey, intlId: 'validation.minimum-value', intlValues: { minValue: maxValue } };
    }
    if (error) {
      if (!isUndefined(index)) {
        error.index = index;
      }
      this.errors.push(error);
    }
  }

  validateMaxValue(newEntry) {
    each(this.fields, (field) => {
      const {
        path,
        itemValue,
        predicate,
        metadata: { maxValue, minValue, children, isCollection },
        columns,
        key,
        parentKey,
      } = field;

      if (predicate && !predicate(newEntry, this.instance)) {
        return;
      }

      if (maxValue || minValue) {
        const val = getElement(newEntry, path);
        this.addMaxValueErrorMessage(val, itemValue, maxValue, key, parentKey);
        this.addMaxValueErrorMessage(val, itemValue, minValue, key, parentKey, true);
      }

      if (children) {
        each(columns, child => {
          const { path, key, parentKey, itemValue, predicate, metadata: { maxValue, minValue } } = child;
          if (predicate && !predicate(newEntry, this.instance)) {
            return;
          }
          if (isUndefined(maxValue) && isUndefined(minValue)) {
            return;
          }
          if (isCollection) {
            const rows = getElement(newEntry, parentKey);
            each(rows, (row, index) => {
              const value = row[key];
              this.addMaxValueErrorMessage(value, itemValue, maxValue, key, parentKey, false, index);
              this.addMaxValueErrorMessage(value, itemValue, minValue, key, parentKey, true, index);
            });
          } else {
            let value;
            if (parentKey) {
              const { path: parentPath } = this.getValidator(parentKey);
              value = getElement(newEntry, parentPath, path);
            } else {
              value = getElement(newEntry, path);
            }
            this.addMaxValueErrorMessage(value, itemValue, maxValue, key, parentKey);
            this.addMaxValueErrorMessage(value, itemValue, minValue, key, parentKey, true);
          }
        });
      }
    });
  }

  validateUniqColumns(newEntry) {
    each(this.fields, (field) => {
      const { predicate, columns, path, key: parentKey } = field;
      if (isEmpty(columns) || predicate && !predicate(newEntry, this.instance)) {
        return;
      }

      each(columns, (column) => {
        const { path: columnPath, key, predicate, isUniq, uniqIntlId } = column;
        if (!isUniq || predicate && !predicate(newEntry, this.instance)) {
          return;
        }
        const table = getElement(newEntry, path);
        const duplicatedIndexes = [];
        each(table, (row, index) => {
          const el = getElement(row, columnPath);
          if (isEmptyElement(el)) {
            return;
          }
          each(table, (subRow, subIndex) => {
            if (index === subIndex || duplicatedIndexes.indexOf(subIndex) >= 0) {
              return;
            }
            const subEl = getElement(subRow, columnPath);
            if (typeof el === 'number' || typeof subEl === 'number') {
              if (isEqual(unformatNumber(el, this.numberOptions), unformatNumber(subEl, this.numberOptions))) {
                this.errors.push({ key, parentKey, index: subIndex, intlId: uniqIntlId });
                duplicatedIndexes.push(subIndex);
              }
            } else if (isEqual(el, subEl)) {
              if (isEmptyObject(el)) {
                return;
              }
              this.errors.push({ key, parentKey, index: subIndex, intlId: uniqIntlId });
              duplicatedIndexes.push(subIndex);
            }
          });
        });
      });
    });
  }

  checkPairDate(fields, entry, path, startDate, endDate, key, parentKey, index) {
    if (!startDate && !endDate) {
      return;
    }

    let startPath, endPath, startKey, endKey;
    if (startDate) {
      startPath = fields[startDate].path;
      startKey = startDate;
      endPath = path;
      endKey = key;
    }
    if (endDate) {
      startPath = path;
      startKey = key;
      endPath = fields[endDate].path;
      endKey = endDate;
    }

    const startEl = getElement(entry, startPath);
    const endEl = getElement(entry, endPath);

    const startD = new Date(startEl);
    const endD = new Date(endEl);
    if (startD > endD) {
      this.errors.push({ key: startKey, parentKey, index, intlId: 'validation.start-date' });
      this.errors.push({ key: endKey, parentKey, index, intlId: 'validation.end-date' });
    }
  }

  validatePairs(newEntry) {
    each(this.fields, (field) => {
      const { predicate, columns, path, key: parentKey, startDate, endDate, startPeriod, endPeriod } = field;
      if (predicate && !predicate(newEntry, this.instance)) {
        return;
      }

      this.checkPairDate(this.fields, newEntry, path, startDate, endDate, parentKey);
      this.checkPairPeriod(this.fields, newEntry, path, startPeriod, endPeriod, parentKey);

      if (!isEmpty(columns)) {
        const table = getElement(newEntry, path);
        each(table, (row, index) => {
          each(columns, (column) => {
            const { path: columnPath, key, predicate, startDate, endDate, startPeriod, endPeriod } = column;
            if (!startDate && !endDate && !startPeriod && !endPeriod) {
              return;
            }
            const el = getElement(row, columnPath);
            if (predicate && !predicate(el, this.instance)) {
              return;
            }
            this.checkPairDate(columns, row, columnPath, startDate, endDate, key, parentKey, index);
            this.checkPairPeriod(columns, row, columnPath, startPeriod, endPeriod, key, parentKey, index);
          });
        });
      }
    });
  }

  checkDate(value, key, parentKey, index) {
    if (!isEmpty(value) && isFullInvalidDate(value)) {
      this.errors.push({ key, parentKey, intlId: 'validation.invalid-date', index });
    }
  }

  validateDates(newEntry) {
    each(this.fields, (field) => {
      const { columns, path, key: parentKey, isDate } = field;
      if (isDate) {
        const el = getElement(newEntry, path);
        this.checkDate(el, parentKey);
      } else if (!isEmpty(columns)) {
        const table = getElement(newEntry, path);
        each(table, (row, index) => {
          each(columns, (column) => {
            const { path: columnPath, key, isDate } = column;
            if (!isDate) {
              return;
            }
            const el = getElement(row, columnPath);
            this.checkDate(el, key, parentKey, index);
          });
        });
      }
    });
  }

  checkPairPeriod(fields, entry, path, startPeriod, endPeriod, key, parentKey, index) {
    if (!startPeriod && !endPeriod) {
      return;
    }

    let startPath, endPath, startKey, endKey;
    if (startPeriod) {
      startPath = fields[startPeriod].path;
      startKey = startPeriod;
      endPath = path;
      endKey = key;
    }
    if (endPeriod) {
      startPath = path;
      startKey = key;
      endPath = fields[endPeriod].path;
      endKey = endPeriod;
    }

    const startEl = getElement(entry, startPath);
    const endEl = getElement(entry, endPath);

    const startP = parseInt(startEl, 10);
    const endP = parseInt(endEl, 10);

    if (startP > endP) {
      this.errors.push({ key: startKey, parentKey, index, intlId: 'validation.start-period' });
      this.errors.push({ key: endKey, parentKey, index, intlId: 'validation.end-period' });
    }
  }

  @autobind
  validate(newEntry) {
    if (!newEntry) {
      newEntry = this.instance.props.entry;
    }
    this.valid = true;
    this.invalid = !this.valid;
    this.errors = [];
    this.validatedEntry = newEntry;
    each(this.tabs, (tab) => {
      tab.valid = true;
      tab.invalid = false;
    });

    this.validateMandatoryFields(newEntry);
    this.validateMaxValue(newEntry);
    this.validateUniqColumns(newEntry);
    this.validatePairs(newEntry);
    this.validateDates(newEntry);

    if (this.validationErrors) {
      this.errors = [...this.errors, ...this.validationErrors];
    }
    if (this.errors.length) {
      this.setValid(false);
    }
    each(this.errors, ({ key, parentKey }) => {
      const validator = this.getValidator(key, parentKey);
      if (validator && validator.tabId) {
        this.setValid(false, validator.tabId);
      }
    });
  }

  @autobind
  getEntry() {
    return this.instance.props.entry;
  }
}
