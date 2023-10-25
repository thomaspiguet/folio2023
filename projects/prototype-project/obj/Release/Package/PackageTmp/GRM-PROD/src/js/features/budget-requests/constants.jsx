import { defineMessages } from 'react-intl';
import { get } from 'lodash';
import { codeDescriptionAttributeSchema, codeDescriptionSchema } from '../../entities/code-description';
import { numberSchema, stringSchema } from '../../entities/base';
import { benefitsBudgetRequestSchema } from '../../entities/benefits';
import { calculationBaseSchema } from '../../entities/calculation-base';
import { jobTitleSchema } from '../../entities/job-title';
import { financialYearGroupSchema } from '../../entities/financial-year-group';
import {
  distributionsSchema,
  isEditableDistributionRatesCell,
  isEditableDistributionAmountsCell,
  DISTRIBUTION_TYPE_MODEL,
} from '../../entities/distribution';
import { isSuggestedHourlyRate } from '../../components/business/suggested-hourly-rate/suggested-hourly-rate';

export const JOB_TITLE_TYPE_CODE = '0';
export const JOB_TITLE_GROUP_TYPE_CODE = '1';
export const titleIcon = 'position';

export const formOptions = {
  tabs: {
    detail: {},
    distributions: {},
  },
  fields: {
    functionalCenter: {
      path: ['functionalCenter'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'FunctionalCenter',
    },
    description: {
      path: ['description'],
      mandatory: true,
      schema: stringSchema,
      tabId: 'detail',
      metadata: 'Description',
    },
    forThisScenario: {
      path: ['forThisScenario'],
      tabId: 'detail',
    },
    requestType: {
      path: ['requestType'],
      mandatory: true,
      schema: codeDescriptionAttributeSchema,
      tabId: 'detail',
      metadata: 'RequestType',
    },
    natureOfExpense: {
      path: ['natureOfExpense'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'NatureOfExpense',
      predicate: (entry) => {
        const secondaryCode = get(entry, 'secondaryCode');
        return !secondaryCode || !secondaryCode.id;
      },
    },
    secondaryCode: {
      path: ['secondaryCode'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'SecondaryCode',
      predicate: (entry) => {
        const natureOfExpense = get(entry, 'natureOfExpense');
        return !natureOfExpense || !natureOfExpense.id;
      },
    },
    calculateBenefits: {
      path: ['isCalculatingBenefits'],
      tabId: 'detail',
    },
    isFteCalculation: {
      path: ['isFteCalculation'],
      tabId: 'detail',
    },
    fte: {
      path: ['fte'],
      tabId: 'detail',
      metadata: 'Fte',
    },
    totalValue: {
      path: ['totalValue'],
      tabId: 'detail',
      metadata: 'TotalValue',
      effect: (instance) => { instance.calculateFTE(); },
    },
    isCalculatingPayrollDeductions: {
      path: ['isCalculatingPayrollDeductions'],
      tabId: 'detail',
    },
    specificRequest: {
      path: ['isSpecificRequest'],
      tabId: 'detail',
    },
    benefits: {
      path: ['benefits'],
      tabId: 'benefits',
      schema: benefitsBudgetRequestSchema,
      metadata: 'Benefits',
      columns: [
        {
          path: ['percenteges', 'pctVacation'],
          id: 'pctVacation',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'PctVacation'],
        },
        {
          path: ['percenteges', 'pctHoliday'],
          id: 'pctHoliday',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'PctHoliday'],
        },
        {
          path: ['percenteges', 'pctSickDay'],
          id: 'pctSickDay',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'PctSickDay'],
        },
        {
          path: ['percenteges', 'pctPsychiatricLeave'],
          id: 'pctPsychiatricLeave',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'PctPsychiatricLeave'],
        },
        {
          path: ['percenteges', 'pctNightShift'],
          id: 'pctNightShift',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'PctNightShift'],
        },
        {
          path: ['percenteges', 'additionalPeriod4'],
          id: 'additionalPeriod4',
          tabId: 'benefits',
          metadata: ['Percenteges', 'children', 'AdditionalPeriod4'],
        },
      ],
    },
    type: {
      path: ['type'],
      mandatory: false,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'Type',
    },
    isAmountToDistribute: {
      path: ['isAmountToDistribute'],
      tabId: 'detail',
    },
    distributions: {
      path: ['distributions'],
      tabId: 'distributions',
      schema: distributionsSchema,
      metadata: 'Distributions',
      columns: [
        {
          path: ['periods', 'period'],
          id: 'period',
          tabId: 'distributions',
        },
        {
          path: ['periods', 'rate'],
          id: 'rate',
          tabId: 'distributions',
          metadata: ['Periods', 'children', 'Rate'],
          editable: isEditableDistributionRatesCell,
        },
        {
          path: ['periods', 'amount'],
          id: 'amount',
          tabId: 'distributions',
          metadata: ['Periods', 'children', 'Amount'],
          editable: isEditableDistributionAmountsCell,
        },
      ],
    },
    distributionType: {
      path: ['distributionType'],
      tabId: 'distributions',
    },
    distributionTemplate: {
      path: ['distributionTemplate'],
      tabId: 'distributions',
      mandatory: true,
      predicate: entry => get(entry, 'distributionType') === DISTRIBUTION_TYPE_MODEL,
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
      mandatory: false,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobTitleGroup',
      itemValue: 'shortDescription',
      predicate: entry => get(entry, 'type.code') === JOB_TITLE_GROUP_TYPE_CODE,
    },
    jobTitle: {
      path: ['jobTitle'],
      mandatory: false,
      schema: jobTitleSchema,
      tabId: 'detail',
      metadata: 'JobTitle',
      itemValue: 'description',
      predicate: entry => get(entry, 'type.code') === JOB_TITLE_TYPE_CODE,
    },
    union: {
      path: ['union'],
      mandatory: false,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'Union',
    },
    jobStatus: {
      path: ['jobStatus'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobStatus',
      predicate: (entry) => {
        const union = get(entry, 'union');
        return union && union.id;
      },
    },
    jobType: {
      path: ['jobType'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobType',
      predicate: (entry) => {
        const union = get(entry, 'union');
        return union && union.id;
      },
    },
    financialYearGroup: {
      path: ['financialYearGroup'],
      schema: financialYearGroupSchema,
      tabId: 'detail',
      metadata: 'FinancialYearGroup',
    },
    valuesToDestribute: {
      path: ['valuesToDestribute'],
      mandatory: true,
      schema: numberSchema,
      tabId: 'detail',
      metadata: 'ValuesToDestribute',
    },
    hourlyFactor: {
      path: ['hourlyFactor'],
      mandatory: true,
      schema: numberSchema,
      tabId: 'detail',
      metadata: 'HourlyFactor',
      predicate: (entry) => {
        const attributeCode = get(entry, 'requestType.attributeCode');
        return attributeCode === '10' || attributeCode === '20' || attributeCode === '30';
      },
    },
    calculationBase: {
      path: ['calculationBase'],
      mandatory: false,
      tabId: 'detail',
      schema: calculationBaseSchema,
      metadata: 'CalculationBase',
      itemValue: 'longDescription',
    },
    suggestedHourlyRate: {
      tabId: 'detail',
      path: ['suggestedHourlyRate'],
      metadata: 'SuggestedHourlyRate',
      mandatory: true,
      columns: [
        {
          path: ['suggestedHourlyRate'],
          id: 'suggestedHourlyRate',
          metadata: ['SuggestedHourlyRate'],
        },
        {
          path: ['rateOriginType'],
          id: 'rateOriginType',
        },
        {
          path: ['specificHourlyRate'],
          id: 'specificHourlyRate',
          mandatory: true,
          predicate: (entry, instance) => (!isSuggestedHourlyRate(entry.suggestedHourlyRate.rateOriginType)),
        },
        {
          path: ['rateOriginFunctionalCenter'],
          id: 'rateOriginFunctionalCenter',
        },
        {
          path: ['jobGroup'],
          id: 'jobGroup',
        },
        {
          path: ['jobGroupType'],
          id: 'jobGroupType',
          metadata: ['JobGroupType'],
        },
        {
          path: ['jobLevel'],
          id: 'jobLevel',
        },
        {
          path: ['jobLevelType'],
          id: 'jobLevelType',
          metadata: ['JobLevelType'],
        },
      ],
    },
  },
};

