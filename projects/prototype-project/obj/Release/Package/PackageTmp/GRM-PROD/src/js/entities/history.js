import { get, some } from 'lodash';
import { dateSchema, numberSchema, stringSchema } from './base';
import { isEmptyObject } from '../utils/utils';

export const processingTypes = [
  {
    id: 'Creation',
    fields: {
      description: true,
      totalAmount: true,
    },
    canBeDeleted: false,
  },
  {
    id: 'Adjustment',
    fields: {
      adjustedAmount: true,
      description: true,
      totalAmount: false,
    },
    canBeDeleted: true,
  },
  {
    id: 'Correction',
    fields: {
      description: true,
      totalAmount: true,
    },
    canBeDeleted: true,
  },
  {
    id: 'Modification',
    fields: {
      adjustedAmount: false,
      description: false,
      totalAmount: false,
    },
    canBeDeleted: true,
  },
  {
    id: 'Indexation',
    fields: {
      adjustedAmount: false,
      description: true,
      rateAmount: true,
      totalAmount: false,
    },
    canBeDeleted: true,
  },
  {
    id: 'BatchIndexation',
    fields: {
      adjustedAmount: false,
      description: true,
      rateAmount: true,
      totalAmount: false,
    },
    canBeDeleted: true,
  },
  {
    id: 'Import',
    fields: {
      adjustedAmount: false,
      description: false,
      totalAmount: false,
    },
    canBeDeleted: false,
  },
  {
    id: 'BudgetEqualsActual',
    fields: {
      adjustedAmount: false,
      description: false,
      totalAmount: false,
    },
    canBeDeleted: false,
  },
];

function valueIsEditable(processingType, columnId) {
  return processingTypes.some((pt) => {
    if (pt.id === processingType) {
      return pt.fields && pt.fields[columnId];
    }

    return false;
  });
}

export function canRemoveHistory(history) {
  return !some(processingTypes, (type) => type.id === history.processingType && !type.canBeDeleted);
}

export function isEditableHistoryCell(entry, row, columnId) {
  return isEmptyObject(get(entry, 'financialYearGroup')) && valueIsEditable(row.processingType, columnId);
}

export const historyItemSchema = {
  type: 'object',
  required: false,
  properties: {
    date: dateSchema,
    processingType: stringSchema,
    description: stringSchema,
    rateAmount: numberSchema,
    adjustedAmount: numberSchema,
    totalAmount: numberSchema,
  },
};

export const historySchema = {
  type: 'array',
  required: false,
  items: historyItemSchema,
};

export const historySummaryLineSchema = {
  type: 'object',
  required: false,
  properties: {
    description: stringSchema,
  },
};

export const createdHistorySummaryLineSchema = {
  type: 'object',
  required: false,
  default: null,
};

export const createdHistorySchema = {
  type: 'array',
  required: false,
  default: [],
};
