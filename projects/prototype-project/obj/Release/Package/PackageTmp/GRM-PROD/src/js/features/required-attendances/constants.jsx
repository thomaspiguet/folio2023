import { defineMessages } from 'react-intl';

export const titleIcon = 'position';
export const JOB_STATUS_PARTIAL_TIME_CASUAL = 'PartialTimeCasual';
export const JOB_STATUS_PARTIAL_TIME_REGULAR = 'PartialTimeRegular';
export const JOB_STATUS_PARTIAL_TIME_TEMPORARY = 'PartialTimeTemporary';
export const HOURS_PER_DAY_OTHER = 'Other';


defineMessages({
  sequenceExists: {
    id: 'required-attendance.sequence-exist',
    defaultMessage: 'The sequence has already been used.',
  },
  workShiftExists: {
    id: 'required-attendance.work-shift-exist',
    defaultMessage: 'The work shift already exists.',
  },
  replacementsTypeExists: {
    id: 'required-attendance.replacements-type-exist',
    defaultMessage: 'The expense type already exists.',
  },
  replacementsPremiumExists: {
    id: 'required-attendance.premium-exist',
    defaultMessage: 'The premium already exists.',
  },
  cancel: {
    id: 'required-attendance.edit-cancel',
    defaultMessage: 'The form is in edit mode. If change have been made, they will be lost. Do you want to continue?',
  },
  changeRoute: {
    id: 'required-attendance.disable-change-route',
    defaultMessage: 'The form is in edit mode. Please save or cancel editing to continue.',
  },
  title: {
    id: 'required-attendance.title',
    defaultMessage: 'Required Attendance:',
  },
  titleRoute: {
    id: 'required-attendance.title-route',
    defaultMessage: 'Required Attendance',
  },
  financialYearColon: {
    id: 'required-attendance.financial-year-colon',
    defaultMessage: 'Financial year:',
  },
  selectedScenario: {
    id: 'required-attendance.selected-scenario',
    defaultMessage: 'Scenario:',
  },
  forThisScenario: {
    id: 'required-attendance.specific-to-this-scenario',
    defaultMessage: 'Specific for this scenario',
  },
  onlyCalculateHours: {
    id: 'required-attendance.hours-calculation-only',
    defaultMessage: 'Hours calculation only',
  },
  functionalCenterCode: {
    id: 'required-attendance.functional-center-code',
    defaultMessage: 'Functional center:',
  },
  functionalCenterPlaceholder: {
    id: 'required-attendance.functional-center-placeholder',
    defaultMessage: 'Select functional center...',
  },
  type: {
    id: 'required-attendance.detail-type',
    defaultMessage: 'Type:',
  },
  reference: {
    id: 'required-attendance.detail-reference',
    defaultMessage: 'Reference:',
  },
  referenceDescription: {
    id: 'required-attendance.detail-reference-description',
    defaultMessage: 'Description:',
  },
  duration: {
    id: 'required-attendance.duration',
    defaultMessage: 'Duration:',
  },
  durationFinancialYear: {
    id: 'required-attendance.duration-financial-year',
    defaultMessage: 'Financial year',
  },
  durationStartDate: {
    id: 'required-attendance.duration-start-date',
    defaultMessage: 'Start:',
  },
  durationEndDate: {
    id: 'required-attendance.duration-end-date',
    defaultMessage: 'End:',
  },
  jobType: {
    id: 'required-attendance.job-type',
    defaultMessage: 'Job type:',
  },
  jobStatus: {
    id: 'required-attendance.job-status',
    defaultMessage: 'Job status:',
  },
  union: {
    id: 'required-attendance.union',
    defaultMessage: 'Union:',
  },
  details: {
    id: 'required-attendance.details',
    defaultMessage: 'Details',
  },
  levels: {
    id: 'required-attendance.levels',
    defaultMessage: 'Levels',
  },
  benefits: {
    id: 'required-attendance.benefits',
    defaultMessage: 'Benefits',
  },
  payrollDeductions: {
    id: 'required-attendance.payroll-deductions',
    defaultMessage: 'Payroll Deductions',
  },
  payrollDeductionsColon: {
    id: 'required-attendance.payroll-deductions-colon',
    defaultMessage: 'Payroll Deductions:',
  },
  payrollDeductionsGlobal: {
    id: 'required-attendance.payroll-deductions-global',
    defaultMessage: 'Global',
  },
  payrollDeductionsGlobalParameters: {
    id: 'required-attendance.payroll-deductions-global-parameters',
    defaultMessage: 'Global payroll deductions parameters:',
  },
  payrollDeductionsIfDifferent: {
    id: 'required-attendance.payroll-deductions-if-different',
    defaultMessage: 'If different:',
  },
  payrollDeductionsSpecific: {
    id: 'required-attendance.payroll-deductions-specific',
    defaultMessage: 'Specific',
  },
  payrollDeductionsSpecificCheckBox: {
    id: 'required-attendance.payroll-deductions-specific-checkbox',
    defaultMessage: 'Specific payroll deductions',
  },
  payrollDeductionsParameters: {
    id: 'required-attendance.payroll-deductions-parameters',
    defaultMessage: 'Parameters',
  },
  payrollDeductionsCustomized: {
    id: 'required-attendance.payroll-deductions-customized',
    defaultMessage: 'Customized',
  },
  payrollDeductionsCalculatedTaxableAmount: {
    id: 'required-attendance.payroll-deductions-calculated-taxable-amount',
    defaultMessage: 'Calculated taxable amount:',
  },
  payrollDeductionsTaxableWageAmount: {
    id: 'required-attendance.payroll-deductions-taxable-wage-amount',
    defaultMessage: 'Taxable wage amount:',
  },
  payrollDeductionsSpecificTaxableAmount: {
    id: 'required-attendance.payroll-deductions-specific-taxable-amount',
    defaultMessage: 'Specific taxable amount:',
  },
  payrollDeductionsFrom: {
    id: 'required-attendance.payroll-deductions-from',
    defaultMessage: 'FROM',
  },
  payrollDeductionsTo: {
    id: 'required-attendance.payroll-deductions-to',
    defaultMessage: 'TO',
  },
  payrollDeductionsParametersRRQ: {
    id: 'required-attendance.payroll-deductions-parameters-rrq',
    defaultMessage: 'RRQ:',
  },
  payrollDeductionsParametersWCB: {
    id: 'required-attendance.payroll-deductions-parameters-wcb',
    defaultMessage: 'WCB:',
  },
  payrollDeductionsParametersHCP: {
    id: 'required-attendance.payroll-deductions-parameters-hcp',
    defaultMessage: 'HCP:',
  },
  payrollDeductionsParametersEL: {
    id: 'required-attendance.payroll-deductions-parameters-el',
    defaultMessage: 'EL:',
  },
  payrollDeductionsParametersPension: {
    id: 'required-attendance.payroll-deductions-parameters-pension',
    defaultMessage: 'Pension:',
  },
  payrollDeductionsParametersQPIP: {
    id: 'required-attendance.payroll-deductions-parameters-qpip',
    defaultMessage: 'QPIP:',
  },
  premiums: {
    id: 'required-attendance.premiums',
    defaultMessage: 'Premiums',
  },
  insurances: {
    id: 'required-attendance.insurances',
    defaultMessage: 'Insurances',
  },
  replacements: {
    id: 'required-attendance.replacements',
    defaultMessage: 'Replacements',
  },
  scheduleRequiredAttendance: {
    id: 'required-attendance.schedule-required-attendance',
    defaultMessage: 'Schedule - Required attendance',
  },
  temporaryClosure: {
    id: 'required-attendance.temporary-closure',
    defaultMessage: 'Temporary closure',
  },
  benefitsAbsences: {
    id: 'required-attendance.benefits-absences',
    defaultMessage: 'Leaves:',
  },
  functionalCenter: {
    id: 'required-attendance.functional-center',
    defaultMessage: 'Functional center:',
  },
  benefitsUnion: {
    id: 'required-attendance.union',
    defaultMessage: 'Union:',
  },
  hourlyRate: {
    id: 'required-attendance.hourly-rate',
    defaultMessage: 'Hourly rate:',
  },
  hourlyRateSuggested: {
    id: 'required-attendance.hourly-rate-suggested',
    defaultMessage: 'Suggested:',
  },
  hourlyRateSpecific: {
    id: 'required-attendance.hourly-rate-specific',
    defaultMessage: 'Specific:',
  },
  suggestedHourlyRateColon: {
    id: 'required-attendance.suggested-hourly-rate-colon',
    defaultMessage: 'Suggested hourly rate:',
  },
  hourlyRateAverageJobTitle: {
    id: 'required-attendance.hourly-rate-average-job-title',
    defaultMessage: 'Average hourly rate - Job title used in the functional center',
  },
  hourlyRateAverageSalaryScale: {
    id: 'required-attendance.hourly-rate-average-salary-scale',
    defaultMessage: 'Average hourly rate - Salary scale of the job title',
  },
  hourlyRateSpecificGroupAndLevel: {
    id: 'required-attendance.hourly-rate-specific-group-and-level',
    defaultMessage: 'Specific group and level - Salary scale of the job title',
  },
  hourlyRateAverageParametersSalaryScale: {
    id: 'required-attendance.hourly-rate-average-parameters-salary-scale',
    defaultMessage: 'Parameters: Average hourly rate - Salary scale of the job title',
  },
  rateOrigin: {
    id: 'required-attendance.rate-origin',
    defaultMessage: 'Rate origin:',
  },
  hoursPerDaySelected: {
    id: 'required-attendance.hours-per-day-selected',
    defaultMessage: 'Hours per day:',
  },
  totalHours: {
    id: 'required-attendance.total-hours',
    defaultMessage: 'Total hours:',
  },
  totalStatus: {
    id: 'required-attendance.total-status',
    defaultMessage: 'STATUS',
  },
  totalHoursPerTwoWeeks: {
    id: 'required-attendance.total-hours-per-two-weeks',
    defaultMessage: 'HRS/2 WKS',
  },
  fullTimeEquivalent: {
    id: 'required-attendance.full-time-equivalent',
    defaultMessage: 'Full-time equivalent:',
  },
  benefitsColon: {
    id: 'required-attendance.benefits-colon',
    defaultMessage: 'Benefits:',
  },
  benefitsDays: {
    id: 'required-attendance.benefits-days',
    defaultMessage: 'Days',
  },
  benefitsPercentages: {
    id: 'required-attendance.benefits-percentages',
    defaultMessage: 'Percentages',
  },
  benefitsParametersDays: {
    id: 'required-attendance.benefits-parameters-days',
    defaultMessage: 'Parameters (days)',
  },
  benefitsIfDifferent: {
    id: 'required-attendance.benefits-if-different',
    defaultMessage: 'If different',
  },
  benefitsUnionPercentage: {
    id: 'required-attendance.benefits-union-percentage',
    defaultMessage: 'Union (%)',
  },
  benefitsParametersPercentage: {
    id: 'required-attendance.benefits-parameters-percentage',
    defaultMessage: 'Parameters (%)',
  },
  benefitsIfDifferentPercentage: {
    id: 'required-attendance.benefits-if-different-percentage',
    defaultMessage: 'If different (%)',
  },
  benefitsVacation: {
    id: 'required-attendance.benefits-vacation',
    defaultMessage: 'Vacation:',
  },
  benefitsVacationPercentage: {
    id: 'required-attendance.benefits-vacation-percentage',
    defaultMessage: 'Vacation (%):',
  },
  benefitsHolidays: {
    id: 'required-attendance.benefits-holidays',
    defaultMessage: 'Holidays:',
  },
  benefitsHolidaysPercentage: {
    id: 'required-attendance.benefits-holidays-percentage',
    defaultMessage: 'Holidays (%):',
  },
  benefitsSickDays: {
    id: 'required-attendance.benefits-sick-days',
    defaultMessage: 'Sick days:',
  },
  benefitsSickDaysPercentage: {
    id: 'required-attendance.benefits-sick-days-percentage',
    defaultMessage: 'Sick days (%):',
  },
  benefitsPsychLeave: {
    id: 'required-attendance.benefits-psych-leave',
    defaultMessage: 'Psych. leave:',
  },
  benefitsPsychLeavePercentage: {
    id: 'required-attendance.benefits-psych-leave-percentage',
    defaultMessage: 'Psych. leave (%):',
  },
  benefitsNightShift: {
    id: 'required-attendance.benefits-night-shift',
    defaultMessage: 'Night shift:',
  },
  benefitsNightShiftPercentage: {
    id: 'required-attendance.benefits-night-shift-percentage',
    defaultMessage: 'Night shift (%):',
  },
  levelsButtonOk: {
    id: 'required-attendance.levels-button-ok',
    defaultMessage: 'Ok',
  },
  levelsButtonCancel: {
    id: 'required-attendance.levels-button-cancel',
    defaultMessage: 'Cancel',
  },
  levelsButtonOthers: {
    id: 'required-attendance.levels-button-others',
    defaultMessage: 'Others',
  },
  hourlyRateSpecificGroup: {
    id: 'required-attendance.hourly-rate-specific-group',
    defaultMessage: 'Group:',
  },
  hourlyRateSpecificLevel: {
    id: 'required-attendance.hourly-rate-specific-level',
    defaultMessage: 'Level:',
  },
  showOriginReplacementsToggle: {
    id: 'required-attendance.show-origin-of-replacements-toggle-button',
    defaultMessage: 'Show origin of replacements',
  },
  hideOriginReplacementsToggle: {
    id: 'required-attendance.hide-origin-of-replacements-toggle-button',
    defaultMessage: 'Hide origin of replacements',
  },
  rateFuncCenterAverage: {
    id: 'required-attendance.rate-origin.functional-center-average',
    defaultMessage: 'FC average',
  },
  rateJobTitleAverage: {
    id: 'required-attendance.rate-origin.job-title-average',
    defaultMessage: 'Job title average',
  },
  rateParameters: {
    id: 'required-attendance.rate-origin.parameters',
    defaultMessage: 'Parameters',
  },
  rateGroupLevel: {
    id: 'required-attendance.rate-origin.group-level',
    defaultMessage: 'Group, level',
  },
  deletingConfirmation: {
    id: 'required-attendance.delete-confirmation',
    defaultMessage: 'Are you sure that you want to delete Required attendance: {requiredAttendanceTitle}?',
  },
  deletedAlert: {
    id: 'required-attendance.deleted-alert',
    defaultMessage: 'Required attendance: {requiredAttendanceTitle} has been deleted.',
  },
  copyAlert: {
    id: 'required-attendance.copy-alert',
    defaultMessage: 'Required attendance: {requiredAttendanceTitle} has been copied.',
  },
  distributions: {
    id: 'required-attendance.distributions',
    defaultMessage: 'Distributions',
  },
  deletingDistributionsConfirmation: {
    id: 'required-attendance.delete-distributions-confirmation',
    defaultMessage: 'Are you sure that you want to delete the distribution record ?',
  },
  distributionsDeletedAlert: {
    id: 'required-attendance.deleted-distributions-alert',
    defaultMessage: 'Distribution record "{description}" has been deleted.',
  },
  noDistributionsData: {
    id: 'data-grid.no-distributions-data',
    defaultMessage: 'No distributions available.',
  },
  descriptionPlaceholder: {
    id: 'required-attendance.description-placeholder',
    defaultMessage: 'Type description here...',
  },
});
