import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages, FormattedMessage } from 'react-intl';
import { map, each } from 'lodash';
import accounting from 'accounting';
import { getCurrencyOptions } from '../../../utils/selectors/currency';

import { AdditionalInfo } from '../../../components/business/additional-info/additional-info';
import { convertFunctionalCenter } from '../../../utils/utils';

defineMessages({
  year: {
    id: 'imports.year',
    defaultMessage: 'YEAR',
  },
  scenario: {
    id: 'imports.scenario',
    defaultMessage: 'SCENARIO',
  },
  importNumber: {
    id: 'imports.import-number',
    defaultMessage: 'IMPORT NUMBER',
  },
  status: {
    id: 'imports.status',
    defaultMessage: 'STATUS',
  },
  comment: {
    id: 'imports.comment',
    defaultMessage: 'COMMENT',
  },
  additionalInfo: {
    id: 'additional-info',
    defaultMessage: 'ADDITIONAL INFO',
  },
  statusActive: {
    id: 'imports.status-active',
    defaultMessage: 'Active',
  },
  statusDeleted: {
    id: 'imports.status-deleted',
    defaultMessage: 'Deleted',
  },
  accountsAccount: {
    id: 'imports.accounts-account',
    defaultMessage: 'ACCOUNT',
  },
  accountsDescription: {
    id: 'imports.accounts-description',
    defaultMessage: 'DESCRIPTION',
  },
  accountsTotal: {
    id: 'imports.accounts-total',
    defaultMessage: 'TOTAL',
  },
  otherScenariosYear: {
    id: 'imports.other-scenarios-year',
    defaultMessage: 'IMPORT',
  },
  otherScenariosScenario: {
    id: 'imports.other-scenarios-scenario',
    defaultMessage: 'IMPORT',
  },
  otherScenariosDescription: {
    id: 'imports.other-scenarios-description',
    defaultMessage: 'IMPORT',
  },
  otherScenariosImport: {
    id: 'imports.other-scenarios-import',
    defaultMessage: 'IMPORT',
  },
  otherScenariosDeletion: {
    id: 'imports.other-scenarios-deletion',
    defaultMessage: 'DELETION',
  },
  otherScenariosActive: {
    id: 'imports.other-scenarios-active',
    defaultMessage: 'Active',
  },
  otherScenariosDeleted: {
    id: 'imports.other-scenarios-deleted',
    defaultMessage: 'Deleted',
  },
  otherScenariosYes: {
    id: 'imports.other-scenarios-yes',
    defaultMessage: 'Yes',
  },
  otherScenariosNo: {
    id: 'imports.other-scenarios-no',
    defaultMessage: 'No',
  },
  financialAccountPeriod: {
    id: 'imports.financial-account-period',
    defaultMessage: 'PERIOD',
  },
  financialAccountImportedUnits: {
    id: 'imports.financial-account-imported-units',
    defaultMessage: 'IMPORTED UNITS',
  },
  statisticalAccountPeriod: {
    id: 'imports.statistical-account-period',
    defaultMessage: 'PERIOD',
  },
  statisticalAccountImportedUnits: {
    id: 'imports.statistical-account-imported-units',
    defaultMessage: 'IMPORTED UNITS',
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

export const extractData = createSelector(
  [
    (state) => state.imports.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'imports.year',
        accessor: 'financialYear',
        id: 'financialYear',
        exportId: '1',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.scenario',
        accessor: 'scenarioName',
        id: 'scenarioName',
        exportId: '2',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.import-number',
        accessor: 'importNumber',
        id: 'importNumber',
        exportId: '3',
        isGroupable: true,
        isNumber: true,
        sortable: false,
      },
      {
        intlId: 'imports.status',
        accessor: 'active',
        id: 'active',
        exportId: '4',
        isGroupable: true,
        sortable: false,
        align: 'center',
        Cell: (row) => {
          const isActive = row.original.active;
          if (isActive) {
            return (
              <div className='imports__active'>
                <FormattedMessage id='imports.status-active' defaultMessage='Active' />
              </div>
            );
          }
          return (
            <div className='imports__deleted'>
              <FormattedMessage id='imports.status-deleted' defaultMessage='Deleted' />
            </div>
          );
        },
      },
      {
        intlId: 'imports.comment',
        accessor: 'comment',
        id: 'comment',
        exportId: '5',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'additional-info',
        accessor: 'additionalInfo',
        id: 'additionalInfo',
        exportId: '6',
        isGroupable: true,
        sortable: false,
        align: 'center',
        Cell: (row) => {
          const { info } = row.original;

          return (
            <AdditionalInfo
              info={ info }
            />
          );
        },
      },
    ];

    data && each(data, (item) => {
      item.info = {
        comment: item.comment,
        fileName: item.fileName,
        fileFormat: item.fileFormat,
        importDateTime: item.importDateTime,
        userName: item.userName,
      };
    });

    return {
      rows: data || [],
      columns,
    };
  }
);

export const extractAccounts = createSelector(
  [
    (state) => state.importAccounts.data,
    (state) => getCurrencyOptions(state),
  ],
  (data, currencyOptions) => {
    const columns = [
      {
        intlId: 'imports.accounts-account',
        accessor: 'accountNumber',
        id: 'accountNumber',
        exportId: '1',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.accounts-description',
        accessor: 'description',
        id: 'description',
        exportId: '2',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.accounts-total',
        accessor: 'total',
        id: 'total',
        exportId: '3',
        isGroupable: true,
        isNumber: true,
        sortable: false,
      },
    ];
    const rows = map(data, item => {
      return {
        accountNumber: convertFunctionalCenter(item.accountNumber),
        description: item.description,
        total: accounting.formatMoney(getElement(item, 'periodDetails', 'total'), { ...currencyOptions }),
        id: item.id,
        importId: item.importId,
      };
    });

    return {
      rows,
      columns,
    };
  }
);

export const extractOtherScenarios = createSelector(
  [
    (state) => state.importOtherScenarios.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'imports.other-scenarios-year',
        accessor: 'financialYear',
        id: 'financialYear',
        exportId: '1',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.other-scenarios-scenario',
        accessor: 'scenarioName',
        id: 'scenarioName',
        exportId: '2',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.other-scenarios-description',
        accessor: 'description',
        id: 'description',
        exportId: '3',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'imports.other-scenarios-import',
        accessor: 'isImport',
        id: 'isImport',
        exportId: '4',
        isGroupable: true,
        sortable: false,
        Cell: (row) => {
          const isImport = row.original.isImport;
          if (isImport) {
            return (
              <div className='imports__yes-no'>
                <FormattedMessage id='imports.other-scenarios-yes' defaultMessage='Yes' />
              </div>
            );
          }
          return (
            <div className='imports__yes-no'>
              <FormattedMessage id='imports.other-scenarios-no' defaultMessage='No' />
            </div>
          );
        },
      },
      {
        intlId: 'imports.other-scenarios-deletion',
        accessor: 'isDeletion',
        id: 'isDeletion',
        exportId: '5',
        isGroupable: true,
        sortable: false,
        Cell: (row) => {
          const isDeletion = row.original.isDeletion;
          if (isDeletion) {
            return (
              <div className='imports__yes-no'>
                <FormattedMessage id='imports.other-scenarios-yes' defaultMessage='Yes' />
              </div>
            );
          }
          return (
            <div className='imports__yes-no'>
              <FormattedMessage id='imports.other-scenarios-no' defaultMessage='No' />
            </div>
          );
        },
      },
    ];

    return {
      rows: data || [],
      columns,
    };
  }
);

