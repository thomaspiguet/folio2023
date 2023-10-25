import { undefinedNumberSchema, stringSchema } from './base';

export const codeDescriptionSchema = {
  type: 'object',
  required: true,
  properties: {
    shortDescription: stringSchema,
    longDescription: stringSchema,
    code: stringSchema,
    id: undefinedNumberSchema,
    codeDescription: stringSchema,
  },
};

export const codeDescriptionAttributeSchema = {
  type: 'object',
  required: true,
  properties: {
    shortDescription: stringSchema,
    longDescription: stringSchema,
    code: stringSchema,
    attributeCode: stringSchema,
    id: undefinedNumberSchema,
    codeDescription: stringSchema,
  },
};
