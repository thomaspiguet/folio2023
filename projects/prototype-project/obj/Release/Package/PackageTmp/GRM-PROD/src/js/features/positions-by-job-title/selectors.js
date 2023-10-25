import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';

import { formatEmpty } from '../../utils/selectors/currency';


defineMessages({
  func: {
    id: 'positions-by-job-title.func',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  jobTitle: {
    id: 'positions-by-job-title.job-title',
    defaultMessage: 'JOB TITLE',
  },
  number: {
    id: 'positions-by-job-title.position-number',
    defaultMessage: 'POSITION NUMBER',
  },
  description: {
    id: 'positions-by-job-title.description',
    defaultMessage: 'DESCRIPTION',
  },
  start: {
    id: 'positions-by-job-title.start',
    defaultMessage: 'START',
  },
  end: {
    id: 'positions-by-job-title.end',
    defaultMessage: 'END',
  },
});

export const extractData = createSelector(
  [
    (state) => state.positionsByJobTitle.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'positions-by-job-title.func',
        accessor: 'functionalCenterNumber',
        id: 'functionalCenterNumber',
        exportId: '1',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'positions-by-job-title.job-title',
        accessor: 'jobTitleNumber',
        id: 'jobTitleNumber',
        exportId: '2',
        isGroupable: true,
        minWidth: 110,
        sortable: false,
      },
      {
        intlId: 'positions-by-job-title.position-number',
        accessor: 'positionNumber',
        id: 'positionNumber',
        exportId: '2',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'positions-by-job-title.description',
        accessor: 'positionDescription',
        id: 'positionDescription',
        isGroupable: true,
        exportId: '2',
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'positions-by-job-title.start',
        accessor: (row) => formatEmpty(row.startDate),
        id: 'startDate',
        isGroupable: true,
        exportId: '3',
        sortable: false,
        width: 130,
      },
      {
        intlId: 'positions-by-job-title.end',
        accessor: (row) => formatEmpty(row.endDate),
        id: 'endDate',
        isGroupable: true,
        exportId: '4',
        sortable: false,
        width: 130,
      },
    ];

    return {
      rows: data || [],
      columns,
    };
  }
);

