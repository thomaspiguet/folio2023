import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages, FormattedMessage } from 'react-intl';
import { map, each, sortBy, isUndefined } from 'lodash';

import { getCurrencyOptions, formatNumber } from '../../utils/selectors/currency';
import Checkbox from '../../components/controls/checkbox';

defineMessages({
  replacementsType: {
    id: 'positions.replacements-type',
    defaultMessage: 'EXPENSE TYPE',
  },
  replacementsPercentage: {
    id: 'positions.replacements-percentage',
    defaultMessage: 'PERCENTAGE',
  },
  replacementsHours: {
    id: 'positions.replacements-hours-per-period',
    defaultMessage: 'NUM. OF HOURS PER PERIOD',
  },
  func: {
    id: 'positions.func',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  number: {
    id: 'positions.number',
    defaultMessage: 'POSITION NUMBER',
  },
  description: {
    id: 'positions.description',
    defaultMessage: 'DESCRIPTION',
  },
  start: {
    id: 'positions.start',
    defaultMessage: 'START',
  },
  end: {
    id: 'positions.end',
    defaultMessage: 'END',
  },
  days: {
    id: 'positions.days',
    defaultMessage: 'Days',
  },
  hours: {
    id: 'positions.hours',
    defaultMessage: 'Hours',
  },
  monday: {
    id: 'positions.monday',
    defaultMessage: 'MONDAY',
  },
  tuesday: {
    id: 'positions.tuesday',
    defaultMessage: 'TUESDAY',
  },
  wednesday: {
    id: 'positions.wednesday',
    defaultMessage: 'WEDNESDAY',
  },
  thursday: {
    id: 'positions.thursday',
    defaultMessage: 'THURSDAY',
  },
  friday: {
    id: 'positions.friday',
    defaultMessage: 'FRIDAY',
  },
  saturday: {
    id: 'positions.saturday',
    defaultMessage: 'SATURDAY',
  },
  sunday: {
    id: 'positions.sunday',
    defaultMessage: 'SUNDAY',
  },
  total: {
    id: 'positions.total',
    defaultMessage: 'TOTAL',
  },
  week1: {
    id: 'positions.week1',
    defaultMessage: 'Week 1',
  },
  week2: {
    id: 'positions.week2',
    defaultMessage: 'Week 2',
  },
  premium: {
    id: 'positions.premium',
    defaultMessage: 'Premium',
  },
  premiumDescription: {
    id: 'positions.premium-description',
    defaultMessage: 'Description',
  },
  premiumStart: {
    id: 'positions.premium-start',
    defaultMessage: 'Start',
  },
  premiumEnd: {
    id: 'positions.premium-end',
    defaultMessage: 'End',
  },
  premiumInconvenience: {
    id: 'positions.premium-inconvenience',
    defaultMessage: 'Inconvenience',
  },
  otherPositionsFunctionalCenter: {
    id: 'positions.other-positions.func-ctr',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  otherPositionsPositionNumber: {
    id: 'positions.other-positions.number',
    defaultMessage: 'POSITION NO.',
  },
  otherPositionsDescription: {
    id: 'positions.other-positions.description',
    defaultMessage: 'POSITION DESCRIPTION',
  },
  otherPositionsJobTitle: {
    id: 'positions.other-positions.job-title',
    defaultMessage: 'JOB TITLE',
  },
  otherPositionsStatus: {
    id: 'positions.other-positions.status',
    defaultMessage: 'STATUS',
  },
  otherPositionsShifts: {
    id: 'positions.other-positions.shifts',
    defaultMessage: 'SHIFTS',
  },
  otherPositionsHoursPerTwoWeeks: {
    id: 'positions.other-positions.hours-per-two-weeks',
    defaultMessage: 'HOURS/2 WEEKS',
  },
  originOfReplacementsHours: {
    id: 'positions.origin-of-replacements-hours',
    defaultMessage: 'HOURS',
  },
});


export const extractData = createSelector(
  [
    (state) => state.positions.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'positions.func',
        accessor: 'functionalCenter',
        id: 'functionalCenter',
        exportId: '1',
        isGroupable: true,
        minWidth: 120,
        sortable: false,
      },
      {
        intlId: 'positions.number',
        accessor: 'positionNumber',
        id: 'positionNumber',
        exportId: '2',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'positions.description',
        accessor: 'description',
        id: 'description',
        isGroupable: true,
        exportId: '2',
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'positions.start',
        accessor: 'startDate',
        id: 'startDate',
        isGroupable: true,
        exportId: '3',
        sortable: false,
        width: 130,
      },
      {
        intlId: 'positions.end',
        accessor: 'endDate',
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

function getElement(record, accessor1, accessor2) {
  if (!record) {
    return '-';
  }
  const el = record[accessor1];
  if (!el) {
    return '-';
  }

  const result = el[accessor2];
  if (result === '' || isUndefined(result)) {
    return '-';
  }
  return result;
}

function getWorkSchedule(firstWeek = {}, secondWeek = {}, headerIntlId, accessor, currencyOptions) {
  const columns = [
    {
      id: 'common',
      sortable: false,
      maxWidth: 70,
      columns: [{
        id: 'week',
        accessor: 'week',
        sortable: false,
        maxWidth: 110,
        Cell: (props) => (
          <FormattedMessage id={ props.row.week } />
        ),
      }],
    },
    {
      id: 'header',
      intlId: headerIntlId,
      sortable: false,
      maxWidth: 70,
      align: 'center',
      columns: [
        {
          id: 'sunday',
          accessor: 'Sunday',
          intlId: 'positions.sunday',
          sortable: false,
        },
        {
          id: 'monday',
          accessor: 'Monday',
          intlId: 'positions.monday',
          sortable: false,
        },
        {
          id: 'tuesday',
          accessor: 'Tuesday',
          intlId: 'positions.tuesday',
          sortable: false,
        },
        {
          id: 'wednesday',
          accessor: 'Wednesday',
          intlId: 'positions.wednesday',
          sortable: false,
        },
        {
          id: 'thursday',
          accessor: 'Thursday',
          intlId: 'positions.thursday',
          sortable: false,
        },
        {
          id: 'friday',
          accessor: 'Friday',
          intlId: 'positions.friday',
          sortable: false,
        },
        {
          id: 'saturday',
          accessor: 'Saturday',
          intlId: 'positions.saturday',
          sortable: false,
        },
      ],
    },
    {
      id: 'common',
      sortable: false,
      maxWidth: 70,
      isTotal: true,
      columns: [
        {
          id: 'total',
          accessor: 'total',
          intlId: 'positions.total',
          isTotal: true,
          sortable: false,
          align: 'right',
        },
      ],
    },
  ];

  const rows = [
    {
      week: 'positions.week1',
      Sunday: getElement(firstWeek, 'Sunday', accessor),
      Monday: getElement(firstWeek, 'Monday', accessor),
      Tuesday: getElement(firstWeek, 'Tuesday', accessor),
      Wednesday: getElement(firstWeek, 'Wednesday', accessor),
      Thursday: getElement(firstWeek, 'Thursday', accessor),
      Friday: getElement(firstWeek, 'Friday', accessor),
      Saturday: getElement(firstWeek, 'Saturday', accessor),
    },
    {
      week: 'positions.week2',
      Sunday: getElement(secondWeek, 'Sunday', accessor),
      Monday: getElement(secondWeek, 'Monday', accessor),
      Tuesday: getElement(secondWeek, 'Tuesday', accessor),
      Wednesday: getElement(secondWeek, 'Wednesday', accessor),
      Thursday: getElement(secondWeek, 'Thursday', accessor),
      Friday: getElement(secondWeek, 'Friday', accessor),
      Saturday: getElement(secondWeek, 'Saturday', accessor),
    },
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  each(rows, row => {
    const total = days.reduce(
      (sum, field) => (sum + (row[field] === '-' ? 0 : +row[field])),
      0);
    each(days, (field) => {
      const value = row[field];
      row[field] = value === '-' ? '-' : formatNumber(value, currencyOptions);
    });
    row.total = !total ? '-' : formatNumber(total, currencyOptions);
  });

  return {
    rows,
    columns,
  };

}

export const extractWorkScheduleDays = createSelector(
  [
    (state) => state.positions.entry.schedule.firstWeek,
    (state) => state.positions.entry.schedule.secondWeek,
    (state) => getCurrencyOptions(state),
  ],
  (firstWeek, secondWeek, currencyOptions) => {
    return getWorkSchedule(firstWeek, secondWeek, 'positions.days', 'workLoad', currencyOptions);
  }
);

export const extractWorkScheduleHours = createSelector(
  [
    (state) => state.positions.entry.schedule.firstWeek,
    (state) => state.positions.entry.schedule.secondWeek,
    (state) => getCurrencyOptions(state),
  ],
  (firstWeek, secondWeek, currencyOptions) => {
    return getWorkSchedule(firstWeek, secondWeek, 'positions.hours', 'hours', currencyOptions);
  }
);

export const extractWorkScheduleDaysByJobTitle = createSelector(
  [
    (state) => state.positionsByJobTitle.entry.schedule.firstWeek,
    (state) => state.positionsByJobTitle.entry.schedule.secondWeek,
    (state) => getCurrencyOptions(state),
  ],
  (firstWeek, secondWeek, currencyOptions) => {
    return getWorkSchedule(firstWeek, secondWeek, 'positions.days', 'workLoad', currencyOptions);
  }
);

export const extractWorkScheduleHoursByJobTitle = createSelector(
  [
    (state) => state.positionsByJobTitle.entry.schedule.firstWeek,
    (state) => state.positionsByJobTitle.entry.schedule.secondWeek,
    (state) => getCurrencyOptions(state),
  ],
  (firstWeek, secondWeek, currencyOptions) => {
    return getWorkSchedule(firstWeek, secondWeek, 'positions.hours', 'hours', currencyOptions);
  }
);

function fillPremiums(premiums) {
  const columns = [
    {
      id: 'premium',
      accessor: 'premium',
      intlId: 'positions.premium',
      sortable: false,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'positions.premium-description',
      sortable: false,
      minWidth: 120,
    },
    {
      id: 'start',
      accessor: 'start',
      intlId: 'positions.premium-start',
      sortable: false,
    },
    {
      id: 'end',
      accessor: 'end',
      intlId: 'positions.premium-end',
      sortable: false,
    },
    {
      id: 'inconvenience',
      accessor: 'inconvenience',
      intlId: 'positions.premium-inconvenience',
      sortable: false,
      align: 'center',
      Cell: (props) => (
        <div className='position__column-checkbox'>
          { props.row.inconvenience === '-' ?
            <span>-</span>
            :
            <Checkbox value={ props.row.inconvenience } editMode={ false } single={ true } />
          }
        </div>
      ),
    },
  ];

  const rows = map(premiums, item => {
    return {
      premium: getElement(item, 'premium', 'code'),
      description: getElement(item, 'premium', 'description'),
      start: item.start ? item.start : '-',
      end: item.end ? item.end : '-',
      inconvenience: item.isInconvenient,
    };
  });

  if (!rows.length) {
    rows.push({
      premium: '-',
      description: '-',
      start: '-',
      end: '-',
      inconvenience: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractPremiums = createSelector(
  [
    (state) => state.positions.entry.positionPremiums,
  ],
  fillPremiums
);

export const extractPremiumsByJobTitle = createSelector(
  [
    (state) => state.positionsByJobTitle.entry.premiums,
  ],
  fillPremiums
);

function fillReplacements(positionReplacements, currencyOptions, withHours) {
  const columns = [
    {
      id: 'type',
      accessor: 'type',
      intlId: 'positions.replacements-type',
      sortable: false,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'positions.premium-description',
      sortable: false,
      minWidth: 120,
    },
    {
      id: 'percentage',
      accessor: 'percentage',
      intlId: 'positions.replacements-percentage',
      isNumber: true,
      sortable: false,
    },
  ];

  if (withHours) {
    columns.push({
      id: 'hours',
      accessor: 'hours',
      intlId: 'positions.replacements-hours-per-period',
      isNumber: true,
      sortable: false,
    });
  }

  const rows = sortBy(map(positionReplacements, item => {
    return {
      type: getElement(item, 'expenseType', 'code'),
      description: getElement(item, 'expenseType', 'shortDescription'),
      hours: formatNumber(item.hours, currencyOptions),
      percentage: formatNumber(item.percentage, currencyOptions),
    };
  }), 'type');

  if (!rows.length) {
    rows.push({
      type: '-',
      description: '-',
      hours: '-',
      percentage: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractReplacements = createSelector(
  [
    (state) => state.positions.entry.positionReplacements,
    (state) => getCurrencyOptions(state),
    (state) => true,
  ],
  fillReplacements
);

export const extractReplacementsByJobTitle = createSelector(
  [
    (state) => state.positionsByJobTitle.entry.replacements,
    (state) => getCurrencyOptions(state),
    (state) => false,
  ],
  fillReplacements
);

export const extractOtherPositions = createSelector(
  [
    (state) => state.positions.entry.employeeOtherPositions,
    (state) => getCurrencyOptions(state),
  ],
  (employeeOtherPositions, currencyOptions) => {
    const columns = [
      {
        id: 'functionalCenter',
        accessor: 'functionalCenter',
        intlId: 'positions.other-positions.func-ctr',
        sortable: false,
      },
      {
        id: 'positionNo',
        accessor: 'positionNo',
        intlId: 'positions.other-positions.number',
        sortable: false,
      },
      {
        id: 'positionDescription',
        accessor: 'positionDescription',
        intlId: 'positions.other-positions.description',
        sortable: false,
      },
      {
        id: 'jobTitle',
        accessor: 'jobTitle',
        intlId: 'positions.other-positions.job-title',
        sortable: false,
      },
      {
        id: 'status',
        accessor: 'status',
        intlId: 'positions.other-positions.status',
        sortable: false,
      },
      {
        id: 'shifts',
        accessor: 'shifts',
        intlId: 'positions.other-positions.shifts',
        sortable: false,
      },
      {
        id: 'hoursPer2Weeks',
        accessor: 'hoursPer2Weeks',
        intlId: 'positions.other-positions.hours-per-two-weeks',
        sortable: false,
      },
    ];

    const rows = sortBy(map(employeeOtherPositions, item => {
      return {
        functionalCenter: (item.functionalCenter ? item.functionalCenter : '-'),
        positionNo: (item.positionNo ? item.positionNo : '-'),
        positionDescription: (item.positionDescription ? item.positionDescription : '-'),
        jobTitle: (item.jobTitle ? item.jobTitle : '-'),
        status: (item.status ? item.status : '-'),
        shifts: (item.shifts ? item.shifts : '-'),
        hoursPer2Weeks: (item.hoursPer2Weeks ? item.hoursPer2Weeks : '-'),
      };
    }), 'type');

    if (!rows.length) {
      rows.push({
        functionalCenter: '-',
        positionNo: '-',
        positionDescription: '-',
        jobTitle: '-',
        status: '-',
        shifts: '-',
        hoursPer2Weeks: '-',
      });
    }

    return {
      rows,
      columns,
    };
  }
);

export const extractOriginReplacements = createSelector(
  [
    (state) => state.positions.entry.originReplacements,
    (state) => getCurrencyOptions(state),
  ],
  (originReplacements, currencyOptions) => {
    const columns = [
      {
        id: 'expenseType',
        accessor: 'expenseType',
        intlId: 'required-attendance.expense-type',
        sortable: false,
      },
      {
        id: 'origin',
        accessor: 'origin',
        intlId: 'required-attendance.origin',
        sortable: false,
      },
      {
        id: 'employeeType',
        accessor: 'employeeType',
        intlId: 'required-attendance.mgmt',
        sortable: false,
      },
      {
        id: 'percentage',
        accessor: 'percentage',
        intlId: 'required-attendance.percentage',
        isNumber: true,
        sortable: false,
      },
      {
        id: 'hours',
        accessor: 'hours',
        intlId: 'positions.origin-of-replacements-hours',
        isNumber: true,
        sortable: false,
      },
    ];

    const rows = sortBy(map(originReplacements, item => {
      return {
        expenseType: (item.expenseType ? item.expenseType : '-'),
        origin: (item.origin ? item.origin : '-'),
        employeeType: (item.employeeType ? item.employeeType : '-'),
        percentage: formatNumber(item.percentage, { ...currencyOptions }),
        hours: formatNumber(item.hours, { ...currencyOptions }),
      };
    }), 'type');

    if (!rows.length) {
      rows.push({
        expenseType: '-',
        origin: '-',
        employeeType: '-',
        percentage: '-',
        hours: '-',
      });
    }

    return {
      rows,
      columns,
    };
  }
);
