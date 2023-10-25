import {
  GROUP_LEVEL_REQUEST,
  GROUP_LEVEL_SUCCESS,
  GROUP_LEVEL_FAILURE,
} from '../../../../api/actions';
import {
  GROUP_LEVEL_SET_SELECTED,
} from '../actions/group-level';
import { SELECT_SCENARIO_ROW } from '../../../../features/scenario/actions/scenario';
import { RESET_FILTERS } from '../../../general/filter-dropdown/actions';


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
  group: undefined,
  level: undefined,
  hourlyRate: '',
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

    case GROUP_LEVEL_SET_SELECTED: {
      const { group, level, hourlyRate } = action.payload;
      return {
        ...state,
        group,
        level,
        hourlyRate,
      };
    }

    case GROUP_LEVEL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GROUP_LEVEL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        options: action.options.data,
        // paging: { ...action.payload.paging },
      };
    }

    case GROUP_LEVEL_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
