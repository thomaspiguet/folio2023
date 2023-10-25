import { forEach, get, set } from 'lodash';
import {
  booleanFalseSchema,
  booleanSchema,
  dateSchema,
  numberSchema,
  stringSchema,
  undefinedNumberSchema,
} from './base';

import { codeDescriptionSchema } from './code-description';
import { idCodeDescriptionSchema } from './id-code-description';
import { normalizeToSave } from '../utils/selectors/normalize-to-save';
import { suggestedHourlyRateSchema } from './suggested-hourly-rate';
import { isZeroId } from '../utils/utils';
import { jobTitleSchema } from './job-title';

export const DISTRIBUTION_TYPE_MODEL = 'DistributionModel';
export const DISTRIBUTION_TYPE_MANUALLY_ENTERED_RATES = 'ManuallyEnteredRates';
export const DISTRIBUTION_TYPE_MANUALLY_ENTERED_VALUES = 'ManuallyEnteredValues';
export const DISTRIBUTION_TYPE_BASED_ON_SOURCE_DATA = 'BasedOnSourceData';
export const DISTRIBUTION_TYPE_PERIOD = 'Period';
export const DISTRIBUTION_TYPE_DAY = 'Day';

export const ADJUSTMENT_DISTRIBUTION_TYPE_MODEL = 'DistributionModel';
export const ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED = 'RatesEntered';
export const ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR = 'RateBasedOnPreviousYear';
export const ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT = 'BasedOnOtherAccount';
export const ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD = 'DividedByNumberOfDaysInPeriod';
export const ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED = 'AmountsEntered';
export const ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE = 'RateBasedOnPreviousYearMinusOne';

export const DISTRIBUTION_EXPENSE_TYPE_MODEL = 'DistributionModel';
export const DISTRIBUTION_EXPENSE_TYPE_SPECIFIC = 'SpecificValue';
export const DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP = 'HolidayGroup';
export const DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE = 'NotApplicable';

export const DISTRIBUTION_EXPENSE_CODE_HOLIDAY = 'Holiday';
export const DISTRIBUTION_EXPENSE_CODE_VACATION = 'Vacation';
export const DISTRIBUTION_EXPENSE_CODE_SICK_DAY = 'Sick';
export const DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE = 'PsychiatricLeave';
export const DISTRIBUTION_EXPENSE_CODE_GLOBAL_PAYROLL_DEDUCTION = 'GlobalPayrollTaxes';
export const DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE = 'SalaryInsurance';
export const DISTRIBUTION_EXPENSE_CODE_PAT_MAT = 'PaternityMaternityLeave';
export const DISTRIBUTION_EXPENSE_CODE_OVERTIME = 'Overtime';
export const DISTRIBUTION_EXPENSE_CODE_INDEPENDENT_LABOUR = 'IndependentLabour';

export const DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY = 'Day';
export const DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS = 'Hours';
export const DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES = 'Percentages';

export const distributionSchema = {
  type: 'object',
  required: true,
  properties: {
    period: numberSchema,
    rate: numberSchema,
    amount: numberSchema,
  },
};

export const distributionTemplateSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    name: stringSchema,
    number: stringSchema,
  },
};

export const distributionsSchema = {
  type: 'object',
  default: {},
  required: true,
  properties: {
    periods: {
      type: 'array',
      default: [],
      required: true,
      items: distributionSchema,
    },
    totalRate: numberSchema,
    totalAmount: numberSchema,
  },
};

export const expenseSchema = {
  ...codeDescriptionSchema,
  properties: {
    ...codeDescriptionSchema.properties,
  },
};

export const distributionExpenseSchema = {
  type: 'object',
  default: {},
  required: true,
  properties: {
    id: undefinedNumberSchema,
    expense: expenseSchema,
    nature: codeDescriptionSchema,
    hourlyFactor: undefinedNumberSchema,
    deductFromRegularHour: booleanSchema,
    calculationBenefit: booleanSchema,
    calculationPayroll: booleanSchema,
    holidayGroup: idCodeDescriptionSchema,
    distributionModel: codeDescriptionSchema,
    distributionType: stringSchema,
    distributionTypeDescription: stringSchema,
    distributionTemplate: distributionTemplateSchema,
    longTermLeave: idCodeDescriptionSchema,
    distributions: distributionsSchema,
    suggestedHourlyRate: suggestedHourlyRateSchema,
    valueToBeDistributed: stringSchema,
    totalToBeDistributed: undefinedNumberSchema,
  },
};

export const targetDistributionExpensesSchema = {
  type: 'object',
  default: {},
  required: true,
  properties: {
    id: undefinedNumberSchema,
    code: stringSchema,
    longDescription: stringSchema,
  },
};

