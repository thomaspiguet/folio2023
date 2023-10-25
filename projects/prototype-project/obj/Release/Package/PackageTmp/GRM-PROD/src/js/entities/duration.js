import { booleanSchema, dateSchema } from './base';

export const durationSchema = {
  type: 'object',
  required: true,
  properties: {
    'isFinancialYear': booleanSchema,
    'startDate': dateSchema,
    'endDate': dateSchema,
  },
};
