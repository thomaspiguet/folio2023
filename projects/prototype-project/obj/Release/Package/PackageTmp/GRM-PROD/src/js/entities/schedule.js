import { numberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';

export const workloadHoursSchema = {
  type: 'object',
  properties: {
    'workLoad': numberSchema,
    'hours': numberSchema,
  },
};

export const scheduleSchema = {
  type: 'object',
  properties: {
    'id': 0,
    'week': {
      type: 'object',
      properties: {
        'Friday': workloadHoursSchema,
        'Monday': workloadHoursSchema,
        'Saturday': workloadHoursSchema,
        'Sunday': workloadHoursSchema,
        'Thursday': workloadHoursSchema,
        'Tuesday': workloadHoursSchema,
        'Wednesday': workloadHoursSchema,
      },
    },
    'shift': codeDescriptionSchema,
    'otherLeave1': numberSchema,
    'otherLeave2': numberSchema,
    'otherLeave3': numberSchema,
    'journal': stringSchema,
  },
};

export const schedulesSchema = {
  type: 'array',
  items: scheduleSchema,
};
