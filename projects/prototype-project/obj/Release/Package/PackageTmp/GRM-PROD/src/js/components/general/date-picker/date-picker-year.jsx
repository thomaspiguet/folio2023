import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import DatePickerItem from './date-picker-item';
import './date-picker-year.scss';

import { MONTHS } from './date-picker';

export default class DatePickerYear extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
    selectedMonth: PropTypes.number,
    selectedYear: PropTypes.number,
    currentMonth: PropTypes.number,
    currentYear: PropTypes.number,
    onClick: PropTypes.func,
  };

  @autobind
  handleOnClick(monthValue, monthIndex) {
    const { onClick, value } = this.props;
    if (onClick) {
      onClick(value, monthValue, monthIndex);
    }
  }

  renderMonths() {
    const { value, selectedMonth, selectedYear, currentMonth, currentYear } = this.props;

    const items = MONTHS.map((month, index) => {
      const isCurrent = (index === currentMonth && value === currentYear);
      const isSelected = (index === selectedMonth && value === selectedYear);
      return (
        <DatePickerItem
          key={ month }
          value={ month }
          indexValue={ index }
          isCurrent={ isCurrent }
          isSelected={ isSelected }
          onClick={ this.handleOnClick }
        />
      );
    });

    return (
      <div className='date-picker-year__months'>
        { items }
      </div>
    );
  }

  render() {
    const { value } = this.props;

    return (
      <div className='date-picker-year'>
        <div className='date-picker-year__title'>{ value }</div>
        { this.renderMonths() }
      </div>
    );
  }

}
