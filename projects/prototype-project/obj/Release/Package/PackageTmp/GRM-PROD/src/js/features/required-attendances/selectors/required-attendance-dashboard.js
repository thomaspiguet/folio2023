import { createSelector } from 'reselect';
import { defineMessages } from 'react-intl';
import { forOwn, each, set } from 'lodash';

import {
  formatDashesNumber,
  formatZeroNumber,
  getCurrencyOptions,
  getElement,
} from '../../../utils/selectors/currency';
import { getCustomColumnGroup, applyCustomColumns } from '../../../utils/utils';

import Field from '../../../components/controls/field';
import { getReferenceKey } from '../reducers/required-attendance-dashboard';

defineMessages({
  generalInformation: {
    id: 'required-attendance-dashboard-table.general-info',
    defaultMessage: 'General information',
  },
  sunday: {
    id: 'required-attendance-dashboard-table.sunday',
    defaultMessage: 'Sunday',
  },
  monday: {
    id: 'required-attendance-dashboard-table.monday',
    defaultMessage: 'Monday',
  },
  tuesday: {
    id: 'required-attendance-dashboard-table.tuesday',
    defaultMessage: 'Tuesday',
  },
  wednesday: {
    id: 'required-attendance-dashboard-table.wednesday',
    defaultMessage: 'Wednesday',
  },
  thursday: {
    id: 'required-attendance-dashboard-table.thursday',
    defaultMessage: 'Thursday',
  },
  friday: {
    id: 'required-attendance-dashboard-table.friday',
    defaultMessage: 'Friday',
  },
  saturday: {
    id: 'required-attendance-dashboard-table.saturday',
    defaultMessage: 'Saturday',
  },
  sectionName: {
    id: 'required-attendance-dashboard-table.section-name',
    defaultMessage: 'Section Name',
  },
  sectionName1: {
    id: 'required-attendance-dashboard-table.section-name-1',
    defaultMessage: 'Section name 1',
  },
  reference: {
    id: 'required-attendance-dashboard-table.reference',
    defaultMessage: 'Reference',
  },
  func: {
    id: 'required-attendance-dashboard-table.func',
    defaultMessage: 'FUNC. CTR',
  },
  type: {
    id: 'required-attendance-dashboard-table.type',
    defaultMessage: 'TYPE',
  },
  groupDesc: {
    id: 'required-attendance-dashboard-table.group-desc',
    defaultMessage: 'GROUP - DESC.',
  },
  day: {
    id: 'required-attendance-dashboard-table.day',
    defaultMessage: 'D',
  },
  evening: {
    id: 'required-attendance-dashboard-table.evening',
    defaultMessage: 'E',
  },
  night: {
    id: 'required-attendance-dashboard-table.night',
    defaultMessage: 'N',
  },
  rotation: {
    id: 'required-attendance-dashboard-table.rotation',
    defaultMessage: 'R',
  },
  totalAttend: {
    id: 'required-attendance-dashboard-table.total-attend',
    defaultMessage: 'TOTAL ATTEND',
  },
  hoursPerDay: {
    id: 'required-attendance-dashboard-table.hours-per-day',
    defaultMessage: 'HOURS PER DAY',
  },
  totalHours: {
    id: 'required-attendance-dashboard-table.total-hours',
    defaultMessage: 'TOTAL HOURS',
  },
  leaves: {
    id: 'required-attendance-dashboard-table.leaves',
    defaultMessage: 'LEAVES',
  },
  replacements: {
    id: 'required-attendance-dashboard-table.replacements',
    defaultMessage: 'Replacements',
  },
  vacRepl: {
    id: 'required-attendance-dashboard-table.vacation-replacements',
    defaultMessage: 'VAC. REPL. %',
  },
  holRepl: {
    id: 'required-attendance-dashboard-table.holiday-replacement',
    defaultMessage: 'HOL. REPL. %',
  },
  sickRepl: {
    id: 'required-attendance-dashboard-table.sick-replacement',
    defaultMessage: 'SICK REPL. %',
  },
  psyRepl: {
    id: 'required-attendance-dashboard-table.psychiatric-replacement',
    defaultMessage: 'PSY. REPL. %',
  },
  totalReplHours: {
    id: 'required-attendance-dashboard-table.total-replacement-hours',
    defaultMessage: 'TOTAL REPL. HRS',
  },
  totalWorkedHours: {
    id: 'required-attendance-dashboard-table.total-worked-hours',
    defaultMessage: 'TOTAL HRS WORKED',
  },
  totalFte: {
    id: 'required-attendance-dashboard-table.total-fte',
    defaultMessage: 'TOTAL FTE',
  },
  scenario: {
    id: 'required-attendance-dashboard-table.scenario',
    defaultMessage: 'SCENARIO',
  },
  fncCntrDescr: {
    id: 'required-attendance-dashboard-table.fnc-cntr-descr',
    defaultMessage: 'FUNC. CTR DESC.',
  },
  departmentCode: {
    id: 'required-attendance-dashboard-table.department-code',
    defaultMessage: 'DEPARTMENT CODE',
  },
  departmentDesc: {
    id: 'required-attendance-dashboard-table.department-desc',
    defaultMessage: 'DEPARTMENT DESC.',
  },
  subdepartmentCode: {
    id: 'required-attendance-dashboard-table.subdepartment-code',
    defaultMessage: 'SUBDEPT. CODE',
  },
  subdepartmentDesc: {
    id: 'required-attendance-dashboard-table.subdepartment-desc',
    defaultMessage: 'SUBDEPT. DESC.',
  },
  programCode: {
    id: 'required-attendance-dashboard-table.program-code',
    defaultMessage: 'PROGRAM. CODE',
  },
  programDesc: {
    id: 'required-attendance-dashboard-table.program-desc',
    defaultMessage: 'PROGRAM. DESC.',
  },
  subprogramCode: {
    id: 'required-attendance-dashboard-table.subprogram-code',
    defaultMessage: 'SUBPROG. CODE',
  },
  subprogramDesc: {
    id: 'required-attendance-dashboard-table.subprogram-desc',
    defaultMessage: 'SUBPROG. DESC.',
  },
  respCtrL1Desc: {
    id: 'required-attendance-dashboard-table.resp-ctr-l1-desc',
    defaultMessage: 'RESP. CTR L1 DESC.',
  },
  respCtrL2Desc: {
    id: 'required-attendance-dashboard-table.resp-ctr-l2-desc',
    defaultMessage: 'RESP. CTR L2 DESC.',
  },
  respCtrL3Desc: {
    id: 'required-attendance-dashboard-table.resp-ctr-l3-desc',
    defaultMessage: 'RESP. CTR L3 DESC.',
  },
  respCtrL1Code: {
    id: 'required-attendance-dashboard-table.resp-ctr-l1-code',
    defaultMessage: 'RESP. CTR L1 CODE',
  },
  respCtrL2Code: {
    id: 'required-attendance-dashboard-table.resp-ctr-l2-code',
    defaultMessage: 'RESP. CTR L2 CODE',
  },
  respCtrL3Code: {
    id: 'required-attendance-dashboard-table.resp-ctr-l3-code',
    defaultMessage: 'RESP. CTR L3 CODE',
  },
  siteCode: {
    id: 'required-attendance-dashboard-table.site-code',
    defaultMessage: 'SITE CODE',
  },
  siteDesc: {
    id: 'required-attendance-dashboard-table.site-desc',
    defaultMessage: 'SITE NAME',
  },
  primaryCode: {
    id: 'required-attendance-dashboard-table.primary-сode',
    defaultMessage: 'PRIMARY CODE',
  },
  primaryCodeDesc: {
    id: 'required-attendance-dashboard-table.primary-сode-desc',
    defaultMessage: 'PRIMARY CODE DESC.',
  },
  groupCode: {
    id: 'required-attendance-dashboard-table.group-code',
    defaultMessage: 'GROUP CODE',
  },
  jobTitleCode: {
    id: 'required-attendance-dashboard-table.job-title-code',
    defaultMessage: 'JOB TITLE CODE',
  },
  jobTitleDesc: {
    id: 'required-attendance-dashboard-table.job-title-desc',
    defaultMessage: 'JOB TITLE DESC.',
  },
  stPerl: {
    id: 'required-attendance-dashboard-table.st-repl',
    defaultMessage: 'ST REPL. %',
  },
  ltPerl: {
    id: 'required-attendance-dashboard-table.lt-repl',
    defaultMessage: 'LT REPL. %',
  },
});

