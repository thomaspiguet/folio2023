import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages, FormattedMessage } from 'react-intl';
import { map } from 'lodash';

import { getCurrencyOptions, formatNumber, formatEmpty } from '../../utils/selectors/currency';

defineMessages({
  start: {
    id: 'employee.start-of-the-year',
    defaultMessage: 'Start of the year',
  },
  firstLevel: {
    id: 'employee.first-level',
    defaultMessage: '1st level change',
  },
  secondLevel: {
    id: 'employee.second-level',
    defaultMessage: '2nd level change',
  },
  levelDate: {
    id: 'employee.level-date',
    defaultMessage: 'Date',
  },
  levelBase: {
    id: 'employee.level-base',
    defaultMessage: 'Based on job title',
  },
  ifDifferent: {
    id: 'employee.level-if-different',
    defaultMessage: 'If different',
  },
  replacementsDescription: {
    id: 'employee.replacements-description',
    defaultMessage: 'DESCRIPTION',
  },
  replacementsPercentage: {
    id: 'employee.replacements-percentage',
    defaultMessage: 'PERCENTAGE',
  },
  replacementsType: {
    id: 'employee.replacements-type',
    defaultMessage: 'EXPENSE TYPE',
  },
});

function getElement(record, accessor1, accessor2) {
  if (!record) {
    return '-';
  }
  const el = record[accessor1];
  if (!el) {
    return '-';
  }

  const result = el[accessor2];
  return result || '-';
}

export const extractLevels = createSelector(
  [
    (state) => state.employees.entry.startOfTheYear,
    (state) => state.employees.entry.firstLevel,
    (state) => state.employees.entry.secondLevel,
    (state) => getCurrencyOptions(state),
  ],
  (startOfTheYear, firstLevel, secondLevel, currencyOptions) => {

    const columns = [
      {
        id: 'name',
        accessor: 'name',
        sortable: false,
        minWidth: 120,
        Cell: (props) => (
          <FormattedMessage id={ props.row.name } />
        ),
      },
      {
        id: 'date',
        intlId: 'employee.level-date',
        accessor: (row) => formatEmpty(row.date),
        sortable: false,
      },
      {
        id: 'basedOnJobTitle',
        intlId: 'employee.level-base',
        accessor: (row) => (row.basedOnJobTitle ? formatNumber(row.basedOnJobTitle, currencyOptions) : '-'),
        sortable: false,
      },
      {
        id: 'ifDifferent',
        intlId: 'employee.level-if-different',
        accessor: (row) => formatNumber(row.ifDifferent, currencyOptions),
        sortable: false,
      },

    ];

    const rows = [
      {
        name: 'employee.start-of-the-year',
        date: startOfTheYear.date,
        basedOnJobTitle: startOfTheYear.basedOnJobTitle,
        ifDifferent: startOfTheYear.ifDifferent,
      },
      {
        name: 'employee.first-level',
        date: firstLevel.date,
        basedOnJobTitle: firstLevel.basedOnJobTitle,
        ifDifferent: firstLevel.ifDifferent,
      },
      {
        name: 'employee.second-level',
        date: secondLevel.date,
        basedOnJobTitle: secondLevel.basedOnJobTitle,
        ifDifferent: secondLevel.ifDifferent,
      },
    ];

    return {
      rows,
      columns,
    };

  }

);

export const extractReplacements = createSelector(
  [
    (state) => state.employees.entry.replacements,
    (state) => getCurrencyOptions(state),
  ],
  (replacements, currencyOptions) => {
    const columns = [
      {
        id: 'type',
        accessor: 'type',
        intlId: 'employee.replacements-type',
        sortable: false,
      },
      {
        id: 'description',
        accessor: 'description',
        intlId: 'employee.replacements-description',
        sortable: false,
        minWidth: 120,
      },
      {
        id: 'percentage',
        accessor: (row) => formatNumber(row.percentage, currencyOptions),
        intlId: 'employee.replacements-percentage',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = map(replacements, item => {
      return {
        type: getElement(item, 'expenseType', 'code'),
        description: getElement(item, 'expenseType', 'shortDescription'),
        percentage: item.percentage,
      };
    });

    if (!rows.length) {
      rows.push({
        type: '-',
        description: '-',
        hours: '-',
        percentage: '-',
      });
    }

    return {
      rows,
      columns,
    };
  }
);
