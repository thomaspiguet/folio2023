import React from 'react';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import { defineMessages, FormattedMessage } from 'react-intl';
import { find, isBoolean, map, padStart, uniq } from 'lodash';
import { applyCustomColumns, convertFunctionalCenter, fillGroupRows, getCustomColumnGroup, rootHash } from '../../utils/utils';

import { formatEmptyNumber, getCurrencyOptions, getElement } from '../../utils/selectors/currency';
import {
  detailSelector,
} from './reducer';

defineMessages({
  func: {
    id: 'salaries-table.func',
    defaultMessage: 'FUNC. CTR',
  },
  description: {
    id: 'salaries-table.description',
    defaultMessage: 'ORIG. DESC',
  },
  details: {
    id: 'salaries-table.details',
    defaultMessage: 'DETAILS',
  },
  total: {
    id: 'salaries-table.total',
    defaultMessage: 'TOTAL',
  },
  period: {
    id: 'salaries-table.period',
    defaultMessage: 'PER. {period}',
  },
  common: {
    id: 'salaries-table.common-group',
    defaultMessage: 'General information',
  },
  amounts: {
    id: 'salaries-table.amounts-group',
    defaultMessage: 'Amounts',
  },
  units: {
    id: 'salaries-table.units-group',
    defaultMessage: 'Units',
  },
  amountsUnits: {
    id: 'salaries-table.amounts-units-group',
    defaultMessage: 'Amounts/Units',
  },
  accountNumber: {
    id: 'salaries-table.account-number',
    defaultMessage: 'ACCOUNT NO.',
  },
  financialStat: {
    id: 'salaries-table.financial-stat',
    defaultMessage: 'FIN./STAT.',
  },
  accountDescription: {
    id: 'salaries-table.account-description',
    defaultMessage: 'ACCOUNT DESC.',
  },
  systemCode: {
    id: 'salaries-table.system-code',
    defaultMessage: 'SYSTEM CODE',
  },
  primCode: {
    id: 'salaries-table.primary-code',
    defaultMessage: 'PRIMARY CODE',
  },
});

function getOrder(state) {
  const line = find(state.dashboard.budgetOptions, x => x.id === +state.salaries.detailId);
  if (line) {
    return line.order;
  }
  return undefined;
}

function isOtherExpenses(detailId) {
  detailId = +detailId;
  return detailId === 8 || detailId === 9;
}

function isLines12to20(detailId) {
  detailId = +detailId;
  return (detailId >= 12 && detailId <= 20);
}

export const getTitle = createSelector(
  [
    (state) => state.salaries.detailId,
    (state) => state.dashboard.budgetOptions,
  ],
  (detailId, budgetOptions) => {
    const opt = find(budgetOptions, { id: +detailId });
    if (opt) {
      return opt.description;
    }
    return '';
  }
);

function getAllAccountSubColumnsFixed(detailId, scenarioId) {
  return [
    {
      intlId: 'salaries-table.account-number',
      id: 'accountInformation.accountNumber',
      exportId: '1',
      isGroupable: true,
      isSortable: true,
      isFilterable: true,
      groupId: 'accountInformation.accountNumber',
      Aggregated: row => null,
      minWidth: 180,
      sortable: false,
      Cell: (row) => {
        const accountNumber = convertFunctionalCenter(getElement(row, 'original', 'accountInformation', 'accountNumber'));
        const id = getElement(row, 'original', 'id');
        const haveGroups = row.tdProps.rest.haveGroups;
        delete row.tdProps.rest.haveGroups;
        return ((accountNumber && !haveGroups && !isLines12to20(detailId))
           ? <Link
             className='salaries__link'
             to={ `/${ scenarioId }/other-expenses/${ id }` }
           > { accountNumber } </Link>
           : <div className='salaries__nolink'>{ accountNumber }</div>
        );
      },
    },
    {
      intlId: 'salaries-table.financial-stat',
      id: 'accountInformation.isFinancial',
      isGroupable: true,
      isFilterable: true,
      isSortable: true,
      groupId: 'accountInformation.isFinancial',
      Aggregated: row => null,
      exportId: '2',
      minWidth: 100,
      sortable: false,
      Cell: (row) => {
        const isFinancial = getElement(row, 'original', 'accountInformation', 'isFinancial');
        delete row.tdProps.rest.haveGroups;
        if (!isBoolean(isFinancial)) {
          return null;
        }
        return (isFinancial
         ? <FormattedMessage id='salaries-table.financial' defaultMessage='Financial' />
         : <FormattedMessage id='salaries-table.statistic' defaultMessage='Statistical' />
        );
      },
    },
    {
      intlId: 'salaries-table.account-description',
      id: 'accountInformation.description',
      accessor: row => getElement(row, 'accountInformation', 'description'),
      groupId: 'accountInformation.description',
      Aggregated: row => null,
      exportId: '3',
      sortable: false,
      width: 260,
    },
    {
      intlId: 'salaries-table.system-code',
      id: 'accountInformation.systemCode',
      accessor: row => getElement(row, 'accountInformation', 'systemCode'),
      groupId: 'accountInformation.systemCode',
      Aggregated: row => null,
      hiddenByDefault: true,
      exportId: '4',
      sortable: false,
      width: 120,
    },
    {
      intlId: 'salaries-table.primary-code',
      id: 'accountInformation.primaryCode',
      accessor: row => getElement(row, 'accountInformation', 'primaryCode'),
      groupId: 'accountInformation.primaryCode',
      Aggregated: row => null,
      hiddenByDefault: true,
      exportId: '5',
      sortable: false,
      width: 120,
    },
    {
      intlId: 'salaries-table.secondary-code',
      id: 'accountInformation.secondaryCode',
      accessor: row => getElement(row, 'accountInformation', 'secondaryCode'),
      groupId: 'accountInformation.secondaryCode',
      Aggregated: row => null,
      hiddenByDefault: true,
      exportId: '6',
      sortable: false,
      width: 160,
    },
  ];
}

