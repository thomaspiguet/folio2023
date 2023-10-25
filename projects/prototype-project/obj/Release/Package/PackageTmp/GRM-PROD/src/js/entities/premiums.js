import { booleanSchema, dateSchema, undefinedNumberSchema, stringSchema } from './base';

export const premiumSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};

export const premiumsSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    start: dateSchema,
    end: dateSchema,
    premium: premiumSchema,
    isInconvenient: booleanSchema,
    journal: stringSchema,
  },
};

