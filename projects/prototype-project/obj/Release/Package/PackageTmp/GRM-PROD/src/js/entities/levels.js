import { numberSchema, booleanSchema, stringSchema } from './base';
import { suggestedHourlyRateSchema } from './suggested-hourly-rate';

export const hoursPerDaySchema = {
  type: 'object',
  properties: {
    id: numberSchema,
    value: stringSchema,
  },
};

export const levelsSchema = {
  type: 'object',
  required: true,
  properties: {
    fullTimeEquivalent: numberSchema,
    hoursPerDaySelected: hoursPerDaySchema,
    isSuggestedHourlyRate: booleanSchema,
    suggestedHourlyRate: suggestedHourlyRateSchema,
    specificHoursPerDay: numberSchema,
    totalHours: numberSchema,
  },
};
