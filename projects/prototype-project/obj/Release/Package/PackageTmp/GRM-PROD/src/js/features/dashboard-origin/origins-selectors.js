import React from 'react';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { padStart } from 'lodash';
import accounting from 'accounting';

import { routes } from '../app/app';
import { getCurrencyOptions } from '../../utils/selectors/currency';

import { getDataKey, getColumnsKey } from './origins-reducer';
import { getCustomColumnGroup, applyCustomColumns, addScenarioIdToRoute } from '../../utils/utils';

defineMessages({
  position: {
    id: 'salaries-table.position',
    defaultMessage: 'POSITION',
  },
  originDesctipion: {
    id: 'salaries-table.origin-description',
    defaultMessage: 'DESCRIPTION',
  },
  jobDesctipion: {
    id: 'salaries-table.job-description',
    defaultMessage: 'DESCRIPTION',
  },
  jobTitle: {
    id: 'salaries-table.job-title',
    defaultMessage: 'JOB TITLE',
  },
  employee: {
    id: 'salaries-table.employee',
    defaultMessage: 'EMPLOYEE',
  },
  name: {
    id: 'salaries-table.fist-name',
    defaultMessage: 'FIRST NAME',
  },
  givenName: {
    id: 'salaries-table.last-name',
    defaultMessage: 'LAST NAME',
  },
  reference: {
    id: 'salaries-table.reference',
    defaultMessage: 'REFERENCE',
  },
  type: {
    id: 'salaries-table.type',
    defaultMessage: 'TYPE',
  },
  code: {
    id: 'salaries-table.code',
    defaultMessage: 'CODE',
  },
  codeDescription: {
    id: 'salaries-table.code-description',
    defaultMessage: 'DESCRIPTION',
  },
  request: {
    id: 'salaries-table.request',
    defaultMessage: 'REQUEST',
  },
  requestType: {
    id: 'salaries-table.request-type',
    defaultMessage: 'REQUEST TYPE',
  },
  import: {
    id: 'salaries-table.import',
    defaultMessage: 'IMPORT',
  },
  date: {
    id: 'salaries-table.date',
    defaultMessage: 'DATE',
  },
  secondaryCode: {
    id: 'salaries-table.secondary-code',
    defaultMessage: 'SECONDARY CODE',
  },
  payrollDeductions: {
    id: 'salaries-table.payroll-deductions',
    defaultMessage: 'PAYROLL DEDUCTIONS',
  },
  entry: {
    id: 'salaries-table.entry',
    defaultMessage: 'ENTRY',
  },
});


function getPositionsColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.position',
      id: 'position',
      accessor: 'generalInformation.position',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.POSITIONS.path }/${ props.original.generalInformation.positionId }`, scenarioId) } >{ props.row.position }</Link>
          :
          <div className='salaries__link'>{ props.row.position }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description',
      accessor: 'generalInformation.description',
      exportId: '3',
      isGroupable: true,
      minWidth: 120,
      sortable: false,
    },
    {
      intlId: 'salaries-table.employee',
      id: 'employee',
      accessor: 'generalInformation.employee',
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.last-name',
      id: 'lastName',
      accessor: 'generalInformation.lastName',
      exportId: '5',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.fist-name',
      id: 'firstName',
      accessor: 'generalInformation.firstName',
      exportId: '6',
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getPositionsByJobTitleColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.position',
      id: 'position',
      accessor: 'generalInformation.position',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.POSITIONS_BY_JOB_TITLE.path }/${ props.original.generalInformation.id }`, scenarioId) } >{ props.row.position }</Link>
          :
          <div className='salaries__link'>{ props.row.position }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description1',
      accessor: 'generalInformation.description1',
      exportId: '3',
      minWidth: 120,
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.job-title',
      id: 'jobTitle',
      accessor: 'generalInformation.jobTitle',
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.job-description',
      id: 'description2',
      accessor: 'generalInformation.description2',
      exportId: '5',
      minWidth: 120,
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getRequestsColumns(originRowDetailId, scenarioId) {
  const ORIGIN_ROUTE_PATH = '/origin/';
  const BUDGET_REQUESTS_ROUTE_PATH = '/budget-requests/';
  return [
    {
      intlId: 'salaries-table.request',
      id: 'request',
      accessor: 'generalInformation.request',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          (
            <Link
              className='salaries__link'
              to={ `/${ scenarioId }${ ORIGIN_ROUTE_PATH }${ originRowDetailId }${ BUDGET_REQUESTS_ROUTE_PATH }${ props.original.generalInformation.id }` }
            >
              { props.row.request }
            </Link>
          )
          :
            <div className='salaries__link'>{ props.row.request }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description',
      accessor: 'generalInformation.description',
      minWidth: 120,
      exportId: '3',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.request-type',
      id: 'requestType',
      accessor: 'generalInformation.requestType',
      minWidth: 185,
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.type',
      id: 'type',
      accessor: 'generalInformation.type',
      minWidth: 120,
      exportId: '5',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.code',
      id: 'code',
      accessor: 'generalInformation.code',
      minWidth: 120,
      exportId: '6',
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getRequiredAttendancesColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.reference',
      id: 'reference',
      accessor: 'generalInformation.reference',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.REQUIRED_ATTENDANCES.path }/${ props.original.generalInformation.id }`, scenarioId) } >{ props.row.reference }</Link>
          :
          <div className='salaries__link'>{ props.row.reference }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description1',
      accessor: 'generalInformation.description1',
      minWidth: 120,
      exportId: '3',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.type',
      id: 'type',
      accessor: 'generalInformation.type',
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.code',
      id: 'code',
      accessor: 'generalInformation.code',
      exportId: '5',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.code-description',
      id: 'description2',
      accessor: 'generalInformation.description2',
      minWidth: 120,
      exportId: '6',
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getImportsColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.import',
      id: 'import',
      accessor: 'generalInformation.import',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.IMPORTS.path }/${ props.original.generalInformation.id }`, scenarioId) } >{ props.row.import }</Link>
          :
          <div className='salaries__link'>{ props.row.import }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description',
      accessor: 'generalInformation.description',
      minWidth: 120,
      exportId: '3',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.type',
      id: 'type',
      accessor: 'generalInformation.type',
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.date',
      id: 'date',
      accessor: 'generalInformation.date',
      exportId: '5',
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getGlobalPremiumsColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.secondary-code',
      id: 'secondaryCode',
      accessor: 'generalInformation.secondaryCode',
      minWidth: 140,
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.PARAMETERS_BY_STRUCTURE.path }/${ props.original.generalInformation.paramByStructureId }/global`, scenarioId) }>
            {props.row.secondaryCode}
          </Link>
          :
          <div className='salaries__link'>{ props.row.secondaryCode }</div>
      ),
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'description',
      accessor: 'generalInformation.description',
      minWidth: 120,
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getPayrollDeductionColumns() {
  return [
    {
      intlId: 'salaries-table.payroll-deductions',
      id: 'payrollDeductions',
      accessor: 'generalInformation.payrollDeductions',
      minWidth: 200,
      isGroupable: true,
      sortable: false,
    },
  ];
}

function getPayrollDeductionForAnAccountColumns(scenarioId) {
  return [
    {
      intlId: 'salaries-table.payroll-deductions',
      id: 'payrollDeductions',
      accessor: 'generalInformation.payrollDeductions',
      minWidth: 200,
      isGroupable: true,
      sortable: false,
      Cell: (props) => (
        props.original ?
          <Link className='salaries__link' to={ addScenarioIdToRoute(`${ routes.GLOBAL_PARAMETERS.path }/global`, scenarioId) }>
            { props.row.payrollDeductions }
          </Link>
          :
          <div className='salaries__link'>{ props.row.payrollDeductions }</div>
      ),
    },
  ];
}


function getEntriesColumns() {
  return [
    {
      intlId: 'salaries-table.entry',
      id: 'entry',
      accessor: 'generalInformation.entry',
      minWidth: 120,
      exportId: '2',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.date',
      id: 'date',
      accessor: 'generalInformation.generalInformation.date',
      exportId: '3',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.secondary-code',
      id: 'secondaryCode',
      accessor: 'generalInformation.secondaryCode',
      minWidth: 120,
      exportId: '4',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.origin-description',
      id: 'generalInformation.description',
      accessor: 'generalInformation.description',
      minWidth: 120,
      exportId: '5',
      isGroupable: true,
      sortable: false,
    },
    {
      intlId: 'salaries-table.type',
      id: 'type',
      accessor: 'generalInformation.type',
      minWidth: 120,
      exportId: '6',
      isGroupable: true,
      sortable: false,
    },
  ];
}


function getOriginColumns(originId, originRowDetailId, scenarioId) {
  switch (originId) {
    case 'Positions':
      return getPositionsColumns(scenarioId);
    case 'PositionsByJobTitle':
      return getPositionsByJobTitleColumns(scenarioId);
    case 'RequiredAttendances':
      return getRequiredAttendancesColumns(scenarioId);
    case 'Requests':
      return getRequestsColumns(originRowDetailId, scenarioId);
    case 'Imports':
      return getImportsColumns(scenarioId);
    case 'GlobalPremiums':
      return getGlobalPremiumsColumns(scenarioId);
    case 'PayrollDeduction':
      return getPayrollDeductionColumns();
    case 'PayrollDeductionForAnAccount':
      return getPayrollDeductionForAnAccountColumns(scenarioId);
    case 'Entries':
      return getEntriesColumns();
    default:
      return [];
  }
}

export const extractData = createSelector(
  [
    (state) => getCurrencyOptions(state),
    (state) => state.origins.context.originId,
    (state) => state.origins[getDataKey(state.origins.context)],
    (state) => state.origins.context.detailId,
    // (state) => state.origins.context.scenarioId,
    // (state) => state.origins.context.functionalCenterId,
    (state) => state.origins[getColumnsKey(state.origins.context)],
    (state) => state.scenario.selectedScenario.scenarioId,
  ],
  (currencyOptions, originId, data, originRowDetailId, columnsInfo, scenarioId) => {

    let columnsFixed = [{
      intlId: 'salaries-table.common-group',
      id: 'Description',
      columns: getOriginColumns(originId, originRowDetailId, scenarioId),
      sortable: false,
    }];

    const subColumnsAmounts = [
      {
        intlId: 'salaries-table.total',
        accessor: (row) => accounting.formatNumber(row.amountsDetails.total, { ...currencyOptions }),
        id: 'amountsTotal',
        exportId: '0',
        sortable: false,
        isNumber: true,
      },
    ];

    const subColumnsUnits = [
      {
        intlId: 'salaries-table.total',
        accessor: (row) => accounting.formatNumber(row.unitsDetails.total, { ...currencyOptions }),
        id: 'unitsTotal',
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
        accessor: (row) => accounting.formatNumber(row.amountsDetails[`period${ no }`], { ...currencyOptions }),
        id: `amounts${ no }`,
        exportId: `${ no }`,
        mappingId: no,
        isNumber: true,
        sortable: false,
      });
      subColumnsUnits.push({
        intlId: 'salaries-table.period',
        intlValues: { period },
        accessor: (row) => accounting.formatNumber(row.unitsDetails[`period${ no }`], { ...currencyOptions }),
        id: `units${ no }`,
        exportId: `${ no }`,
        mappingId: no,
        isNumber: true,
        sortable: false,
      });
    }

    let columnsScrolled = [
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

    const customColumns = {
      columnsFixed: getCustomColumnGroup(columnsFixed, columnsInfo),
      columnsScrolled: getCustomColumnGroup(columnsScrolled, columnsInfo),
    };

    columnsFixed = applyCustomColumns(columnsFixed, customColumns.columnsFixed);
    columnsScrolled = applyCustomColumns(columnsScrolled, customColumns.columnsScrolled);

    const columns = [
      ...columnsFixed,
      ...columnsScrolled,
    ];

    return {
      rows: data || [],
      columnsFixed,
      columnsScrolled,
      columns,
      customColumns,
    };
  }
);
