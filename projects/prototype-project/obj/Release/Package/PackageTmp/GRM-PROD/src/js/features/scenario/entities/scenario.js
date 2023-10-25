import {
  booleanFalseSchema,
  booleanTrueSchema,
  numberSchema,
  stringSchema,
  stringEmptySchema,
} from '../../../entities/base';
import { normalizeToSave } from '../../../utils/selectors/normalize-to-save';

export const scenarioSchema = {
  type: 'object',
  required: true,
  properties: {
    organization: stringSchema,
    organizationId: numberSchema,
    scenarioCode: stringSchema,
    scenarioDescription: stringSchema,
    scenarioId: numberSchema,
    year: numberSchema,
    yearId: numberSchema,
    status: stringSchema,
    approvedBy: stringSchema,
    approvalDate: stringSchema,
    isImplementation: booleanFalseSchema,
    haveJobTitleIndexationRates: booleanFalseSchema,
  },
};

export const financialYearSchema = {
  type: 'object',
  required: true,
  properties: {
    id: numberSchema,
    value: numberSchema,
  },
};

export const scenarioCopySchema = {
  type: 'object',
  required: true,
  properties: {
    'id': numberSchema,
    'organization': stringSchema,
    'financialYear': numberSchema,
    'scenario': scenarioSchema,
    'createSecondaryScenarios': booleanFalseSchema,

    'isIncludeBudgetsForOtherExpenses': booleanTrueSchema,
    'isImplementationScenario': booleanFalseSchema,
    'isIncludeImports': booleanTrueSchema,
    'isIncludeSalarySaleIndexationRates': booleanFalseSchema,

    'isIncludePositionsForThisScenario': booleanFalseSchema,
    'isIncludePositionsByJobTitleForThisScenario': booleanFalseSchema,
    'isIncludeRequiredAttendanceForThisScenario': booleanFalseSchema,
    'isIncludeRequestsForThisScenario': booleanFalseSchema,
    'isIncludeInactivePositions': booleanTrueSchema,
    'isCopyJobTitleIndexationRates': booleanFalseSchema,
    'isCopyAttachedDocuments': booleanTrueSchema,

    'targetFinancialYear': financialYearSchema,
    'allFinancialYears': {
      type: 'array',
      items: numberSchema,
      default: [],
      required: true,
    },
    'targetScenarioName': stringEmptySchema,
    'targetScenarioDescription': stringEmptySchema,
    'targetAttachDocuments': booleanTrueSchema,
    'targetAttachNotes': booleanFalseSchema,
  },
};

export function convertCopyToSave(entry) {
  const newEntry = normalizeToSave(entry, scenarioCopySchema);
  return newEntry;
}
