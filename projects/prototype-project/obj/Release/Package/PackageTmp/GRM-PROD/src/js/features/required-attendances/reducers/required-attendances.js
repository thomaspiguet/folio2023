import { cloneDeep, find, isEqual, isUndefined } from 'lodash';

import fillDefaults from 'json-schema-fill-defaults';

import {
  DISTRIBUTION_EXPENSE_CREATE_SUCCESS,
  DISTRIBUTION_EXPENSE_SUCCESS,
  GET_SUGGESSTED_HOURLY_RATE_FAILURE,
  GET_SUGGESSTED_HOURLY_RATE_REQUEST,
  GET_SUGGESSTED_HOURLY_RATE_SUCCESS,
  ORIGIN_REPLACEMENTS_FAILURE,
  ORIGIN_REPLACEMENTS_REQUEST,
  ORIGIN_REPLACEMENTS_SUCCESS,
  REQUIRED_ATTENDANCE_BENEFITS_DAYS_FAILURE,
  REQUIRED_ATTENDANCE_BENEFITS_DAYS_REQUEST,
  REQUIRED_ATTENDANCE_BENEFITS_DAYS_SUCCESS,
  REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_FAILURE,
  REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_REQUEST,
  REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_SUCCESS,
  REQUIRED_ATTENDANCE_CREATE_FAILURE,
  REQUIRED_ATTENDANCE_CREATE_REQUEST,
  REQUIRED_ATTENDANCE_CREATE_SUCCESS,
  REQUIRED_ATTENDANCE_DEFAULT_SUCCESS,
  REQUIRED_ATTENDANCE_DELETE_FAILURE,
  REQUIRED_ATTENDANCE_DELETE_REQUEST,
  REQUIRED_ATTENDANCE_DELETE_SUCCESS,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_SUCCESS,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_FAILURE,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_REQUEST,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS,
  REQUIRED_ATTENDANCE_FAILURE,
  REQUIRED_ATTENDANCE_LIST_METADATA_FAILURE,
  REQUIRED_ATTENDANCE_LIST_METADATA_REQUEST,
  REQUIRED_ATTENDANCE_LIST_METADATA_SUCCESS,
  REQUIRED_ATTENDANCE_METADATA_SUCCESS,
  REQUIRED_ATTENDANCE_REQUEST,
  REQUIRED_ATTENDANCE_SAVE_FAILURE,
  REQUIRED_ATTENDANCE_SAVE_REQUEST,
  REQUIRED_ATTENDANCE_SAVE_SUCCESS,
  REQUIRED_ATTENDANCE_SUCCESS,
  REQUIRED_ATTENDANCE_TOTAL_HOURS_FAILURE,
  REQUIRED_ATTENDANCE_TOTAL_HOURS_REQUEST,
  REQUIRED_ATTENDANCE_TOTAL_HOURS_SUCCESS,
  REQUIRED_ATTENDANCES_FAILURE,
  REQUIRED_ATTENDANCES_REQUEST,
  REQUIRED_ATTENDANCES_SUCCESS,
  REQUIRED_ATTENDANCE_COPY_SUCCESS,
} from '../../../api/actions';
import {
  REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_EDIT_CANCEL,
  REQUIRED_ATTENDANCE_EDIT_START,
  REQUIRED_ATTENDANCE_ORIGIN_OF_REPLACEMENTS_EXPAND,
  REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD,
  REQUIRED_ATTENDANCE_SET_ENTRY,
  REQUIRED_ATTENDANCE_SET_GROUPS,
  REQUIRED_ATTENDANCE_SET_SEARCH_ENTRY,
  REQUIRED_ATTENDANCE_SUGGESTED_HOURLY_RATE_EXPAND,
  REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_DELETE_FINISHED,
} from '../actions/required-attendances';
import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';

import { jobTitleSchema } from '../../../entities/job-title';
import { codeDescriptionSchema } from '../../../entities/code-description';
import { payrollDeductionSchema } from '../../../entities/payroll-deduction';
import { isJobTitleType } from '../../../entities/suggested-hourly-rate';
import { HOURS_PER_DAY_OTHER, isOtherHoursPerDay } from '../../../entities/required-attendance';

