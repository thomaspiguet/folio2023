import { isEmpty, isUndefined, set } from 'lodash';
import { unformatNumber } from '../utils/selectors/currency';

import { booleanSchema, booleanTrueSchema, booleanFalseSchema, numberSchema, stringSchema } from './base';
import { codeDescriptionSchema } from './code-description';
import { jobTitleSchema } from './job-title';
import { durationSchema } from './duration';
import { levelsSchema } from './levels';
import { benefitsSchema } from './benefits';
import { idCodeDescriptionSchema } from './id-code-description';
import { payrollDeductionSchema } from './payroll-deduction';
import { premiumsSchema } from './premiums';
import { replacementsSchema } from './replacements';
import { scheduleSchema } from './schedule';
import { temporaryClosuresSchema } from './temporary-closures';
import { normalizeToSave } from '../utils/selectors/normalize-to-save';
import { isJobTitleType } from './suggested-hourly-rate';
import { distributionExpenseCopySchema } from './distribution';

export const HOURS_PER_DAY_OTHER = 'Other';

export const requiredAttendanceSchema = {
  type: 'object',
  required: true,
  properties: {
    'id': numberSchema,
    'code': stringSchema,
    'description': stringSchema,
    'isCalclulatedForScenario': booleanSchema,
    'functionalCenter': codeDescriptionSchema,
    'jobTitle': jobTitleSchema,
    'jobTitleGroup': codeDescriptionSchema,
    'jobType': codeDescriptionSchema,
    'groupType': codeDescriptionSchema,
    'jobStatus': codeDescriptionSchema,
    'duration': durationSchema,
    'union': codeDescriptionSchema,
    'isSpecificToThisScenario': booleanSchema,
    'isHoursCalculationOnly': booleanSchema,
    'level': levelsSchema,
    'fourDaySchedule': booleanSchema,
    'benefit': benefitsSchema,
    'isSpecificPayrollDeduction': booleanSchema,
    'globalPayrollDeductionParameter': idCodeDescriptionSchema,
    'globalPayrollDeduction': idCodeDescriptionSchema,
    'payrollDeduction': payrollDeductionSchema,
    'premiums': {
      type: 'array',
      items: premiumsSchema,
    },
    'replacements': replacementsSchema,
    'schedules': {
      type: 'array',
      items: scheduleSchema,
    },
    'scheduleOtherLeaveTitle1': stringSchema,
    'scheduleOtherLeaveTitle2': stringSchema,
    'scheduleOtherLeaveTitle3': stringSchema,
    'temporaryClosures': temporaryClosuresSchema,
    'hoursPer2Weeks': numberSchema,
    'isInactive': booleanSchema,
    'journal': stringSchema,
  },
};

export const requiredAttendanceCopySchema = {
  type: 'object',
  required: true,
  properties: {
    'id': numberSchema,
    'groupType': codeDescriptionSchema,
    'jobTitle': jobTitleSchema,
    'jobTitleGroup': codeDescriptionSchema,
    'code': stringSchema,
    'description': stringSchema,
    'jobType': codeDescriptionSchema,
    'jobStatus': codeDescriptionSchema,
    'functionalCenter': codeDescriptionSchema,

    'references': {
      type: 'array',
      items: requiredAttendanceSchema,
      default: [],
      required: true,
    },
    'targetFunctionalCenter': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'departments': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'subDepartments': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'programs': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'primaryCodeGroups': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'subPrograms': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'responsibilityCentersLevel1': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'responsibilityCentersLevel2': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'responsibilityCentersLevel3': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'sites': {
      type: 'array',
      items: codeDescriptionSchema,
      default: [],
      required: true,
    },
    'isIncludeSchedule': booleanTrueSchema,
    'isIncludeTemporaryClosure': booleanTrueSchema,
    'isIncludeBenefits': booleanTrueSchema,
    'isIncludeReplacements': booleanTrueSchema,
    'isIncludePremiums': booleanTrueSchema,
    'isIncludePayrollDeductions': booleanTrueSchema,
    'isIncludeSpecificDistribution': booleanTrueSchema,
    'isIncludeAttachment': booleanFalseSchema,
    'isIncludeNotes': booleanFalseSchema,
  },
};

const options = { decimal: '.' };

function setHoursPerDaySelected(newEntry, isJobTitle) {
  const { level: { hoursPerDaySelected, specificHoursPerDay } } = newEntry;

  if (isJobTitle) {
    if (hoursPerDaySelected) {
      if (hoursPerDaySelected.value !== HOURS_PER_DAY_OTHER) {
        set(newEntry, 'level.hoursPerDaySelected.value', unformatNumber(hoursPerDaySelected.value, options));
        set(newEntry, 'level.specificHoursPerDay', null);
      } else {
        set(newEntry, 'level.hoursPerDaySelected', null);
        set(newEntry, 'level.specificHoursPerDay', unformatNumber(specificHoursPerDay, options));
      }
    }
  } else {
    if (hoursPerDaySelected && hoursPerDaySelected.value
      && hoursPerDaySelected.value !== HOURS_PER_DAY_OTHER && isUndefined(specificHoursPerDay)) {
      set(newEntry, 'level.specificHoursPerDay', unformatNumber(hoursPerDaySelected.value, options));
    } else {
      set(newEntry, 'level.specificHoursPerDay', unformatNumber(specificHoursPerDay, options));
    }
    set(newEntry, 'level.hoursPerDaySelected', null);
  }
}

export function convertToSave(entry) {
  const newEntry = normalizeToSave(entry, requiredAttendanceSchema);
  const { level, functionalCenter, groupType } = newEntry;
  if (isEmpty(level.suggestedHourlyRate.rateOriginFunctionalCenter)) {
    level.suggestedHourlyRate.rateOriginFunctionalCenter = functionalCenter;
  }
  const isJobTitle = isJobTitleType(groupType);
  set(newEntry, isJobTitle ? 'jobTitleGroup' : 'jobTitle', null);

  setHoursPerDaySelected(newEntry, isJobTitle);

  return newEntry;
}

export function convertCopyToSave(entry) {
  const newEntry = normalizeToSave(entry, requiredAttendanceCopySchema);
  const { groupType } = newEntry;

  const isJobTitle = isJobTitleType(groupType);
  set(newEntry, isJobTitle ? 'jobTitleGroup' : 'jobTitle', null);

  return newEntry;
}

export function convertDistributionsCopyToSave(entry) {
  const newEntry = normalizeToSave(entry, distributionExpenseCopySchema);

  return newEntry;
}

export function isHoursPerDayValue(value) {
  return value && value.value;
}

export function isOtherHoursPerDay(value) {
  return !isUndefined(value) && value && value.value === HOURS_PER_DAY_OTHER;
}

export function isSpecificHoursPerDay(value) {
  return isUndefined(value) || value.value === HOURS_PER_DAY_OTHER;
}

