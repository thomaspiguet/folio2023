import fillDefaults from 'json-schema-fill-defaults';

import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import { BREADCRUMBS_SET_ROUTE } from '../../../components/general/breadcrumbs/actions';

import {
  DISTRIBUTION_EXPENSE_CREATE_FAILURE,
  DISTRIBUTION_EXPENSE_CREATE_REQUEST,
  DISTRIBUTION_EXPENSE_CREATE_SUCCESS,
  DISTRIBUTION_EXPENSE_DEFAULT_FAILURE,
  DISTRIBUTION_EXPENSE_DEFAULT_REQUEST,
  DISTRIBUTION_EXPENSE_DEFAULT_SUCCESS,
  DISTRIBUTION_EXPENSE_FAILURE,
  DISTRIBUTION_EXPENSE_METADATA_SUCCESS,
  DISTRIBUTION_EXPENSE_RECALCULATE_FAILURE,
  DISTRIBUTION_EXPENSE_RECALCULATE_REQUEST,
  DISTRIBUTION_EXPENSE_RECALCULATE_SUCCESS,
  DISTRIBUTION_EXPENSE_REQUEST,
  DISTRIBUTION_EXPENSE_SAVE_FAILURE,
  DISTRIBUTION_EXPENSE_SAVE_REQUEST,
  DISTRIBUTION_EXPENSE_SAVE_SUCCESS,
  DISTRIBUTION_EXPENSE_SUCCESS,
  DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_SUCCESS,
  GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_REQUEST,
  GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_SUCCESS,
  GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_FAILURE,
} from '../../../api/actions';
import { distributionExpenseSchema } from '../../../entities/distribution';
import {
  REQUIRED_ATTENDANCE_DISTRIBUTION_DETAILS_CLOSE,
  REQUIRED_ATTENDANCE_EDIT_START,
} from '../actions/required-attendances';
import {
  DISTRIBUTION_EXPENSE_EDIT_CANCEL,
  DISTRIBUTION_EXPENSE_HOURLY_RATE_EXPAND,
  DISTRIBUTION_EXPENSE_SET_ENTRY,
  DISTRIBUTION_EXPENSE_EDIT_SAVE,
} from '../actions/distribution-expense';

const baseEntry = {
  distributions: [
    { period: 1, rate: 0, amount: 0 },
    { period: 2, rate: 0, amount: 0 },
    { period: 3, rate: 0, amount: 0 },
    { period: 4, rate: 0, amount: 0 },
    { period: 5, rate: 0, amount: 0 },
    { period: 6, rate: 0, amount: 0 },
    { period: 7, rate: 0, amount: 0 },
    { period: 8, rate: 0, amount: 0 },
    { period: 9, rate: 0, amount: 0 },
    { period: 10, rate: 0, amount: 0 },
    { period: 11, rate: 0, amount: 0 },
    { period: 12, rate: 0, amount: 0 },
    { period: 13, rate: 0, amount: 0 },
  ],
};

const emptyEntry = fillDefaults(baseEntry, distributionExpenseSchema);

const initialState = {
  entry: emptyEntry,
  isLoadingMaster: false,
  isLoadingDetails: false,
  id: undefined,
  editMode: false,
  metadata: null,
  validationErrors: null,
  isSaving: false,
  isRecalculating: false,
  isSuggestedHourlyRateExpanded: false,
  calculatedSuggestedHourlyRate: 0,
  previousValueToBeDistributed: emptyEntry.valueToBeDistributed,
};

