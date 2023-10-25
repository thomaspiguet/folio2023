import fillDefaults from 'json-schema-fill-defaults';

import {
  GLOBAL_PARAMETERS_REQUEST,
  GLOBAL_PARAMETERS_SUCCESS,
  GLOBAL_PARAMETERS_FAILURE,
} from '../../api/actions';

import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { payrollDeductionGlobalSchema, parametersSchema } from '../../entities/payroll-deduction';
import { modelSchema, othersRegularSchema } from '../../entities/parameters';

const emptyEntry = {
  'budgetEqualsActualDefaultPeriod': undefined,
  'calculateGlobalPremium': undefined,
  'defaultPeriodForActualToDate': undefined,
  'expectedSickDaysPerEmployee': {
    'numberOfDaysFullTime': undefined,
    'numberOfDaysFullTimeManagement': undefined,
    'numberOfDaysPartTime': undefined,
  },
  'federalInsuranceTaxModel': {
    'id': undefined,
    'code': undefined,
    'rate': undefined,
  },
  'financialPeriodOfEmployeesPay': {
    'code': undefined,
    'id': undefined,
    'isCurrent': undefined,
  },
  'financialYear': {
    'code': undefined,
    'id': undefined,
    'isCurrent': undefined,
  },
  'fteCalculationBaseNonUnion': undefined,
  'globalPremiumDistributionModel': undefined,
  'globalPremiumNature': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'holidays': {
    'holidayGroup': {
      'id': undefined,
      'code': undefined,
      'description': undefined,
    },
    'numberOfDaysPartTime': undefined,
  },
  'includeUnusedSickDaysInCalculations': undefined,
  payrollDeductionGlobal: fillDefaults({}, payrollDeductionGlobalSchema),
  globalSpecificPayrollDeduction: fillDefaults({}, parametersSchema),
  'provincialInsuranceTaxModel': {
    'id': undefined,
    'code': undefined,
    'rate': undefined,
  },
  'psychiatricLeaveNumberOfDaysFullTime': undefined,
  'replacementHourlyRate': {
    'rateOriginDescription': undefined,
    'rateOriginType': undefined,
    'jobGroupType': undefined,
    'jobGroupValue': undefined,
    'jobLevelType': undefined,
    'jobLevelValue': undefined,
  },
  'vacantPositionAndRequest': {
    'rateOriginDescription': undefined,
    'rateOriginType': undefined,
    'jobGroupType': undefined,
    'jobGroupValue': undefined,
    'jobLevelType': undefined,
    'jobLevelValue': undefined,
  },
  'salaryCalculationBase': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'salaryNumberOfPayPeriodsYear': undefined,
  'vacation': {
    'numberOfDaysFullTime': undefined,
    'numberOfDaysFullTimeManagement': undefined,
    'numberOfDaysPartTime': undefined,
  },
  'automaticCalculationOfTaxableAmount': undefined,
  'theFirstPayOfThePreviousYear': undefined,
  'theFirstPayOfTheCurrentYear': undefined,
  'previousFinancialYear': undefined,
  'isTargetScenario': undefined,
  'otherScenario': { 'code': undefined },
  'targetScenario': { 'code': undefined },
  'defaultBenefitForNonUnionRequests': {
    'additionalPeriod4': undefined,
    'pctHoliday': undefined,
    'pctPsychiatricLeave': undefined,
    'pctSickDay': undefined,
    'pctVacation': undefined,
  },
  'fourDaysScheduleFteCalculationBaseNonUnion': undefined,
  'fourDaysScheduleHolidayGroup': {
    'id': undefined,
    'code': undefined,
    'description': undefined,
  },
  'fourDaysScheduleSickDays': {
    'numberOfDaysFullTime': undefined,
    'numberOfDaysFullTimeManagement': undefined,
    'numberOfDaysPartTime': undefined,
    'sickLeaveBank': undefined,
  },
  'fourDaysScheduleVacationDays': undefined,
  'calendar': {
    'board': {
      'id': undefined,
      'regular': {
        'week': {
          'Sunday': undefined,
          'Monday': undefined,
          'Tuesday': undefined,
          'Wednesday': undefined,
          'Thursday': undefined,
          'Friday': undefined,
          'Saturday': undefined,
        },
        'total': undefined,
        'title': undefined,
      },
      'others': {},
    },
    'otherNonWorkDays': [
      {
        'id': undefined,
        'row': undefined,
        'expense': {
          'shortDescription': undefined,
          'longDescription': undefined,
          'code': undefined,
          'id': undefined,
          'codeDescription': undefined,
        },
        'date': undefined,
        'day': undefined,
      },
    ],
  },
  modelsAndBenefits: fillDefaults({}, modelSchema),
  othersRegularManagement: fillDefaults({}, othersRegularSchema),
  othersRegularNonManagement: fillDefaults({}, othersRegularSchema),
  replacementsManagement: [],
  replacementsNonManagement: [],
};

const initialState = {
  isLoading: false,
  options: {},
  entry: emptyEntry,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
      };
    }

    case GLOBAL_PARAMETERS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
      };
    }

    case GLOBAL_PARAMETERS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        options: action.options.data,
        entry: {
          ...emptyEntry,
          ...action.payload,
          payrollDeductionGlobal: fillDefaults(action.payload.payrollDeductionGlobal, payrollDeductionGlobalSchema),
          globalSpecificPayrollDeduction: fillDefaults(action.payload.globalSpecificPayrollDeduction, parametersSchema),
          modelsAndBenefits: fillDefaults(action.payload.modelsAndBenefits, modelSchema),
          othersRegularManagement: fillDefaults(action.payload.othersRegularManagement, othersRegularSchema),
          othersRegularNonManagement: fillDefaults(action.payload.othersRegularNonManagement, othersRegularSchema),
        },
      };
    }

    case GLOBAL_PARAMETERS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    default:
      return state;
  }
}
