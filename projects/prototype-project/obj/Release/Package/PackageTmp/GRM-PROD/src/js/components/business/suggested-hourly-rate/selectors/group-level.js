import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each, cloneDeep } from 'lodash';

defineMessages({
  group: {
    id: 'group-level.group',
    defaultMessage: 'GROUP',
  },
  level: {
    id: 'group-level.level',
    defaultMessage: 'LEVEL',
  },
  rate: {
    id: 'group-level.hourly-rate',
    defaultMessage: 'HOURLY RATE',
  },
});

export const extractData = createSelector(
  [
    (state) => state.groupLevel.data,
    (state) => state.groupLevel.group,
    (state) => state.groupLevel.level,
  ],
  (data, group, level) => {
    const columns = [
      {
        intlId: 'group-level.group',
        accessor: 'group',
        id: 'group',
        minWidth: 120,
        sortable: false,
      },
      {
        intlId: 'group-level.level',
        accessor: 'level',
        id: 'level',
        minWidth: 120,
        sortable: false,
      },
      {
        intlId: 'group-level.hourly-rate',
        accessor: 'hourlyRate',
        id: 'hourlyRate',
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
      if (row.group === group && row.level === level) {
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

