import React from 'react';
import { defineMessages } from 'react-intl';
import { createSelector } from 'reselect';
import { groupBy, sortBy, each, find, map, filter, reduce } from 'lodash';

import Decimal from '../../../../node_modules/decimal.js/decimal';

import {
  getCurrencyOptions,
  formatMoney,
  formatNumber,
  formatDashesNumber,
  formatZeroNumber,
} from '../../utils/selectors/currency';
import Budget from './dashboard-budget';

defineMessages({
  description: {
    id: 'dashboard-table.description',
    defaultMessage: 'DESCRIPTION',
  },
  fte: {
    id: 'dashboard-table.fte',
    defaultMessage: 'FTE',
  },
  amounts: {
    id: 'dashboard-table.amounts',
    defaultMessage: 'AMOUNTS',
  },
  hours: {
    id: 'dashboard-table.hours',
    defaultMessage: 'HOURS',
  },
  selected: {
    id: 'dashboard-table.selected',
    defaultMessage: 'Selected budget',
  },
  other: {
    id: 'dashboard-table.other-budget',
    defaultMessage: 'Budget',
  },
  byPeriod: {
    id: 'dashboard-table.by-period',
    defaultMessage: 'Actual to date - Period',
  },
  byYear: {
    id: 'dashboard-table.by-year',
    defaultMessage: 'Actual',
  },
  period: {
    id: 'dashboard-table.period',
    defaultMessage: 'PER. {period}',
  },
});

export const extractBudgetsAmount = createSelector(
  [
    state => state.dashboard.data,
    state => state.app.filter,
    state => state.dashboard.budgets,
  ],
  (data, { year }, budgets) => {
    const organization = 'o1';
    const org = filter(data, (item) => (
      item.organization === organization
      && item.year === year
      && budgets[item.budget]
    ));

    let months = groupBy(org, ({ budget, year, month }) => {
      return `${ budget }:${ year }:${ month }`;
    });

    months = map(months, (items) => ({
      budget: items[0].budget,
      year: items[0].year,
      month: items[0].month,
      Amounts: reduce(items, (result, item) => result.plus(item.Amounts), new Decimal(0)).toNumber(),
    }));

    const groups = groupBy(months, ({ year, month }) => {
      return `${ year }:${ month }`;
    });

    const result = [];
    each(groups, (val) => {
      const item = { month: val[0].month };
      each(budgets, (budget, id) => {
        const el = find(val, { budget: id });
        item[id] = el ? el.Amounts : 0;
      });
      result.push(item);
    });

    return result;
  }
);

function makeGroupColumn(postfix, currencyOptions, { hasFTE, intlId, color, values, value, sortDescending, budgetName, isLoading, onChange }) {
  const subcolums = [
    {
      intlId: 'dashboard-table.amounts',
      isNumber: true,
      highlightNegative: true,
      id: `amounts${ postfix }`,
      accessor: (row) => formatMoney(row[`amounts${ postfix }`], currencyOptions),
      sortable: false,
    },
    {
      intlId: 'dashboard-table.hours',
      isNumber: true,
      highlightNegative: true,
      id: `hours${ postfix }`,
      accessor: (row) => formatDashesNumber(row[`hours${ postfix }`], currencyOptions),
      sortable: false,
    },
  ];

  if (hasFTE) {
    subcolums.unshift({
      intlId: 'dashboard-table.fte',
      isNumber: true,
      highlightNegative: true,
      id: `fte${ postfix }`,
      accessor: (row) => (row.showZeroFte
        ? formatZeroNumber(row[`fte${ postfix }`], currencyOptions)
        : formatNumber(row[`fte${ postfix }`], currencyOptions)),
      sortable: false,
      width: 80,
    });
  }

  const cprops = {
    intlId,
    color,
    values,
    value,
    budgetName,
    isLoading,
    sortDescending,
    onChange,
  };

  return {
    columns: subcolums,
    sortable: false,
    id: postfix,
    isLoading,
    values,
    Header: (props) => (
      <Budget { ...props } { ...cprops } />
    ),
  };
}

function isTargetRow(row) {
  return row.itemId === 11 || row.itemId === 12; // Cible || Ecart
}

