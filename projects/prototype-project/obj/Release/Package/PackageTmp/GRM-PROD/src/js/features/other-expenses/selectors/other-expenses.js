import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each } from 'lodash';

import Field from '../../../components/controls/field';
import DetailsInfoCell from '../../../components/controls/details-info-cell';
import DetailsSummaryCell from '../../../components/controls/details-summary-cell';

import {
  getOtherExpensesHistoryDetails,
  getOtherExpensesBudgetDetails,
  getOtherExpensesActualDetails,
} from '../../../api/actions';

import { getCurrencyOptions, formatNumber, getElement, getElementEmpty, getElementEdit } from '../../../utils/selectors/currency';

defineMessages({
  description: {
    id: 'other-expenses.description',
    defaultMessage: 'YEARS',
  },
  budgetAmount: {
    id: 'other-expenses.budget-amount',
    defaultMessage: 'BUDGET',
  },
  actual: {
    id: 'other-expenses.actual-amount',
    defaultMessage: 'ACTUAL',
  },

  date: {
    id: 'other-expenses.date-time',
    defaultMessage: 'DATE/TIME',
  },
  processing: {
    id: 'other-expenses.processing',
    defaultMessage: 'PROCESSING',
  },
  descriptionHistory: {
    id: 'other-expenses.description-history-table',
    defaultMessage: 'DESCRIPTION',
  },
  rate: {
    id: 'other-expenses.rate',
    defaultMessage: 'RATE',
  },
  adjusted: {
    id: 'other-expenses.adjusted',
    defaultMessage: 'ADJUSTED',
  },
  total: {
    id: 'other-expenses.total',
    defaultMessage: 'TOTAL',
  },
});

function addHistoryRow(rows, param, currencyOptions) {
  if (param && (param.budgetAmount || param.description || param.actualAmount || param.financialYearId)) {
    rows.push({
      description: param.description,
      budgetAmount: formatNumber(param.budgetAmount, currencyOptions),
      actualAmount: formatNumber(param.actualAmount, currencyOptions),
      financialYearId: param.financialYearId,
    });
  } else {
    rows.push({
      description: '-',
      budgetAmount: '-',
      actualAmount: '-',
      financialYearId: '-',
    });
  }
}

function addHistoryTableRow(rows, item, currencyOptions, editMode) {
  rows.push({
    id: getElementEmpty(item, 'id'),
    date: getElementEmpty(item, 'date'),
    processingType: getElementEmpty(item, 'processingType'),
    processingTypeDescription: getElementEmpty(item, 'processingTypeDescription'),
    description: getElementEdit(item, editMode, 'description'),
    rateAmount: formatNumber(getElementEmpty(item, 'rateAmount'), currencyOptions),
    adjustedAmount: formatNumber(getElementEmpty(item, 'adjustedAmount'), currencyOptions),
    totalAmount: formatNumber(getElement(item, 'totalAmount'), currencyOptions),
  });
}

export const getHistorySummaryLines = createSelector(
  [
    (state) => state.otherExpenses.entry.historySummaryLine1,
    (state) => state.otherExpenses.entry.historySummaryLine2,
    (state) => state.otherExpenses.entry.historySummaryLine3,
    (state) => getCurrencyOptions(state),
    (state) => state.otherExpenses.otherExpensesId,
    (state) => state.otherExpenses.editMode,
  ],
  (
    historySummaryLine1,
    historySummaryLine2,
    historySummaryLine3,
    currencyOptions,
    otherExpensesId,
    editMode
  ) => {
    const columns = [
      {
        id: 'description',
        accessor: 'description',
        intlId: 'other-expenses.description',
        sortable: false,
      },
      {
        id: 'budgetAmount',
        accessor: 'budgetAmount',
        intlId: 'other-expenses.budget-amount',
        isNumber: true,
        sortable: false,
        props: { otherExpensesId, editMode },
        Cell: editMode ? null : (row) => {
          const { original: { financialYearId } } = row;
          return (
            <DetailsSummaryCell
              row={ row }
              action={ getOtherExpensesBudgetDetails }
              otherExpensesId={ otherExpensesId }
              financialYearId={ financialYearId }
            />
          );
        },
      },
      {
        id: 'actualAmount',
        accessor: 'actualAmount',
        intlId: 'other-expenses.actual-amount',
        isNumber: true,
        sortable: false,
        props: { otherExpensesId, editMode },
        Cell: editMode ? null : (row) => {
          const { original: { financialYearId } } = row;
          return (
            <DetailsSummaryCell
              row={ row }
              action={ getOtherExpensesActualDetails }
              otherExpensesId={ otherExpensesId }
              financialYearId={ financialYearId }
            />
          );
        },
      },
    ];

    const rows = [];

    addHistoryRow(rows, historySummaryLine1, currencyOptions);
    addHistoryRow(rows, historySummaryLine2, currencyOptions);
    addHistoryRow(rows, historySummaryLine3, currencyOptions);

    return {
      rows,
      columns,
    };
  }
);

