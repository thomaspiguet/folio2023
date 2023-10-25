import { isUndefined, merge } from 'lodash';

import { normalizeToSave } from '../utils/selectors/normalize-to-save';
import { booleanSchema, numberSchema, stringSchema, undefinedNumberSchema } from './base';
import {
  historySchema,
  historySummaryLineSchema,
} from './history';
import { generalLedgerAccountSchema } from './payroll-deduction';
import { calculationBaseSchema } from './calculation-base';
import { distributionSchema, distributionsSchema, distributionTemplateSchema } from './distribution';
import { financialYearGroupSchema } from './financial-year-group';
import { isEmptyObject } from '../utils/utils';

export const OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT = 'Adjustment';
export const OTHER_EXPENSES_HISTORY_TYPE_CORRECTION = 'Correction';
export const OTHER_EXPENSES_HISTORY_TYPE_INDEXATION = 'Indexation';

export const OTHER_EXPENSES_OPTIONS_BUDGET = 'Budget';
export const OTHER_EXPENSES_OPTIONS_ACTUAL = 'Actual';

export function isHistoryAdjustment(type) {
  return type === OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT;
}

export function isHistoryIndexation(type) {
  return type === OTHER_EXPENSES_HISTORY_TYPE_INDEXATION;
}

export function isHistoryCorrection(type) {
  return type === OTHER_EXPENSES_HISTORY_TYPE_CORRECTION;
}

export const otherExpensesSchema = {
  type: 'object',
  required: true,
  properties: {
    amountToBeDistributed: numberSchema,
    calculationBase: calculationBaseSchema,
    distributionType: stringSchema,
    distributionTemplate: distributionTemplateSchema,
    distributions: distributionsSchema,
    generalLedgerAccount: generalLedgerAccountSchema,
    financialYearGroup: financialYearGroupSchema,
    history: historySchema,
    historySummaryLine1: historySummaryLineSchema,
    historySummaryLine2: historySummaryLineSchema,
    historySummaryLine3: historySummaryLineSchema,
    id: numberSchema,
    journal: stringSchema,
    totalAmount: numberSchema,
  },
};

export const otherExpensesCreatedSchema = {
  type: 'object',
  required: true,
  properties: {
    amountToBeDistributed: numberSchema,
    calculationBase: calculationBaseSchema,
    distributionType: stringSchema,
    distributionTemplate: distributionTemplateSchema,
    distributions: distributionsSchema,
    generalLedgerAccount: generalLedgerAccountSchema,
    financialYearGroup: financialYearGroupSchema,
    id: numberSchema,
    totalAmount: numberSchema,
  },
};

export const indexationPeriodSchema = {
  type: 'object',
  required: true,
  properties: {
    start: stringSchema,
    end: stringSchema,
  },
};

export const otherExpensesIndexationSchema = {
  type: 'object',
  required: true,
  properties: {
    origin: stringSchema,
    originDescription: stringSchema,
    rate: undefinedNumberSchema,
    period: indexationPeriodSchema,
  },
};

export const distributionOtherAccountSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    accountNumber: stringSchema,
    description: stringSchema,
    isFinancial: booleanSchema,
  },
};

export const defaultBudgetActualOptions = [
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
  'Budget',
];

export const defaultPeriods = [
  {
    budgetActualOption: defaultBudgetActualOptions[0],
    period: 1,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[1],
    period: 2,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[2],
    period: 3,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[3],
    period: 4,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[4],
    period: 5,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[5],
    period: 6,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[6],
    period: 7,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[7],
    period: 8,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[8],
    period: 9,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[9],
    period: 10,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[10],
    period: 11,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[11],
    period: 12,
  },
  {
    budgetActualOption: defaultBudgetActualOptions[12],
    period: 13,
  },
];

export const defaultPreviousYearOptions = [
  { title: 'Account', value: 'GeneralLedgerAccount' },
  { title: 'Secondary code', value: 'SecondaryCode' },
];

export const previousYearSchema = {
  type: 'object',
  properties: {
    title: stringSchema,
    value: stringSchema,
  },
};

export const otherExpensesDistributionSchema = {
  type: 'object',
  required: true,
  properties: {
    periods: {
      type: 'array',
      default: defaultPeriods,
      required: true,
      items: distributionSchema,
    },
    budgetActualOptions: {
      type: 'array',
      default: defaultBudgetActualOptions,
      required: true,
      items: stringSchema,
    },
    budgetActualHeaderOption: {
      type: 'string',
      required: true,
      default: OTHER_EXPENSES_OPTIONS_BUDGET,
    },
    method: stringSchema,
    methodDescription: stringSchema,
    model: distributionTemplateSchema,
    previousYear: numberSchema,
    previousYearOptions: {
      type: 'array',
      default: defaultPreviousYearOptions,
      required: true,
      items: previousYearSchema,
    },
    previousYearDescription: stringSchema,
    otherAccount: distributionOtherAccountSchema,
  },
};


export function convertToSave(entry) {
  return normalizeToSave(entry, otherExpensesSchema);
}

export function convertCreatedEntryToSave(entry) {
  return normalizeToSave(entry, otherExpensesCreatedSchema);
}

export function buildAdjustmentModel(entry, revenueOtherExpenseId, totalAmountP, selectedModel, totalBefore, selectedAccount) {
  const {
    id,
    type,
    distribution,
    distribution: {
      periods,
      budgetActualOptions,
      previousYear: previousYearIndex,
      previousYearOptions,
    },
    description,
    totalAmount: totalAmountE,
  } = entry;
  const model = selectedModel || (isEmptyObject(distribution.model) ? null : distribution.model);
  const otherAccount = selectedAccount || (isEmptyObject(distribution.otherAccount) ? null : distribution.otherAccount);
  const totalAmount = isUndefined(totalAmountP) ? totalAmountE : totalAmountP;
  let adjustedAmount = entry.adjustedAmount;
  let previousYear = previousYearOptions[previousYearIndex];
  if (isHistoryCorrection(type)) {
    adjustedAmount = totalAmount - totalBefore;
  }
  periods.forEach((period, idx) => {
    period.budgetActualOption = budgetActualOptions[idx];
  });
  previousYear = previousYearOptions[previousYearIndex].value;
  const data = {
    revenueOtherExpenseId,
    type,
    distribution: {
      ...distribution,
      model,
      previousYear,
      otherAccount,
    },
    id,
    description,
    adjustedAmount,
    totalAmount,
  };
  return data;
}

export function buildIndexationModel(entry, revenueOtherExpenseId, indexation) {
  const {
    description,
    id,
    indexation: { rate, period: { start, end }, origin, originDescription },
    totalAmount,
    type,
  } = entry;

  const data = merge({
    description,
    id,
    indexation: {
      rate,
      origin,
      originDescription,
      period: {
        start,
        end,
      },
    },
    revenueOtherExpenseId,
    totalAmount,
    totalRate: rate,
    type,
  }, { indexation });
  return data;
}

