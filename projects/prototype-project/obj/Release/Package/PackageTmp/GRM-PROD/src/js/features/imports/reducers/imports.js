import {
  IMPORTS_REQUEST,
  IMPORTS_SUCCESS,
  IMPORTS_FAILURE,
  IMPORT_REQUEST,
  IMPORT_SUCCESS,
  IMPORT_FAILURE,
} from '../../../api/actions';
import { IMPORT_SET_GROUPS } from '../actions/imports';
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
  'id': undefined,
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

    case IMPORT_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case IMPORTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case IMPORTS_SUCCESS: {
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

    case IMPORTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case IMPORT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
      };
    }

    case IMPORT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
        },
      };
    }

    case IMPORT_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    default:
      return state;
  }
}