export const extractFinancialAccount = createSelector(
  [
    (state) => state.importAccounts.entry.financailAccount,
    (state) => getCurrencyOptions(state),
  ],
  (financialAccount, currencyOptions) => {
    const columns = [
      {
        id: 'period',
        accessor: 'period',
        intlId: 'imports.financial-account-period',
        sortable: false,
      },
      {
        id: 'importedUnits',
        accessor: 'importedUnits',
        intlId: 'imports.financial-account-imported-units',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = [];
    if (financialAccount && financialAccount.periodDetails) {
      each(financialAccount.periodDetails, (item, key) => {
        const periodNumber = key.slice('period'.length);
        if (periodNumber) {
          rows.push({
            period: periodNumber,
            importedUnits: accounting.formatNumber(item, { ...currencyOptions }),
          });
        } else {
          rows.push({
            period: 'Total',
            importedUnits: accounting.formatNumber(item, { ...currencyOptions }),
            isSection: true,
          });
        }

      });
    } else {
      rows.push({
        period: '-',
        importedUnits: '-',
      });
      rows.push({
        period: 'Total',
        importedUnits: '-',
        isSection: true,
      });
    }

    return {
      rows,
      columns,
    };
  }
);

export const extractStatisticalAccounts = createSelector(
  [
    (state) => state.importAccounts.entry.statisticalAccount,
    (state) => getCurrencyOptions(state),
  ],
  (statisticalAccount, currencyOptions) => {
    const columns = [
      {
        id: 'period',
        accessor: 'period',
        intlId: 'imports.statistical-account-period',
        sortable: false,
      },
      {
        id: 'importedUnits',
        accessor: 'importedUnits',
        intlId: 'imports.statistical-account-imported-units',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = [];
    if (statisticalAccount && statisticalAccount.periodDetails) {
      each(statisticalAccount.periodDetails, (item, key) => {
        const periodNumber = key.slice('period'.length);
        if (periodNumber) {
          rows.push({
            period: periodNumber,
            importedUnits: accounting.formatNumber(item, { ...currencyOptions }),
          });
        } else {
          rows.push({
            period: 'Total',
            importedUnits: accounting.formatNumber(item, { ...currencyOptions }),
            isSection: true,
          });
        }

      });
    } else {
      rows.push({
        period: '-',
        importedUnits: '-',
      });
      rows.push({
        period: 'Total',
        importedUnits: '-',
        isSection: true,
      });
    }

    return {
      rows,
      columns,
    };
  }
);
