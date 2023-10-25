import {
  POSITIONS_SET_GROUPS,
  POSITIONS_SHOW_OTHER_POSITIONS,
  POSITIONS_ORIGIN_OF_REPLACEMENTS_EXPAND,
} from './actions';
import {
  POSITIONS_REQUEST,
  POSITIONS_SUCCESS,
  POSITIONS_FAILURE,
  POSITION_REQUEST,
  POSITION_SUCCESS,
  POSITION_FAILURE,
  ORIGIN_REPLACEMENTS_REQUEST,
  ORIGIN_REPLACEMENTS_SUCCESS,
  ORIGIN_REPLACEMENTS_FAILURE,
} from '../../api/actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';

const emptyEntry = {
  'functionalCenter': {},
  'union': {},
  'positionDuration': {},
  'shift': {},
  'jobType': {},
  'jobStatus': {},
  'jobTitle': {},
  'employee': {},
  'schedule': { 'firstWeek': {} },
  // 'schedule': {
  //   'firstWeek': {
  //     'Sunday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Monday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Tuesday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Wednesday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Thursday': {},
  //     'Friday': {},
  //     'Saturday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //   },
  //   'secondWeek': {
  //     'Sunday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Monday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Tuesday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Wednesday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //     'Thursday': {},
  //     'Friday': {},
  //     'Saturday': {
  //       'workLoad': 1,
  //       'hours': 7,
  //     },
  //   },
  // },
  'positionPremiums': [],
  // 'positionPremiums': [
  //   {
  //     'id': 1864,
  //     'start': '2016-04-01',
  //     'end': '2017-03-31',
  //     'isInconvenient': true,
  //     'premium': {
  //       'id': 434,
  //       'code': 23,
  //       'description': 'Prime nuit stable',
  //     },
  //   },
  // ],
  positionReplacements: [],
  // positionReplacements: [
  //   {
  //     'id': 84697,
  //     'percentage': 100,
  //     'hours': 2.0,
  //     'expenseType': {
  //       'shortDescription': 'Vacances',
  //       'longDescription': 'Vacances',
  //       'code': '01',
  //       'id': 2436,
  //     },
  //   },
  // ],
  'isActivePosition': undefined,
  'employeeOtherPositions': undefined,
  //   'functionalCenter': undefined,
  //   'hoursPer2Weeks': undefined,
  //   'jobTitle': undefined,
  //   'positionDescription': undefined,
  //   'positionNo': undefined,
  //   'shifts': undefined,
  //   'status': undefined,
  // ],
};

const initialState = {
  isLoading: false,
  isLoadingOriginReplacements: false,
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
  isShowOtherPositions: false,
  isOriginOfReplacementsExpanded: false,
};

const mockEntry = { // eslint-disable-line no-unused-vars
  'id': 405763,
  'fourDaySchedule': false,
  'weekend2Days': false,
  'number': 'P_00001',
  'description': 'Infirmier-ère',
  'functionalCenter': {
    'shortDescription': 'Adm. des soins infirmiers x',
    'longDescription': 'Adm. des soins infirmiers x',
    'code': '001171 600001',
    'id': 0,
  },
  'union': {
    'shortDescription': 'AIM-HD',
    'longDescription': 'AIM-HD',
    'code': '20',
    'id': 10000,
  },
  'isActualPosition': true,
  'forThisScenario': false,
  'employee': {
    'id': 112059,
    'firstName': 'TC - syndiqué',
    'lastName': 'Employé 00001',
    'employeeNumber': '00001',
  },
  'jobType': {
    'shortDescription': 'Syndiqué',
    'longDescription': 'Employé syndiqué',
    'code': '2',
    'id': 2429,
  },
  'jobStatus': {
    'shortDescription': 'TCR',
    'longDescription': 'Temps complet régulier',
    'code': 'TCR',
    'id': 2408,
  },
  'jobTitle': {
    'id': 6622,
    'description': 'Infirmier-ère',
    'notaryEmploymentCode': '2471',
  },
  'isEmployeeJobTitle': false,
  'shift': {
    'shortDescription': 'Jour',
    'longDescription': 'Jour',
    'code': 'Jour',
    'id': 2437,
  },
  'hoursPerDay': 7,
  'hoursPer2Weeks': 70,
  'specificHourlyRate': 0,
  'taskPercentage': 100,
  'fullTimeEquivalent': 0.2,
  'totalDaysToDistribute': 10,
  'schedule': {
    'firstWeek': {
      'Sunday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Monday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Tuesday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Wednesday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Thursday': {},
      'Friday': {},
      'Saturday': {
        'workLoad': 1,
        'hours': 7,
      },
    },
    'secondWeek': {
      'Sunday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Monday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Tuesday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Wednesday': {
        'workLoad': 1,
        'hours': 7,
      },
      'Thursday': {},
      'Friday': {},
      'Saturday': {
        'workLoad': 1,
        'hours': 7,
      },
    },
  },
  'positionPremiums': [
    {
      'id': 1864,
      'start': '2016-04-01',
      'end': '2017-03-31',
      'isInconvenient': true,
      'premium': {
        'id': 434,
        'code': 23,
        'description': 'Prime nuit stable',
      },
    },
  ],
  'positionReplacements': [
    {
      'id': 84697,
      'percentage': 100,
      'expenseType': {
        'shortDescription': 'Vacances',
        'longDescription': 'Vacances',
        'code': '01',
        'id': 2436,
      },
    },
  ],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }
    case POSITIONS_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }
    case POSITION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
      };
    }
    case POSITION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: { ...emptyEntry, ...action.payload },
        positionId: action.options.resource.positionId,
        isOriginOfReplacementsExpanded: false,
      };
    }
    case POSITION_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }
    case POSITIONS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case POSITIONS_SUCCESS: {
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
    case POSITIONS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case POSITIONS_SHOW_OTHER_POSITIONS: {
      return {
        ...state,
        isShowOtherPositions: !state.isShowOtherPositions,
      };
    }

    case POSITIONS_ORIGIN_OF_REPLACEMENTS_EXPAND: {
      return {
        ...state,
        isOriginOfReplacementsExpanded: !state.isOriginOfReplacementsExpanded,
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

    default:
      return state;
  }
}
