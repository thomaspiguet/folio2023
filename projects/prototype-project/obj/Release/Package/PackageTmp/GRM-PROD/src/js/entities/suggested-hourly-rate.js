import { booleanSchema, numberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';

export const suggestedHourlyRateSchema = {
  type: 'object',
  required: true,
  properties: {
    'suggestedHourlyRate': numberSchema,
    'specificHourlyRate': numberSchema,
    'rateOriginType': stringSchema,
    'rateOriginDescription': stringSchema,
    'rateOriginFunctionalCenter': codeDescriptionSchema,
    'isSuggestedHourlyRate': booleanSchema,
    'jobGroup': stringSchema,
    'jobGroupType': stringSchema,
    'jobLevel': stringSchema,
    'jobLevelType': stringSchema,
  },
};
export const JOB_TITLE_TYPE_CODE = '0';
export const JOB_TITLE_GROUP_TYPE_CODE = '1';

export function isJobTitleType(type) {
  return type && type.code === JOB_TITLE_TYPE_CODE;
}

export function isJobGroupTitleType(type) {
  return type && type.code === JOB_TITLE_GROUP_TYPE_CODE;
}
