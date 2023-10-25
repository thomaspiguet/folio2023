import fillDefaults from 'json-schema-fill-defaults';

import {
  POSITIONS_BY_JOB_TITLE_SET_GROUPS,
  POSITIONS_BY_JOB_TITLE_SUGGESTED_HOURLY_RATE_EXPAND,
} from './actions';
import {
  POSITIONS_BY_JOB_TITLE_REQUEST, POSITION_BY_JOB_TITLE_REQUEST, POSITION_BY_JOB_TITLE_SUCCESS,
  POSITION_BY_JOB_TITLE_FAILURE, POSITIONS_BY_JOB_TITLE_SUCCESS, POSITIONS_BY_JOB_TITLE_FAILURE,
} from '../../api/actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';

import { payrollDeductionSchema } from '../../entities/payroll-deduction';

const emptyEntry = {
  'id': undefined,
  'number': undefined,
  'description': undefined,
  'forThisScenario': undefined,
  'numberOfPositions': undefined,
  'fourDaySchedule': undefined,
  'functionalCenter': {
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
    'codeDescription': undefined,
  },
  'jobStatus': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'union': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'positionDuration': {
    'isFinancialYear': undefined,
    'startDate': undefined,
    'endDate': undefined,
  },
  'isActivePositionByJobTitle': undefined,
  'jobTitle': {
    'id': undefined,
    'description': undefined,
    'notaryEmploymentCode': undefined,
  },
  'shift': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'hoursPerDay': undefined,
  'hoursPer2Weeks': undefined,
  'fullTimeEquivalent': undefined,
  'totalDaysToDistribute': undefined,
  'totalHoursToDistribute': undefined,
  'schedule': {
    'firstWeek': {
      'Sunday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Monday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Tuesday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Wednesday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Thursday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Friday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Saturday': {
        'workLoad': undefined,
        'hours': undefined,
      },
    },
    'secondWeek': {
      'Sunday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Monday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Tuesday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Wednesday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Thursday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Friday': {
        'workLoad': undefined,
        'hours': undefined,
      },
      'Saturday': {
        'workLoad': undefined,
        'hours': undefined,
      },
    },
    'total': {
      'workLoad': undefined,
      'hours': undefined,
    },
  },
  'specificHourlyRate': undefined,
  'rateOriginType': undefined,
  'rateOriginDescription': undefined,
  'suggestedHourlyRate': undefined,
  'rateOriginFunctionalCenter': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
    'codeDescription': undefined,
  },
  'premiums': [
    // {
    //   'id': undefined,
    //   'start': undefined,
    //   'end': undefined,
    //   'isInconvenient': undefined,
    //   'premium': {
    //     'id': undefined,
    //     'code': undefined,
    //     'description': undefined,
    //   },
    // },
  ],
  'replacements': [
    // {
    //   'id': undefined,
    //   'percentage': undefined,
    //   'hours': undefined,
    //   'expenseType': {
    //     'shortDescription': undefined,
    //     'longDescription': undefined,
    //     'code': undefined,
    //     'id': undefined,
    //     'codeDescription': undefined,
    //   },
    // },
  ],
  'benefit': {
    'showPercentage': undefined,
    'qtyVacation': undefined,
    'qtyHoliday': undefined,
    'qtySickDay': undefined,
    'qtyPsychiatricLeave': undefined,
    'qtyNightShift': undefined,
    'pctVacation': undefined,
    'pctHoliday': undefined,
    'pctSickDay': undefined,
    'pctPsychiatricLeave': undefined,
    'pctNightShift': undefined,
    'qtyVacationFromParameter': undefined,
    'qtyHolidayFromParameter': undefined,
    'qtySickDayFromParameter': undefined,
    'qtyPsychiatricLeaveFromParameter': undefined,
    'qtyNightShiftFromParameter': undefined,
    'pctVacationFromParameter': undefined,
    'pctHolidayFromParameter': undefined,
    'pctSickDayFromParameter': undefined,
    'pctPsychiatricLeaveFromParameter': undefined,
    'pctNightShiftFromParameter': undefined,
  },
  payrollDeduction: fillDefaults({}, payrollDeductionSchema),
  'globalPayrollDeduction': {
    'code': undefined,
    'description': undefined,
  },
  'globalPayrollDeductionParameter': {
    'code': undefined,
    'description': undefined,
  },
  isSpecificPayrollDeduction: undefined,
  'jobGroup': undefined,
  'jobLevel': undefined,
};

const initialState = {
  isLoading: false,
  data: null,
  paging: {
    'pageNo': 1, // from 1
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
  groups: [],
  positions: {},
  options: {},
  entry: emptyEntry,
  isSuggestedHourlyRateExpanded: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case POSITIONS_BY_JOB_TITLE_SUGGESTED_HOURLY_RATE_EXPAND: {
      return {
        ...state,
        isSuggestedHourlyRateExpanded: !state.isSuggestedHourlyRateExpanded,
      };
    }

    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }
    case POSITIONS_BY_JOB_TITLE_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }
    case POSITION_BY_JOB_TITLE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
        isSuggestedHourlyRateExpanded: false,
      };
    }
    case POSITION_BY_JOB_TITLE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
          payrollDeduction: fillDefaults(action.payload.payrollDeduction, payrollDeductionSchema),
        },
        positionId: action.options.resource.positionId,
      };
    }
    case POSITION_BY_JOB_TITLE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }
    case POSITIONS_BY_JOB_TITLE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case POSITIONS_BY_JOB_TITLE_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
        listResource: resource,
      };
    }
    case POSITIONS_BY_JOB_TITLE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
