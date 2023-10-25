import { undefinedNumberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';

export const queryPeriodSchema = {
  type: 'object',
  required: true,
  properties: {
    period: undefinedNumberSchema,
    amount: undefinedNumberSchema,
    hour: undefinedNumberSchema,
  },
};

export const queryExpenseSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    description: stringSchema,
    totalAmount: undefinedNumberSchema,
    totalHour: undefinedNumberSchema,
    originDistribution: codeDescriptionSchema,
    originValue: codeDescriptionSchema,
    periods: {
      type: 'array',
      required: true,
      items: queryPeriodSchema,
    },
  },
};

export const queryExpensesSchema = {
  type: 'object',
  required: true,
  properties: {
    totalAmount: undefinedNumberSchema,
    totalHour: undefinedNumberSchema,
    expenses: {
      type: 'array',
      required: true,
      items: queryExpenseSchema,
    },
  },
};

export const requiredAttendanceQuerySchema = {
  type: 'object',
  required: true,
  properties: {
    generalBenefits: queryExpensesSchema,
    hourlyRate: queryExpensesSchema,
    leaves: queryExpensesSchema,
    otherInformation: queryExpensesSchema,
    payrollDeductions: queryExpensesSchema,
    premiums: queryExpensesSchema,
    replacements: queryExpenseSchema,
    specialBenefits: queryExpensesSchema,
    summary: queryExpensesSchema,
    worked: queryExpensesSchema,
  },
};
