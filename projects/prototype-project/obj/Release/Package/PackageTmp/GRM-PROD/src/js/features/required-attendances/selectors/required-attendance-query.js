import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each, padStart } from 'lodash';

import { formatEmptyNumber, formatNumber, getCurrencyOptions, getElement } from '../../../utils/selectors/currency';

import { AdditionalInfo } from '../../../components/business/additional-info/additional-info';

defineMessages({
  hours: {
    id: 'required-attendance-query.cell.hours',
    defaultMessage: 'Hours',
  },
  hoursDays: {
    id: 'required-attendance-query.cell.hours-days',
    defaultMessage: 'Hours/Days',
  },
  amounts: {
    id: 'required-attendance-query.cell.amounts',
    defaultMessage: 'Amounts',
  },
  expense: {
    id: 'required-attendance-query.column.expense',
    defaultMessage: 'EXPENSE',
  },
  period: {
    id: 'required-attendance-query.column.period',
    defaultMessage: 'PER. {period}',
  },
  total: {
    id: 'required-attendance-query.column.total',
    defaultMessage: 'TOTAL',
  },
  totalHours: {
    id: 'required-attendance-query.column.totalHours',
    defaultMessage: 'TOTAL HOURS',
  },
  totalAmounts: {
    id: 'required-attendance-query.column.totalAmounts',
    defaultMessage: 'TOTAL AMOUNTS',
  },
});

function extractAmountsAndHoursData(data, currencyOptions, hasAdditionalInfo, intl, hasHoursDaysLabel, hideTotals) {
  const { expenses } = data;
  const columnsScrolled = [];
  const rows = [];

  const columnsFixed = [
    {
      accessor: (row) => getElement(row, 'description'),
      align: 'left',
      hasMergedCells: true,
      id: 'expense',
      intlId: 'required-attendance-query.column.expense',
      minWidth: 200,
      sortable: false,
      Cell: (row) => {
        const { title, info } = row.original;

        return (
          <div className='required-attendance-query__merged-cell'>
            { title && <span>{ title }</span> }
            { hasAdditionalInfo ? <AdditionalInfo info={ info } /> : null }
          </div>
        );
      },
    },
    {
      accessor: (row) => getElement(row, 'unit'),
      id: 'units',
      borderLeft: true,
      sortable: false,
      Cell: (row) => {
        return (
          <div className='required-attendance-query__unit'>{ row.value }</div>
        );
      },
    },
  ];

  for (let no = 1; no <= 13; no++) {
    const period = padStart(`${ no }`, 2, '0');

    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, `period${ no }`), currencyOptions),
      id: `period${ no }`,
      intlId: 'required-attendance-query.column.period',
      intlValues: { period },
      isNumber: true,
      minWidth: 100,
      sortable: false,
    });
  }

  if (!hideTotals) {
    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, 'totalHour'), currencyOptions),
      id: 'totalHour',
      intlId: 'required-attendance-query.column.totalHours',
      isNumber: true,
      minWidth: 130,
      sortable: false,
      Cell: (row) => {
        return (
          <div className='required-attendance-query__total--bold'>
            {row.value}
          </div>
        );
      },
    });

    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, 'totalAmount'), currencyOptions),
      id: 'totalAmount',
      intlId: 'required-attendance-query.column.totalAmounts',
      isNumber: true,
      minWidth: 130,
      sortable: false,
      Cell: (row) => {
        return (
          <div className='required-attendance-query__total--bold'>
            {row.value}
          </div>
        );
      },
    });
  }

  expenses && each(expenses, (item) => {
    let row = {};

    const periods = getElement(item, 'periods');

    row.title = getElement(item, 'description');
    row.info = {
      originValue: getElement(item, 'originValue', 'shortDescription'),
      originDistribution: getElement(item, 'originDistribution', 'shortDescription'),
      originDistributionHour: getElement(item, 'originDistributionHour', 'shortDescription'),
      originDistributionAmount: getElement(item, 'originDistributionAmount', 'shortDescription'),
    };
    row.totalHour = hideTotals ? null : formatNumber(getElement(item, 'totalHour'), currencyOptions);
    row.unit = intl.formatMessage({ id: hasHoursDaysLabel ? 'required-attendance-query.cell.hours-days' : 'required-attendance-query.cell.hours' });
    row.mergedCell = true;

    periods.forEach((period, idx) => {
      row[`period${ ++idx }`] = period.hour;
    });

    rows.push(row);

    row = {};

    row.totalAmount = hideTotals ? null : formatNumber(getElement(item, 'totalAmount'), currencyOptions);
    row.unit = intl.formatMessage({ id: 'required-attendance-query.cell.amounts' });

    periods.forEach((period, idx) => {
      row[`period${ ++idx }`] = period.amount;
    });

    rows.push(row);
  });

  const columns = [
    ...columnsFixed,
    ...columnsScrolled,
  ];

  return {
    rows,
    columnsFixed,
    columnsScrolled,
    columns,
  };
}

