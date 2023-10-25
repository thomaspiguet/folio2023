import { numberSchema, stringSchema } from './base';

export const calculationBaseSchema = {
  type: 'object',
  required: true,
  properties: {
    code: stringSchema,
    id: numberSchema,
    longDescription: stringSchema,
    shortDescription: stringSchema,
  },
};
