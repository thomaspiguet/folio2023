import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { map } from 'lodash';

import { formatDashesMoney, getCurrencyOptions, getElement } from '../../utils/selectors/currency';
import { convertFunctionalCenter } from '../../utils/utils';

defineMessages({
  account: {
    id: 'revenue-and-other-expenses.account',
    defaultMessage: 'ACCOUNT',
  },
  description: {
    id: 'revenue-and-other-expenses.description',
    defaultMessage: 'DESCRIPTION',
  },
  total: {
    id: 'revenue-and-other-expenses.total',
    defaultMessage: 'TOTAL',
  },
});

export const extractData = createSelector(
  [
    (state) => state.revenueAndOtherExpenses.data,
    (state) => getCurrencyOptions(state),
  ],
  (data, currencyOptions) => {
    const columns = [
      {
        id: 'accountNumber',
        accessor: 'accountNumber',
        intlId: 'revenue-and-other-expenses.account',
        sortable: false,
      },
      {
        id: 'total',
        accessor: 'total',
        intlId: 'revenue-and-other-expenses.total',
        sortable: false,
      },
      {
        id: 'description',
        accessor: 'description',
        intlId: 'revenue-and-other-expenses.description',
        sortable: false,
      },
    ];

    const rows = map(data, item => {
      return {
        accountNumber: convertFunctionalCenter(getElement(item, 'generalLedgerAccount', 'accountNumber')),
        description: getElement(item, 'generalLedgerAccount', 'description'),
        total: formatDashesMoney(item.totalAmount, { ...currencyOptions }),
        id: item.id,
      };
    });

    return {
      rows,
      columns,
    };
  }
);