export const getHistoryTableLines = createSelector(
  [
    (state) => state.otherExpenses.entry.history,
    (state) => getCurrencyOptions(state),
    (state) => state.otherExpenses.editMode,
    (state) => state.otherExpenses.validationErrors,
  ],
  (
    data,
    currencyOptions,
    editMode
  ) => {
    const columns = [
      {
        id: 'date',
        accessor: 'date',
        intlId: 'other-expenses.date-time',
        sortable: false,
      },
      {
        id: 'processingTypeDescription',
        accessor: 'processingTypeDescription',
        intlId: 'other-expenses.processing',
        sortable: false,
      },
      {
        id: 'description',
        accessor: 'description',
        intlId: 'other-expenses.description-history-table',
        sortable: false,
        EditCell: Field.Input,
      },
      {
        id: 'rateAmount',
        accessor: 'rateAmount',
        intlId: 'other-expenses.rate',
        isNumber: true,
        sortable: false,
        EditCell: Field.Number2,
      },
      {
        id: 'adjustedAmount',
        accessor: 'adjustedAmount',
        intlId: 'other-expenses.adjusted',
        isNumber: true,
        sortable: false,
        EditCell: Field.Zero2,
      },
      {
        id: 'totalAmount',
        accessor: 'totalAmount',
        intlId: 'other-expenses.total',
        isNumber: true,
        sortable: false,
        EditCell: Field.Zero2,
      },
    ];

    if (!editMode) {
      columns.push({
        id: 'info',
        width: 48,
        sortable: false,
        Cell: row => {
          return (<DetailsInfoCell action={ getOtherExpensesHistoryDetails } id={ row.original.id } />);
        },
      });
    }

    const rows = [];

    each(data, (item) => {
      addHistoryTableRow(rows, item, currencyOptions, editMode);
    });

    return {
      rows,
      columns,
    };
  }
);

export const extractDatesOtherExpensesDetails = createSelector(
  [
    (state) => state.otherExpenses.entry.history,
    (state) => getCurrencyOptions(state),
    () => false,
    (state) => state.otherExpensesDetails.selectedDataRow,
  ],
  (
    data,
    currencyOptions,
    editMode,
    selectedRowId
  ) => {
    const columns = [
      {
        id: 'date',
        accessor: 'date',
        intlId: 'other-expenses.date-time',
        sortable: false,
      },
    ];

    const rows = [];
    let selectedRow = null;

    each(data, (item, index) => {
      const row = {};
      row.id = getElement(item, 'id');
      row.date = getElementEmpty(item, 'date');
      row.type = getElementEmpty(item, 'type');
      row.description = getElementEdit(item, editMode, 'description');
      row.rateAmount = formatNumber(getElementEmpty(item, 'rateAmount'), currencyOptions);
      row.adjustedAmount = formatNumber(getElementEmpty(item, 'adjustedAmount'), currencyOptions);
      row.totalAmount = formatNumber(getElement(item, 'totalAmount'), currencyOptions);

      if (row.id === selectedRowId) {
        row.selected = true;
        selectedRow = index;
      } else {
        row.selected = false;
      }
      rows.push(row);
    });

    return {
      rows,
      columns,
      selectedRow,
    };
  }
);