function getColumnDrilldown(detailId, scenarioId, order) {
  if (isOtherExpenses(detailId)) {
    return {
      id: 'drilldown',
      maxWidth: 40,
      sortable: false,
      isLink: true,
      Cell: (row) => {
        const accountNumber = getElement(row, 'original', 'accountInformation', 'accountNumber');
        const id = getElement(row, 'original', 'id');
        const groupId = row.original.groupId;
        return ((!groupId && accountNumber)
            ? <Link
              className='salaries__link salaries__link--drilldown'
              to={ `/${ scenarioId }/other-expenses/${ id }` }
            />
            : null
        );
      },
    };
  } else if (isLines12to20(detailId)) {
    return {};
  }
  return {
    id: 'drilldown',
    maxWidth: 40,
    sortable: false,
    isLink: true,
    Cell: (props) => {
      const info = getElement(props, 'original', 'generalInformation');
      const groupId = props.original.groupId;
      return (!groupId && info.functionalCenterId && info.originDescription) ? (
        <Link
          className='salaries__link salaries__link--drilldown'
          to={ `/${ scenarioId }/dashboard/${ detailId }/origin/${ info.originDescription.value }/${ info.functionalCenterId }` }
        />
      ) : null;
    },
  };
}

function getAllSubColumnsFixed(detailId, scenarioId) {
  return [
    {
      intlId: 'salaries-table.func',
      accessor: 'generalInformation.functionalCenter',
      id: 'generalInformation.functionalCenter',
      exportId: '1',
      isSortable: true,
      isGroupable: true,
      isFilterable: true,
      groupId: 'generalInformation.functionalCenter',
      Aggregated: row => null,
      minWidth: 150,
      sortable: false,
      Cell: (row) => {
        const info = getElement(row, 'original', 'generalInformation');
        const haveGroups = row.tdProps.rest.haveGroups;
        delete row.tdProps.rest.haveGroups;
        return (info && info.originDescription && info.functionalCenterId && !haveGroups) ?
          <Link
            className='salaries__link'
            to={ `/${ scenarioId }/dashboard/${ detailId }/origin/${ info.originDescription.value }/${ info.functionalCenterId }` }
          >{ info.functionalCenter }</Link>
          :
          <div className='salaries__nolink'>{ info.functionalCenter }</div>;
      },
    },
    {
      intlId: 'salaries-table.description',
      accessor: row => getElement(row, 'generalInformation', 'originDescription', 'displayValue'),
      id: 'generalInformation.originDescription',
      isSortable: true,
      isGroupable: true,
      isFilterable: true,
      groupId: 'generalInformation.originDescription',
      Aggregated: row => null,
      exportId: '2',
      minWidth: 135,
      sortable: false,
    },
    {
      intlId: 'salaries-table.details',
      accessor: row => getElement(row, 'generalInformation', 'detail'),
      id: 'generalInformation.detail',
      exportId: '3',
      isSortable: true,
      sortable: false,
      Aggregated: row => null,
      width: 90,
      isNumber: true,
    },
  ];
}

function getSubColumnsFixed(detailId, scenarioId, order) {
  if (isOtherExpenses(detailId) || isLines12to20(detailId)) {
    return getAllAccountSubColumnsFixed(detailId, scenarioId);
  }

  return getAllSubColumnsFixed(detailId, scenarioId);
}

function getColumnsScrolled(detailId, subColumnsAmounts, subColumnsUnits, subColumnsAmountsUnits, order) {
  if (isOtherExpenses(detailId) || isLines12to20(detailId)) {
    return [
      {
        intlId: 'salaries-table.amounts-units-group',
        id: 'Amounts/Units',
        columns: subColumnsAmountsUnits,
        sortable: false,
        align: 'center',
      },
    ];
  }

  return [
    {
      intlId: 'salaries-table.amounts-group',
      id: 'Amount',
      columns: subColumnsAmounts,
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'salaries-table.units-group',
      id: 'Unit',
      columns: subColumnsUnits,
      sortable: false,
      align: 'center',
    },
  ];

}

