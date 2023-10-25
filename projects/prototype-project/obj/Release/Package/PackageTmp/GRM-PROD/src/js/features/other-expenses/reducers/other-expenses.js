import fillDefaults from 'json-schema-fill-defaults';
import {
  OTHER_EXPENSES_FAILURE,
  OTHER_EXPENSES_REQUEST,
  OTHER_EXPENSES_SUCCESS,
  OTHER_EXPENSES_METADATA_SUCCESS,
  OTHER_EXPENSES_SAVE_REQUEST,
  OTHER_EXPENSES_SAVE_FAILURE,
  OTHER_EXPENSES_SAVE_SUCCESS,
  OTHER_EXPENSES_RECALCULATE_REQUEST,
  OTHER_EXPENSES_RECALCULATE_SUCCESS,
  OTHER_EXPENSES_RECALCULATE_FAILURE,
  OTHER_EXPENSES_DELETE_REQUEST,
  OTHER_EXPENSES_DELETE_SUCCESS,
  OTHER_EXPENSES_DELETE_FAILURE,
  REVENUE_AND_OTHER_EXPENSES_CREATE_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_CREATE_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_CREATE_FAILURE,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_METADATA_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_RECALCULATE_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_RECALCULATE_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_RECALCULATE_FAILURE,
} from '../../../api/actions';
import {
  OTHER_EXPENSES_EDIT_SAVE,
  OTHER_EXPENSES_EDIT_START,
  OTHER_EXPENSES_SET_ENTRY,
} from '../actions/other-expenses';
import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import { convertFunctionalCenter } from '../../../utils/utils';
import { distributionsSchema, distributionTemplateSchema } from '../../../entities/distribution';
import { distributionOtherAccountSchema } from '../../../entities/other-expenses';
import { calculationBaseSchema } from '../../../entities/calculation-base';

const defaultDistributionsTable = {
  periods: [
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

const emptyEntry = {
  id: undefined,
  generalLedgerAccount: fillDefaults({}, distributionOtherAccountSchema),
  calculationBase: fillDefaults({}, calculationBaseSchema),
  amountToBeDistributed: undefined,
  totalAmount: undefined,
  financialYearGroup: undefined,
  distributions: {},
  distributionType: undefined,
  distributionTemplate: fillDefaults({}, distributionTemplateSchema),
  history: [],
};

const initialState = {
  isLoading: false,
  editMode: false,
  entry: emptyEntry,
  metadata: {},
  isRecalculating: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...state,
      };
    }

    case OTHER_EXPENSES_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: { ...emptyEntry },
        prevHistory: emptyEntry.history,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_CREATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_CREATE_SUCCESS:
    case OTHER_EXPENSES_SAVE_SUCCESS:
    case OTHER_EXPENSES_SUCCESS: {
      const entry = action.payload;
      const { generalLedgerAccount, history: prevHistory } = entry;
      const otherExpensesId = `${ entry.id }`;
      const { resource } = action.options;
      const updatedGeneralLedgerAccountNumber = generalLedgerAccount ? convertFunctionalCenter(generalLedgerAccount.accountNumber) : '';
      return {
        ...state,
        isLoading: false,
        editMode: false,
        entry: {
          ...emptyEntry,
          ...action.payload,
          generalLedgerAccount: {
            ...generalLedgerAccount,
            accountNumber: updatedGeneralLedgerAccountNumber,
          },
        },
        otherExpensesId,
        prevHistory: [...prevHistory],
        validationErrors: null,
        isSaving: false,
        listResource: resource,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS: {
      const entry = action.payload;
      return {
        ...state,
        isLoading: false,
        editMode: true,
        entry: {
          ...emptyEntry,
          ...entry,
          distributions: fillDefaults(defaultDistributionsTable, distributionsSchema),
          history: null,
          historySummaryLine1: null,
          historySummaryLine2: null,
          historySummaryLine3: null,
        },
        otherExpensesId: 0,
        prevHistory: null,
        validationErrors: null,
        isSaving: false,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
        editMode: true,
      };
    }

    case OTHER_EXPENSES_FAILURE: {
      return {
        ...initialState,
        isLoading: false,
        entry: emptyEntry,
        prevHistory: emptyEntry.history,
      };
    }

    case OTHER_EXPENSES_EDIT_START: {
      const editMode = !!state.metadata;
      return {
        ...state,
        editMode,
        prevHistory: editMode ? [...state.entry.history] : emptyEntry.history,
      };
    }

    case OTHER_EXPENSES_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
        prevHistory: [...state.entry.history],
      };
    }

    case OTHER_EXPENSES_SET_ENTRY: {
      return {
        ...state,
        entry: action.payload,
        validationErrors: null,
      };
    }

    case OTHER_EXPENSES_SAVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_CREATE_FAILURE:
    case OTHER_EXPENSES_SAVE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        validationErrors: { ...action.payload, responseError: action.error },
        isSaving: false,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_RECALCULATE_REQUEST:
    case OTHER_EXPENSES_RECALCULATE_REQUEST: {
      return {
        ...state,
        isRecalculating: true,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_RECALCULATE_SUCCESS: {
      const { distribution } = action.payload;
      return {
        ...state,
        entry: {
          ...state.entry,
          distributions: fillDefaults(distribution, distributionsSchema),
          totalAmount: distribution.totalAmount,
        },
        isRecalculating: false,
      };
    }

    case OTHER_EXPENSES_RECALCULATE_SUCCESS: {
      const { history, distribution } = action.payload;
      const historySummaryLine3 = state.entry.historySummaryLine3;
      return {
        ...state,
        entry: {
          ...state.entry,
          distributions: fillDefaults(distribution, distributionsSchema),
          amountToBeDistributed: distribution.amountToBeDistributed,
          totalAmount: distribution.totalAmount,
          historySummaryLine3: { ...historySummaryLine3, budgetAmount: distribution.totalAmount },
          history,
        },
        prevHistory: [...history],
        isRecalculating: false,
      };
    }

    case REVENUE_AND_OTHER_EXPENSES_RECALCULATE_FAILURE:
    case OTHER_EXPENSES_RECALCULATE_FAILURE: {
      return {
        ...state,
        isRecalculating: false,
      };
    }

    case OTHER_EXPENSES_DELETE_REQUEST: {
      return {
        ...state,
        validationErrors: null,
      };
    }

    case OTHER_EXPENSES_DELETE_FAILURE: {
      return {
        ...state,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case OTHER_EXPENSES_DELETE_SUCCESS: {
      return {
        ...state,
        validationErrors: null,
      };
    }

    case OTHER_EXPENSES_EDIT_SAVE: {
      return {
        ...state,
        isSaving: true,
      };
    }

    default:
      return state;
  }
}
