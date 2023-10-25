import React from 'react';

import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { map, sortBy, isUndefined } from 'lodash';
import accounting from 'accounting';
import { getCurrencyOptions } from '../../../utils/selectors/currency';

import Field from '../../controls/field';
import RadioButton from '../../controls/radio-button';

import {
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE,
  isManualAdjustmentDistribution,
} from '../../../entities/distribution';
import { OTHER_EXPENSES_OPTIONS_ACTUAL, OTHER_EXPENSES_OPTIONS_BUDGET } from '../../../entities/other-expenses';
import { OtherExpensesBudgetActualHeader } from '../../../features/other-expenses/other-expenses-budget-actual-header';
import { isFinancialGroupPercentage } from '../../dropdowns/financial-year-group';

defineMessages({
  func: {
    id: 'budget-request.functional-center',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  type: {
    id: 'budget-request.type',
    defaultMessage: 'TYPE',
  },
  request: {
    id: 'budget-request.request',
    defaultMessage: 'REQUEST',
  },
  description: {
    id: 'budget-request.description',
    defaultMessage: 'DESCRIPTION',
  },
  distributionsPeriod: {
    id: 'budget-request.distributions-period',
    defaultMessage: 'PERIOD',
  },
  distributionsDistrib: {
    id: 'budget-request.distributions-distrib',
    defaultMessage: 'DISTRIBUTIVE',
  },
  distributionsHours: {
    id: 'budget-request.distributions-hours',
    defaultMessage: 'HOURS',
  },
  distributionsAmounts: {
    id: 'budget-request.distributions-amounts',
    defaultMessage: 'AMOUNTS',
  },
  beforeDistribution: {
    id: 'budget-request.amount-before-distribution',
    defaultMessage: 'BEFORE INDEXATION',
  },
  budgetActualOptions: {
    id: 'budget-request.distributions-budget-actual',
    defaultMessage: 'BUDGET / ACTUAL',
  },
});

export const extractData = createSelector(
  [
    (state) => state.budgetRequests.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'budget-request.functional-center',
        accessor: 'functionalCenter',
        id: 'functionalCenter',
        exportId: '1',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'budget-request.type',
        accessor: 'type',
        id: 'type',
        exportId: '2',
        isGroupable: true,
        minWidth: 120,
        sortable: false,
      },
      {
        intlId: 'budget-request.request',
        accessor: 'request',
        id: 'request',
        exportId: '3',
        isGroupable: true,
        minWidth: 70,
        sortable: false,
      },
      {
        intlId: 'budget-request.description',
        accessor: 'description',
        id: 'description',
        exportId: '4',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
    ];

    return {
      rows: data || [],
      columns,
    };
  }
);

