import { each } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';

import { payrollDeductionSchema } from '../../entities/payroll-deduction';

import {
  EMPLOYEE_REQUEST,
  EMPLOYEE_SUCCESS,
  EMPLOYEE_FAILURE,
} from '../../api/actions';

const emptyEntry = {

  'employeeNumber': undefined,
  'employmentDate': undefined,
  'financialYear': {
    'code': undefined,
    'id': undefined,
    'isCurrent': undefined,
  },
  'jobTitle': {
    'id': undefined,
    'description': undefined,
    'notaryEmploymentCode': undefined,
  },
  'firstName': undefined,
  'group': undefined,
  'id': undefined,
  'jobStatus': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'jobType': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'lastName': undefined,
  'levelAsOfAprilFirst': undefined,
  'union': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'startOfTheYear': {
    'date': undefined,
    'basedOnJobTitle': undefined,
    'ifDifferent': undefined,
  },
  'firstLevel': {
    'date': undefined,
    'basedOnJobTitle': undefined,
    'ifDifferent': undefined,
  },
  'secondLevel': {
    'date': undefined,
    'basedOnJobTitle': undefined,
    'ifDifferent': undefined,
  },
  'hoursPerDay': {
    'id': undefined,
    'value': undefined,
  },
  'hoursPerDayIfDifferent': undefined,
  'replacements': [
    {
      'id': undefined,
      'percentage': undefined,
      'hours': undefined,
      'expenseType': {
        'shortDescription': undefined,
        'longDescription': undefined,
        'code': undefined,
        'id': undefined,
      },
    },
  ],
  'vacation': {
    'basedOnParametersVacationDays': undefined,
    'ifDifferentAmountInVacationBank': undefined,
    'ifDifferentHoursInVacationBank': undefined,
    'ifDifferentVacationDays': undefined,
  },
  'benefits': {
    'additionalPeriod4': undefined,
    'pctHoliday': undefined,
    'pctPsychiatricLeave': undefined,
    'pctSickDay': undefined,
    'pctVacation': undefined,
  },
  'specificsBenefits': {
    'additionalPeriod4': undefined,
    'pctHoliday': undefined,
    'pctPsychiatricLeave': undefined,
    'pctSickDay': undefined,
    'pctVacation': undefined,
  },
  'isSpecificsBenefits': undefined,
  payrollDeduction: fillDefaults({}, payrollDeductionSchema),
  permanentNightShiftDays: undefined,
  premiums: {
    seniority: {},
    others1: {},
    others2: {},
    others3: {},
    others4: {},
  },
  insurances: {
    General: { id: undefined, code: undefined, description: undefined },
    ShortTerm: { id: undefined, code: undefined, description: undefined },
    LongTerm: { id: undefined, code: undefined, description: undefined },
    Group1: { id: undefined, code: undefined, description: undefined },
    Group2: { id: undefined, code: undefined, description: undefined },
    Group3: { id: undefined, code: undefined, description: undefined },
  },
};

const initialState = {
  isLoading: false,
  // data: null,
  // paging: {
  //   'pageNo': 1, // from 1
  //   'pageSize': 30,
  //   'pageCount': -1,
  //   'recordCount': undefined,
  // },
  // groups: [],
  // options: {},
  entry: emptyEntry,
};

function convertPremiums(premiums) {
  const result = {
    seniority: {},
    others1: {},
    others2: {},
    others3: {},
    others4: {},
  };

  each(premiums, (item) => {
    switch (item.type) {
      case 'Seniority':
        result.seniority = item;
        break;
      case 'Other1':
        result.others1 = item;
        break;
      case 'Other2':
        result.others2 = item;
        break;
      case 'Other3':
        result.others3 = item;
        break;
      case 'Other4':
        result.others4 = item;
        break;
      default:
        break;
    }
  });

  return result;
}

function convertInsurances(insurances) {
  const result = {
    General: { id: undefined, code: undefined, description: undefined },
    ShortTerm: { id: undefined, code: undefined, description: undefined },
    LongTerm: { id: undefined, code: undefined, description: undefined },
    Group1: { id: undefined, code: undefined, description: undefined },
    Group2: { id: undefined, code: undefined, description: undefined },
    Group3: { id: undefined, code: undefined, description: undefined },
  };

  each(insurances, (item) => {
    switch (item.type) {
      case 'General': result.General = item; break;
      case 'ShortTerm': result.ShortTerm = item; break;
      case 'LongTerm': result.LongTerm = item; break;
      case 'Group1': result.Group1 = item; break;
      case 'Group2': result.Group2 = item; break;
      case 'Group3': result.Group3 = item; break;
      default: break;
    }
  });

  return result;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case EMPLOYEE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
      };
    }
    case EMPLOYEE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
          payrollDeduction: fillDefaults(action.payload.payrollDeduction, payrollDeductionSchema),
          premiums: convertPremiums(action.payload.premiums),
          insurances: convertInsurances(action.payload.insurances),
        },
        positionId: action.options.resource.positionId,
      };
    }
    case EMPLOYEE_FAILURE: {
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
