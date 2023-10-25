import { defineMessages } from 'react-intl';
import { createSelector } from 'reselect';
import { map, times } from 'lodash';

import { getCurrencyOptions, formatNumber, getElementEmpty } from '../../../utils/selectors/currency';

defineMessages({
  expenseType: {
    id: 'parameters-by-structure.expense-type',
    defaultMessage: 'EXPENSE TYPE',
  },
  description: {
    id: 'parameters-by-structure.description',
    defaultMessage: 'DESCRIPTION',
  },
  percentage: {
    id: 'parameters-by-structure.percentage',
    defaultMessage: 'PERCENTAGE',
  },
});

function extractReplacements(replacements, currencyOptions) {
  const columns = [
    {
      id: 'expenseType',
      accessor: 'expenseType',
      intlId: 'parameters-by-structure.expense-type',
      sortable: false,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'parameters-by-structure.description',
      sortable: false,
    },
    {
      id: 'percentage',
      accessor: 'percentage',
      intlId: 'parameters-by-structure.percentage',
      sortable: false,
      isNumber: true,
    },
  ];

  let rows = map(replacements, (row) => {
    return {
      expenseType: getElementEmpty(row, 'expenseType', 'code'),
      description: getElementEmpty(row, 'expenseType', 'longDescription'),
      percentage: formatNumber(row.percentage, currencyOptions),
    };
  });

  if (!rows.length) {
    rows = times(4, () => ({
      expenseType: '-',
      description: '-',
      percentage: '-',
    }));
  }

  return {
    rows,
    columns,
  };
}

export const extractReplacementsManagement = createSelector(
  [
    (state) => state.parametersByStructure.entry.replacementsManagement,
    (state) => getCurrencyOptions(state),
  ],
  extractReplacements
);

export const extractReplacementsNonManagement = createSelector(
  [
    (state) => state.parametersByStructure.entry.replacementsNonManagement,
    (state) => getCurrencyOptions(state),
  ],
  extractReplacements
);

export const extractReplacementsManagementGlobal = createSelector(
  [
    (state) => state.globalParameters.entry.replacementsManagement,
    (state) => getCurrencyOptions(state),
  ],
  extractReplacements
);

export const extractReplacementsNonManagementGlobal = createSelector(
  [
    (state) => state.globalParameters.entry.replacementsNonManagement,
    (state) => getCurrencyOptions(state),
  ],
  extractReplacements
);
