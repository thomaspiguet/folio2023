import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each, cloneDeep } from 'lodash';

defineMessages({
  accountModel: {
    id: 'other-account.account',
    defaultMessage: 'ACCOUNT',
  },
  accountDescription: {
    id: 'other-account.description',
    defaultMessage: 'DESCRIPTION',
  },
});

export const extractAccount = createSelector(
  [
    (state) => state.account.data,
    (state) => state.account.selectedRow,
  ],
  (data, selectedAccount) => {
    const columns = [
      {
        intlId: 'other-account.account',
        accessor: 'accountNumber',
        id: 'accountNumber',
        minWidth: 80,
        sortable: false,
      },
      {
        intlId: 'other-account.description',
        accessor: 'description',
        id: 'description',
        minWidth: 140,
        sortable: false,
      },
      {
        id: 'selected',
        width: 40,
        sortable: false,
        Cell: (row) => {
          if (!row.original.selected) {
            return null;
          }
          return (
            <div className='other-account__selected' />
          );
        },
      },
    ];

    const rows = data ? cloneDeep(data) : [];

    let selectedRow = null;
    each(rows, (row, index) => {
      if (row.id === selectedAccount.id) {
        selectedRow = index;
        row.selected = true;
      }
    });

    return {
      rows,
      columns,
      selectedRow,
    };
  }
);
