import {
  BENEFITS_DISTRIBUTION_TEMPLATES_REQUEST,
  BENEFITS_DISTRIBUTION_TEMPLATES_SUCCESS,
  BENEFITS_DISTRIBUTION_TEMPLATES_FAILURE,
} from '../../../api/actions';
import {
  SET_SELECTED_BENEFITS_MODEL,
  CLEAR_BENEFITS_MODEL_KEYWORD,
  FILTER_BENEFITS_MODEL_BY_KEYWORD,
} from './actions';

import { PANEL_CLOSE } from '../../general/popup/actions';
import { SELECT_SCENARIO_ROW } from '../../../features/scenario/actions/scenario';
import { RESET_FILTERS } from '../../general/filter-dropdown/actions';

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
  selectedRow: {},
  searchKeyword: '',
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

    case SET_SELECTED_BENEFITS_MODEL: {
      return {
        ...state,
        selectedRow: {
          ...action.payload,
        },
      };
    }

    case BENEFITS_DISTRIBUTION_TEMPLATES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case BENEFITS_DISTRIBUTION_TEMPLATES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
      };
    }

    case BENEFITS_DISTRIBUTION_TEMPLATES_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case PANEL_CLOSE:
    case CLEAR_BENEFITS_MODEL_KEYWORD: {
      return {
        ...state,
        searchKeyword: '',
      };
    }

    case FILTER_BENEFITS_MODEL_BY_KEYWORD: {
      return {
        ...state,
        searchKeyword: action.payload,
      };
    }

    default:
      return state;
  }
}
