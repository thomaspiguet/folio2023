import { defineMessages } from 'react-intl';
import { createSelector } from 'reselect';
import { map } from 'lodash';

import { getCurrencyOptions, formatNumber, getElementEmpty } from '../../utils/selectors/currency';

defineMessages({
  year: {
    id: 'parameters-by-structure.year',
    defaultMessage: 'YEAR',
  },
  group: {
    id: 'parameters-by-structure.group',
    defaultMessage: 'GROUP',
  },
  code: {
    id: 'parameters-by-structure.code',
    defaultMessage: 'CODE',
  },
  description: {
    id: 'parameters-by-structure.description',
    defaultMessage: 'DESCRIPTION',
  },
  globalPremiumAmount: {
    id: 'parameters-by-structure.global-premium-amount',
    defaultMessage: 'AMOUNT',
  },
  globalPremiumDistributionModel: {
    id: 'parameters-by-structure.global-premium-distribution-template',
    defaultMessage: 'DISTRIBUTION TEMPLATE',
  },
  globalPremiumNatureExp: {
    id: 'parameters-by-structure.global-premium-nature-exp',
    defaultMessage: 'NATURE EXP.',
  },
});


export const extractData = createSelector(
  [
    (state) => state.parametersByStructure.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'parameters-by-structure.year',
        accessor: 'financialYear.code',
        id: 'financialYear.code',
        exportId: '1',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'parameters-by-structure.group',
        accessor: 'group.shortDescription',
        id: 'group.shortDescription',
        exportId: '2',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'parameters-by-structure.code',
        accessor: 'code.code',
        id: 'code.code',
        exportId: '3',
        isGroupable: true,
        sortable: false,
      },
      {
        intlId: 'parameters-by-structure.description',
        accessor: 'code.longDescription',
        id: 'code.longDescription',
        exportId: '4',
        isGroupable: true,
        sortable: false,
      },
    ];

    return {
      rows: data || [],
      columns,
    };
  }
);

export const extractGlobalPremium = createSelector(
  [
    (state) => state.parametersByStructure.entry.globalPremium,
    (state) => getCurrencyOptions(state),
  ],
  (globalPremium, currencyOptions) => {
    const columns = [
      {
        id: 'amount',
        accessor: 'amount',
        intlId: 'parameters-by-structure.global-premium-amount',
        sortable: false,
      },
      {
        id: 'distribution',
        accessor: 'distribution',
        intlId: 'parameters-by-structure.global-premium-distribution-template',
        sortable: false,
      },
      {
        id: 'nature',
        accessor: 'nature',
        intlId: 'parameters-by-structure.global-premium-nature-exp',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = map(globalPremium, (row) => {
      return {
        amount: formatNumber(row.amount, currencyOptions),
        distribution: getElementEmpty(row, 'distributionModel', 'number'),
        nature: getElementEmpty(row, 'natureExp', 'code'),
      };
    });

    if (!rows.length) {
      rows.push({
        amount: '-',
        distribution: '-',
        nature: '-',
      });
    }

    return {
      rows,
      columns,
    };
  }
);
