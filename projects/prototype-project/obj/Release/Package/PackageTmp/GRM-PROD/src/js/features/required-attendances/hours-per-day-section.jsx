import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getDigit0Options,
  getDigit2Options,
  unformatNumber,
} from '../../utils/selectors/currency';

import HoursPerDay from '../../components/dropdowns/hours-per-day';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';

import { isJobGroupTitleType, isJobTitleType } from '../../entities/suggested-hourly-rate';
import { isOtherHoursPerDay } from '../../entities/required-attendance';

export function predicateHoursPerDaySelected(groupType, hoursPerDaySelected, specificHoursPerDay) {
  const isJobTitle = isJobTitleType(groupType);
  return isJobTitle;
}

export function predicateHoursPerDaySpecific(groupType, hoursPerDaySelected, specificHoursPerDay) {
  const isJobGroupTitle = isJobGroupTitleType(groupType);
  return isJobGroupTitle || isOtherHoursPerDay(hoursPerDaySelected);
}

@connect(state => ({
  digit2Options: getDigit2Options(state),
  digit0Options: getDigit0Options(state),
}), (dispatch) => bindActionCreators({
}, dispatch))
export class HoursPerDaySection extends Component {

  @autobind
  handleHoursPerDayChange(valueP) {
    const { editMode, digit0Options, onChange, selectedValidator, fullTimeEquivalentValidator } = this.props;
    if (editMode) {
      const value = valueP || {};
      const updatedValue = { id: value.id };
      if (!isOtherHoursPerDay(value)) {
        updatedValue.value = unformatNumber(value.value, digit0Options);
      } else {
        updatedValue.value = value.value;
      }

      const context = {};
      fullTimeEquivalentValidator.setValue(context, 0);
      selectedValidator.onChange(updatedValue, undefined, context);
      if (!isOtherHoursPerDay(updatedValue)) {
        onChange(updatedValue.value);
      }
    }
  }

  @autobind
  handleSpecificHoursPerDayChange(value) {
    const { editMode, digit0Options, specificValidator, fullTimeEquivalentValidator, onChange } = this.props;
    const updatedValue = unformatNumber(value, digit0Options);
    if (editMode) {
      const context = {};
      fullTimeEquivalentValidator.setValue(context, 0);
      specificValidator.onChange(updatedValue, undefined, context);
      onChange(updatedValue);
    }
  }

  render() {
    const {
      editMode,
      groupType,
      jobTitle,
      totalHours,
      fullTimeEquivalent,
      selectedValue,
      specificValue,
      selectedValidator,
      specificValidator,
      flashErrors,
    } = this.props;

    const isJobTitle = isJobTitleType(groupType);

    const hoursPerDaysValue = selectedValue;
    const isHoursPerDayOtherSelected = isOtherHoursPerDay(hoursPerDaysValue);
    const specificValueValue = specificValue;

    return (
      <Form.Row>
        { isJobTitle && (editMode || !isHoursPerDayOtherSelected) &&
        <Form.Column>
          <HoursPerDay
            editMode={ editMode }
            validator={ selectedValidator }
            value={ hoursPerDaysValue }
            parameters={ jobTitle && jobTitle.id ? { jobTitleId: jobTitle.id } : {} }
            labelIntlId='required-attendance.hours-per-day-selected'
            onChange={ this.handleHoursPerDayChange }
            flashErrors={ flashErrors }
            groupType={ groupType }
            jobTitle={ jobTitle }
          />
        </Form.Column>
        }
        { (!isJobTitle || (isJobTitle && isHoursPerDayOtherSelected)) &&
        <Form.Column>
          <Field.Number
            editMode={ editMode }
            validator={ specificValidator }
            value={ specificValueValue }
            labelIntlId='required-attendance.hours-per-day-selected'
            onChange={ this.handleSpecificHoursPerDayChange }
            flashErrors={ flashErrors }
            groupType={ groupType }
            jobTitle={ jobTitle }
          />
        </Form.Column>
        }
        <Form.Column>
          <Field.Number value={ totalHours } disabled labelIntlId='required-attendance.total-hours' />
        </Form.Column>
        <Form.Column>
          <Field.Number1 value={ fullTimeEquivalent } disabled labelIntlId='required-attendance.full-time-equivalent' />
        </Form.Column>
      </Form.Row>

    );
  }
}