export const requiredAttendanceReferencesSchema = {
  type: 'object',
  default: {},
  required: true,
  properties: {
    description: stringSchema,
    endDate: dateSchema,
    functionalCenter: codeDescriptionSchema,
    jobTitle: jobTitleSchema,
    jobTitleGroup: codeDescriptionSchema,
    reference: stringSchema,
    requiredAttendanceId: undefinedNumberSchema,
    startDate: dateSchema,
    type: stringSchema,
  },
};

export const distributionExpenseCopySchema = {
  type: 'object',
  default: {},
  required: true,
  properties: {
    id: undefinedNumberSchema,
    targetFunctionalCenter: {
      type: 'array',
      items: codeDescriptionSchema,
    },
    targetDistributionExpenses: {
      type: 'array',
      default: [],
      required: true,
      items: targetDistributionExpensesSchema,
    },
    sourceIds: {
      type: 'array',
      default: [],
      required: true,
      items: requiredAttendanceReferencesSchema,
    },
    isIncludeAttachment: booleanFalseSchema,
  },
};


export function isEditableDistributionRatesCell(entry, row, id, index) {
  const totalLineIndex = get(entry, 'distributions.periods.length');
  const lastPeriodLineIndex = totalLineIndex - 1;

  return get(entry, 'distributionType') === DISTRIBUTION_TYPE_MANUALLY_ENTERED_RATES && index !== totalLineIndex && index !== lastPeriodLineIndex;
}

export function isEditableDistributionAmountsCell(entry, row, it, index) {
  const totalLineIndex = get(entry, 'distributions.periods.length');
  const lastPeriodLineIndex = totalLineIndex - 1;

  return get(entry, 'distributionType') === DISTRIBUTION_TYPE_MANUALLY_ENTERED_VALUES && index !== totalLineIndex && index !== lastPeriodLineIndex;
}

export function isEditableAdjustmentDistributionRatesCell(entry, row, id, index) {
  const totalLineIndex = get(entry, 'distribution.periods.length');
  const lastPeriodLineIndex = totalLineIndex - 1;

  return get(entry, 'distribution.method') === ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED && index !== totalLineIndex && index !== lastPeriodLineIndex;
}

export function isEditableAdjustmentDistributionAmountsCell(entry, row, it, index) {
  const totalLineIndex = get(entry, 'distribution.periods.length');
  const lastPeriodLineIndex = totalLineIndex - 1;

  return get(entry, 'distribution.method') === ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED && index !== totalLineIndex && index !== lastPeriodLineIndex;
}

export function isManualAdjustmentDistribution(method) {
  return method === ADJUSTMENT_DISTRIBUTION_TYPE_RATES_ENTERED
    || method === ADJUSTMENT_DISTRIBUTION_TYPE_AMOUNTS_ENTERED
    || method === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR
    || method === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE;
}