function extractDistributionsEntry(distributions, isAmountToDistribute, currencyOptions, editMode, totalValue, distributionType, showTotalRow, beforeDistribution) {
  const columns = [];
  const basedOnPreviousYear = distributions.method === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR
    || distributions.method === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE;

  if (editMode) {
    columns.push({
      id: 'period',
      accessor: 'period',
      intlId: 'budget-request.distributions-period',
      sortable: false,
      width: 100,
    });
    if (beforeDistribution) {
      columns.push({
        id: 'amountBefore',
        accessor: 'amountBefore',
        intlId: 'budget-request.amount-before-distribution',
        isNumber: true,
        sortable: false,
      });
    }
    if (!basedOnPreviousYear) {
      columns.push({
        id: 'rate',
        accessor: 'rate',
        intlId: 'budget-request.distributions-distrib',
        isNumber: true,
        sortable: false,
        EditCell: Field.Number2,
      });
    }
    columns.push({
      id: 'amount',
      accessor: 'amount',
      intlId: isAmountToDistribute ? 'budget-request.distributions-amounts' : 'budget-request.distributions-hours',
      isNumber: true,
      sortable: false,
      EditCell: basedOnPreviousYear ? null : Field.Number2,
    });
    if (basedOnPreviousYear) {
      columns.push({
        id: 'budgetActualOption',
        accessor: 'budgetActualOption',
        intlId: 'budget-request.distributions-budget-actual',
        align: 'center',
        sortable: false,
        Header: () => {
          return (<OtherExpensesBudgetActualHeader editMode />);
        },
        EditCell: (props) => {
          const { row: { budgetActualOption, _original: { isSection } }, ...rest } = props;
          return (!isSection && <div className='radio-button__budget-actual-wrapper'>
            <RadioButton
              modifier='budget-actual'
              value={ budgetActualOption }
              values={ [
                { value: OTHER_EXPENSES_OPTIONS_BUDGET, id: 'budget' },
                { value: OTHER_EXPENSES_OPTIONS_ACTUAL, id: 'actual' },
              ] }
              editMode
              { ...rest }
            />
          </div>);
        },
      });
    }
  } else {
    columns.push({
      id: 'period',
      accessor: 'period',
      intlId: 'budget-request.distributions-period',
      sortable: false,
    });
    if (beforeDistribution) {
      columns.push({
        id: 'amountBefore',
        accessor: 'amountBefore',
        intlId: 'budget-request.amount-before-distribution',
        sortable: false,
      });
    }
    columns.push({
      id: 'rate',
      accessor: 'rate',
      intlId: 'budget-request.distributions-distrib',
      isNumber: true,
      sortable: false,
    });
    columns.push({
      id: 'amount',
      accessor: 'amount',
      intlId: isAmountToDistribute ? 'budget-request.distributions-amounts' : 'budget-request.distributions-hours',
      isNumber: true,
      sortable: false,
    });
  }

  let rows = [];
  if (distributions && distributions.periods) {
    rows = sortBy(map(distributions.periods, (item, index) => {
      const row = {
        period: item.period,
        rate: accounting.formatNumber(item.rate, currencyOptions),
        amount: accounting.formatNumber(item.amount, currencyOptions),
      };
      if (beforeDistribution) {
        row.amountBefore = accounting.formatNumber(beforeDistribution.periods[index].amount, currencyOptions);
      }
      if (basedOnPreviousYear) {
        row.budgetActualOption = distributions.budgetActualOptions[index];
      }
      return row;
    }), 'period');
  }

  // add totals
  let totalAmount;
  const totalRate = distributions && distributions.totalRate;
  if (!isUndefined(totalValue)) {
    totalAmount = totalValue;
  } else if (distributions && distributions.totalAmount) {
    totalAmount = distributions.totalAmount;
  }


  if (!rows.length) {
    rows.push({
      period: '-',
      rate: '-',
      amount: '-',
    });
    if (showTotalRow) {
      rows.push({
        period: 'Total',
        rate: '-',
        amount: '-',
        isSection: true,
      });
    }
  } else if (showTotalRow) {
    rows.push({
      period: 'Total',
      rate: accounting.formatNumber(totalRate, { ...currencyOptions }),
      amount: accounting.formatNumber(totalAmount, { ...currencyOptions }),
      isSection: true,
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractDistributions = createSelector(
  [
    (state) => state.budgetRequests.entry.distributions,
    (state) => state.budgetRequests.entry.isAmountToDistribute,
    (state) => getCurrencyOptions(state),
    (state) => state.budgetRequests.editMode,
    (state) => state.budgetRequests.entry.totalValue,
    (state) => state.budgetRequests.entry.distributionType,
    () => true,
    (state) => state.otherExpensesDetails.entry.beforeDistribution,
  ],
  extractDistributionsEntry
);

export const extractDistributionsForNewOtherExpense = createSelector(
  [
    (state) => state.otherExpenses.entry.distributions,
    (state) => !isFinancialGroupPercentage(state.otherExpenses.entry.financialYearGroup),
    (state) => getCurrencyOptions(state),
    (state) => state.otherExpenses.editMode,
    (state) => state.otherExpenses.entry.totalAmount,
    (state) => state.otherExpenses.entry.distributionType,
    () => true,
    () => false,
  ],
  extractDistributionsEntry
);


export const extractDistributionsOtherExpenses = createSelector(
  [
    (state) => state.otherExpenses.entry.distributions,
    () => true,
    (state) => getCurrencyOptions(state),
    (state) => state.otherExpenses.editMode,
    (state) => state.budgetRequests.entry.totalAmount,
    (state) => state.budgetRequests.entry.distributionType,
    () => true,
    (state) => state.otherExpensesDetails.entry.beforeDistribution,
  ],
  extractDistributionsEntry
);

export const extractDistributionsOtherExpensesDetails = createSelector(
  [
    (state) => state.otherExpensesDetails.entry.distribution,
    () => true,
    (state) => getCurrencyOptions(state),
    () => false,
    (state) => state.otherExpensesDetails.entry.totalAmount,
    (state) => state.otherExpensesDetails.entry.type,
    () => false,
    (state) => state.otherExpensesDetails.entry.beforeDistribution,
  ],
  extractDistributionsEntry
);

export const extractDistributionsOtherExpensesHistory = createSelector(
  [
    (state) => state.otherExpensesDetails.entry.distribution,
    () => true,
    (state) => getCurrencyOptions(state),
    (state) => isManualAdjustmentDistribution(state.otherExpensesDetails.entry.distribution.method),
    (state) => state.otherExpensesDetails.entry.totalAmount,
    (state) => state.otherExpensesDetails.entry.type,
    () => true,
    (state) => state.otherExpensesDetails.entry.beforeDistribution,
  ],
  extractDistributionsEntry
);
