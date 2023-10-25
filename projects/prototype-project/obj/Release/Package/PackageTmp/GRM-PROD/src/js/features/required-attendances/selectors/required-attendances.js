import React from 'react';
import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { get, map, sortBy } from 'lodash';
import accounting from 'accounting';

import Checkbox from '../../../components/controls/checkbox';
import Field from '../../../components/controls/field';
import Premium from '../../../components/dropdowns/premium';
import ExpenseType from '../../../components/dropdowns/expense-type';
import WorkShift from '../../../components/dropdowns/work-shift';
import DetailsInfoCell from '../../../components/controls/details-info-cell';
import { getFinancialYearEndDate, getFinancialYearStartDate } from '../../../utils/utils';
import { getDistributionExpense } from '../../../api/actions';
import { formatNumber, formatZeroNumber, getCurrencyOptions, getElement, getElementEmpty } from '../../../utils/selectors/currency';

defineMessages({
  func: {
    id: 'required-attendance.func',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  type: {
    id: 'required-attendance.type',
    defaultMessage: 'TYPE',
  },
  inconvenience: {
    id: 'required-attendance.inconvenience',
    defaultMessage: 'INCONVENIENCE',
  },
  jobTitle: {
    id: 'required-attendance.job-title',
    defaultMessage: 'JOB TITLE',
  },
  jobTitleGroup: {
    id: 'required-attendance.job-title-group',
    defaultMessage: 'JOB TITLE GROUP',
  },
  premium: {
    id: 'required-attendance.premium',
    defaultMessage: 'PREMIUM',
  },
  reference: {
    id: 'required-attendance.reference',
    defaultMessage: 'REFERENCE',
  },
  description: {
    id: 'required-attendance.description',
    defaultMessage: 'DESCRIPTION',
  },
  percentage: {
    id: 'required-attendance.percentage',
    defaultMessage: 'PERCENTAGE',
  },
  expenseType: {
    id: 'required-attendance.expense-type',
    defaultMessage: 'EXPENSE TYPE',
  },
  start: {
    id: 'required-attendance.start',
    defaultMessage: 'START',
  },
  end: {
    id: 'required-attendance.end',
    defaultMessage: 'END',
  },
  sequence: {
    id: 'required-attendance.temporary-closures-sequence',
    defaultMessage: 'SEQUENCE',
  },
  workShift: {
    id: 'required-attendance.temporary-closures-work-shift',
    defaultMessage: 'WORK SHIFT',
  },
  startDate: {
    id: 'required-attendance.temporary-closures-start-date',
    defaultMessage: 'START DATE',
  },
  endDate: {
    id: 'required-attendance.temporary-closures-end-date',
    defaultMessage: 'END DATE',
  },
  monday: {
    id: 'required-attendance.temporary-closures-monday',
    defaultMessage: 'MONDAY',
  },
  tuesday: {
    id: 'required-attendance.temporary-closures-tuesday',
    defaultMessage: 'TUESDAY',
  },
  wednesday: {
    id: 'required-attendance.temporary-closures-wednesday',
    defaultMessage: 'WEDNESDAY',
  },
  thursday: {
    id: 'required-attendance.temporary-closures-thursday',
    defaultMessage: 'THURSDAY',
  },
  friday: {
    id: 'required-attendance.temporary-closures-friday',
    defaultMessage: 'FRIDAY',
  },
  saturday: {
    id: 'required-attendance.temporary-closures-saturday',
    defaultMessage: 'SATURDAY',
  },
  sunday: {
    id: 'required-attendance.temporary-closures-sunday',
    defaultMessage: 'SUNDAY',
  },
  schedulesShift: {
    id: 'required-attendance.schedules-shift',
    defaultMessage: 'WORK SHIFT',
  },
  schedulesMonday: {
    id: 'required-attendance.schedules-monday',
    defaultMessage: 'MONDAY',
  },
  schedulesTuesday: {
    id: 'required-attendance.schedules-tuesday',
    defaultMessage: 'TUESDAY',
  },
  schedulesWednesday: {
    id: 'required-attendance.schedules-wednesday',
    defaultMessage: 'WEDNESDAY',
  },
  schedulesThursday: {
    id: 'required-attendance.schedules-thursday',
    defaultMessage: 'THURSDAY',
  },
  schedulesFriday: {
    id: 'required-attendance.schedules-friday',
    defaultMessage: 'FRIDAY',
  },
  schedulesSaturday: {
    id: 'required-attendance.schedules-saturday',
    defaultMessage: 'SATURDAY',
  },
  schedulesSunday: {
    id: 'required-attendance.schedules-sunday',
    defaultMessage: 'SUNDAY',
  },
  otherLeave: {
    id: 'required-attendance.schedules-otherLeave',
    defaultMessage: 'OTHER LEAVE',
  },
  origin: {
    id: 'required-attendance.origin',
    defaultMessage: 'ORIGIN',
  },
  mgmt: {
    id: 'required-attendance.mgmt',
    defaultMessage: 'MGMT/NON-MGMT',
  },
  distributionsExpense: {
    id: 'required-attendance.distributions-expense',
    defaultMessage: 'EXPENSE',
  },
  distributionsDescription: {
    id: 'required-attendance.distributions-description',
    defaultMessage: 'DESCRIPTION',
  },
  distributionsValue: {
    id: 'required-attendance.distributions-value',
    defaultMessage: 'VALUE TO BE DISTRIBUTED',
  },
  distributionsTotal: {
    id: 'required-attendance.distributions-total',
    defaultMessage: 'TOTAL TO DISTRIBUTE',
  },
  period: {
    id: 'required-attendance.expense.distribution.period',
    defaultMessage: 'PERIOD',
  },
  rate: {
    id: 'required-attendance.expense.distribution.to-distribute',
    defaultMessage: 'TO DISTRIBUTE',
  },
  amount: {
    id: 'required-attendance.expense.distribution.parameters-model',
    defaultMessage: 'PARAMETERS / MODEL',
  },
});

export const extractData = createSelector(
  [
    (state) => state.requiredAttendances.data,
  ],
  (data) => {
    const columns = [
      {
        intlId: 'required-attendance.func',
        accessor: 'functionalCenter',
        id: 'functionalCenter',
        exportId: '1',
        isGroupable: true,
        minWidth: 120,
        sortable: false,
      },
      {
        intlId: 'required-attendance.type',
        accessor: 'type',
        id: 'type',
        exportId: '2',
        isGroupable: true,
        minWidth: 110,
        sortable: false,
      },
      {
        intlId: 'required-attendance.job-title',
        accessor: 'jobTitle',
        id: 'jobTitle',
        exportId: '3',
        isGroupable: true,
        minWidth: 70,
        sortable: false,
      },
      {
        intlId: 'required-attendance.job-title-group',
        accessor: 'jobTitleGroup',
        id: 'jobTitleGroup',
        exportId: '4',
        isGroupable: true,
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'required-attendance.reference',
        accessor: 'reference',
        id: 'reference',
        isGroupable: true,
        exportId: '5',
        minWidth: 100,
        sortable: false,
      },
      {
        intlId: 'required-attendance.description',
        accessor: 'description',
        id: 'description',
        isGroupable: true,
        exportId: '6',
        minWidth: 140,
        sortable: false,
      },
      {
        intlId: 'required-attendance.start',
        accessor: 'startDate',
        id: 'startDate',
        isGroupable: true,
        exportId: '7',
        sortable: false,
        width: 130,
      },
      {
        intlId: 'required-attendance.end',
        accessor: 'endDate',
        id: 'endDate',
        isGroupable: true,
        exportId: '8',
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


function extractPremiums(premiums, editMode) {
  const columns = [
    {
      id: 'premium',
      accessor: 'premium',
      intlId: 'required-attendance.premium',
      sortable: false,
      EditCell: Premium,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'required-attendance.description',
      sortable: false,
      minWidth: 120,
    },
    {
      id: 'start',
      accessor: 'start',
      intlId: 'required-attendance.start',
      sortable: false,
      EditCell: Field.Date,
    },
    {
      id: 'end',
      accessor: 'end',
      intlId: 'required-attendance.end',
      sortable: false,
      EditCell: Field.Date,
    },
    {
      id: 'isInconvenient',
      accessor: 'isInconvenient',
      intlId: 'required-attendance.inconvenience',
      sortable: false,
      align: 'center',
      Cell: (props) => (
        props.row.isInconvenient === '-' ?
          <span>-</span>
        :
          <Checkbox value={ props.row.isInconvenient } editMode={ false } single={ true } />
      ),
      EditCell: (props) => (<Checkbox { ...props } single />),
    },
  ];

  let rows = [];

  if (premiums) {
    rows = map(premiums, item => {
      return {
        premium: editMode ? item.premium : getElement(item, 'premium', 'code'),
        description: getElement(item, 'premium', 'description'),
        start: item.start ? item.start : '-',
        end: item.end ? item.end : '-',
        isInconvenient: item.isInconvenient,
      };
    });
  }

  if (!rows.length && !editMode) {
    rows.push({
      premium: '-',
      description: '-',
      start: '-',
      end: '-',
      isInconvenient: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractPremiumsSelector = createSelector(
  [
    (state) => state.requiredAttendances.entry.premiums,
    (state) => state.requiredAttendances.editMode,
  ],
  extractPremiums
);

export function extractReplacements(replacements, editMode, currencyOptions) {
  const columns = [
    {
      id: 'expenseType',
      accessor: 'expenseType',
      intlId: 'required-attendance.expense-type',
      sortable: false,
      EditCell: ExpenseType,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'required-attendance.description',
      sortable: false,
      minWidth: 120,
    },
    {
      id: 'percentage',
      accessor: 'percentage',
      intlId: 'required-attendance.percentage',
      isNumber: true,
      sortable: false,
      EditCell: Field.Number2,
    },
  ];

  const rows = sortBy(map(replacements, item => {
    return {
      expenseType: editMode ? item.expenseType : getElement(item, 'expenseType', 'code'),
      description: getElement(item, 'expenseType', 'shortDescription'),
      percentage: formatNumber(item.percentage, currencyOptions),
    };
  }), 'type');

  if (!rows.length && !editMode) {
    rows.push({
      expenseType: '-',
      description: '-',
      percentage: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractReplacementsSelector = createSelector(
  [
    (state) => state.requiredAttendances.entry.replacements,
    (state) => state.requiredAttendances.editMode,
    (state) => getCurrencyOptions(state),
  ],
  extractReplacements
);

export const extractOriginReplacementsSelector = createSelector(
  [
    (state) => state.requiredAttendances.entry.originReplacements,
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
    ];

    const rows = sortBy(map(originReplacements, item => {
      return {
        expenseType: (item.expenseType ? item.expenseType : '-'),
        origin: (item.origin ? item.origin : '-'),
        employeeType: (item.employeeType ? item.employeeType : '-'),
        percentage: accounting.formatNumber(item.percentage, { ...currencyOptions }),
      };
    }), 'type');

    if (!rows.length) {
      rows.push({
        expenseType: '-',
        origin: '-',
        employeeType: '-',
        percentage: '-',
      });
    }

    return {
      rows,
      columns,
    };
  }
);

export function extractSchedules(
  schedules,
  scheduleOtherLeaveTitle1,
  scheduleOtherLeaveTitle2,
  scheduleOtherLeaveTitle3,
  editMode,
  currencyOptions
  ) {
  const columns = [
    {
      id: 'shift',
      accessor: 'shift',
      intlId: 'required-attendance.schedules-shift',
      sortable: false,
      minWidth: 120,
      EditCell: WorkShift,
    },
    {
      id: 'sunday',
      accessor: 'sunday',
      intlId: 'required-attendance.schedules-sunday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'monday',
      accessor: 'monday',
      intlId: 'required-attendance.schedules-monday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'tuesday',
      accessor: 'tuesday',
      intlId: 'required-attendance.schedules-tuesday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'wednesday',
      accessor: 'wednesday',
      intlId: 'required-attendance.schedules-wednesday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'thursday',
      accessor: 'thursday',
      intlId: 'required-attendance.schedules-thursday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'friday',
      accessor: 'friday',
      intlId: 'required-attendance.schedules-friday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'saturday',
      accessor: 'saturday',
      intlId: 'required-attendance.schedules-saturday',
      sortable: false,
      EditCell: Field.Number2,
    },
  ];

  if (scheduleOtherLeaveTitle1 /* && schedules && (
      (schedules[0] && schedules[0].otherLeave1 >= 0) ||
      (schedules[1] && schedules[1].otherLeave1 >= 0) ||
      (schedules[2] && schedules[2].otherLeave1 >= 0) ||
      (schedules[3] && schedules[3].otherLeave1 >= 0)
      ) */) {
    columns.push(
      {
        id: 'otherLeave1',
        accessor: 'otherLeave1',
        Header: scheduleOtherLeaveTitle1 ? scheduleOtherLeaveTitle1.toUpperCase() : null,
        sortable: false,
        EditCell: Field.Number2,
      }
      );
  }

  if (scheduleOtherLeaveTitle2 /* && schedules && (
        (schedules[0] && schedules[0].otherLeave2 >= 0) ||
        (schedules[1] && schedules[1].otherLeave2 >= 0) ||
        (schedules[2] && schedules[2].otherLeave2 >= 0) ||
        (schedules[3] && schedules[3].otherLeave2 >= 0)
      ) */) {
    columns.push(
      {
        id: 'otherLeave2',
        accessor: 'otherLeave2',
        Header: scheduleOtherLeaveTitle2 ? scheduleOtherLeaveTitle2.toUpperCase() : null,
        sortable: false,
        EditCell: Field.Number2,
      }
      );
  }

  if (scheduleOtherLeaveTitle3 /* && schedules && (
        (schedules[0] && schedules[0].otherLeave3 >= 0) ||
        (schedules[1] && schedules[1].otherLeave3 >= 0) ||
        (schedules[2] && schedules[2].otherLeave3 >= 0) ||
        (schedules[3] && schedules[3].otherLeave3 >= 0)
      ) */) {
    columns.push(
      {
        id: 'otherLeave3',
        accessor: 'otherLeave3',
        Header: scheduleOtherLeaveTitle3 ? scheduleOtherLeaveTitle3.toUpperCase() : null,
        sortable: false,
        EditCell: Field.Number2,
      }
      );
  }

  const rows = map(schedules, item => {
    return {
      shift: editMode ? item.shift : getElement(item, 'shift', 'longDescription'),
      sunday: formatNumber(getElement(item, 'week', 'Sunday', 'workLoad'), currencyOptions),
      monday: formatNumber(getElement(item, 'week', 'Monday', 'workLoad'), currencyOptions),
      tuesday: formatNumber(getElement(item, 'week', 'Tuesday', 'workLoad'), currencyOptions),
      wednesday: formatNumber(getElement(item, 'week', 'Wednesday', 'workLoad'), currencyOptions),
      thursday: formatNumber(getElement(item, 'week', 'Thursday', 'workLoad'), currencyOptions),
      friday: formatNumber(getElement(item, 'week', 'Friday', 'workLoad'), currencyOptions),
      saturday: formatNumber(getElement(item, 'week', 'Saturday', 'workLoad'), currencyOptions),
      otherLeave1: formatNumber(item.otherLeave1, currencyOptions),
      otherLeave2: formatNumber(item.otherLeave2, currencyOptions),
      otherLeave3: formatNumber(item.otherLeave3, currencyOptions),
    };
  });

  if (!rows.length && !editMode) {
    rows.push({
      shift: '-',
      sunday: '-',
      monday: '-',
      tuesday: '-',
      wednesday: '-',
      thursday: '-',
      friday: '-',
      saturday: '-',
      otherLeave1: '-',
      otherLeave2: '-',
      otherLeave3: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractSchedulesSelector = createSelector(
  [
    (state) => state.requiredAttendances.entry.schedules,
    (state) => state.requiredAttendances.entry.scheduleOtherLeaveTitle1,
    (state) => state.requiredAttendances.entry.scheduleOtherLeaveTitle2,
    (state) => state.requiredAttendances.entry.scheduleOtherLeaveTitle3,
    (state) => state.requiredAttendances.editMode,
    (state) => getCurrencyOptions(state),
  ],
  extractSchedules
);

export function extractTemporaryClosures(
  temporaryClosures,
  editMode,
  currencyOptions,
  financialYearStartDate,
  financialYearEndDate
  ) {
  const columns = [
    {
      id: 'sequence',
      accessor: 'sequence',
      intlId: 'required-attendance.temporary-closures-sequence',
      sortable: false,
      EditCell: Field.Number0,
    },
    {
      id: 'workShift',
      accessor: 'workShift',
      intlId: 'required-attendance.temporary-closures-work-shift',
      sortable: false,
      minWidth: 120,
      EditCell: WorkShift,
    },
    {
      id: 'startDate',
      accessor: 'startDate',
      intlId: 'required-attendance.temporary-closures-start-date',
      sortable: false,
      minWidth: 155,
      EditCell: (props) => (
        <Field.Date { ...props } minDate={ financialYearStartDate } maxDate={ financialYearEndDate } />
      ),
    },
    {
      id: 'endDate',
      accessor: 'endDate',
      intlId: 'required-attendance.temporary-closures-end-date',
      sortable: false,
      minWidth: 155,
      EditCell: (props) => (
        <Field.Date { ...props } minDate={ financialYearStartDate } maxDate={ financialYearEndDate } />
      ),
    },
    {
      id: 'sunday',
      accessor: 'sunday',
      intlId: 'required-attendance.temporary-closures-sunday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'monday',
      accessor: 'monday',
      intlId: 'required-attendance.temporary-closures-monday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'tuesday',
      accessor: 'tuesday',
      intlId: 'required-attendance.temporary-closures-tuesday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'wednesday',
      accessor: 'wednesday',
      intlId: 'required-attendance.temporary-closures-wednesday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'thursday',
      accessor: 'thursday',
      intlId: 'required-attendance.temporary-closures-thursday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'friday',
      accessor: 'friday',
      intlId: 'required-attendance.temporary-closures-friday',
      sortable: false,
      EditCell: Field.Number2,
    },
    {
      id: 'saturday',
      accessor: 'saturday',
      intlId: 'required-attendance.temporary-closures-saturday',
      sortable: false,
      EditCell: Field.Number2,
    },
  ];

  const rows = map(temporaryClosures, item => {
    return {
      sequence: item.sequence,
      workShift: editMode ? item.workShift : getElementEmpty(item, 'workShift', 'longDescription'),
      startDate: item.startDate,
      endDate: item.endDate,
      sunday: formatNumber(item.nbDayForSunday, currencyOptions),
      monday: formatNumber(item.nbDayForMonday, currencyOptions),
      tuesday: formatNumber(item.nbDayForTuesday, currencyOptions),
      wednesday: formatNumber(item.nbDayForWednesday, currencyOptions),
      thursday: formatNumber(item.nbDayForThursday, currencyOptions),
      friday: formatNumber(item.nbDayForFriday, currencyOptions),
      saturday: formatNumber(item.nbDayForSaturday, currencyOptions),
    };
  });

  if (!rows.length && !editMode) {
    rows.push({
      sequence: '-',
      workShift: '-',
      startDate: '-',
      endDate: '-',
      sunday: '-',
      monday: '-',
      tuesday: '-',
      wednesday: '-',
      thursday: '-',
      friday: '-',
      saturday: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractTemporaryClosuresSelector = createSelector(
  [
    (state) => state.requiredAttendances.entry.temporaryClosures,
    (state) => state.requiredAttendances.editMode,
    (state) => getCurrencyOptions(state),
    (state) => getFinancialYearStartDate(state.scenario.selectedScenario.year),
    (state) => getFinancialYearEndDate(state.scenario.selectedScenario.year),
  ],
  extractTemporaryClosures
);

export function extractDistributions(distributions, editMode, currencyOptions, noDashesForEmptyRows) {
  const columns = [
    {
      id: 'expense',
      accessor: 'expense',
      intlId: 'required-attendance.distributions-expense',
      sortable: false,
    },
    {
      id: 'description',
      accessor: 'description',
      intlId: 'required-attendance.distributions-description',
      sortable: false,
    },
    {
      id: 'value',
      accessor: 'value',
      intlId: 'required-attendance.distributions-value',
      sortable: false,
    },
    {
      id: 'total',
      accessor: 'total',
      intlId: 'required-attendance.distributions-total',
      sortable: false,
      isNumber: true,
    },
  ];

  if (!editMode) {
    columns.push({
      id: 'info',
      width: 48,
      sortable: false,
      Cell: props => {
        return (
          <DetailsInfoCell action={ getDistributionExpense } id={ props.original.id } />
        );
      },
    });
  }


  let rows = [];

  if (distributions) {
    rows = map(distributions, (item) => {
      return {
        expense: item.expense ? item.expense.code : '-',
        description: item.expense ? item.expense.longDescription : '-',
        value: item ? item.valueToBeDistributed : '-',
        total: item && item.totalToBeDistributed !== undefined ? accounting.formatNumber(item.totalToBeDistributed, currencyOptions) : '-',
        id: getElementEmpty(item, 'id'),
      };
    });
  }

  if (!rows.length && !noDashesForEmptyRows) {
    rows.push({
      expense: '-',
      description: '-',
      value: '-',
      total: '-',
      id: '-',
    });
  }

  return {
    rows,
    columns,
  };
}

export const extractDistributionsSelector = createSelector(
  [
    (state) => state.requiredAttendances.distributions,
    (state) => state.requiredAttendances.editMode,
    (state) => getCurrencyOptions(state),
    () => true,
  ],
  extractDistributions
);

export const extractExpenseTable = createSelector(
  [
    (state) => state.requiredAttendances.distributions,
    (state) => state.requiredAttendances.selectedDistributions,
    (state) => state.distributionExpense.isNew,
    (state, props) => props.intl,
  ],
  (distributions, selectedDistributions, isNew, intl) => {
    const columns = [
      {
        id: 'expense',
        accessor: 'expense',
        intlId: 'required-attendance.distributions-expense',
        sortable: false,
      },
    ];

    let rows = [];
    const selectedId = get(selectedDistributions, 'id');
    let selectedRow = -1;

    if (distributions) {
      rows = map(distributions, (item, index) => {
        if (item.id === selectedId) {
          selectedRow = index;
        }
        return {
          expense: item.expense ? item.expense.code : '-',
          id: item.id,
        };
      });
    }

    if (isNew) {
      selectedRow = rows.length;
      const expense = intl.formatMessage({ id: 'distribution-expense.new-distribution' });
      rows.push({
        expense,
      });
    }

    if (!rows.length) {
      rows.push({
        expense: '-',
      });
    }

    return {
      rows,
      columns,
      selectedRow,
    };
  }
);

export const extractExpenseDistributionsTable = createSelector(
  [
    (state) => state.distributionExpense.entry.distributions.periods,
    (state) => getCurrencyOptions(state),
    (state) => state.distributionExpense.editMode,
  ],
  (periods, currencyOptions) => {
    const columns = [
      {
        id: 'period',
        accessor: 'period',
        intlId: 'required-attendance.expense.distribution.period',
        sortable: false,
        width: 80,
      },
      {
        id: 'amount',
        accessor: (row) => formatZeroNumber(getElement(row, 'amount'), currencyOptions),
        intlId: 'required-attendance.expense.distribution.to-distribute',
        sortable: false,
        align: 'right',
        width: 110,
        EditCell: Field.Number2,
      },
      {
        id: 'rate',
        accessor: (row) => formatZeroNumber(getElement(row, 'rate'), currencyOptions),
        intlId: 'required-attendance.expense.distribution.parameters-model',
        sortable: false,
        align: 'right',
        width: 160,
      },
    ];

    return {
      rows: periods,
      columns,
    };
  }
);
