import {
  OTHER_RATES_REQUEST,
  OTHER_RATES_SUCCESS,
  OTHER_RATES_FAILURE,
} from '../../../../api/actions';
import {
  OTHER_RATES_SET_GROUPS,
  OTHER_RATES_SET_FILTERS, OTHER_RATES_SET_SELECTED,
} from '../actions/other-rates';
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
  filterCenters: [],
  functionalCenter: {},
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

    case OTHER_RATES_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case OTHER_RATES_SET_FILTERS: {
      return {
        ...state,
        filterCenters: action.payload,
      };
    }

    case OTHER_RATES_SET_SELECTED: {
      const { functionalCenter, hourlyRate } = action.payload;
      return {
        ...state,
        functionalCenter,
        hourlyRate,
      };
    }

    case OTHER_RATES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case OTHER_RATES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
      };
    }

    case OTHER_RATES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
