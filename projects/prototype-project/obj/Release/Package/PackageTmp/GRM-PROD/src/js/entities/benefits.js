import { booleanSchema, undefinedBooleanSchema, numberSchema, undefinedNumberSchema, stringSchema } from './base';

export const benefitsSchema = {
  type: 'object',
  required: true,
  properties: {
    showPercentage: booleanSchema,
    isFinancialYearParameters: booleanSchema,

    qtyVacation: undefinedNumberSchema,
    qtyVacationFromParameter: numberSchema,
    qtyHoliday: undefinedNumberSchema,
    qtyHolidayFromParameter: numberSchema,
    qtySickDay: undefinedNumberSchema,
    qtySickDayFromParameter: numberSchema,
    qtyPsychiatricLeave: undefinedNumberSchema,
    qtyPsychiatricLeaveFromParameter: numberSchema,
    qtyNightShift: undefinedNumberSchema,
    qtyNightShiftFromParameter: numberSchema,
    pctVacationFromParameter: numberSchema,
    pctVacation: numberSchema,
    pctHolidayFromParameter: numberSchema,
    pctHoliday: numberSchema,
    pctSickDayFromParameter: numberSchema,
    pctSickDay: numberSchema,
    pctPsychiatricLeaveFromParameter: numberSchema,
    pctPsychiatricLeave: numberSchema,
    pctNightShiftFromParameter: numberSchema,
    pctNightShift: numberSchema,
  },
};

export const modelItemSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    name: stringSchema,
    number: stringSchema,
  },
};

export const modelsSchema = {
  type: 'object',
  required: true,
  properties: {
    vacation: modelItemSchema,
    holidays: modelItemSchema,
    sickDays: modelItemSchema,
  },
};

export const percentagesSchema = {
  type: 'object',
  required: true,
  properties: {
    additionalPeriod4: stringSchema,
    isFinancialYearParameters: undefinedBooleanSchema,
    pctHoliday: stringSchema,
    pctPsychiatricLeave: stringSchema,
    pctSickDay: stringSchema,
    pctVacation: stringSchema,
  },
};

export const benefitsBudgetRequestSchema = {
  type: 'object',
  required: true,
  properties: {
    models: modelsSchema,
    origin: stringSchema,
    percenteges: percentagesSchema,
  },
};

