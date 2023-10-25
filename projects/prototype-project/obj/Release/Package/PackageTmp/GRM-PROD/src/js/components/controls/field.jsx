import React, { PureComponent, Component } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { isUndefined, pick, isNumber, isNaN, trim, debounce } from 'lodash';

import {
  getCurrencyOptions, getDigit1Options, getDigit0Options, getDigit2Options,
  formatNumber, formatZeroNumber, unformatNumber, formatEmptyNumber, formatMoney,
} from '../../utils/selectors/currency';
import { defaultValidator } from '../../utils/components/form-validator';

import Dropdown from '../../components/controls/dropdown';
import RelativePortal from '../general/relative-portal/relative-portal';
import CustomTooltip from '../general/custom-tooltip/custom-tooltip';
import DatePicker from '../general/date-picker/date-picker';

import './field.scss';
import { focusKeyDown } from '../../utils/components/keyboard';
import { isEmptyOrDash } from '../../utils/utils';


const INPUT_PROPS = [
  'className',
  'onBlur',
  'type',
  'value',
];

const NUMBER_CHARS = '01234567890 -,.';

function isNumberKey(key, ctrlKey, altKey) {
  if (ctrlKey || altKey || key.length > 1) {
    return true;
  }
  return NUMBER_CHARS.indexOf(key) >= 0;
}

export class FieldComponent extends PureComponent {

  static defaultProps = {
    validator: defaultValidator,
  };

  constructor(props) {
    super(props);
    this.state = {
      mouseHovered: false,
    };

    this.fieldCenter = 0;
  }

  componentDidMount() {
    if (this.node) {
      this.fieldCenter = this.node.getBoundingClientRect().width / 2;
    }
  }

  componentWillReceiveProps(props) {
    const { checkErrors, value, validator } = props;
    if (checkErrors && value !== this.props.value) {
      validator.validate();
    }
  }

  onMouseOver = () => {
    this.setState({ mouseHovered: true });
  };

  onMouseOut = () => {
    this.setState({ mouseHovered: false });
  };

  renderError(error) {
    const { isDataGridField } = this.props;
    const { mouseHovered } = this.state;

    const errorClassName = classNames(
      { 'field__error': !isDataGridField },
      { 'field__error-tooltip': isDataGridField }
    );

    if (error) {
      return (
        isDataGridField
          ? (mouseHovered && <RelativePortal top={ 0 } left={ 0 }><CustomTooltip errorClassName={ errorClassName } error={ error } isDataGridField={ isDataGridField } fieldCenter={ this.fieldCenter } /></RelativePortal>)
          : <div className={ errorClassName } aria-label={ error } > { error } </div>
      );
    }

    return null;
  }

