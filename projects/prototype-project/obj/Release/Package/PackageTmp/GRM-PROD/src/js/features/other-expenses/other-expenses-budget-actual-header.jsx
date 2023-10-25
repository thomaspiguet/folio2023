import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setBudgetActual } from './actions/other-expenses';

import {
  OTHER_EXPENSES_OPTIONS_ACTUAL,
  OTHER_EXPENSES_OPTIONS_BUDGET,
} from '../../entities/other-expenses';

import RadioButton from '../../components/controls/radio-button';

defineMessages({
  budgetOption: {
    id: 'budget-request.budget-option',
    defaultMessage: 'BUDGET',
  },
  actualOption: {
    id: 'budget-request.actual-option',
    defaultMessage: 'ACTUAL',
  },
});

@connect(state => ({
  budgetActualHeaderOption: state.otherExpensesDetails.entry.distribution.budgetActualHeaderOption,
}), (dispatch) => bindActionCreators({
  setBudgetActual,
}, dispatch))
export class OtherExpensesBudgetActualHeader extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    onChange: PropTypes.func,
    twoColumnsWidth: PropTypes.bool,
  };

  @autobind
  onChange(value) {
    this.props.setBudgetActual(value);
  }

  render() {
    const { twoColumnsWidth, editMode, budgetActualHeaderOption } = this.props;

    return (
      <RadioButton
        modifier='budget-actual-header'
        value={ budgetActualHeaderOption }
        values={ [
          { value: OTHER_EXPENSES_OPTIONS_BUDGET, id: 'budget', intlId: 'budget-request.budget-option' },
          { value: OTHER_EXPENSES_OPTIONS_ACTUAL, id: 'actual', intlId: 'budget-request.actual-option' },
        ] }
        editMode={ editMode }
        twoColumnsWidth={ twoColumnsWidth }
        onChange={ this.onChange }
      />
    );
  }
}