const emptyEntry = { // eslint-disable-line no-unused-vars
  'id': undefined,
  'code': undefined,
  'description': undefined,
  'functionalCenter': {
    'code': undefined,
    'description': undefined,
    'id': undefined,
  },
  'jobType': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'groupType': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'jobStatus': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'duration': {
    'isFinancialYear': undefined,
    'startDate': '2017-09-15T07:18:14.009Z',
    'endDate': '2017-09-15T07:18:14.009Z',
  },
  'union': {
    'shortDescription': undefined,
    'longDescription': undefined,
    'code': undefined,
    'id': undefined,
  },
  'isSpecificToThisScenario': undefined,
  'isHoursCalculationOnly': undefined,
  'level': {
    'suggestedHourlyRate': {
      'suggestedHourlyRate': undefined,
      'specificHourlyRate': undefined,
      'rateOriginType': undefined,
      'rateOriginDescription': undefined,
      'rateOriginFunctionalCenter': {
        'shortDescription': undefined,
        'longDescription': undefined,
        'code': undefined,
        'id': undefined,
        'codeDescription': undefined,
      },
    },
    'isSuggestedHourlyRate': undefined,
    'hoursPerDaySelected': undefined,
    'specificHoursPerDay': undefined,
    'hoursPerDays': [],
    'totalHours': undefined,
    'fullTimeEquivalent': undefined,
  },
  'benefit': {
    'showPercentage': undefined,
    'fourDaySchedule': undefined,
    'qtyVacation': undefined,
    'qtyHoliday': undefined,
    'qtySickDay': undefined,
    'qtyPsychiatricLeave': undefined,
    'qtyNightShift': undefined,
    'qtyVacationFromParameter': undefined,
    'qtyHolidayFromParameter': undefined,
    'qtySickDayFromParameter': undefined,
    'qtyPsychiatricLeaveFromParameter': undefined,
    'qtyNightShiftFromParameter': undefined,
    'pctVacation': undefined,
    'pctHoliday': undefined,
    'pctSickDay': undefined,
    'pctPsychiatricLeave': undefined,
    'pctNightShift': undefined,
    'pctVacationFromParameter': undefined,
    'pctHolidayFromParameter': undefined,
    'pctSickDayFromParameter': undefined,
    'pctPsychiatricLeaveFromParameter': undefined,
    'pctNightShiftFromParameter': undefined,
    'isFinancialYearParameters': undefined,
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
  'premiums': [
    // {
    //   'id': undefined,
    //   'start': '2017-09-15T07:18:14.010Z',
    //   'end': '2017-09-15T07:18:14.010Z',
    //   'isInconvenient': true,
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
  'originReplacements': [
    {
      expenseType: undefined,
      origin: undefined,
      employeeType: undefined,
      percentage: undefined,
    },
  ],
  'schedule': [
    {
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
      'shift': {
        'code': undefined,
        'id': undefined,
        'longDescription': undefined,
        'shortDescription': undefined,
      },
      'otherLeave1': undefined,
      'otherLeave2': undefined,
      'otherLeave3': undefined,
    },
  ],
  'scheduleOtherLeaveTitle1': undefined,
  'scheduleOtherLeaveTitle2': undefined,
  'scheduleOtherLeaveTitle3': undefined,
  'temporaryClosures': [
    // {
    //   'id': undefined,
    //   'sequence': undefined,
    //   'workShift': {
    //     'shortDescription': undefined,
    //     'longDescription': undefined,
    //     'code': undefined,
    //     'id': undefined,
    //     'codeDescription': undefined,
    //   },
    //   'startDate': undefined,
    //   'endDate': undefined,
    //   'nbDayForMonday': undefined,
    //   'nbDayForTuesday': undefined,
    //   'nbDayForWednesday': undefined,
    //   'nbDayForThursday': undefined,
    //   'nbDayForFriday': undefined,
    //   'nbDayForSaturday': undefined,
    //   'nbDayForSunday': undefined,
    // },
  ],
  'jobGroup': undefined,
  'jobLevel': undefined,
  'isInactive': undefined,
  jobTitle: fillDefaults({}, jobTitleSchema),
  jobTitleGroup: fillDefaults({}, codeDescriptionSchema),
};

const emptyFields = {
  validationErrors: null,
  isLoading: false,
};

const emptySearch = {
  description: '',
  functionalCenter: [],
  jobTitle: [],
  jobTitleGroup: [],
  jobType: [],
  jobStatus: [],
};

const defaultPaging = {
  'pageNo': 1,
  'pageSize': 30,
  'pageCount': -1,
  'recordCount': undefined,
};

const initialState = {
  isLoading: false,
  isDeleting: false,
  isLoadingOriginReplacements: false,
  isLoadingOriginDistributionsList: false,
  editMode: false,
  metadata: undefined,
  listMetadata: undefined,
  listMetadataLoading: false,
  data: null,
  paging: { ...defaultPaging },
  groups: [],
  requiredAttendances: {},
  referenceSearchKeyWord: '',
  options: {},
  entry: emptyEntry,
  requiredAttendanceId: undefined,
  isSuggestedHourlyRateExpanded: false,
  isOriginOfReplacementsExpanded: false,
  validationErrors: null,
  suggestedHourlyRate: undefined,
  // {
  //   'VersionInconsistency': false,
  //   'ValidationMessages': [
  //     { 'Path': 'Data.FunctionalCenter.Id', 'Message': 'Le centre fonctionnel ne peut pas être changé', 'Type': null, 'Data': null },
  //   ],
  // },
  distributions: [],
  ...emptyFields,
  showAdvancedSearch: false,
  haveAdvancedSearch: false,
  applyAdvancedSearch: false,
  advancedSearch: emptySearch,
  search: emptySearch,
};

export const requiredAttendancesSelector = state => state.requiredAttendances;

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...state,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
        data: null,
      };
    }

    case REQUIRED_ATTENDANCE_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case REQUIRED_ATTENDANCES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case REQUIRED_ATTENDANCES_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
        editMode: false,
        listResource: resource,
      };
    }

    case REQUIRED_ATTENDANCES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
        isSuggestedHourlyRateExpanded: false,
        isOriginOfReplacementsExpanded: false,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_SAVE_SUCCESS:
    case REQUIRED_ATTENDANCE_CREATE_SUCCESS:
    case REQUIRED_ATTENDANCE_SUCCESS: {
      const entry = action.payload;
      const isJobTitle = isJobTitleType(entry.groupType);
      const { level: { hoursPerDaySelected, specificHoursPerDay } } = entry;
      const requiredAttendanceId = `${ entry.id }`;
      const hoursPerDaySelectedValue = (isJobTitle && !isUndefined(specificHoursPerDay)) ? { value: HOURS_PER_DAY_OTHER } : hoursPerDaySelected;
      return {
        ...state,
        editMode: false,
        entry: {
          ...entry,
          payrollDeduction: fillDefaults(entry.payrollDeduction, payrollDeductionSchema),
          jobTitle: fillDefaults(entry.jobTitle, jobTitleSchema),
          jobTitleGroup: fillDefaults(entry.jobTitleGroup, codeDescriptionSchema),
          level: {
            ...entry.level,
            hoursPerDaySelected: hoursPerDaySelectedValue,
          },
        },
        requiredAttendanceId,
        oldEntry: undefined,
        metadata: state.metadata,
        data: action.type === REQUIRED_ATTENDANCE_SUCCESS ? state.data : null,
        ...emptyFields,
      };
    }

    case REQUIRED_ATTENDANCE_DEFAULT_SUCCESS: {
      const entry = action.payload;
      return {
        ...state,
        editMode: true,
        entry: {
          ...emptyEntry,
          ...entry,
          payrollDeduction: fillDefaults(entry.payrollDeduction, payrollDeductionSchema),
          jobTitle: fillDefaults(entry.jobTitle, jobTitleSchema),
          jobTitleGroup: fillDefaults(entry.jobTitleGroup, codeDescriptionSchema),
        },
        requiredAttendanceId: 0,
        oldEntry: undefined,
        metadata: state.metadata,
        distributions: initialState.distributions,
        ...emptyFields,
      };
    }

    case REQUIRED_ATTENDANCE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    case REQUIRED_ATTENDANCE_EDIT_START: {
      return {
        ...state,
        editMode: !!state.metadata,
        oldEntry: cloneDeep(state.entry),
      };
    }

    case REQUIRED_ATTENDANCE_SUGGESTED_HOURLY_RATE_EXPAND: {
      return {
        ...state,
        isSuggestedHourlyRateExpanded: !state.isSuggestedHourlyRateExpanded,
        suggestedHourlyRate: undefined,
      };
    }

    case REQUIRED_ATTENDANCE_ORIGIN_OF_REPLACEMENTS_EXPAND: {
      return {
        ...state,
        isOriginOfReplacementsExpanded: !state.isOriginOfReplacementsExpanded,
      };
    }

    case REQUIRED_ATTENDANCE_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
        editMode: true,
        oldEntry: cloneDeep(state.entry),
      };
    }

    case REQUIRED_ATTENDANCE_LIST_METADATA_REQUEST: {
      return {
        ...state,
        listMetadata: undefined,
        listMetadataLoading: true,
      };
    }

    case REQUIRED_ATTENDANCE_LIST_METADATA_FAILURE: {
      return {
        ...state,
        listMetadataLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_LIST_METADATA_SUCCESS: {
      return {
        ...state,
        listMetadata: action.payload,
        listMetadataLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_SET_ENTRY: {
      const entry = action.payload;
      const prevEntry = state.entry;
      let { level: { hoursPerDaySelected, specificHoursPerDay } } = entry;
      const { level: { hoursPerDaySelected: prevHoursPerDaySelected, specificHoursPerDay: prevSpecificHoursPerDay } } = prevEntry;
      const isJobTitle = isJobTitleType(entry.groupType);
      const isPrevJobTitle = isJobTitleType(prevEntry.groupType);

      if (isJobTitle && !isPrevJobTitle) {
        hoursPerDaySelected = { value: HOURS_PER_DAY_OTHER };
        specificHoursPerDay = prevSpecificHoursPerDay;
      } else if (!isJobTitle && isPrevJobTitle && prevHoursPerDaySelected && !isOtherHoursPerDay(prevHoursPerDaySelected)) {
        specificHoursPerDay = prevHoursPerDaySelected.value;
      }

      return {
        ...state,
        entry: {
          ...entry,
          level: {
            ...entry.level,
            hoursPerDaySelected,
            specificHoursPerDay,
          },
        },
      };
    }

    case REQUIRED_ATTENDANCE_SAVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
        isOriginOfReplacementsExpanded: false,
      };
    }

    case REQUIRED_ATTENDANCE_SAVE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case REQUIRED_ATTENDANCE_EDIT_CANCEL: {
      return {
        ...state,
        entry: emptyEntry,
        ...emptyFields,
      };
    }

    case REQUIRED_ATTENDANCE_CREATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_CREATE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case REQUIRED_ATTENDANCE_DELETE_REQUEST: {
      return {
        ...state,
        isDeleting: true,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DELETE_FAILURE: {
      return {
        ...state,
        isDeleting: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case REQUIRED_ATTENDANCE_DELETE_SUCCESS: {
      return {
        ...initialState,
        isDeleting: true,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DELETE_FINISHED: {
      return {
        ...state,
        isDeleting: false,
      };
    }

    case REQUIRED_ATTENDANCE_TOTAL_HOURS_REQUEST: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_TOTAL_HOURS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          level: {
            ...state.entry.level,
            totalHours: action.payload,
          },
        },
      };
    }

    case REQUIRED_ATTENDANCE_TOTAL_HOURS_FAILURE: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_DAYS_REQUEST: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_DAYS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          benefit: {
            ...state.entry.benefit,
            qtyVacationFromParameter: action.payload.qtyVacation,
            qtyHolidayFromParameter: action.payload.qtyHoliday,
            qtySickDayFromParameter: action.payload.qtySickDay,
            qtyPsychiatricLeaveFromParameter: action.payload.qtyPsychiatricLeave,
            qtyNightShiftFromParameter: action.payload.qtyNightShift,
            pctVacationFromParameter: action.payload.pctVacation,
            pctHolidayFromParameter: action.payload.pctHoliday,
            pctSickDayFromParameter: action.payload.pctSickDay,
            pctPsychiatricLeaveFromParameter: action.payload.pctPsychiatricLeave,
            pctNightShiftFromParameter: action.payload.pctNightShift,
            isFinancialYearParameters: action.payload.isFinancialYearParameters,
          },
        },
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_DAYS_FAILURE: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_REQUEST: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          benefit: {
            ...state.entry.benefit,
            qtyVacationFromParameter: action.payload.pctVacation,
            qtyHolidayFromParameter: action.payload.pctHoliday,
            qtySickDayFromParameter: action.payload.pctSickDay,
            qtyPsychiatricLeaveFromParameter: action.payload.pctPsychiatricLeave,
          },
        },
      };
    }

    case REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_FAILURE: {
      return {
        ...state,
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_REQUEST: {
      return {
        ...state,
        suggestedHourlyRate: undefined,
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_SUCCESS: {
      const { resource: { setValue } } = action.options;
      const newState = {
        ...state,
        suggestedHourlyRate: action.payload,
      };
      if (setValue) {
        newState.entry.level.suggestedHourlyRate.suggestedHourlyRate = action.payload;
      }
      return newState;
    }

    case GET_SUGGESSTED_HOURLY_RATE_FAILURE: {
      return {
        ...state,
        suggestedHourlyRate: undefined,
      };
    }

    case ORIGIN_REPLACEMENTS_REQUEST: {
      return {
        ...state,
        isLoadingOriginReplacements: true,
      };
    }

    case ORIGIN_REPLACEMENTS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          originReplacements: {
            ...action.payload,
          },
        },
        isLoadingOriginReplacements: false,
      };
    }

    case ORIGIN_REPLACEMENTS_FAILURE: {
      return {
        ...state,
        isLoadingOriginReplacements: true,
      };
    }

    case REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_REQUEST: {
      return {
        ...state,
        isLoadingDistributionsList: true,
      };
    }

    case REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS: {
      const distributions = action.payload;
      return {
        ...state,
        isLoadingDistributionsList: false,
        distributions,
      };
    }

    case DISTRIBUTION_EXPENSE_SUCCESS: {
      const id = action.options.resource.id;
      return {
        ...state,
        selectedDistributions: find(state.distributions, { id }),
      };
    }

    case DISTRIBUTION_EXPENSE_CREATE_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        selectedDistributions: find(state.distributions, { id }),
      };
    }

    case REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_FAILURE: {
      return {
        ...state,
        isLoadingDistributionsList: false,
        distributions: initialState.distributions,
      };
    }

    case REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_SUCCESS: {
      return {
        ...state,
      };
    }

    case REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD: {
      return {
        ...state,
        referenceSearchKeyWord: action.payload,
      };
    }

    case REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH: {
      return {
        ...state,
        showAdvancedSearch: !state.showAdvancedSearch,
        search: cloneDeep(state.advancedSearch),
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH: {
      return {
        ...state,
        advancedSearch: emptySearch,
        search: emptySearch,
        haveAdvancedSearch: false,
      };
    }

    case REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH: {
      return {
        ...state,
        advancedSearch: emptySearch,
        search: emptySearch,
        haveAdvancedSearch: false,
      };
    }

    case REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH: {
      return {
        ...state,
        search: cloneDeep(state.advancedSearch),
        showAdvancedSearch: false,
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case REQUIRED_ATTENDANCE_SET_SEARCH_ENTRY: {
      const advancedSearch = action.payload;
      return {
        ...state,
        advancedSearch,
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case REQUIRED_ATTENDANCE_COPY_SUCCESS: {
      return {
        ...state,
        data: [],
        paging: { ...defaultPaging },
        options: {},
      };
    }

    default:
      return state;
  }
}
