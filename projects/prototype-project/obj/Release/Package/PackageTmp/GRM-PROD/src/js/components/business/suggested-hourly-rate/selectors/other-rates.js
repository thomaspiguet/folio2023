import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each, cloneDeep } from 'lodash';

defineMessages({
  func: {
    id: 'other-rates.functional-center',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  type: {
    id: 'other-rates.hourly-rate',
    defaultMessage: 'HOURLY RATE',
  },
});

export const extractData = createSelector(
  [
    (state) => state.otherRates.data,
    (state) => state.otherRates.functionalCenter,
  ],
  (data, functionalCenter) => {
    const columns = [
      {
        intlId: 'other-rates.functional-center',
        accessor: 'functionalCenter.code',
        id: 'functionalCenter',
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'other-rates.hourly-rate',
        accessor: 'hourlyRate',
        id: 'type',
        minWidth: 120,
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
            <div className='other-rates__selected' />
          );
        },
      },
    ];

    const rows = data ? cloneDeep(data) : [];

    let selectedRow;
    each(rows, (row, index) => {
      if (functionalCenter && row.functionalCenter.id === functionalCenter.id) {
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

