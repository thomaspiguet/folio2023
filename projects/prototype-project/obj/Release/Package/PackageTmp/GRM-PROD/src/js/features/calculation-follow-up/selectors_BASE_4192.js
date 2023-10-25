import React from 'react';
import { cloneDeep } from 'lodash';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';

import RoutesDropDown, {
  BUTTON_IN_GRID_OPTIONS_LIST_VERTICAL_SHIFT,
} from '../../components/controls/routes-dropdown';

const REQUEST_CALCULATION = 'RequestCalculation';
const REQUEST_GENERATION = 'RequestGeneration';
const POSITION_CALCULATION = 'PositionCalculation';
const AVERAGE_HOURLY_RATE_CALCULATION = 'AverageHourlyRateCalculation';
const MENU_BUTTON_DETAILS_INDEX = 0;
const MENU_BUTTON_RESULTS_INDEX = 1;

defineMessages({
  dateTime: {
    id: 'calculation-follow-up.date-time',
    defaultMessage: 'DATE/TIME',
  },
  process: {
    id: 'calculation-follow-up.process',
    defaultMessage: 'PROCESS',
  },
  user: {
    id: 'calculation-follow-up.user',
    defaultMessage: 'USER',
  },
  complete: {
    id: 'calculation-follow-up.complete',
    defaultMessage: 'COMPLETE',
  },
  result: {
    id: 'calculation-follow-up.result',
    defaultMessage: 'RESULT',
  },
});

function isResultOptionEnabled(type) {
  return type === REQUEST_CALCULATION
    || type === REQUEST_GENERATION
    || type === POSITION_CALCULATION
    || type === AVERAGE_HOURLY_RATE_CALCULATION;
}

export const extractData = createSelector(
  [
    (state) => state.calculationFollowUp.data,
    (state) => state.app.editMode,
    (state) => state.calculationFollowUp.menuButtons,
  ],
  (data, editMode, menuButtons) => {
    const columns = [
      {
        accessor: 'date',
        id: 'dateTime',
        intlId: 'calculation-follow-up.date-time',
        sortable: false,
      },
      {
        accessor: 'typeDescription',
        id: 'process',
        intlId: 'calculation-follow-up.process',
        sortable: false,
      },
      {
        accessor: 'user.displayName',
        id: 'user',
        intlId: 'calculation-follow-up.user',
        sortable: false,
      },
      {
        accessor: 'resultDescription',
        id: 'complete',
        intlId: 'calculation-follow-up.complete',
        sortable: false,
        Cell: (row) => {
          const { original: { resultDescription } } = row;

          return (
            <div className='calculation-follow-up__complete-cell'>
              <div className='calculation-follow-up__complete-value'>{ resultDescription }</div>
            </div>
          );
        },
      },
      // { TODO: Uncomment result column when back-end for GRFWEB-6341 is ready and check if contracts are okay
      //   accessor: 'result',
      //   id: 'result',
      //   intlId: 'calculation-follow-up.result',
      //   sortable: false,
      //   Cell: (row) => {
      //     const { original: { result } } = row;
      //     const { errors, warnings } = result;
      //
      //     return <WarningsErrors warnings={ warnings } errors={ errors } />;
      //   },
      // },
      {
        id: 'menu',
        sortable: false,
        align: 'right',
        minWidth: 20,
        Cell: (props) => {
          const { original: { id, type } } = props;
          const updatedMenuButtons = cloneDeep(menuButtons);
          if (updatedMenuButtons.length > 0) {
            updatedMenuButtons[MENU_BUTTON_DETAILS_INDEX].active = isResultOptionEnabled(type);
          }
          return (
            <RoutesDropDown
              valueClass='routes-in-grid__ellipsis'
              optionClass='routes-in-grid__option'
              optionsClass='routes-in-grid__options'
              optionsListVerticalShift={ BUTTON_IN_GRID_OPTIONS_LIST_VERTICAL_SHIFT }
              editMode={ editMode }
              values={ updatedMenuButtons }
              selectedRouteItemId={ id }
            />
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
