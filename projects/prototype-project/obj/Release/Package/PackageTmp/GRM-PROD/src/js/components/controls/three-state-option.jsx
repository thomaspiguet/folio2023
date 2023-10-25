import React, { PureComponent } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import './three-state-option.scss';

import Checkbox from './checkbox';

defineMessages({
  yes: {
    id: 'three-state-option.yes',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'three-state-option.no',
    defaultMessage: 'No',
  },
});

class ThreeStateOption extends PureComponent {
  static propTypes = {
    labelIntlId: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    editMode: true,
  };

  onChange(value) {
    const { onChange, validator, index } = this.props;
    if (validator) {
      validator.onChange(value, index);
    }
    if (onChange) {
      onChange(value);
    }
  }

  @autobind
  onToggleYes() {
    const { value } = this.props;
    const newValue = (value !== false ? false : undefined);
    this.onChange(newValue);
  }

  @autobind
  onToggleNo() {
    const { value } = this.props;
    const newValue = (value !== true ? true : undefined);
    this.onChange(newValue);
  }

  getYesValue() {
    const { value } = this.props;
    return value !== false;
  }

  getNoValue() {
    const { value } = this.props;
    return value !== true;
  }

  render() {
    const {
      labelIntlId,
      labelIntlValues,
      intl,
      editMode,
      labelIntlIdYes = 'three-state-option.yes',
      labelIntlIdNo = 'three-state-option.no',
    } = this.props;

    return (
      <div
        className='three-state-option'
      >
        { labelIntlId &&
        <div className='three-state-option__label'>
          { intl.formatMessage({ id: labelIntlId }, labelIntlValues) }
        </div>
        }
        <div className='three-state-option__options'>
          <div className='three-state-option__option'>
            <Checkbox
              value={ this.getYesValue() }
              labelIntlId={ labelIntlIdYes }
              onToggle={ this.onToggleYes }
              single={ true }
              editMode={ editMode }
            />
          </div>
          <div className='three-state-option__option'>
            <Checkbox
              value={ this.getNoValue() }
              labelIntlId={ labelIntlIdNo }
              onToggle={ this.onToggleNo }
              single={ true }
              editMode={ editMode }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(ThreeStateOption);