defineMessages({
  title: {
    id: 'budget-request.title',
    defaultMessage: 'Budget Requests',
  },
  titleColon: {
    id: 'budget-request.title-colon',
    defaultMessage: 'Budget Request:',
  },
  detailsTabTitle: {
    id: 'budget-request.details-tab-title',
    defaultMessage: 'Budget request:',
  },
  itemTitle: {
    id: 'budget-request.item-title',
    defaultMessage: 'Budget request',
  },
  detailsTabDistributions: {
    id: 'budget-request.distributions',
    defaultMessage: 'Distributions',
  },
  financialYearColon: {
    id: 'budget-request.financial-year-colon',
    defaultMessage: 'Financial year:',
  },
  selectedScenario: {
    id: 'budget-request.selected-scenario',
    defaultMessage: 'Scenario:',
  },
  requestTypeSpecific: {
    id: 'budget-request.request-type-specific',
    defaultMessage: 'Specific request',
  },
  requestTypeGenerated: {
    id: 'budget-request.request-type-generated',
    defaultMessage: 'Generated request',
  },
  forThisScenario: {
    id: 'budget-request.for-this-scenario',
    defaultMessage: 'For this scenario',
  },
  functionalCenterCode: {
    id: 'budget-request.functional-center-code',
    defaultMessage: 'Functional center:',
  },
  functionalCenterPlaceholder: {
    id: 'budget-request.functional-center-placeholder',
    defaultMessage: 'Select functional center...',
  },
  requestType: {
    id: 'budget-request.request-type',
    defaultMessage: 'Request type:',
  },
  requestNumber: {
    id: 'budget-request.request-number',
    defaultMessage: 'Request number:',
  },
  requestDescription: {
    id: 'budget-request.request-description',
    defaultMessage: 'Description:',
  },
  type: {
    id: 'budget-request.type-colon',
    defaultMessage: 'Type:',
  },
  jobStatusColon: {
    id: 'budget-request.job-status-colon',
    defaultMessage: 'Job status:',
  },
  jobTypeColon: {
    id: 'budget-request.job-type-colon',
    defaultMessage: 'Job type:',
  },
  union: {
    id: 'budget-request.union-colon',
    defaultMessage: 'Union:',
  },
  hourlyRate: {
    id: 'budget-request.hourly-rate-colon',
    defaultMessage: 'Hourly rate:',
  },
  hourlyRateSuggested: {
    id: 'budget-request.hourly-rate-suggested',
    defaultMessage: 'Suggested',
  },
  hourlyRateSpecific: {
    id: 'budget-request.hourly-rate-specific',
    defaultMessage: 'Specific',
  },
  rateOrigin: {
    id: 'budget-request.rate-origin',
    defaultMessage: 'Rate origin:',
  },
  calculateBenefits: {
    id: 'budget-request.calculate-benefits',
    defaultMessage: 'Calculate benefits',
  },
  calculatePayrollDeductions: {
    id: 'budget-request.calculate-payroll-deductions',
    defaultMessage: 'Calculate payroll deductions',
  },
  globalParameterValues: {
    id: 'budget-request.global-parameter-values',
    defaultMessage: 'Global parameter values',
  },
  unionParameterValues: {
    id: 'budget-request.union-parameter-values',
    defaultMessage: 'Union parameters',
  },
  specificParameterValues: {
    id: 'budget-request.specific-parameter-values',
    defaultMessage: 'Specific parameter values',
  },
  percentageTitle: {
    id: 'budget-request.percentage-title',
    defaultMessage: 'Percentage (%)',
  },
  modelTitle: {
    id: 'budget-request.models-block-title',
    defaultMessage: 'Models',
  },
  benefitsVacationPercentage: {
    id: 'budget-request.benefits-vacation-percentage',
    defaultMessage: 'Vacation (%):',
  },
  benefitsVacationModel: {
    id: 'budget-request.benefits-vacation-model',
    defaultMessage: 'Vacation:',
  },
  benefitsHolidaysPercentage: {
    id: 'budget-request.benefits-holidays-percentage',
    defaultMessage: 'Holidays (%):',
  },
  benefitsHolidaysModel: {
    id: 'budget-request.benefits-holidays-model',
    defaultMessage: 'Holidays:',
  },
  benefitsSickDaysPercentage: {
    id: 'budget-request.benefits-sick-days-percentage',
    defaultMessage: 'Sick days (%):',
  },
  benefitsSickDaysModel: {
    id: 'budget-request.benefits-sick-days-model',
    defaultMessage: 'Sick days:',
  },
  benefitsPsychiatricLeavePercentage: {
    id: 'budget-request.benefits-psychiatric-leave-percentage',
    defaultMessage: 'Psych.leave (%):',
  },
  benefitsAdditionalPeriod4: {
    id: 'budget-request.benefits-additional-period-4',
    defaultMessage: 'Additional period 4(%):',
  },
  valueToBeDistributed: {
    id: 'budget-request.value-to-be-distributed',
    defaultMessage: 'Value to be distributed:',
  },
  hours: {
    id: 'budget-request.hours',
    defaultMessage: 'Hours',
  },
  amount: {
    id: 'budget-request.amount',
    defaultMessage: 'Amount',
  },
  group: {
    id: 'budget-request.group',
    defaultMessage: 'Group:',
  },
  hoursToBeDistributed: {
    id: 'budget-request.hours-to-be-distributed',
    defaultMessage: 'Hours to be distributed:',
  },
  hourlyFactor: {
    id: 'budget-request.hourly-factor',
    defaultMessage: 'Hourly factor:',
  },
  calculateFTE: {
    id: 'budget-request.calculate-fte',
    defaultMessage: 'Calculate FTE',
  },
  calculationBase: {
    id: 'budget-request.calculation-base',
    defaultMessage: 'Calculation base:',
  },
  hoursTotal: {
    id: 'budget-request.hours-total',
    defaultMessage: 'Hours total:',
  },
  amountTotal: {
    id: 'budget-request.amount-total',
    defaultMessage: 'Amount total:',
  },
  amountToBeDistributed: {
    id: 'budget-request.amount-to-be-distributed',
    defaultMessage: 'Amount to be distributed:',
  },
  percentageToBeDistributed: {
    id: 'budget-request.percentage-to-be-distributed',
    defaultMessage: 'Percentage:',
  },
  radioButtonDistributionsColon: {
    id: 'budget-request.radio-button-distributions-colon',
    defaultMessage: 'Distributions:',
  },
  radioButtonDistributionModel: {
    id: 'budget-request.radio-button-distribution-model',
    defaultMessage: 'Distribution model',
  },
  radioButtonManuallyEnteredRates: {
    id: 'budget-request.radio-button-manually-entered-rates',
    defaultMessage: 'Manually entered rates',
  },
  radioButtonManuallyEnteredValues: {
    id: 'budget-request.radio-button-manually-entered-values',
    defaultMessage: 'Manually entered values',
  },
  radioButtonBasedOnSourceData: {
    id: 'budget-request.radio-button-based-on-source-data',
    defaultMessage: 'Based on source data',
  },
  radioButtonDistributionPeriod: {
    id: 'budget-request.radio-button-distribution-period',
    defaultMessage: 'Period',
  },
  radioButtonDistributionDay: {
    id: 'budget-request.radio-button-distribution-day',
    defaultMessage: 'Day',
  },
  distributionsModel: {
    id: 'budget-request.distributions-model',
    defaultMessage: 'Model:',
  },
  distributionsYears: {
    id: 'budget-request.distributions-years',
    defaultMessage: 'Distributions {years}',
  },
  deletingConfirmation: {
    id: 'budget-request.delete-confirmation',
    defaultMessage: 'Are you sure that you want to delete Budget Request: {budgetRequestTitle}?',
  },
  deletedAlert: {
    id: 'budget-request.deleted-alert',
    defaultMessage: 'Budget Request: {budgetRequestTitle} has been deleted.',
  },
  descriptionPlaceholder: {
    id: 'budget-request.description-placeholder',
    defaultMessage: 'Type description here...',
  },
});
