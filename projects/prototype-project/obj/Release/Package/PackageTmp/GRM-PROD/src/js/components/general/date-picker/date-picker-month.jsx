import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import DatePickerItem from './date-picker-item';
import { NUMBER_OF_DAYS_IN_WEEK, FIRST_DAY_INDEX } from './date-picker';

import './date-picker-month.scss';

export default class DatePickerMonth extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    valueIndex: PropTypes.number,
    year: PropTypes.number,
    periods: PropTypes.array,
    selectedDay: PropTypes.number,
    selectedMonth: PropTypes.number,
    selectedYear: PropTypes.number,
    currentDay: PropTypes.number,
    currentMonth: PropTypes.number,
    currentYear: PropTypes.number,
    onClick: PropTypes.func,
    onMonthClick: PropTypes.func,
  };

  static defaultProps = {
    periods: [],
  };

  @autobind
  handleDayClick(dayItem) {
    const { onClick, valueIndex, year } = this.props;
    if (onClick) {
      onClick(year, valueIndex, dayItem);
    }
  }

  @autobind
  handleMonthTitleClick() {
    const { onMonthClick, valueIndex, year } = this.props;
    if (onMonthClick) {
      onMonthClick(year, valueIndex);
    }
  }

  renderMonthTitle() {
    const { value, year } = this.props;
    return (
      <div className='date-picker-month__title' key={ `${ year }-${ value }-0-title` }>
        <span className='date-picker-month__title-text' onClick={ this.handleMonthTitleClick }>
          { `${ value } ${ year }` }
        </span>
        <span className='date-picker-month__title-arrow' onClick={ this.handleMonthTitleClick } />
      </div>
    );
  }

  getWeekendDays(dayShift) {
    const weekendDays = [];
    let weekend = dayShift < FIRST_DAY_INDEX ? FIRST_DAY_INDEX - dayShift : NUMBER_OF_DAYS_IN_WEEK - (dayShift - FIRST_DAY_INDEX);

    while (weekend < 32) {
      weekendDays.push(weekend);
      weekendDays.push(weekend + 1);
      weekend += 7;
    }
    return weekendDays;
  }

  renderDays() {
    const { year, value, valueIndex, periods } = this.props;
    const { currentYear, currentMonth, currentDay, selectedYear, selectedMonth, selectedDay } = this.props;

    const daysInMonth = new Date(year, valueIndex + 1, 0).getDate();
    const dayIndex = new Date(year, valueIndex).getDay();
    const items = [];

    items.push(this.renderMonthTitle());

    let numberOfDaysToShift = (dayIndex + FIRST_DAY_INDEX) % NUMBER_OF_DAYS_IN_WEEK;
    const weekendDays = this.getWeekendDays(numberOfDaysToShift);

    while (numberOfDaysToShift > 0) {
      items.push(
        <DatePickerItem
          key={ `${ year }-${ value }-0-${ numberOfDaysToShift }` }
          value=''
          isDisabled={ true }
        />
      );
      numberOfDaysToShift--;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrent = (day === currentDay && valueIndex === currentMonth && year === currentYear);
      const isSelected = (day === selectedDay && valueIndex === selectedMonth && year === selectedYear);
      const isGrayed = weekendDays.find(item => item === day) === day;
      const period = periods.filter(period => period.startDay === day);
      const isPeriodStart = period.length > 0;
      items.push(
        <DatePickerItem
          key={ `${ year }-${ value }-${ day }` }
          value={ day }
          isGrayed={ isGrayed }
          isCurrent={ isCurrent }
          isSelected={ isSelected }
          isPeriodStart={ isPeriodStart }
          periodNumber={ isPeriodStart ? period[0].periodNumber : 0 }
          onClick={ this.handleDayClick }
        />
      );
    }

    return (
      <div className='date-picker-month__days'>
        { items }
      </div>
    );
  }

  render() {
    const { style } = this.props;
    return (
      <div className='date-picker-month' style={ style }>
        { this.renderDays() }
      </div>
    );
  }

}