export const extractBudgets = createSelector(
  [
    state => getCurrencyOptions(state),
    state => state.scenario.organizationPeriods,
    state => state.scenario.organizationYears,
    state => state.dashboard.budgetOptions,
    state => state.dashboard.budgetSelected,
    state => state.dashboard.budgetActualByPeriod,
    state => state.dashboard.budgetActualByYear,
    state => state.dashboard.budgetOther,
    state => state.dashboard.budgetActualPeriod,
    state => state.dashboard.budgetActualYear,
    state => state.dashboard.budgetActualYearLoading,
    state => state.dashboard.budgetActualPeriodLoading,
    (state, props) => props.setYear,
    (state, props) => props.setPeriod,
  ],
  (currencyOptions, periods, years, options, selected, byPeriod, byYear, other,
   budgetActualPeriod, budgetActualYear,
   budgetActualYearLoading, budgetActualPeriodLoading,
   setYear, setPeriod) => {

    const items = sortBy(options, 'order');

    const rowsById = {};
    const rows = [];
    each(items, (item) => {
      const row = {};
      row.description = item.description;
      row.section = item.section;
      row.fteSelected = '';
      row.amountsSelected = 0;
      row.hoursSelected = 0;
      row.amountsByPeriod = 0;
      row.hoursByPeriod = 0;
      row.amountsByYear = 0;
      row.hoursByYear = 0;
      row.amountsOther = 0;
      row.hoursOther = 0;
      row.isSection = item.type === 0;
      row.isJoinedSection = item.id === 11; // Cible
      row.itemId = item.id;
      if (isTargetRow(row)) {
        row.hoursSelected = '';
        row.amountsByPeriod = '';
        row.hoursByPeriod = '';
        row.amountsByYear = '';
        row.hoursByYear = '';
        row.amountsOther = '';
        row.hoursOther = '';
      }

      rowsById[item.id] = row;
      rows.push(row);
    });

    each(selected, (item) => {
      const row = rowsById[item.rowOptionId];
      if (row) {
        row.fteSelected = item.fte;
        if (row.fteSelected === 0) {
          row.fteSelected = '';
        }
        row.amountsSelected = item.amount;
        row.hoursSelected = item.hours;
        row.showZeroFte = item.rowOptionId === 1;
        if (isTargetRow(row) && !row.hoursSelected) {
          row.hoursSelected = '';
        }
      }
    });
    each(byPeriod, (item) => {
      const row = rowsById[item.rowOptionId];
      if (row) {
        row.amountsByPeriod = item.amount;
        row.hoursByPeriod = item.hours;
      }
    });
    each(byYear, (item) => {
      const row = rowsById[item.rowOptionId];
      if (row) {
        row.amountsByYear = item.amount;
        row.hoursByYear = item.hours;
      }
    });
    if (other && other.rows) {
      each(other.rows, (item) => {
        const row = rowsById[item.rowOptionId];
        if (row) {
          row.amountsOther = item.amount;
          row.hoursOther = item.hours;
        }
      });
    }

    const columns = [
      {
        Header: '',
        columns: [{
          intlId: 'dashboard-table.description',
          accessor: 'description',
          minWidth: 150,
          sortable: false,
        }],
      },
    ];

    const selectedColumn = makeGroupColumn('Selected', currencyOptions, {
      hasFTE: true,
      intlId: 'dashboard-table.selected',
      color: '#ffb915',
    });
    columns.push(selectedColumn);

    const byPeriodColumn = makeGroupColumn('ByPeriod', currencyOptions, {
      intlId: 'dashboard-table.by-period',
      // color: '#00bdd5',
      values: periods,
      value: budgetActualPeriod,
      isLoading: budgetActualPeriodLoading,
      onChange: setPeriod,
      minWidth: 150,
    });
    columns.push(byPeriodColumn);

    const byYearColumn = makeGroupColumn('ByYear', currencyOptions, {
      intlId: 'dashboard-table.by-year',
      // color: '#47d58e',
      values: years,
      value: budgetActualYear,
      sortDescending: true,
      isLoading: budgetActualYearLoading,
      onChange: setYear,
      minWidth: 150,
    });
    columns.push(byYearColumn);

    const otherColumn = makeGroupColumn('Other', currencyOptions, {
      intlId: 'dashboard-table.other-budget',
      budgetName: (other && other.scenarioName) ? other.scenarioName : '',
    });
    columns.push(otherColumn);
    return {
      rows,
      columns,
    };
  }
);


function addBudget(budgets, allBudgets, budget) {
  budgets[budget] = allBudgets[budget];
}

export const filterBudgets = createSelector(
  [
    (state) => state.app.budgets,
    (state, filter) => filter,
    (state) => state.scenario.selectedScenario.scenarioId,
  ],
  (allBudgets, { scenario }, scenarioId) => {
    const budgets = {};
    addBudget(budgets, allBudgets, scenarioId);
    addBudget(budgets, allBudgets, scenario);
    return budgets;
  }
);
