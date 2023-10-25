import React from 'react';
import { createSelector } from 'reselect';
import { sortBy, each } from 'lodash';
import { RowSelected } from '../../../components/general/data-grid/data-grid-row-selected';

export const extractScenarios = createSelector(
  [
    state => state.app.locale,
    state => state.scenario.data,
    state => state.scenario.selectedScenario,
  ],
  (locale, data, selectedScenario) => {
    const items = sortBy(data, 'organization');
    const rows = [];
    let selectedRow = null;

    each(items, (item, index) => {
      const row = { ...item };
      item.functionalCenter ? row.functionalCenter = item.functionalCenter : null;
      item.functionalCenterDescription ? row.functionalCenterDescription = item.functionalCenterDescription : null;
      item.responsible ? row.responsible = item.responsible : null;

      if (item.scenarioId === selectedScenario.scenarioId) {
        row.selected = true;
        selectedRow = index;
      } else {
        row.selected = false;
      }

      rows.push(row);
    });

    const components = [];

    const columns = [
      {
        intlId: 'scenario-table.organization',
        accessor: 'organization',
        minWidth: 70,
        sortable: false,
      }, {
        intlId: 'scenario-table.year',
        accessor: 'year',
        minWidth: 60,
        sortable: false,
      }, {
        intlId: 'scenario-table.scenario',
        accessor: 'scenarioCode',
        // minWidth: 150,
        sortable: false,
      }, {
        intlId: 'scenario-table.description',
        accessor: 'scenarioDescription',
        minWidth: 150,
        sortable: false,
      }, {
        intlId: 'scenario-table.administrative-units',
        accessor: 'functionalCenter',
        minWidth: 120,
        sortable: false,
      }, {
        intlId: 'scenario-table.responsible',
        accessor: 'responsible',
        minWidth: 100,
        sortable: false,
      }, {
        intlId: '',
        accessor: 'selected',
        Cell: row => <RowSelected isSelected={ row.value } />,
        minWidth: 120,
        sortable: false,
      },
    ];

    return {
      rows,
      columns,
      components,
      selectedRow,
    };
  }
);
