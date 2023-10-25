import {
  REVENUE_AND_OTHER_EXPENSES_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_FAILURE,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_FAILURE,
} from '../../api/actions';

import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';

const initialState = {
  data: null,
  isLoading: false,
  options: [],
  paging: {
    pageCount: -1,
    pageNo: 1,
    pageSize: 30,
    recordCount: undefined,
  },
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

    case REVENUE_AND_OTHER_EXPENSES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_SUCCESS: {
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

    case REVENUE_AND_OTHER_EXPENSES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_DEFAULT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
