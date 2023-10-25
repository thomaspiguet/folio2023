import {
  IMPORT_ACCOUNTS_REQUEST,
  IMPORT_ACCOUNTS_SUCCESS,
  IMPORT_ACCOUNTS_FAILURE,
  IMPORT_ACCOUNT_REQUEST,
  IMPORT_ACCOUNT_SUCCESS,
  IMPORT_ACCOUNT_FAILURE,
  IMPORT_ACCOUNT_DETAILS_REQUEST,
  IMPORT_ACCOUNT_DETAILS_SUCCESS,
  IMPORT_ACCOUNT_DETAILS_FAILURE,
} from '../../../api/actions';
import {
  IMPORT_ACCOUNTS_SET_GROUPS,
} from '../actions/imports';
import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';

const emptyEntry = {
  'accountNumber': undefined,
  'description': undefined,
  'id': undefined,
  'importId': undefined,
  'financailAccount': {},
  'statisticalAccount': {},
};

const initialState = {
  isLoading: false,
  isAccountDetailsLoading: false,
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
    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }

    case IMPORT_ACCOUNTS_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case IMPORT_ACCOUNTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case IMPORT_ACCOUNTS_SUCCESS: {
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

    case IMPORT_ACCOUNTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case IMPORT_ACCOUNT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
      };
    }

    case IMPORT_ACCOUNT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
        },
      };
    }

    case IMPORT_ACCOUNT_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    case IMPORT_ACCOUNT_DETAILS_REQUEST: {
      return {
        ...state,
        isAccountDetailsLoading: true,
        entry: emptyEntry,
      };
    }

    case IMPORT_ACCOUNT_DETAILS_SUCCESS: {
      return {
        ...state,
        isAccountDetailsLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
        },
      };
    }

    case IMPORT_ACCOUNT_DETAILS_FAILURE: {
      return {
        ...state,
        isAccountDetailsLoading: false,
        entry: emptyEntry,
      };
    }

    default:
      return state;
  }
}
