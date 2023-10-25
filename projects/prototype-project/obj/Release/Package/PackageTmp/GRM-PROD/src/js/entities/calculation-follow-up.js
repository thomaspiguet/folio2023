import { numberSchema, stringSchema, dateSchema, booleanTrueSchema } from './base';
import { codeDescriptionAttributeSchema } from './code-description';

export const calculationFollowUpDetailsSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    date: dateSchema,
    result: stringSchema,
    resultDescription: stringSchema,
    type: stringSchema,
    typeDescription: stringSchema,

    departments: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    functionalCenters: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    primaryCodeGroups: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    programs: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    responsCentersLevel1: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    responsCentersLevel2: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    responsCentersLevel3: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    sites: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    subDepartments: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
    subPrograms: {
      type: 'object',
      required: true,
      properties: {
        all: booleanTrueSchema,
        items: {
          type: 'array',
          default: [],
          required: true,
          items: codeDescriptionAttributeSchema,
        },
      },
    },
  },
};
