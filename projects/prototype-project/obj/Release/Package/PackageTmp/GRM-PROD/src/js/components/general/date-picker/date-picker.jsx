import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl } from 'react-intl';
import { findIndex, isEmpty, isEqual, isUndefined } from 'lodash';

import { ScrollBox } from '../scroll-box/index';
import ModalEventsHandler from '../../../utils/components/modal-events-handler';
import DatePickerMonth from './date-picker-month';
import DatePickerYear from './date-picker-year';
import { defaultValidator } from '../../../utils/components/form-validator';
import { formatDate, isInvalidDate, unformatDate } from '../../../utils/utils';
import Field from '../../controls/field';
import VirtualScrollList from '../vitrual-scroll-list/virtual-scroll-list';
import RelativePortal from '../relative-portal/relative-portal';

import './date-picker.scss';

const DATE_PICKER_YEARS_VIEW = 'years';
const DATE_PICKER_MONTHS_VIEW = 'months';
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS_OF_THE_WEEK = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export const NUMBER_OF_DAYS_IN_WEEK = DAYS_OF_THE_WEEK.length;
export const FIRST_DAY_INDEX = 4;
const ROW_HEIGHT = 38;
const ROW_PADDING = 9;

defineMessages({
  financialPeriodStart: {
    id: 'date-picker.financial-period-start',
    defaultMessage: 'Financial period start',
  },
  datePickerInputPlaceholder: {
    id: 'date-picker.input-placeholder',
    defaultMessage: 'yyyy-mm-dd',
  },
});

