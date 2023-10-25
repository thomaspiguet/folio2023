import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { each, cloneDeep } from 'lodash';
import { getCurrencyOptions, formatDashesNumber, getElement } from '../../../utils/selectors/currency';

defineMessages({
  benefitsModel: {
    id: 'benefits-model.model',
    defaultMessage: 'MODEL',
  },
  benefitsDescription: {
    id: 'benefits-model.description',
    defaultMessage: 'DESCRIPTION',
  },
  benefitsPeriod: {
    id: 'benefits-model.period',
    defaultMessage: 'PERIOD',
  },
  benefitsDistribution: {
    id: 'benefits-model.distribution',
    defaultMessage: 'DISTRIBUTION',
  },
});

export const extractModel = createSelector(
  [
    (state) => state.benefitsModel.data,
    (state) => state.benefitsModel.selectedRow,
  ],
  (data, selectedModel) => {
    const columns = [
      {
        intlId: 'benefits-model.model',
        accessor: 'number',
        id: 'number',
        minWidth: 80,
        sortable: false,
      },
      {
        intlId: 'benefits-model.description',
        accessor: 'name',
        id: 'name',
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
            <div className='benefits-model__selected' />
          );
        },
      },
    ];

    const rows = data ? cloneDeep(data) : [];

    let selectedRow = null;
    each(rows, (row, index) => {
      if (row.id === selectedModel.id) {
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


export const extractDistribution = createSelector(
  [
    (state) => state.benefitsModel.selectedRow,
    (state) => getCurrencyOptions(state),
  ],
  (selectedRow, currencyOptions) => {
    const columns = [
      {
        id: 'period',
        accessor: 'period',
        intlId: 'benefits-model.period',
        width: 90,
        sortable: false,
      },
      {
        id: 'distribution',
        accessor: 'distribution',
        intlId: 'benefits-model.distribution',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = [];
    for (let no = 1; no <= 13; no++) {
      rows.push({
        period: `${ no }`,
        distribution: formatDashesNumber(getElement(selectedRow.distribution, `period${ no }`), currencyOptions),
      });
    }

    return {
      rows,
      columns,
    };
  }
);
