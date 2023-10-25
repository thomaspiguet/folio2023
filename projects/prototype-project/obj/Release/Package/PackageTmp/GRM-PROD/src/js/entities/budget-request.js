import { set } from 'lodash';

import { booleanSchema, numberSchema, undefinedNumberSchema, stringSchema } from './base';
import { codeDescriptionSchema, codeDescriptionAttributeSchema } from './code-description';
import { benefitsBudgetRequestSchema } from './benefits';
import { jobTitleSchema } from './job-title';
import { financialYearGroupSchema } from './financial-year-group';
import { distributionsSchema, distributionTemplateSchema } from './distribution';
import { isJobTitleType, suggestedHourlyRateSchema } from './suggested-hourly-rate';
import { normalizeToSave } from '../utils/selectors/normalize-to-save';

export const budgetRequestSchema = {
  type: 'object',
  required: true,
  properties: {
    'id': numberSchema,
    'isSpecificRequest': booleanSchema,
    'budgetDetailsId': numberSchema,
    'number': numberSchema,
    'forThisScenario': booleanSchema,
    'description': stringSchema,
    'isAmountToDistribute': booleanSchema,
    'isCalculatingPayrollDeductions': booleanSchema,
    'isCalculatingBenefits': booleanSchema,

    'jobType': codeDescriptionSchema,
    'jobStatus': codeDescriptionSchema,
    'jobTitle': jobTitleSchema,

    'union': codeDescriptionSchema,
    'functionalCenter': codeDescriptionSchema,
    'requestType': codeDescriptionAttributeSchema,

    'type': codeDescriptionSchema,
    'jobTitleGroup': codeDescriptionSchema,
    'natureOfExpense': codeDescriptionSchema,

    'secondaryCode': codeDescriptionSchema,
    'financialYearGroup': financialYearGroupSchema,
    'valuesToDestribute': undefinedNumberSchema,

    'calculationBase': codeDescriptionSchema,
    'hourlyFactor': numberSchema,
    'totalValue': numberSchema,
    'isFteCalculation': booleanSchema,
    'fte': numberSchema,

    'benefits': benefitsBudgetRequestSchema,
    'distributionType': stringSchema,
    'distributionTemplate': distributionTemplateSchema,
    'distributions': distributionsSchema,

    'isCalclulatedForScenario': booleanSchema,
    'journal': stringSchema,

    'suggestedHourlyRate': suggestedHourlyRateSchema,
  },
};

export function convertToSave(entry) {
  const newEntry = normalizeToSave(entry, budgetRequestSchema);
  const { type } = newEntry;
  set(newEntry, isJobTitleType(type) ? 'jobTitleGroup' : 'jobTitle', null);
  return newEntry;
}