function getSubFixedColumns(currencyOptions) {
  return [
    {
      intlId: 'required-attendance-dashboard-table.reference',
      accessor: row => getElement(row, 'generalInformation', 'reference'),
      id: 'generalInformation.reference',
      Aggregated: row => null,
      minWidth: 120,
      sortable: false,
    },
    {
      intlId: 'required-attendance-dashboard-table.func',
      accessor: row => getElement(row, 'generalInformation', 'functionalCenter', 'code'),
      id: 'generalInformation.functionalCenter.code',
      Aggregated: row => null,
      minWidth: 150,
      sortable: false,
    },
    {
      intlId: 'required-attendance-dashboard-table.type',
      accessor: row => getElement(row, 'generalInformation', 'type'),
      id: 'generalInformation.type',
      sortable: false,
      Aggregated: row => null,
      width: 120,
    },
  ];
}

function getScrolledColumns(params, getPerDaySubColumns, sectionNameColumns, sectionName1Columns, replacementsSubColumns, totalsSubColumns) {
  const scrolledColumns = [
    {
      intlId: 'required-attendance-dashboard-table.section-name',
      id: 'sectionName',
      columns: sectionNameColumns,
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.sunday',
      id: 'sunday',
      columns: getPerDaySubColumns('sunday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.monday',
      id: 'monday',
      columns: getPerDaySubColumns('monday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.tuesday',
      id: 'tuesday',
      columns: getPerDaySubColumns('tuesday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.wednesday',
      id: 'wednesday',
      columns: getPerDaySubColumns('wednesday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.thursday',
      id: 'thursday',
      columns: getPerDaySubColumns('thursday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.friday',
      id: 'friday',
      columns: getPerDaySubColumns('friday'),
      sortable: false,
      align: 'center',
    },
    {
      intlId: 'required-attendance-dashboard-table.saturday',
      id: 'saturday',
      columns: getPerDaySubColumns('saturday'),
      sortable: false,
      align: 'center',
    },
  ];

  forOwn(params, (value, key) => {
    if (value.title) {
      scrolledColumns.push({
        title: value.title,
        id: value.title,
        columns: getPerDaySubColumns(`otherNonWorkDay${ key }`),
        sortable: false,
        align: 'center',
      });
    }
  });

  scrolledColumns.push({
    intlId: 'required-attendance-dashboard-table.section-name-1',
    id: 'sectionName1',
    columns: sectionName1Columns,
    sortable: false,
    align: 'center',
  });

  scrolledColumns.push({
    intlId: 'required-attendance-dashboard-table.replacements',
    id: 'replacements',
    columns: replacementsSubColumns,
    sortable: false,
    align: 'center',
  });

  scrolledColumns.push({
    id: 'totalsSection',
    columns: totalsSubColumns,
    sortable: false,
    align: 'center',
  });

  return scrolledColumns;
}

function getSubScrolledColumns(currencyOptions) {
  const getPerDaySubColumns = (weekDay) => {
    return [
      {
        intlId: 'required-attendance-dashboard-table.day',
        accessor: (row) => formatDashesNumber(getElement(row, weekDay, 'day'), currencyOptions),
        id: `${ weekDay }.day`,
        sortable: false,
        isNumber: true,
        highlightNegative: true,
        width: 65,
        changable: true,
        EditCell: Field.Number2,
        editWidth: 85,
        noExtraPadding: true,
      },
      {
        intlId: 'required-attendance-dashboard-table.evening',
        accessor: (row) => formatDashesNumber(getElement(row, weekDay, 'evening'), currencyOptions),
        id: `${ weekDay }.evening`,
        sortable: false,
        isNumber: true,
        highlightNegative: true,
        width: 65,
        changable: true,
        EditCell: Field.Number2,
        editWidth: 85,
      },
      {
        intlId: 'required-attendance-dashboard-table.night',
        accessor: (row) => formatDashesNumber(getElement(row, weekDay, 'night'), currencyOptions),
        id: `${ weekDay }.night`,
        sortable: false,
        isNumber: true,
        highlightNegative: true,
        width: 65,
        changable: true,
        EditCell: Field.Number2,
        editWidth: 85,
      },
      {
        intlId: 'required-attendance-dashboard-table.rotation',
        accessor: (row) => formatDashesNumber(getElement(row, weekDay, 'rotation'), currencyOptions),
        id: `${ weekDay }.rotation`,
        sortable: false,
        isNumber: true,
        highlightNegative: true,
        width: 65,
        changable: true,
        EditCell: Field.Number2,
        editWidth: 85,
      },
    ];
  };

  const sectionNameSubColumns = [
    {
      intlId: 'required-attendance-dashboard-table.scenario',
      accessor: (row) => getElement(row, 'generalInformation', 'scenario', 'code'),
      id: 'generalInformation.scenario.code',
      sortable: false,
      width: 135,
      Aggregated: row => null,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.fnc-cntr-descr',
      accessor: row => getElement(row, 'generalInformation', 'functionalCenter', 'longDescription'),
      id: 'generalInformation.functionalCenter.longDescription',
      Aggregated: row => null,
      minWidth: 150,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.department-code',
      accessor: row => getElement(row, 'generalInformation', 'department', 'code'),
      id: 'generalInformation.department.code',
      Aggregated: row => null,
      minWidth: 100,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.department-desc',
      accessor: row => getElement(row, 'generalInformation', 'department', 'longDescription'),
      id: 'generalInformation.department.longDescription',
      Aggregated: row => null,
      minWidth: 160,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.subdepartment-code',
      accessor: row => getElement(row, 'generalInformation', 'subDepartment', 'code'),
      id: 'generalInformation.subDepartment.code',
      Aggregated: row => null,
      minWidth: 115,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.subdepartment-desc',
      accessor: row => getElement(row, 'generalInformation', 'subDepartment', 'longDescription'),
      id: 'generalInformation.subDepartment.longDescription',
      Aggregated: row => null,
      minWidth: 160,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.program-code',
      accessor: row => getElement(row, 'generalInformation', 'program', 'code'),
      id: 'generalInformation.program.code',
      Aggregated: row => null,
      minWidth: 125,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.program-desc',
      accessor: row => getElement(row, 'generalInformation', 'program', 'longDescription'),
      id: 'generalInformation.program.longDescription',
      Aggregated: row => null,
      minWidth: 120,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.subprogram-code',
      accessor: row => getElement(row, 'generalInformation', 'subProgram', 'code'),
      id: 'generalInformation.subProgram.code',
      Aggregated: row => null,
      minWidth: 110,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.subprogram-desc',
      accessor: row => getElement(row, 'generalInformation', 'subProgram', 'longDescription'),
      id: 'generalInformation.subProgram.longDescription',
      Aggregated: row => null,
      minWidth: 120,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l1-code',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel1', 'code'),
      id: 'generalInformation.responsibilityCenterLevel1.code',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l1-desc',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel1', 'longDescription'),
      id: 'generalInformation.responsibilityCenterLevel1.longDescription',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l2-code',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel2', 'code'),
      id: 'generalInformation.responsibilityCenterLevel2.code',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l2-desc',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel2', 'longDescription'),
      id: 'generalInformation.responsibilityCenterLevel2.longDescription',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l3-code',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel3', 'code'),
      id: 'generalInformation.responsibilityCenterLevel3.code',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.resp-ctr-l3-desc',
      accessor: row => getElement(row, 'generalInformation', 'responsibilityCenterLevel3', 'longDescription'),
      id: 'generalInformation.responsibilityCenterLevel3.longDescription',
      Aggregated: row => null,
      minWidth: 130,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.site-code',
      accessor: row => getElement(row, 'generalInformation', 'site', 'code'),
      id: 'generalInformation.site.code',
      Aggregated: row => null,
      minWidth: 100,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.site-desc',
      accessor: row => getElement(row, 'generalInformation', 'site', 'longDescription'),
      id: 'generalInformation.site.longDescription',
      Aggregated: row => null,
      minWidth: 120,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.primary-сode',
      accessor: row => getElement(row, 'generalInformation', 'primaryCodeGroup', 'code'),
      id: 'generalInformation.primaryCodeGroup.code',
      Aggregated: row => null,
      minWidth: 115,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.primary-сode-desc',
      accessor: row => getElement(row, 'generalInformation', 'primaryCodeGroup', 'longDescription'),
      id: 'generalInformation.primaryCodeGroup.longDescription',
      Aggregated: row => null,
      minWidth: 150,
      sortable: false,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.group-code',
      accessor: (row) => getElement(row, 'generalInformation', 'jobTitleGroup', 'code'),
      id: 'generalInformation.jobTitleGroup.code',
      sortable: false,
      width: 110,
      Aggregated: row => null,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.group-desc',
      accessor: row => getElement(row, 'generalInformation', 'jobTitleGroup', 'longDescription'),
      id: 'generalInformation.jobTitleGroup.longDescription',
      sortable: false,
      Aggregated: row => null,
      width: 120,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.job-title-code',
      accessor: row => getElement(row, 'generalInformation', 'jobTitle', 'code'),
      id: 'generalInformation.jobTitle.code',
      sortable: false,
      Aggregated: row => null,
      width: 115,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.job-title-desc',
      accessor: row => getElement(row, 'generalInformation', 'jobTitle', 'longDescription'),
      id: 'generalInformation.jobTitle.longDescription',
      sortable: false,
      Aggregated: row => null,
      width: 120,
      hiddenByDefault: true,
    },
  ];

  const sectionName1SubColumns = [
    {
      intlId: 'required-attendance-dashboard-table.total-attend',
      accessor: (row) => formatZeroNumber(getElement(row, 'totalAttendance'), currencyOptions),
      id: 'totalAttendance',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.hours-per-day',
      accessor: (row) => formatZeroNumber(getElement(row, 'hoursPerDay'), currencyOptions),
      id: 'hoursPerDay',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.total-hours',
      accessor: (row) => formatZeroNumber(getElement(row, 'totalHours'), currencyOptions),
      id: 'totalHours',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 100,
    },
    {
      intlId: 'required-attendance-dashboard-table.leaves',
      accessor: (row) => formatZeroNumber(getElement(row, 'leaves'), currencyOptions),
      id: 'leaves',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 80,
    },
  ];

  const replacementsSubColumns = [
    {
      intlId: 'required-attendance-dashboard-table.vacation-replacements',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'vacation'), currencyOptions),
      id: 'remplacement.vacation',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.holiday-replacement',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'holiday'), currencyOptions),
      id: 'remplacement.holiday',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.sick-replacement',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'sick'), currencyOptions),
      id: 'remplacement.sick',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.psychiatric-replacement',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'psychiatric'), currencyOptions),
      id: 'remplacement.psychiatric',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
    },
    {
      intlId: 'required-attendance-dashboard-table.st-repl',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'shortTerm'), currencyOptions),
      id: 'remplacement.shortTerm',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.lt-repl',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'longTerm'), currencyOptions),
      id: 'remplacement.longTerm',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 110,
      hiddenByDefault: true,
    },
    {
      intlId: 'required-attendance-dashboard-table.total-replacement-hours',
      accessor: (row) => formatZeroNumber(getElement(row, 'remplacement', 'totalHours'), currencyOptions),
      id: 'remplacement.totalHours',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 120,
    },
  ];

  const totalsSubColumns = [
    {
      intlId: 'required-attendance-dashboard-table.total-worked-hours',
      accessor: (row) => formatZeroNumber(getElement(row, 'totalHoursWorked'), currencyOptions),
      id: 'totalHoursWorked',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 135,
    },
    {
      intlId: 'required-attendance-dashboard-table.total-fte',
      accessor: (row) => formatZeroNumber(getElement(row, 'totalFte'), currencyOptions),
      id: 'totalFte',
      exportId: '0',
      sortable: false,
      isNumber: true,
      highlightNegative: true,
      width: 100,
    },
  ];

  return { getPerDaySubColumns, sectionNameSubColumns, sectionName1SubColumns, replacementsSubColumns, totalsSubColumns };
}