class DatePicker extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    formNode: PropTypes.object,
    value: PropTypes.string,
    values: PropTypes.array,
    onInputChange: PropTypes.func,
    onInputBlur: PropTypes.func,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    onChange: PropTypes.func,
    validator: PropTypes.object,
  };

  static defaultProps = {
    values: [],
    validator: defaultValidator,
  };

  constructor(props) {
    super(props);
    const today = new Date();
    const selectedAndCurrentDates = this.calculateSelectedAndCurrentDates(today, props.value);
    this.state = {
      today,
      expanded: false,
      viewMode: DATE_PICKER_MONTHS_VIEW,
      currentDay: selectedAndCurrentDates.currentDay,
      currentMonth: selectedAndCurrentDates.currentMonth,
      currentYear: selectedAndCurrentDates.currentYear,
      selectedDay: selectedAndCurrentDates.selectedDay,
      selectedMonth: selectedAndCurrentDates.selectedMonth,
      selectedYear: selectedAndCurrentDates.selectedYear,
      monthsData: [],
    };
    this.node = undefined;
    this.value = '';
    this.modalHandler = new ModalEventsHandler(this.getNode, {
      onClickOutside: this.handleClickOutsideDatePicker,
      onWheelEvent: this.handleWheelEvent,
    });
  }

  @autobind
  getNode() {
    return this.node;
  }

  @autobind
  setExpanded(expanded) {
    this.setState({ expanded });
    this.modalHandler.block(expanded);
  }

  @autobind
  handleClickOutsideDatePicker() {
    const { expanded } = this.state;
    if (expanded) {
      this.setExpanded(false);
    }
  }

  init(props, force) {
    this.modalHandler.setFormNode(this.props.formNode);
    const { value, values } = props;
    if (this.props.value !== value || force) {
      const dates = this.calculateSelectedAndCurrentDates(this.state.today, value);
      this.setState({
        currentDay: dates.currentDay,
        currentMonth: dates.currentMonth,
        currentYear: dates.currentYear,
        selectedDay: dates.selectedDay,
        selectedMonth: dates.selectedMonth,
        selectedYear: dates.selectedYear,
        value,
      });
      this.value = value;
      if (!isEqual(values, this.props.values) || force) {
        this.setState({
          monthsData: this.buildMonthsData(values),
        });
      }
    }
  }

  @autobind
  scrollToSelected(selectedYear, selectedMonth) {
    const { viewMode } = this.state;
    const { values } = this.props;
    const selectedYearIndex = findIndex(values, item => (item && item.year === selectedYear));
    if (selectedYearIndex >= 0) {
      if (viewMode === DATE_PICKER_YEARS_VIEW) {
        window.setTimeout(() => {
          if (this.scrollBox) {
            this.scrollBox.scrollToY(selectedYearIndex * 77);
          }
        }, 0);
      }
    }
  }

  calculateSelectedAndCurrentDates(today, value) {
    const updatedValue = unformatDate(value, new Date());

    return {
      currentDay: today.getDate(),
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      selectedDay: updatedValue.getDate(),
      selectedMonth: updatedValue.getMonth(),
      selectedYear: updatedValue.getFullYear(),
    };
  }

  componentDidMount() {
    this.init(this.props, true);
    this.modalHandler.onMount(this.props.formNode);
  }

  componentWillUnmount() {
    this.modalHandler.onUnmount();
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    const { expanded, selectedYear, selectedMonth, currentYear, currentMonth } = this.state;
    if (prevState.expanded !== expanded) {
      this.modalHandler.block(expanded);
      if (expanded) {
        this.scrollToSelected(selectedYear || currentYear, selectedMonth || currentMonth);
      }
    }
    if (expanded && this.inputNode) {
      this.inputNode.focus();
    }
  }

  @autobind
  handleInputOnClick() {
    const { expanded, value } = this.state;
    this.setExpanded(!expanded);
    if (expanded) {
      this.setValue(value);
    }
  }

  @autobind
  onBlur(e) {
    const { value } = this;
    const { expanded } = this.state;
    if (!isUndefined(this.scrollMonthsIndex) || !expanded) {
      this.setValue(value);
    }
  }

  @autobind
  onKeyDown(e) {
    const { expanded } = this.state;
    const { key } = e;
    if (expanded) {
      if (key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
      } else if (key === 'ArrowDown') {
        this.scrollList(e, 1);
      } else if (key === 'ArrowUp') {
        this.scrollList(e, -1);
      }
    }
  }

  setValue(selectedDate) {
    const { value, onChange, validator: { onChange: validatorOnChange }, index } = this.props;
    if (validatorOnChange) {
      validatorOnChange(selectedDate, index, undefined, () => {
        if (onChange) {
          onChange(selectedDate, index, value);
        }
      });
    } else if (onChange) {
      onChange(selectedDate, index, value);
    }
  }

  @autobind
  handleDayClick(yearItem, monthItem, dayItem) {
    const selectedDate = formatDate(new Date(yearItem, monthItem, dayItem));
    this.setValue(selectedDate);
    this.setExpanded(false);
  }

  @autobind
  handleMonthClick(year, monthIndex) {
    this.setState({
      viewMode: DATE_PICKER_YEARS_VIEW,
      scrollMonthsIndex: this.getYearMonths(year, monthIndex),
    }, () => {
      this.scrollToSelected(year, monthIndex);
    });
  }

  @autobind
  handleYearClick(year, monthName, monthIndex) {
    this.scrollMonthsIndex = this.getYearMonths(year, monthIndex);
    this.setState({
      viewMode: DATE_PICKER_MONTHS_VIEW,
    }, () => {
      this.scrollToSelected(year, monthIndex);
    });
  }

  getYearMonths(year, monthIndex) {
    const { values } = this.props;
    const yearIndex = findIndex(values, { year });
    return (yearIndex > 0 ? yearIndex * 12 : 0) + monthIndex;
  }

  @autobind
  onChange(value) {
    this.value = value;
    this.setState({ value });
  }

  renderMonthsHeader() {
    const daysOfWeekItems = DAYS_OF_THE_WEEK.map(item =>
      <div className='date-picker-months__header-item' key={ item }>{ item }</div>
    );
    return (
      <div className='date-picker-months__header'>
        { daysOfWeekItems }
      </div>
    );
  }

  @autobind
  renderMonthsFooter() {
    return (
      <div className='date-picker-months-footer'>
        <div className='date-picker-months-footer__icon' />
        <div className='date-picker-months-footer__text'>
          { this.props.intl.formatMessage({ id: 'date-picker.financial-period-start' }) }
        </div>
      </div>
    );
  }

  buildMonthsData(yearItems) {
    const monthsData = [];
    yearItems.forEach(yearItem => {
      const yearPeriods = yearItem.periods;
      MONTHS.forEach((month, monthIndex) => {
        const year = yearItem.year;
        const periods = yearPeriods && yearPeriods.length ? yearPeriods.filter(period => period.startMonth === monthIndex) : [];
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDayWeekIndex = new Date(year, monthIndex).getDay();
        const numberOfDaysToShift = (firstDayWeekIndex + 4) % 7;
        const rows = Math.ceil((numberOfDaysToShift + 3 + daysInMonth) / 7);
        monthsData.push({
          year,
          periods,
          month,
          monthIndex,
          daysInMonth,
          firstDayWeekIndex,
          numberOfDaysToShift,
          rows,
          size: rows * ROW_HEIGHT + ROW_PADDING,
        });
      });
    });
    return monthsData;
  }

  @autobind
  getMonthSize(index) {
    const data = this.getMonthsData(index);
    const { size } = data;
    return size;
  }

  @autobind
  getMonthsData(index) {
    return this.state.monthsData[index] || {};
  }

  @autobind
  renderMonth({ index, style }) {
    const { year, month, monthIndex, periods } = this.getMonthsData(index);
    const { currentYear, currentMonth, currentDay, selectedYear, selectedMonth, selectedDay } = this.state;
    return (
      <DatePickerMonth
        key={ `${ year }-${ monthIndex }` }
        value={ month }
        valueIndex={ monthIndex }
        year={ year }
        periods={ periods }
        selectedDay={ selectedDay }
        selectedMonth={ selectedMonth }
        selectedYear={ selectedYear }
        currentDay={ currentDay }
        currentMonth={ currentMonth }
        currentYear={ currentYear }
        onClick={ this.handleDayClick }
        onMonthClick={ this.handleMonthClick }
        style={ style }
      />
    );
  }

  getInputYearMonth() {
    const { currentYear, currentMonth, value } = this.state;
    let year = currentYear;
    let month = currentMonth;

    if (value && value.length >= 4) {
      year = parseInt(value.substr(0, 4), 10);
    }

    if (value && value.length >= 7) {
      month = parseInt(value.substr(5, 2), 10) - 1;
      if (month < 0) {
        month = 0;
      }
    }

    return { year, month };
  }

  renderMonthsFeed() {
    const { selectedDay } = this.state;
    const { year, month } = this.getInputYearMonth();
    let scrollMonthsIndex;
    if (isUndefined(this.scrollMonthsIndex)) {
      scrollMonthsIndex = this.getYearMonths(year, month);
    } else {
      scrollMonthsIndex = this.scrollMonthsIndex;
      this.scrollMonthsIndex = undefined;
    }

    return (
      <div className='date-picker-months'>
        { this.renderMonthsHeader() }
        <VirtualScrollList
          estimatedItemSize={ 5.5 * ROW_HEIGHT + ROW_PADDING }
          className='date-picker-months__body'
          height={ 274 }
          itemCount={ this.state.monthsData.length }
          itemSize={ this.getMonthSize }
          renderItem={ this.renderMonth }
          scrollToIndex={ scrollMonthsIndex }
          scrollToAlignment='start'
          scrollDirection='vertical'
          overflowStyle='hidden'
          ref={ (node) => { this.virtualList = node; } }
          selectedDay={ selectedDay }
        />
        { this.renderMonthsFooter() }
      </div>
    );
  }

  @autobind
  handleWheelEvent(e) {
    const { deltaY } = e;
    this.scrollList(e, deltaY);
  }

  scrollList(e, deltaY) {
    if (this.virtualList) {
      e.preventDefault();
      e.stopPropagation();
      this.virtualList.doScroll(deltaY > 0 ? ROW_HEIGHT : -ROW_HEIGHT);
    }
  }

  renderYearsFeed() {
    const { values } = this.props;
    const { currentMonth, currentYear, selectedMonth, selectedYear } = this.state;

    const items = values.map(item => {
      return (
        <DatePickerYear
          key={ item.id }
          value={ item.year }
          selectedMonth={ selectedMonth }
          selectedYear={ selectedYear }
          currentMonth={ currentMonth }
          currentYear={ currentYear }
          onClick={ this.handleYearClick }
        />
      );
    });

    return (
      <div className='date-picker-years'>
        <ScrollBox style={ { height: '100%' } } getRef={ (node) => { this.scrollBox = node; } } >
          { items }
        </ScrollBox>
      </div>
    );
  }

  getOffset() {
    if (!this.node) {
      return 40;
    }
    const { height } = this.node.getBoundingClientRect();
    return height;
  }

  getHeight() {
    const { viewMode } = this.state;
    return viewMode === DATE_PICKER_MONTHS_VIEW ? 340 : 313;
  }

  render() {
    const { editMode } = this.props;
    const { expanded, viewMode, value } = this.state;
    const datePickerIconClass = classNames('date-picker__button',
      { 'date-picker__button--selected': expanded },
      { 'date-picker__button--disabled': !editMode }
    );

    const dateValue = formatDate(value, new Date());
    const errorMode = isInvalidDate(value) && !isEmpty(value);

    return (
      <div className='date-picker' ref={ (node) => { this.node = node; } } onBlur={ this.onBlur } >
        <Field.Input
          { ...this.props }
          value={ dateValue }
          onChange={ this.onChange }
          editMode
          noSave
          getRef={ (node) => { this.inputNode = node; } }
          errorMode={ errorMode }
          onKeyDown={ this.onKeyDown }
          placeholderIntlId='date-picker.input-placeholder'
        />
        <div
          className={ datePickerIconClass }
          onClick={ this.handleInputOnClick }
        />
        { expanded && <RelativePortal height={ this.getHeight() } offset={ this.getOffset() }>
          { viewMode === DATE_PICKER_YEARS_VIEW && this.renderYearsFeed() }
          { viewMode === DATE_PICKER_MONTHS_VIEW && this.renderMonthsFeed() }
        </RelativePortal> }
      </div>
    );
  }

}

export default injectIntl(DatePicker);