export const distributionExpenseSelector = state => state.distributionExpense;

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS:
    case BREADCRUMBS_SET_ROUTE:
    case REQUIRED_ATTENDANCE_EDIT_START: {
      return {
        ...state,
        isMasterDetailViewActive: false,
        id: undefined,
      };
    }

    case DISTRIBUTION_EXPENSE_REQUEST: {
      return {
        ...state,
        isLoadingDetails: true,
        id: action.payload.options.resource.id,
        previousValueToBeDistributed: emptyEntry.valueToBeDistributed,
      };
    }

    case DISTRIBUTION_EXPENSE_SAVE_SUCCESS:
    case DISTRIBUTION_EXPENSE_SUCCESS: {
      const entry = action.payload;
      return {
        ...state,
        entry: fillDefaults(entry, distributionExpenseSchema),
        isLoadingDetails: false,
        isMasterDetailViewActive: true,
        id: action.options.resource.id,
        editMode: false,
        validationErrors: null,
        previousValueToBeDistributed: entry.valueToBeDistributed,
        isSaving: false,
      };
    }

    case DISTRIBUTION_EXPENSE_DEFAULT_REQUEST: {
      return {
        ...state,
        isMasterDetailViewActive: true,
        isLoadingDetails: true,
        isNew: true,
      };
    }

    case DISTRIBUTION_EXPENSE_DEFAULT_SUCCESS:
    case DISTRIBUTION_EXPENSE_DEFAULT_FAILURE: {
      const entry = action.payload || {};
      return {
        ...state,
        isLoadingDetails: false,
        entry: fillDefaults(entry, distributionExpenseSchema),
        isMasterDetailViewActive: true,
        id: 0,
        editMode: true,
        validationErrors: { ...action.payload, responseError: action.error },
        isNew: true,
        previousValueToBeDistributed: entry.valueToBeDistributed ? entry.valueToBeDistributed : undefined,
      };
    }

    case DISTRIBUTION_EXPENSE_SAVE_REQUEST:
    case DISTRIBUTION_EXPENSE_CREATE_REQUEST: {
      return {
        ...state,
        isLoadingDetails: true,
        validationErrors: null,
      };
    }

    case DISTRIBUTION_EXPENSE_CREATE_SUCCESS: {
      return {
        ...state,
        isLoadingDetails: false,
        isNew: false,
      };
    }

    case DISTRIBUTION_EXPENSE_SAVE_FAILURE:
    case DISTRIBUTION_EXPENSE_FAILURE:
    case DISTRIBUTION_EXPENSE_CREATE_FAILURE: {
      return {
        ...state,
        isLoadingDetails: false,
        isSaving: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case REQUIRED_ATTENDANCE_DISTRIBUTION_DETAILS_CLOSE: {
      return {
        ...state,
        isMasterDetailViewActive: false,
        isLoadingDetail: false,
        id: undefined,
      };
    }

    case DISTRIBUTION_EXPENSE_SET_ENTRY: {
      const entry = action.payload;
      return {
        ...state,
        entry,
      };
    }

    case DISTRIBUTION_EXPENSE_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
        isMasterDetailViewActive: true,
        editMode: true,
      };
    }

    case DISTRIBUTION_EXPENSE_HOURLY_RATE_EXPAND: {
      return {
        ...state,
        isSuggestedHourlyRateExpanded: !state.isSuggestedHourlyRateExpanded,
      };
    }

    case DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          totalToBeDistributed: action.payload,
        },
        previousValueToBeDistributed: action.options.body.valueToBeDistributed,
      };
    }

    case DISTRIBUTION_EXPENSE_RECALCULATE_REQUEST: {
      return {
        ...state,
        isRecalculating: true,
      };
    }

    case DISTRIBUTION_EXPENSE_RECALCULATE_SUCCESS: {
      const { periods, totalAmount, totalRate } = action.payload;

      return {
        ...state,
        entry: {
          ...state.entry,
          distributions: {
            periods,
            totalAmount,
            totalRate,
          },
        },
        isRecalculating: false,
      };
    }

    case DISTRIBUTION_EXPENSE_RECALCULATE_FAILURE: {
      return {
        ...state,
        isRecalculating: false,
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_REQUEST: {
      return {
        ...state,
        calculatedSuggestedHourlyRate: undefined,
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_SUCCESS: {
      const { resource: { setValue } } = action.options;
      const newState = {
        ...state,
        calculatedSuggestedHourlyRate: action.payload,
      };
      if (setValue) {
        newState.entry.suggestedHourlyRate.suggestedHourlyRate = action.payload;
      }
      return newState;
    }

    case GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_FAILURE: {
      return {
        ...state,
        calculatedSuggestedHourlyRate: undefined,
      };
    }

    case DISTRIBUTION_EXPENSE_EDIT_CANCEL: {
      return {
        ...state,
        isNew: false,
        entry: emptyEntry,
      };
    }

    case DISTRIBUTION_EXPENSE_EDIT_SAVE: {
      return {
        ...state,
        isSaving: true,
      };
    }

    default:
      return state;
  }
}
