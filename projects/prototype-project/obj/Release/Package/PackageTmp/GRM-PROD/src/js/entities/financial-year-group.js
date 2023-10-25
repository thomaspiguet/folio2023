import { booleanSchema, numberSchema, stringSchema } from './base';

export const financialYearGroupSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    description: stringSchema,
    isValueFixed: booleanSchema,
    valueType: stringSchema,
    fixedValueInPercentages: numberSchema,
    fixedAmountValue: numberSchema,
  },
};