export function buildDistributionTypeItems(isBenefitPercentage, codeDescription) {
  const result = [];
  if (codeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY) {
    if (isBenefitPercentage) {
      result.push(DISTRIBUTION_EXPENSE_TYPE_MODEL);
      result.push(DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
    } else {
      result.push(DISTRIBUTION_EXPENSE_TYPE_MODEL);
      result.push(DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP);
      result.push(DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
    }
  } else if (codeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_GLOBAL_PAYROLL_DEDUCTION
  ) {
    result.push(DISTRIBUTION_EXPENSE_TYPE_MODEL);
    result.push(DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
  } else {
    result.push(DISTRIBUTION_EXPENSE_TYPE_MODEL);
    result.push(DISTRIBUTION_EXPENSE_TYPE_SPECIFIC);
    result.push(DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE);
  }
  return result;
}

export function isDistributionTypeSpecific(distributionType) {
  return distributionType === DISTRIBUTION_EXPENSE_TYPE_SPECIFIC;
}

export function isDistributionTypeModel(distributionType) {
  return distributionType === DISTRIBUTION_EXPENSE_TYPE_MODEL;
}

export function isHolidayGroupEditable(distributionType) {
  return distributionType === DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP;
}

export function isLongTermLeaveEditable(expenseCodeDescription) {
  return expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_SALARY_INSURANCE
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_PAT_MAT;
}

export function isTotalToBeDistributedEditable(distributionType) {
  return distributionType !== DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE;
}

export function isTotalToBeDistributedDisabled(expenseCodeDescription, distributionType) {
  return distributionType === DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_GLOBAL_PAYROLL_DEDUCTION
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE;
}

export function isHourlyFactorEditable(distributionType) {
  return distributionType !== DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE;
}

export function isNatureEditable(distributionType) {
  return distributionType !== DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE;
}

export function isExpenseEditable(id) {
  return isZeroId(id);
}

export function expenseIsIndependentLabour(codeDescription) {
  return codeDescription === DISTRIBUTION_EXPENSE_CODE_INDEPENDENT_LABOUR;
}

export function expenseIsGlobalPayrollDeduction(codeDescription) {
  return codeDescription === DISTRIBUTION_EXPENSE_CODE_GLOBAL_PAYROLL_DEDUCTION;
}

export function expenseIsOvertimeOrIndependentLabour(codeDescription) {
  return codeDescription === DISTRIBUTION_EXPENSE_CODE_OVERTIME
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_INDEPENDENT_LABOUR;
}

export function expenseIsVacationOrHolidayOrSickDayOrPsychLeave(codeDescription) {
  return codeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE;
}

export function expenseIsVacationOrHolidayOrSickDayOrIndependentLabour(codeDescription) {
  return codeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_INDEPENDENT_LABOUR;
}

export function buildValueToBeDistributedItems(codeDescription) {
  const result = [];
  if (codeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY
    || codeDescription === DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE
  ) {
    result.push(DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY);
    result.push(DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES);
  } else if (codeDescription === DISTRIBUTION_EXPENSE_CODE_GLOBAL_PAYROLL_DEDUCTION) {
    result.push(DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES);
  } else {
    result.push(DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY);
    result.push(DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS);
  }
  return result;
}

export function distributionExpenseConvertToSave(entry) {
  const normalizedEntry = normalizeToSave(entry, distributionExpenseSchema);
  if (!isLongTermLeaveEditable(get(normalizedEntry, 'expense.codeDescription'))) {
    set(normalizedEntry, 'longTermLeave', undefined);
  }
  return normalizedEntry;
}

export function buildExpenseDescription(intl, { isBenefitPercentage, valueToBeDistributed, expenseCodeDescription, expenseLongDescription }) {
  if (isBenefitPercentage
    && (expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
      || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
      || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY)
    && valueToBeDistributed === DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY) {
    return `${ expenseLongDescription } (${ intl.formatMessage({ id: 'distribution-expense.absence-for' }) })`;
  }
  return expenseLongDescription;
}

export function isValueToBeDistributedEditable(isBenefitPercentage, expenseCodeDescription) {
  return !(expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_PSYCHIATRIC_LEAVE
    || (!isBenefitPercentage
    && (expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY)));
}

export function setDistributionTemplate(newEntry, distributionTemplate) {
  newEntry.distributionTemplate = distributionTemplate || {};
  const newPeriods = [];
  forEach(newEntry.distributions.periods, (period, index) => {
    newPeriods.push(
      {
        ...period,
        rate: newEntry.distributionTemplate.distribution ? get(newEntry.distributionTemplate.distribution, `period${ index + 1 }`) : 0,
      });
  });
  newEntry.distributions.periods = newPeriods;
}

export function resetDistributions(distributions) {
  const newPeriods = [];

  forEach(distributions.periods, (period) => {
    newPeriods.push({
      ...period,
      amount: 0,
      rate: 0,
    });
  });

  distributions.periods = newPeriods;
  distributions.totalAmount = 0;
  distributions.totalRate = 0;
}

export function getTotalToBeDistributedLabel(valueToBeDistributed) {
  if (valueToBeDistributed === DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES) {
    return 'distribution-expense.percentages-to-be-distributed';
  }

  return 'distribution-expense.total-to-be-distributed';
}

export function isCalculationCheckboxEditable(expenseCodeDescription) {
  return !(expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_VACATION
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_HOLIDAY
    || expenseCodeDescription === DISTRIBUTION_EXPENSE_CODE_SICK_DAY);
}

export function isDistributionAmountEditable(entry, row, id, index) {
  const totalLineIndex = get(entry, 'distributions.periods.length');
  const lastPeriodLineIndex = totalLineIndex - 1;

  return get(entry, 'distributionType') === DISTRIBUTION_EXPENSE_TYPE_SPECIFIC && index !== totalLineIndex && index !== lastPeriodLineIndex;
}

export function buildDistributionExpenseRecalculationModel(financialYearId, entry, context = {}) {
  const {
    distributions,
    distributionType,
    expense,
    totalToBeDistributed,
    distributionTemplate,
  } = { ...entry, ...context };

  return {
    financialYearId,
    distributions,
    distributionType,
    expense,
    totalToBeDistributed,
    distributionTemplate,
  };
}
