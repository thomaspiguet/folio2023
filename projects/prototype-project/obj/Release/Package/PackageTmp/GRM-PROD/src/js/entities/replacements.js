import { numberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';

export const replacementSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    percentage: numberSchema,
    hours: numberSchema,
    expenseType: codeDescriptionSchema,
    journal: stringSchema,
  },
};

export const replacementsSchema = {
  type: 'array',
  items: replacementSchema,
};
