import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { focusKeyDown } from '../../utils/components/keyboard';

import './switch.scss';

defineMessages({
  yes: {
    id: 'switch.yes',
    defaultMessage: 'YES',
  },
  no: {
    id: 'switch.no',
    defaultMessage: 'NO',
  },
});

class Switch extends PureComponent {
  static propTypes = {
    editMode: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    index: PropTypes.string,
    className: PropTypes.string,
    styleModifier: PropTypes.string,
    intl: PropTypes.object,
    labelIntlId: PropTypes.string,
    labelIntlValues: PropTypes.object,
    intlId: PropTypes.string,
    intlValues: PropTypes.object,
    validator: PropTypes.object,
    onToggle: PropTypes.func,
    onChange: PropTypes.func,
    onTab: PropTypes.func,
    onShiftTab: PropTypes.func,
    available: PropTypes.bool,
  };

  static defaultProps = {
    value: false,
    available: true,
  };

  @autobind
  onToggle() {
    const { onToggle, value, disabled, validator, onChange, index } = this.props;
    if (disabled) {
      return;
    }
    const val = !value;
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
    const { value, editMode, styleModifier, labelIntlId,
      labelIntlValues, intl, className, validator, intlId, intlValues, available } = this.props;

    const switchClassName = classNames('switch__element', styleModifier, className, {
      'switch__element--view': available && !editMode,
      'switch__element--checked': available && value,
      'switch__element--not-available': !available,
    });

    const switchToggleClassName = classNames('switch__toggle', {
      'switch__toggle--checked': value,
    });

    const switchTextClassName = classNames('switch__text', {
      'switch__text--checked': value,
      'switch__text--unchecked': !value,
    });

    const switchText = intl.formatMessage({ id: value ? 'switch.yes' : 'switch.no' });

    return (
      <div className='switch'>
        { labelIntlId &&
          <div className='switch__label'>
            { intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
          </div>
        }
        <span
          className={ switchClassName }
          onClick={ (editMode && available) ? this.onToggle : null }
          onKeyDown={ this.onKeyDown }
          tabIndex={ (editMode && available) ? '0' : null }
          ref={ validator && validator.onRef(this.props) }
        >
          { !available && <span className='switch__not-available' /> }
          { available && <small className={ switchToggleClassName } /> }
          { available && <span className={ switchTextClassName }>{ switchText }</span> }
        </span>
        { intlId && <span className='switch__message'>
          { intl.formatMessage({ id: intlId }, intlValues) } </span> }
      </div>
    );
  }
}

export default injectIntl(Switch);