function getSubColumns(currencyOptions) {

  const subColumnsAmounts = [
    {
      intlId: 'salaries-table.total',
      accessor: (row) => formatEmptyNumber(getElement(row, 'amountsDetails', 'total'), currencyOptions),
      id: 'amountsTotal',
      exportId: '0',
      sortable: false,
      isNumber: true,
    },
  ];

  const subColumnsUnits = [
    {
      intlId: 'salaries-table.total',
      accessor: (row) => formatEmptyNumber(getElement(row, 'unitsDetails', 'total'), currencyOptions),
      id: 'unitsTotal',
      exportId: '0',
      sortable: false,
      isNumber: true,
    },
  ];

  const subColumnsAmountsUnits = [
    {
      intlId: 'salaries-table.total',
      accessor: (row) => formatEmptyNumber(getElement(row, row.accountInformation.isFinancial ? 'amountsDetails' : 'unitsDetails', 'total'), currencyOptions),
      id: 'amountsTotal',
      exportId: '0',
      sortable: false,
      isNumber: true,
    },
  ];

  for (let no = 1; no <= 13; no++) {
    const period = padStart(no, 2, '0');
    subColumnsAmounts.push({
      intlId: 'salaries-table.period',
      intlValues: { period },
      accessor: (row) => formatEmptyNumber(getElement(row, 'amountsDetails', `period${ no }`), currencyOptions),
      id: `amounts${ no }`,
      exportId: `${ no }`,
      isNumber: true,
      sortable: false,
    });
    subColumnsUnits.push({
      intlId: 'salaries-table.period',
      intlValues: { period },
      accessor: (row) => formatEmptyNumber(getElement(row, 'unitsDetails', `period${ no }`), currencyOptions),
      id: `units${ no }`,
      exportId: `${ no }`,
      isNumber: true,
      sortable: false,
    });
    subColumnsAmountsUnits.push({
      intlId: 'salaries-table.period',
      intlValues: { period },
      accessor: (row) => formatEmptyNumber(getElement(row, row.accountInformation.isFinancial ? 'amountsDetails' : 'unitsDetails', `period${ no }`), currencyOptions),
      id: `amountsunits${ no }`,
      exportId: `${ no }`,
      isNumber: true,
      sortable: false,
    });
  }

  return { subColumnsAmounts, subColumnsUnits, subColumnsAmountsUnits };
}

function getColumnsExport(detailId, columnsScrolled) {
  if (!isOtherExpenses(detailId)) {
    return columnsScrolled;
  }

  const columnsGroup = columnsScrolled[0];
  return [
    { ...columnsGroup, id: 'Amount' },
  ];
}

export const extractData = createSelector(
  [
    (state) => getCurrencyOptions(state),
    (state) => state.salaries.detailId,
    (state) => detailSelector(state).data,
    (state) => detailSelector(state).groups,
    (state) => detailSelector(state).dataGroups,
    (state) => detailSelector(state).columns,
    (state) => detailSelector(state).filter,
    (state) => state.scenario.selectedScenario.scenarioId,
    (state) => getOrder(state),
  ],
  (currencyOptions, detailId, data, groups, dataGroups, columnsInfo, filterData, scenarioId, order) => {

    const subColumnsFixed = getSubColumnsFixed(detailId, scenarioId, order);

    let columnsFixed = [{
      intlId: 'salaries-table.common-group',
      id: 'Description',
      columns: subColumnsFixed,
      sortable: false,
    }];

    const { subColumnsAmounts, subColumnsUnits, subColumnsAmountsUnits } = getSubColumns(currencyOptions);
    let columnsScrolled = getColumnsScrolled(detailId, subColumnsAmounts, subColumnsUnits, subColumnsAmountsUnits, order);

    let rows = data || [];
    if (groups && groups.length) {
      rows = [];
      const primeHash = (filterData && filterData.filterHash) ? filterData.filterHash : rootHash;
      fillGroupRows(rows, dataGroups, primeHash, { generalInformation: { originDescription: {} } });
      const columnDrillDown = getColumnDrilldown(detailId, scenarioId, order);
      const columnIds = uniq([...map(groups, column => column.id), columnDrillDown.id, ...map(subColumnsFixed, (column) => column.id)]);
      const allSubColumnsFixed = [...subColumnsFixed, columnDrillDown];
      columnsFixed[0].columns = map(columnIds, id => {
        const column = find(allSubColumnsFixed, { id });
        return {
          ...column,
          grouped: !!find(groups, { groupId: column.groupId }),
        };
      });
    }

    const customColumns = {
      columnsFixed: getCustomColumnGroup(columnsFixed, columnsInfo),
      columnsScrolled: getCustomColumnGroup(columnsScrolled, columnsInfo),
    };

    columnsFixed = applyCustomColumns(columnsFixed, customColumns.columnsFixed);
    columnsScrolled = applyCustomColumns(columnsScrolled, customColumns.columnsScrolled);
    const columnsScrolledExport = getColumnsExport(detailId, columnsScrolled);

    const columns = [
      ...columnsFixed,
      ...columnsScrolled,
    ];

    return {
      rows,
      columnsFixed,
      columnsScrolled,
      columnsScrolledExport,
      columns,
      customColumns,
    };
  }
);

