import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import './date-picker-item.scss';

export default class DatePickerItem extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    indexValue: PropTypes.number,
    isGrayed: PropTypes.bool,
    isCurrent: PropTypes.bool,
    isSelected: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isPeriodStart: PropTypes.bool,
    periodNumber: PropTypes.number,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    isGrayed: false,
    isCurrent: false,
    isSelected: false,
    isDisabled: false,
  };

  @autobind
  handleOnClick() {
    const { onClick, value, indexValue } = this.props;
    if (onClick) {
      onClick(value, indexValue);
    }
  }

  render() {
    const { value, isGrayed, isCurrent, isSelected, isDisabled, isPeriodStart, periodNumber } = this.props;

    const periodClassName = classNames('date-picker-item',
      { 'date-picker-item__period': isPeriodStart }
    );

    const itemClassName = classNames('date-picker-item__text',
      { 'date-picker-item__text--grayed': isGrayed },
      { 'date-picker-item__text--current': isCurrent },
      { 'date-picker-item__text--selected': isSelected },
      { 'date-picker-item__text--disabled': isDisabled }
    );

    return (
      <div className={ periodClassName }>
        <div className={ itemClassName } onClick={ this.handleOnClick }>{ value }</div>
        { isPeriodStart && periodNumber &&
          <div className='date-picker-item__period-number'>{ periodNumber }</div>
        }
      </div>
    );
  }

}
