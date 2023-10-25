import { stringSchema, undefinedNumberSchema } from './base';

export const jobTitleSchema = {
  type: 'object',
  required: true,
  properties: {
    description: stringSchema,
    id: undefinedNumberSchema,
    notaryEmploymentCode: stringSchema,
  },
};
