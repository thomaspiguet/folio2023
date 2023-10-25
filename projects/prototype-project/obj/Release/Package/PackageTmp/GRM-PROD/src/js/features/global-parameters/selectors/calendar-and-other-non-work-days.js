import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { map, each, times, reduce } from 'lodash';
import Decimal from '../../../../../node_modules/decimal.js/decimal';

import { getCurrencyOptions, formatNumber, formatEmpty, getElementEmpty } from '../../../utils/selectors/currency';

defineMessages({
  total: {
    id: 'parameters-by-structure.total-column',
    defaultMessage: 'TOTAL',
  },
  other: {
    id: 'parameters-by-structure.other',
    defaultMessage: 'OTHER NON-WORK DAYS',
  },
  expense: {
    id: 'parameters-by-structure.expense',
    defaultMessage: 'EXPENSE',
  },
  date: {
    id: 'parameters-by-structure.date',
    defaultMessage: 'DATE',
  },
  day: {
    id: 'parameters-by-structure.day',
    defaultMessage: 'DAY',
  },
});


function makeDashFormZero(day, currencyOptions) {
  return day ? formatNumber(day, currencyOptions) : '-';
}

function buildScheduleRow(currencyOptions, isRegular, item, index) {
  return {
    description: item.title,
    index,
    isRegular: !!isRegular,
    sunday: makeDashFormZero(item.week.Sunday, currencyOptions),
    monday: makeDashFormZero(item.week.Monday, currencyOptions),
    tuesday: makeDashFormZero(item.week.Tuesday, currencyOptions),
    wednesday: makeDashFormZero(item.week.Wednesday, currencyOptions),
    thursday: makeDashFormZero(item.week.Thursday, currencyOptions),
    friday: makeDashFormZero(item.week.Friday, currencyOptions),
    saturday: makeDashFormZero(item.week.Saturday, currencyOptions),
    total: formatNumber(item.total, currencyOptions),
    original: {
      sunday: formatEmpty(item.week.Sunday),
      monday: formatEmpty(item.week.Monday),
      tuesday: formatEmpty(item.week.Tuesday),
      wednesday: formatEmpty(item.week.Wednesday),
      thursday: formatEmpty(item.week.Thursday),
      friday: formatEmpty(item.week.Friday),
      saturday: formatEmpty(item.week.Saturday),
      total: formatEmpty(item.total),
    },
  };
}

function addTotalRow(rows, fields, currencyOptions) {
  const total = { isSection: true };
  each(fields, (field) => {
    total[field] = '-';
  });
  each(rows, (row) => {
    each(fields, (field) => {
      let sum = total[field];
      const val = row.original[field];
      if (val !== '-' && val !== undefined) {
        if (sum === '-') {
          sum = new Decimal(val);
        } else {
          sum = sum.plus(val);
        }
      }
      total[field] = sum;
    });
  });
  each(fields, (field) => {
    const sum = total[field];
    if (sum !== '-') {
      total[field] = formatNumber(sum.toNumber(), currencyOptions);
    }
  });
  rows.push(total);
}

function fillEmptyCalendarLines(rows, fields) {
  while (rows.length < 4) {
    const row = reduce(fields,
      (result, field) => {
        result[field] = '-';
        return result;
      },
      { description: '-', original: {}, index: rows.length });
    rows.push(row);
  }
}

function extractCalendar(board, currencyOptions) {
  const columns = [
    {
      id: 'description',
      accessor: 'description',
      sortable: false,
      minWidth: 180,
      Cell: (props) => {
        if (props.original.isRegular) {
          return <FormattedMessage id='parameters-by-structure.regular' defaultMessage='Regular' />;
        } else if (props.original.isSection) {
          return <FormattedMessage id='parameters-by-structure.total-row' defaultMessage='Total' />;
        }
        return (
          <div>
            <span className='grid-column__index'>{ props.original.index }</span>
            <span className='grid-column__text' >{ props.row.description || '' }</span>
          </div>
        );
      },
    },
    {
      id: 'sunday',
      accessor: 'sunday',
      intlId: 'required-attendance.schedules-sunday',
      sortable: false,
    },
    {
      id: 'monday',
      accessor: 'monday',
      intlId: 'required-attendance.schedules-monday',
      sortable: false,
    },
    {
      id: 'tuesday',
      accessor: 'tuesday',
      intlId: 'required-attendance.schedules-tuesday',
      sortable: false,
    },
    {
      id: 'wednesday',
      accessor: 'wednesday',
      intlId: 'required-attendance.schedules-wednesday',
      sortable: false,
    },
    {
      id: 'thursday',
      accessor: 'thursday',
      intlId: 'required-attendance.schedules-thursday',
      sortable: false,
    },
    {
      id: 'friday',
      accessor: 'friday',
      intlId: 'required-attendance.schedules-friday',
      sortable: false,
    },
    {
      id: 'saturday',
      accessor: 'saturday',
      intlId: 'required-attendance.schedules-saturday',
      sortable: false,
    },
    {
      id: 'total',
      accessor: 'total',
      intlId: 'parameters-by-structure.total-column',
      sortable: false,
    },
  ];

  const fields = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'total'];
  const rows = map(board.others, buildScheduleRow.bind(null, currencyOptions, false));
  rows.unshift(buildScheduleRow(currencyOptions, true, board.regular));
  fillEmptyCalendarLines(rows, fields);

  addTotalRow(rows, fields, currencyOptions);

  return {
    rows,
    columns,
  };
}

export const extractGlobalParametersCalendar = createSelector(
  [
    (state) => state.globalParameters.entry.calendar.board,
    (state) => getCurrencyOptions(state),
  ],
  extractCalendar
);


export const extractParameterByStructureCalendar = createSelector(
  [
    (state) => state.parametersByStructure.entry.calendar.board,
    (state) => getCurrencyOptions(state),
  ],
  extractCalendar
);

function extractOtherNonWorkDays(otherNonWorkDays) {
  const columns = [
    {
      id: 'other',
      accessor: 'other',
      intlId: 'parameters-by-structure.other',
      sortable: false,
    },
    {
      id: 'expense',
      accessor: 'expense',
      intlId: 'parameters-by-structure.expense',
      sortable: false,
    },
    {
      id: 'date',
      accessor: 'date',
      intlId: 'parameters-by-structure.date',
      sortable: false,
    },
    {
      id: 'day',
      accessor: 'day',
      intlId: 'parameters-by-structure.day',
      sortable: false,
    },
  ];

  let rows = map(otherNonWorkDays, (row) => {
    return {
      other: row.row,
      expense: getElementEmpty(row, 'expense', 'code'),
      date: row.date,
      day: row.day,
    };
  });

  if (!rows.length) {
    rows = times(3, () => ({
      other: '-',
      expense: '-',
      date: '-',
      day: '-',
    }));
  }

  return {
    rows,
    columns,
  };
}

export const extractParametersByStructureOtherNonWorkDays = createSelector(
  [
    (state) => state.parametersByStructure.entry.calendar.otherNonWorkDays,
  ],
  extractOtherNonWorkDays
);

export const extractGlobalParametersOtherNonWorkDays = createSelector(
  [
    (state) => state.globalParameters.entry.calendar.otherNonWorkDays,
  ],
  extractOtherNonWorkDays
);
