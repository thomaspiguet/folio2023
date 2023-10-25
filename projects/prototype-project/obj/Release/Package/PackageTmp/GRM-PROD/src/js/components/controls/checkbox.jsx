import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import './checkbox.scss';
import { focusKeyDown } from '../../utils/components/keyboard';

class Checkbox extends PureComponent {
  static propTypes = {
    labelIntlId: PropTypes.string,
    value: PropTypes.any,
    onToggle: PropTypes.func,
    styleModifier: PropTypes.string,
    partlyChecked: PropTypes.bool,
  };

  @autobind
  onToggle() {
    const { onToggle, value, partlyChecked, disabled, validator, onChange, index } = this.props;
    if (disabled) {
      return;
    }
    const val = partlyChecked ? false : !value;
    if (validator) {
      validator.onChange(val, index);
    }
    if (onToggle) {
      onToggle(val, index);
    }
    if (onChange) {
      onChange(val, index);
    }
  }

  @autobind
  onKeyDown(e) {
    const { onTab, onShiftTab } = this.props;
    focusKeyDown(e, { onTab, onShiftTab, onEnter: this.onToggle });
  }

  render() {
    const { value, editMode, disabled, single, partlyChecked, styleModifier, labelIntlId,
      labelIntlValues, intl, label, className, validator, vertical } = this.props;

    return (
      <div
        className={ classNames('checkbox', styleModifier, className, {
          'checkbox--single': single,
          'checkbox--vertical': vertical,
          'checkbox--view': !editMode,
        }) }
        onClick={ editMode ? this.onToggle : null }
        onKeyDown={ this.onKeyDown }
        tabIndex={ editMode ? '0' : null }
        ref={ validator && validator.onRef(this.props) }
      >
        <div className={ classNames('checkbox__icon', {
          'checkbox__icon--checked-view': value && !disabled && !editMode,
          'checkbox__icon--unchecked-view': !value && !disabled && !editMode,
          'checkbox__icon--checked-disabled': value && disabled,
          'checkbox__icon--unchecked-disabled': !value && disabled,
          'checkbox__icon--checked': value && !disabled && editMode,
          'checkbox__icon--unchecked': !value && !disabled && editMode,
          'checkbox__icon--unchecked-all-edit': !disabled && editMode && partlyChecked,
        }) }
        />
        { labelIntlId &&
          <div className='checkbox__label'>
            { intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
          </div>
        }
        { label &&
        <div className='checkbox__label'>
          { label }
        </div>
        }
      </div>
    );
  }
}

export default injectIntl(Checkbox);