  render() {
    const { value, labelIntlId, labelIntlValues, intl, small, wrap, selected, hideTitle, labelComponent,
      inRadioButton, noBackground, children, editMode, index, isDataGridField, disabled, className, isNumber,
      validator, error: propError,
    } = this.props;

    const { getError, getMandatory } = validator;
    const mandatory = getMandatory(index);

    const error = propError || (isDataGridField ? getError(index) : getError());
    const fieldClassName = classNames('field', className, {
      'field--small': small,
      'field--wrap': wrap,
      'field--edit': editMode,
      'field--disabled': disabled,
      'field--selected': selected,
      'field--no-background': noBackground,
      'field--inside-radio-button': inRadioButton,
      'field--in-data-grid': isDataGridField,
      'field--number': isNumber,
      'field--error': error,
    });
    const valueClassName = classNames('field__value', {
      'field__value--no-background': noBackground,
      'field__value--wrap': wrap,
    });

    let fieldTitle = null;
    if (!hideTitle && !labelComponent) {
      fieldTitle = (
        <div
          className={ classNames('field__label', {
            'field__label--mandatory': editMode && mandatory,
            'field__label--error': error,
          }) }
          ref={ (node) => { this.node = node; } }
        >
          { labelIntlId && intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
        </div>
      );
    } else if (labelComponent) {
      fieldTitle = labelComponent;
    }

    return (
      <div
        className={ fieldClassName }
        onMouseOver={ this.onMouseOver }
        onMouseOut={ this.onMouseOut }
      >
        { fieldTitle }
        { children || <div className={ valueClassName }>
          { value || '-' }
        </div>
        }
        { this.renderError(error) }
      </div>
    );
  }
}

const Field = injectIntl(FieldComponent);

class NumberInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      strValue: props.value,
    };
  }

  componentWillReceiveProps(props) {
    const { strValue } = this.state;
    const { value } = props;
    const isInputActive = this.inputNode && this.inputNode === document.activeElement;
    if (value !== strValue && !isInputActive) {
      this.setState({ strValue: value });
    }
  }

  @autobind
  onChange(e) {
    const { value: strValue } = e.target;
    this.setState({ strValue });
  }

  @autobind
  onKeyDown(event) {
    const { key, ctrlKey, altKey } = event;
    if (!isNumberKey(key, ctrlKey, altKey)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @autobind
  onBlur(e) {
    const { onValueChange, onBlur, value } = this.props;
    const { strValue } = this.state;
    if (onValueChange && strValue !== value) {
      onValueChange(strValue);
    }
    if (onBlur) {
      onBlur(e);
    }
  }

  @autobind
  getRef(node) {
    const { getRef } = this.props;
    this.inputNode = node;
    if (getRef) {
      getRef(node);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.strValue !== nextState.strValue;
  }

  render() {
    const { strValue } = this.state;
    return (
      <input
        { ...pick(this.props, INPUT_PROPS) }
        onChange={ this.onChange }
        onKeyDown={ this.onKeyDown }
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        value={ strValue }
        ref={ this.getRef }
      />
    );
  }

}

class Input extends Component {
  static defaultProps = {
    validator: defaultValidator,
    placeholderIntlId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.value,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, force) {
    const isInputActive = this.inputNode && this.inputNode === document.activeElement;
    if (!force && isInputActive) {
      return;
    }
    const { onChangeValue, value } = props;
    const isChangedProps = value !== this.props.value;
    const inputValue = isUndefined(value) ? '' : value;
    const isChangedState = inputValue !== this.state.inputValue;

    if (isChangedProps && onChangeValue && !force) {
      onChangeValue(value, this.props.value);
    }
    if (isChangedState || force) {
      this.setState({ inputValue });
    }
    if (isChangedState && !force) {
      this.update(inputValue);
    }
  }

  update = debounce(this.saveValue, 700);

  @autobind
  saveValue(value) {
    const { validator: { onChange }, index, onChange: onChangeProp, noSave, isNumber, options, editMode } = this.props;
    this.debounced = false;
    if (!editMode) {
      return;
    }
    let prevValue = this.props.value;
    if (isNumber && value !== '') {
      value = unformatNumber(value, options);
      prevValue = unformatNumber(prevValue, options);
    }
    if (!noSave && value !== prevValue) {
      onChange(value, index);
    }
    if (onChangeProp && !isNumber) {
      onChangeProp(value, index);
    }
  }

  @autobind
  onChange(e) {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.debounced = true;
    this.update(value);
  }

  @autobind
  onBlur() {
    const { confirmModify, labelIntlId, labelIntlValues, validator: { isChanged, onModify }, value } = this.props;
    const { inputValue } = this.state;
    if (confirmModify && (isChanged() || this.debounced)) {
      onModify(labelIntlId, labelIntlValues);
    }
    if (value !== inputValue) {
      this.saveValue(inputValue);
    }
  }

  @autobind
  getRef(node) {
    this.inputNode = node;
    const { getRef } = this.props;
    if (getRef) {
      getRef(node);
    }
  }

  render() {
    const { editMode, value, validator: { mandatory, getError, metadata, editable },
      index, isDataGridField, isNumber, disabled: isDisabled, placeholderIntlId, intl,
      entry, row, column, errorMode, onKeyDown, error: propError } = this.props;
    let maxLength;
    if (metadata) {
      maxLength = metadata.maxLength;
    }

    const disabled = isDisabled || ((editMode && editable) ? !editable(entry, (row && row._original) ? row._original : row, column.id, index) : false);
    const error = propError || (isDataGridField ? getError(index) : getError());
    if (!editMode || disabled) {
      return (
        <Field
          { ...this.props }
          disabled={ disabled }
          isNumber={ isNumber }
          error={ error }
        />
      );
    }

    const placeholder = placeholderIntlId ? intl.formatMessage({ id: placeholderIntlId }) : '';
    const numberValue = isUndefined(value) ? '' : value;
    const { inputValue } = this.state;

    return (
      <Field
        { ...this.props }
      >
        <div
          className={ classNames('field__input', {
            'field__input--mandatory': mandatory,
            'field__input--error': error || errorMode,
            'field__input--edit': editMode,
            'field__input--number': isNumber,
          }) }
        >
          { isNumber ?
            <NumberInput
              { ...this.props }
              type='text'
              value={ numberValue }
              onBlur={ this.onBlur }
              onKeyDown={ onKeyDown }
              getRef={ this.getRef }
            />
          :
            <input
              type='text'
              maxLength={ maxLength }
              value={ inputValue }
              onChange={ this.onChange }
              onBlur={ this.onBlur }
              placeholder={ placeholder }
              ref={ this.getRef }
              onKeyDown={ onKeyDown }
            />
          }
        </div>
      </Field>
    );
  }
}
Field.Input = injectIntl(Input);


// TODO: delete this class after implementation is done
class Date extends Input {

  render() {
    const { editMode, value, validator: { mandatory, getError }, index, isDataGridField, minDate, maxDate } = this.props;
    const inputValue = isEmptyOrDash(value) ? '' : value;

    if (!editMode) {
      return (
        <Field
          { ...this.props }
        />
      );
    }

    return (
      <Field
        { ...this.props }
      >
        <div
          className={ classNames('field__input', {
            'field__input--mandatory': mandatory,
            'field__input--error': (isDataGridField ? getError(index) : getError()),
            'field__input--edit': editMode,
          }) }
        >
          <input
            type='date'
            value={ inputValue }
            onChange={ this.onChange }
            onBlur={ this.onBlur }
            min={ minDate }
            max={ maxDate }
          />
        </div>
      </Field>
    );
  }
}
Field.Date = injectIntl(Date);

// TODO: rename to Date after implementation is done
class DatePick extends Input {

  render() {
    const { editMode } = this.props;

    if (!editMode) {
      return (
        <Field
          { ...this.props }
        />
      );
    }

    return (
      <DatePicker
        { ...this.props }
      />
    );
  }
}

// TODO: rename to Date after implementation is done
Field.DatePick = injectIntl(DatePick);

export class NumberBase extends Component {
  static defaultProps = {
    validator: defaultValidator,
  };

  constructor(props) {
    super(props);
    this.state = {
      version: 0,
    };
  }

  addVersion() {
    let { version } = this.state;
    ++version;
    this.setState({ version });
  }

  haveError({ index, validator: { getError } }) {
    const nextError = getError(index);
    const error = this.error;
    if (nextError !== error) {
      this.error = nextError;
    }
    return !!nextError || !!error;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { mandatory, editable, predicate } = nextProps.validator;

    return (this.haveError(nextProps)
      || this.state.version !== nextState.version
      || this.props.value !== nextProps.value
      || this.props.disabled !== nextProps.disabled
      || this.props.labelIntlId !== nextProps.labelIntlId
      || this.props.editMode !== nextProps.editMode
      || editable
      || predicate
      || mandatory
    );
  }

  @autobind
  onValueChange(valueParam) {
    const { onChange, validator, index, options, validator: { metadata }, noEmpty } = this.props;
    let minValue, maxValue;
    if (metadata) {
      minValue = metadata.minValue;
      maxValue = metadata.maxValue;
    }

    const haveMinValue = !isUndefined(minValue);
    const haveMaxValue = !isUndefined(maxValue);

    let val;
    const value = trim(valueParam);
    if (value === '-') {
      val = undefined;
    } else if (value !== '') {
      val = unformatNumber(value, options);
    }

    if (isUndefined(val)) {
      val = '';
    } else {
      if (haveMinValue && val < minValue) {
        val = minValue;
      }
      if (haveMaxValue && val > maxValue) {
        val = maxValue;
      }
    }

    const newVal = noEmpty ? formatZeroNumber(val, options) : formatEmptyNumber(val, options);
    if (newVal !== valueParam || newVal === '') {
      if (noEmpty) {
        val = unformatNumber(newVal, options);
      }
      this.addVersion();
    }

    if (validator) {
      validator.onChange(val, index, undefined, () => {
        if (onChange) {
          onChange(val, index);
        }
      });
    } else if (onChange) {
      onChange(val, index);
    }
  }

  render() {
    const { options, value, editMode, validator: { metadata } } = this.props;
    const { version } = this.state;
    let minValue, maxValue;
    if (metadata) {
      minValue = metadata.minValue;
      maxValue = metadata.maxValue;
    }
    const error = this.error;

    const val = isNaN(value) ? '' : (editMode ? formatEmptyNumber(value, options) : formatNumber(value, options));
    if (!editMode) {
      return (
        <Field.Input
          { ...this.props }
          numberOptions={ options }
          isNumber
          value={ val }
          error={ error }
        />
      );
    }

    return (
      <Field.Input
        { ...this.props }
        value={ val }
        onValueChange={ this.onValueChange }
        isNumber
        version={ version }
        numberOptions={ options }
        minValue={ minValue }
        maxValue={ maxValue }
        error={ error }
        disableNegative={ isNumber(minValue) && minValue >= 0 }
      />
    );
  }
}

@connect(state => ({
  options: getCurrencyOptions(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
class Number extends NumberBase {
}
Field.Number = injectIntl(Number);

@connect(state => ({
  options: getDigit2Options(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
class Number2 extends NumberBase {
}
Field.Number2 = injectIntl(Number2);

@connect(state => ({
  options: getDigit2Options(state),
  noEmpty: true,
}), (dispatch) => bindActionCreators({
}, dispatch))
class Zero2 extends NumberBase {
}
Field.Zero2 = injectIntl(Zero2);

@connect(state => ({
  options: getDigit1Options(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
class Number1 extends NumberBase {
}
Field.Number1 = injectIntl(Number1);

@connect(state => ({
  options: getDigit0Options(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
class Number0 extends NumberBase {
}
Field.Number0 = injectIntl(Number0);


Field.Info = injectIntl((props) => {
  const { value, small } = props;
  return (
    <div className={ classNames('field', { 'field--small': small }) }>
      <div className='field__info-box'>
        <div className='field__pointer' />
        <div className='field__info' />
        <div className='field__value field__value--info'>
          { value }
        </div>
      </div>
    </div>
  );
});

@connect(state => ({
  options: getCurrencyOptions(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
class Summary extends PureComponent {
  static defaultProps = {
    validator: defaultValidator,
  };

  componentWillReceiveProps(props) {
    const { validator } = props;
    validator.validate();
  }

  render() {
    const { value, labelIntlId, labelIntlValues, intl, options, validator: { getError }, editMode } = this.props;
    if (editMode) {
      return (
        <div className={ classNames('field', 'field--summary') }>
          <Field.Number2 { ...this.props } />
        </div>
      );
    }

    const strValue = formatMoney(value, options);
    const error = getError();
    return (
      <div className={ classNames('field', 'field--summary', { 'field--error': error }) }>
        <div className={ classNames('field__label', { 'field__label--error': error }) }>
          { labelIntlId && intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
        </div>
        <div className='field__summary'>
          { strValue }
        </div>
        { error && <div className='field__error'> { error } </div> }
      </div>
    );
  }
}
Field.Summary = injectIntl(Summary);

class Ellipsis extends Component {
  static propTypes = {
    labelIntlId: PropTypes.string,
    labelIntlValues: PropTypes.object,
    validator: PropTypes.object,
    value: PropTypes.string,
    index: PropTypes.string,
    fieldName: PropTypes.string,
    editMode: PropTypes.bool,
    hideTitle: PropTypes.bool,
    rowMargins: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    inRadioButton: PropTypes.bool,
    isDataGridField: PropTypes.bool,
    onClick: PropTypes.func,
    onClear: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      mouseHovered: false,
    };

    this.fieldCenter = 0;
  }

  static defaultProps = {
    buttonClass: 'field__ellipsis-button',
    haveClearButton: false,
    visibleInReadOnlyMode: true,
  };

  @autobind
  handleOnClick() {
    const { onClick, disabled } = this.props;
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick();
    }
    if (this.buttonNode) {
      this.buttonNode.focus();
    }
  }

  @autobind
  handleOnClear() {
    const { onClear, fieldName } = this.props;
    if (onClear) {
      onClear(fieldName);
    }
  }

  @autobind
  onKeyDown(e) {
    const { onTab, onShiftTab, onClick, disabled } = this.props;
    if (!disabled) {
      focusKeyDown(e, { onTab, onShiftTab, onEnter: onClick });
    }
  }

  @autobind
  onMouseOver() {
    this.setState({ mouseHovered: true });
  }

  @autobind
  onMouseOut() {
    this.setState({ mouseHovered: false });
  }

  componentDidMount() {
    if (this.node) {
      this.fieldCenter = this.node.getBoundingClientRect().width / 2;
    }
  }

  renderError(error) {
    const { isDataGridField } = this.props;
    const { mouseHovered } = this.state;

    const errorClassName = classNames(
      { 'field__error': !isDataGridField },
      { 'field__error-tooltip': isDataGridField }
    );

    if (error) {
      return (
        isDataGridField
          ? (mouseHovered && <RelativePortal top={ 0 } left={ 0 }><CustomTooltip errorClassName={ errorClassName } error={ error } isDataGridField={ isDataGridField } fieldCenter={ this.fieldCenter } /></RelativePortal>)
          : <div className={ errorClassName } aria-label={ error } > { error } </div>
      );
    }

    return null;
  }

  render() {
    const { value, labelIntlId, labelIntlValues, small, hideTitle, rowMargins, inRadioButton,
      isDataGridField, index, validator, editMode, disabled, buttonClass,
      visibleInReadOnlyMode, haveClearButton } = this.props;

    const { getError, getMandatory } = (validator || defaultValidator);
    const mandatory = getMandatory(index);
    const error = (isDataGridField ? getError(index) : getError());
    const available = editMode || visibleInReadOnlyMode;
    const availableAction = editMode && !disabled;

    let fieldTitle = null;
    if (!hideTitle) {
      fieldTitle = (<div className={ classNames('field__label', {
        'field__label--mandatory': editMode && mandatory,
        'field__label--error': error,
      }) }
      >
        { labelIntlId ? this.props.intl.formatMessage({ id: labelIntlId }, labelIntlValues) : '' }
      </div>);
    }

    return (
      <div
        className={ classNames('field', {
          'field--small': small,
          'field--row-margins': rowMargins,
          'field--inside-radio-button': inRadioButton,
        }) }
        onMouseOver={ this.onMouseOver }
        onMouseOut={ this.onMouseOut }
        ref={ (node) => { this.node = node; } }
      >
        { fieldTitle }
        <div className={ classNames('field__ellipsis-box', {
          'field__ellipsis-box--edit': editMode && !disabled,
          'field__ellipsis-box--error': error,
          'field__ellipsis-box--disabled': disabled,
        }) }
        >
          <div className={ classNames('field__value',
            { 'field__value--ellipsis': !editMode },
            { 'field__value--ellipsis-edit': editMode },
            { 'field__value--ellipsis-disabled': disabled }) }
          >
            { value || '-' }
          </div>
          { available && haveClearButton && !isUndefined(value) && <div className='field__close-button' onClick={ this.handleOnClear } /> }
          { available &&
            <div
              className={ classNames(buttonClass, { [`${ buttonClass }--disabled`]: disabled }) }
              onClick={ this.handleOnClick }
              tabIndex={ availableAction ? '0' : undefined }
              onKeyDown={ availableAction ? this.onKeyDown : null }
              ref={ availableAction ? (node) => { this.buttonNode = node; } : null }
            />
          }
        </div>
        { this.renderError(error) }
      </div>
    );
  }
}
Field.Ellipsis = injectIntl(Ellipsis);

class SearchField extends Ellipsis {
  static defaultProps = {
    buttonClass: 'field__search-button',
    haveClearButton: true,
    visibleInReadOnlyMode: false,
  };
}
Field.InputSearch = injectIntl(SearchField);

class FieldDropdown extends Field {
  static defaultProps = {
    itemValue: 'value',
    placeholderIntlId: '',
  };


  setDropdownExpanded(e, expanded) {
    e.preventDefault();
    e.stopPropagation();
    if (this.dropdown) {
      this.dropdown.getWrappedInstance().setExpanded(expanded, true);
    }
  }

  @autobind
  onKeyDown(e) {
    const { type, key } = e;
    if (type === 'keydown') {
      if (key === 'Escape') {
        this.setDropdownExpanded(e, false);
      } else if (key === 'ArrowDown' || key === 'Enter') {
        this.setDropdownExpanded(e, true);
      }
    }
  }

  @autobind
  onChange(value, opt, currentValue) {
    const { onChange, validator, index } = this.props;
    if (validator) {
      validator.onChange(value, index, undefined, () => {
        if (onChange) {
          onChange(value, opt, currentValue);
        }
      });
    } else if (onChange) {
      onChange(value, opt, currentValue);
    }
    if (this.node) {
      this.node.focus();
    }
  }

  renderError(error) {
    const errorClassName = 'field__error';

    if (error) {
      return (
        <div className={ errorClassName } aria-label={ error } > { error } </div>
      );
    }

    return null;
  }

  render() {
    const { labelIntlId, placeholderIntlId, labelIntlValues, itemValue,
      value, values, intl, hideTitle, inRadioButton, validator, disabled } = this.props;
    const { getError } = (validator || defaultValidator);
    const error = getError();

    return (
      <div className={ classNames('field', {
        'field--inside-radio-button': inRadioButton,
        'field--error': error,
      }) }
      >
        {labelIntlId && <div
          className={ classNames('field__label', {
            'field__label--error': error,
          }) }
        >
          {intl.formatMessage({ id: labelIntlId }, labelIntlValues)}
        </div>
        }
        <div
          className={ classNames('field__dropdown', {
            'field__dropdown--error': error,
          }) }
          tabIndex='0'
          onKeyDown={ this.onKeyDown }
          ref={ (node) => { this.node = node; } }
        >
          <Dropdown
            disabled={ disabled }
            ref={ (node) => { this.dropdown = node; } }
            labelIntlId={ labelIntlId }
            hideTitle={ hideTitle }
            placeholderIntlId={ placeholderIntlId }
            values={ values }
            value={ value }
            itemValue={ itemValue }
            onChange={ this.onChange }
            classNames='dropdown--field'
            valueClass='dropdown__value--field'
            wide
          />
        </div>
        { this.renderError(error) }
      </div>
    );
  }
}
Field.Dropdown = injectIntl(FieldDropdown);

Field.Search = class extends Field {

  @autobind
  onClick() {
    const { onSearch, value } = this.props;
    if (onSearch) {
      onSearch(value);
    }
  }

  render() {
    const { editMode, disabled, noBackground, wrap, value } = this.props;
    const valueClassName = classNames('field__value', {
      'field__value--no-background': noBackground,
      'field__value--wrap': wrap,
      'field__value--border': editMode,
      'field--disabled': disabled,
    });
    return (
      <Field
        { ...this.props }
        className={ classNames('field--short', {
          'field--with-icon': editMode,
        }) }
      >
        <div className={ valueClassName }>
          { value || '-' }
        </div>
        { editMode && !disabled && <div className='field__search' onClick={ this.onClick } /> }
      </Field>
    );
  }
};


Field.Padding = function (props) {
  return (
    <div className='field field--padding' />
  );
};

export default Field;
