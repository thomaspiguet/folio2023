import {
  GENERAL_LEDGER_ACCOUNT_REQUEST,
  GENERAL_LEDGER_ACCOUNT_SUCCESS,
  GENERAL_LEDGER_ACCOUNT_FAILURE,
} from '../../../api/actions';
import {
  SET_SELECTED_ACCOUNT,
  CLEAR_ACCOUNT_KEYWORD,
  FILTER_ACCOUNT_BY_KEYWORD,
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
  filterKeyword: '',
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

    case SET_SELECTED_ACCOUNT: {
      return {
        ...state,
        selectedRow: {
          ...action.payload,
        },
      };
    }

    case GENERAL_LEDGER_ACCOUNT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GENERAL_LEDGER_ACCOUNT_SUCCESS: {
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

    case GENERAL_LEDGER_ACCOUNT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case PANEL_CLOSE:
    case CLEAR_ACCOUNT_KEYWORD: {
      return {
        ...state,
        filterKeyword: '',
      };
    }

    case FILTER_ACCOUNT_BY_KEYWORD: {
      return {
        ...state,
        filterKeyword: action.payload,
      };
    }

    default:
      return state;
  }
}