function extractAmountsData(data, currencyOptions, hasAdditionalInfo, intl, hideTotals) {
  const { expenses } = data;
  const columnsScrolled = [];
  const rows = [];

  const columnsFixed = [
    {
      accessor: (row) => getElement(row, 'description'),
      align: 'left',
      hasMergedCells: true,
      id: 'expense',
      intlId: 'required-attendance-query.column.expense',
      minWidth: 200,
      sortable: false,
      Cell: (row) => {
        const { title, info } = row.original;

        return (
          <div className='required-attendance-query__merged-cell'>
            { title && <span>{ title }</span> }
            { hasAdditionalInfo ? <AdditionalInfo info={ info } /> : null }
          </div>
        );
      },
    },
  ];

  for (let no = 1; no <= 13; no++) {
    const period = padStart(`${ no }`, 2, '0');

    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, `period${ no }`), currencyOptions),
      id: `period${ no }`,
      intlId: 'required-attendance-query.column.period',
      intlValues: { period },
      isNumber: true,
      minWidth: 100,
      sortable: false,
    });
  }

  if (!hideTotals) {
    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, 'totalAmount'), currencyOptions),
      id: 'totalAmount',
      intlId: 'required-attendance-query.column.total',
      isNumber: true,
      minWidth: 100,
      sortable: false,
      Cell: (row) => {
        return (
          <div className='required-attendance-query__total--bold'>
            {row.value}
          </div>
        );
      },
    });
  }

  expenses && each(expenses, (item) => {
    const row = {};

    const periods = getElement(item, 'periods');

    row.title = getElement(item, 'description');
    row.info = {
      premiumDescription: getElement(item, 'premiumDescription'),
    };
    row.totalAmount = hideTotals ? null : formatNumber(getElement(item, 'totalAmount'), currencyOptions);

    periods.forEach((period, idx) => {
      row[`period${ ++idx }`] = period.amount;
    });

    rows.push(row);
  });

  const columns = [
    ...columnsFixed,
    ...columnsScrolled,
  ];

  return {
    rows,
    columnsFixed,
    columnsScrolled,
    columns,
  };
}

function extractHoursData(data, currencyOptions, hasAdditionalInfo, intl, hideTotals) {
  const { expenses } = data;
  const columnsScrolled = [];
  const rows = [];

  const columnsFixed = [
    {
      accessor: (row) => getElement(row, 'description'),
      align: 'left',
      hasMergedCells: true,
      id: 'expense',
      intlId: 'required-attendance-query.column.expense',
      minWidth: 200,
      sortable: false,
      Cell: (row) => {
        const { title, info } = row.original;

        return (
          <div className='required-attendance-query__merged-cell'>
            { title && <span>{ title }</span> }
            { hasAdditionalInfo ? <AdditionalInfo info={ info } /> : null }
          </div>
        );
      },
    },
  ];

  for (let no = 1; no <= 13; no++) {
    const period = padStart(`${ no }`, 2, '0');

    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, `period${ no }`), currencyOptions),
      id: `period${ no }`,
      intlId: 'required-attendance-query.column.period',
      intlValues: { period },
      isNumber: true,
      minWidth: 100,
      sortable: false,
    });
  }

  if (!hideTotals) {
    columnsScrolled.push({
      accessor: (row) => formatEmptyNumber(getElement(row, 'totalHour'), currencyOptions),
      id: 'totalHour',
      intlId: 'required-attendance-query.column.total',
      isNumber: true,
      minWidth: 100,
      sortable: false,
      Cell: (row) => {
        return (
          <div className='required-attendance-query__total--bold'>
            {row.value}
          </div>
        );
      },
    });
  }

  expenses && each(expenses, (item) => {
    const row = {};

    const periods = getElement(item, 'periods');

    row.title = getElement(item, 'description');
    row.info = {
      premiumDescription: getElement(item, 'premiumDescription'),
      originDistribution: getElement(item, 'originDistribution', 'shortDescription'),
      originValue: getElement(item, 'originValue', 'shortDescription'),
    };
    row.totalHour = hideTotals ? null : formatNumber(getElement(item, 'totalHour'), currencyOptions);

    periods.forEach((period, idx) => {
      row[`period${ ++idx }`] = period.hour;
    });

    rows.push(row);
  });

  const columns = [
    ...columnsFixed,
    ...columnsScrolled,
  ];

  return {
    rows,
    columnsFixed,
    columnsScrolled,
    columns,
  };
}

export const extractGeneralBenefitsTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.generalBenefits,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
    (state) => false,
  ],
  extractAmountsAndHoursData
);

export const extractHourlyRateTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.hourlyRate,
    (state) => getCurrencyOptions(state),
    (state) => false,
    (state, props) => props.intl,
    (state) => true,
  ],
  extractHoursData
);

export const extractLeavesTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.leaves,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
  ],
  extractHoursData
);

export const extractOtherInformationTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.otherInformation,
    (state) => getCurrencyOptions(state),
    (state) => false,
    (state, props) => props.intl,
    (state) => true,
    (state) => false,
  ],
  extractAmountsAndHoursData
);

export const extractPayrollDeductionsTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.payrollDeductions,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
  ],
  extractAmountsData
);

export const extractPremiumsTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.premiums,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
  ],
  extractAmountsData
);

export const extractReplacementsTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.replacements,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
  ],
  extractHoursData
);

export const extractSpecificBenefitsTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.specialBenefits,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
    (state) => false,
  ],
  extractAmountsAndHoursData
);

export const extractSummaryTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.summary,
    (state) => getCurrencyOptions(state),
    (state) => false,
    (state, props) => props.intl,
    (state) => false,
    (state) => false,
  ],
  extractAmountsAndHoursData
);

export const extractWorkedTab = createSelector(
  [
    (state) => state.requiredAttendanceQuery.data.worked,
    (state) => getCurrencyOptions(state),
    (state) => true,
    (state, props) => props.intl,
    (state) => false,
    (state) => false,
  ],
  extractAmountsAndHoursData
);
