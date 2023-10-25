import { undefinedNumberSchema, stringSchema } from './base';

export const idCodeDescriptionSchema = {
  type: 'object',
  required: true,
  properties: {
    id: undefinedNumberSchema,
    code: stringSchema,
    description: stringSchema,
  },
};
