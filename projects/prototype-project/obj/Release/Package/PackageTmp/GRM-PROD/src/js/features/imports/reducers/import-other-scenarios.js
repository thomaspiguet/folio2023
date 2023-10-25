import {
  IMPORT_OTHER_SCENARIOS_REQUEST,
  IMPORT_OTHER_SCENARIOS_SUCCESS,
  IMPORT_OTHER_SCENARIOS_FAILURE,
} from '../../../api/actions';
import {
  IMPORT_OTHER_SCENARIOS_SET_GROUPS,
} from '../actions/imports';
import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';

const emptyEntry = {
  'financialYear': undefined,
  'scenarioName': undefined,
  'importNumber': undefined,
  'active': undefined,
  'comment': undefined,
  'additionalInfo': undefined,
  'description': undefined,
  'import': undefined,
  'accounts': [],
  'otherScenarios': [],
};

const initialState = {
  isLoading: false,
  data: null,
  paging: {
    'pageNo': 1,
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
  groups: [],
  options: {},
  entry: emptyEntry,
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

    case IMPORT_OTHER_SCENARIOS_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case IMPORT_OTHER_SCENARIOS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case IMPORT_OTHER_SCENARIOS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
      };
    }

    case IMPORT_OTHER_SCENARIOS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