export function getAllColumns(currencyOptions, params) {
  const columnsFixed = [
    {
      intlId: 'required-attendance-dashboard-table.general-info',
      id: 'generalInfo',
      columns: getSubFixedColumns(),
      sortable: false,
    },
  ];
  const { getPerDaySubColumns, sectionNameSubColumns, sectionName1SubColumns, replacementsSubColumns, totalsSubColumns } = getSubScrolledColumns(currencyOptions);
  const columnsScrolled = getScrolledColumns(params, getPerDaySubColumns, sectionNameSubColumns, sectionName1SubColumns, replacementsSubColumns, totalsSubColumns);
  return { columnsFixed, columnsScrolled };
}

const getColumns = createSelector(
  [
    (state) => getCurrencyOptions(state),
    (state) => state.requiredAttendanceDashboard.parameters,
    (state) => state.requiredAttendanceDashboard.customizedColumns,
    (state) => state.requiredAttendanceDashboard.editMode,
  ],
  (currencyOptions, params, customizedColumns) => {
    const columns = getAllColumns(currencyOptions, params);
    const customColumns = {
      columnsFixed: getCustomColumnGroup(columns.columnsFixed, customizedColumns),
      columnsScrolled: getCustomColumnGroup(columns.columnsScrolled, customizedColumns),
    };

    columns.columnsFixed = applyCustomColumns(columns.columnsFixed, customColumns.columnsFixed);
    columns.columnsScrolled = applyCustomColumns(columns.columnsScrolled, customColumns.columnsScrolled);
    return { columns, customColumns };
  }
);

export const extractData = createSelector(
  [
    (state) => state.requiredAttendanceDashboard.data,
    (state) => state.requiredAttendanceDashboard.changedData,
    (state) => state.requiredAttendanceDashboard.editMode,
    (state) => getColumns(state),
  ],
  (data, changedData, editMode, { columns, customColumns }) => {
    const rows = data ? [...data] : [];

    if (editMode) {
      each(rows, (row) => {
        row._changed = {};
        each(columns, (columnList) => {
          each(columnList, (columnGroup) => {
            each(columnGroup.columns, (column) => {
              const changed = changedData[getReferenceKey(row, column.id)];
              if (changed) {
                row._changed[column.id] = true;
                set(row, column.id, changed.value);
              }
            });
          });
        });
      });
    }

    return {
      rows,
      columnsFixed: [...columns.columnsFixed],
      columnsScrolled: [...columns.columnsScrolled],
      columns,
      customColumns,
    };
  }
);

export const extractEntry = createSelector(
  [
    (state) => extractData(state),
  ],
  (table) => {
    return {
      table,
    };
  }
);
