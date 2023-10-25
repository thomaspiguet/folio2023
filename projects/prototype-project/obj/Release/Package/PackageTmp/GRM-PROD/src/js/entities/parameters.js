import { numberSchema, stringSchema } from './base';

export const nameNumberSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    name: stringSchema,
    number: stringSchema,
  },
};
export const othersRegularSchema = {
  type: 'object',
  required: true,
  properties: {
    hours: nameNumberSchema,
    amounts: nameNumberSchema,
  },
};
export const parameterSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    name: stringSchema,
    number: stringSchema,
  },
};
export const distributionSchema = {
  type: 'object',
  required: true,
  properties: {
    psychLeave: parameterSchema,
    vacation: parameterSchema,
    holidays: parameterSchema,
    sickDays: parameterSchema,
  },
};
export const modelSchema = {
  type: 'object',
  required: true,
  properties: {
    fullTimeDistribution: distributionSchema,
    partTimeDistribution: distributionSchema,
    fullTimeFinalDistribution: distributionSchema,
    partTimeFinalDistribution: distributionSchema,
  },
};
