import { isUndefined, map } from 'lodash';

import fillDefaults from 'json-schema-fill-defaults';
import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import { BREADCRUMBS_SET_ROUTE } from '../../../components/general/breadcrumbs/actions';
import {
  OTHER_EXPENSES_HISTORY_DETAILS_REQUEST,
  OTHER_EXPENSES_HISTORY_DETAILS_SUCCESS,
  OTHER_EXPENSES_HISTORY_DETAILS_FAILURE,
  OTHER_EXPENSES_HISTORY_METADATA_SUCCESS,
  OTHER_EXPENSES_CALCULATE_HISTORY_SUCCESS,
  GET_INDEXATION_PERIODS_SUCCESS,
  OTHER_EXPENSES_SAVE_HISTORY_SUCCESS,
  OTHER_EXPENSES_CANCEL_HISTORY_REQUEST,
  OTHER_EXPENSES_RESERVE_ACCOUNT,
  OTHER_EXPENSES_SAVE_HISTORY_FAILURE,
  OTHER_EXPENSES_CALCULATE_HISTORY_REQUEST,
  OTHER_EXPENSES_CALCULATE_HISTORY_FAILURE,
  OTHER_EXPENSES_BUDGET_DETAILS_REQUEST,
  OTHER_EXPENSES_BUDGET_DETAILS_SUCCESS,
  OTHER_EXPENSES_BUDGET_DETAILS_FAILURE,
  OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST,
  OTHER_EXPENSES_ACTUAL_DETAILS_SUCCESS,
  OTHER_EXPENSES_ACTUAL_DETAILS_FAILURE,
} from '../../../api/actions';
import {
  OTHER_EXPENSES_EDIT_START,
  OTHER_EXPENSES_HISTORY_DETAILS_CLOSE,
  OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT,
  OTHER_EXPENSES_HISTORY_ADD_INDEXATION,
  OTHER_EXPENSES_SET_DETAILS_ENTRY,
  OTHER_EXPENSES_SET_BUDGET_ACTUAL,
  OTHER_EXPENSES_SAVE_HISTORY_START,
  OTHER_EXPENSES_SET_PREVIOUS_YEAR,
} from '../actions/other-expenses';
import {
  otherExpensesIndexationSchema,
  otherExpensesDistributionSchema,
  OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT,
  OTHER_EXPENSES_HISTORY_TYPE_INDEXATION,
} from '../../../entities/other-expenses';
import {
  ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD,
} from '../../../entities/distribution';

const emptyIndexation = {
  rate: 0,
  origin: 'generalLedgerAccount',
  originDescription: 'General Ledger Account',
  period: { start: '1', end: '13' },
};

const emptyEntry = {
  id: undefined,
  adjustedAmount: 0,
  totalAmount: undefined,
  indexation: fillDefaults(emptyIndexation, otherExpensesIndexationSchema),
  distribution: fillDefaults({}, otherExpensesDistributionSchema),
  type: undefined,
  typeDescription: undefined,
  description: undefined,
};

const initialPeriods = [
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
];

const initialSummaryDetails = {
  periods: initialPeriods,
  totalAmount: '-',
  totalRate: '-',
};

const initialState = {
  entry: emptyEntry,

  summaryDetails: initialSummaryDetails,
  isLoadingDetails: false,
  isMasterDetailViewActive: false,
  isSavingHistory: false,
  selectedDataRow: undefined,
  isRecalculating: false,
  metadata: {},
  totalBefore: 0,
  periods: {
    '1': { code: '1' },
    '2': { code: '2' },
    '3': { code: '3' },
    '4': { code: '4' },
    '5': { code: '5' },
    '6': { code: '6' },
    '7': { code: '7' },
    '8': { code: '8' },
    '9': { code: '9' },
    '10': { code: '10' },
    '11': { code: '11' },
    '12': { code: '12' },
    '13': { code: '13' },
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS:
    case BREADCRUMBS_SET_ROUTE:
    case OTHER_EXPENSES_EDIT_START: {
      return {
        ...state,
        isMasterDetailViewActive: false,
        selectedDataRow: undefined,
      };
    }

    case OTHER_EXPENSES_SAVE_HISTORY_START: {
      return {
        ...state,
        isSavingHistory: true,
      };
    }

    case OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST:
    case OTHER_EXPENSES_BUDGET_DETAILS_REQUEST: {
      return {
        ...state,
        summaryDetails: initialSummaryDetails,
        isLoadingDetails: true,
      };
    }

    case OTHER_EXPENSES_ACTUAL_DETAILS_SUCCESS:
    case OTHER_EXPENSES_BUDGET_DETAILS_SUCCESS: {
      const {
        periods,
        totalAmount,
        totalRate,
      } = action.payload;

      return {
        ...state,
        summaryDetails: {
          periods,
          totalAmount,
          totalRate,
        },
        isLoadingDetails: false,
      };
    }

    case OTHER_EXPENSES_ACTUAL_DETAILS_FAILURE:
    case OTHER_EXPENSES_BUDGET_DETAILS_FAILURE: {
      return {
        ...state,
        isLoadingDetails: false,
      };
    }

    case OTHER_EXPENSES_HISTORY_DETAILS_REQUEST: {
      return {
        ...state,
        isLoadingDetails: true,
        selectedDataRow: action.payload.options.resource.id,
      };
    }

    case OTHER_EXPENSES_HISTORY_DETAILS_SUCCESS: {
      const entry = action.payload;
      return {
        ...state,
        entry: {
          ...entry,
          indexation: fillDefaults(action.payload.indexation, otherExpensesIndexationSchema),
          distribution: fillDefaults(action.payload.distribution, otherExpensesDistributionSchema),
        },
        isLoadingDetails: false,
        isMasterDetailViewActive: true,
        selectedDataRow: action.options.resource.id,
      };
    }

    case OTHER_EXPENSES_HISTORY_DETAILS_FAILURE: {
      return {
        ...state,
        isLoadingDetails: false,
      };
    }

    case OTHER_EXPENSES_HISTORY_DETAILS_CLOSE: {
      return {
        ...state,
        isMasterDetailViewActive: false,
        isLoadingDetails: false,
        selectedDataRow: undefined,
      };
    }

    case OTHER_EXPENSES_HISTORY_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
      };
    }

    case OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT: {
      const { totalAmount } = action.payload;
      return {
        ...initialState,
        entry: {
          ...emptyEntry,
          distribution: {
            ...emptyEntry.distribution,
            method: ADJUSTMENT_DISTRIBUTION_TYPE_DIVIDED_BY_NUMBER_OR_DAYS_IN_PERIOD,
          },
          type: OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT,
          totalAmount,
        },
        totalBefore: totalAmount,
        editMode: true,
      };
    }

    case OTHER_EXPENSES_HISTORY_ADD_INDEXATION: {
      const { totalAmount } = action.payload;
      return {
        ...initialState,
        entry: {
          ...emptyEntry,
          distribution: {
            ...emptyEntry.distribution,
          },
          indexation: {
            ...emptyEntry.indexation,
          },
          type: OTHER_EXPENSES_HISTORY_TYPE_INDEXATION,
          adjustedAmount: totalAmount,
          totalAmount,
        },
        totalBefore: totalAmount,
        editMode: true,
      };
    }

    case OTHER_EXPENSES_SET_DETAILS_ENTRY: {
      const entry = action.payload;
      const isChangeType = state.entry.type !== entry.type;
      let adjustedAmount = isUndefined(entry.adjustedAmount) ? 0 : entry.adjustedAmount;
      let totalAmount = entry.totalAmount;
      if (isChangeType) {
        totalAmount = state.totalBefore;
        adjustedAmount = 0;
      }
      const {
        distribution: {
          periods,
          budgetActualOptions: prevBudgetActualOptions,
        },
        distribution,
      } = entry;

      let budgetActualHeaderOption = distribution.budgetActualHeaderOption;

      const budgetActualOptions = periods.length ? map(periods, (row, index) => (
        isUndefined(row.budgetActualOption) ? prevBudgetActualOptions[index] : row.budgetActualOption)) : prevBudgetActualOptions;

      if (budgetActualOptions.reduce((a, b) => { return (a === b) ? a : NaN; })) {
        budgetActualHeaderOption = budgetActualOptions[0];
      } else {
        budgetActualHeaderOption = null;
      }

      return {
        ...state,
        entry: {
          ...entry,
          adjustedAmount,
          totalAmount,
          distribution: {
            ...distribution,
            budgetActualOptions,
            budgetActualHeaderOption,
          },
        },
        validationErrors: null,
      };
    }

    case OTHER_EXPENSES_CALCULATE_HISTORY_REQUEST: {
      return {
        ...state,
        isRecalculating: true,
      };
    }

    case OTHER_EXPENSES_CALCULATE_HISTORY_FAILURE: {
      return {
        ...state,
        isRecalculating: false,
      };
    }

    case OTHER_EXPENSES_CALCULATE_HISTORY_SUCCESS: {
      const {
        beforeDistribution,
        periods,
        totalAmount,
        totalRate,
      } = action.payload;

      return {
        ...state,
        entry: {
          ...state.entry,
          beforeDistribution,
          distribution: {
            ...state.entry.distribution,
            periods,
            totalRate,
          },
          totalAmount,
        },
        isRecalculating: false,
      };
    }

    case GET_INDEXATION_PERIODS_SUCCESS: {
      const periods = {};
      action.payload.forEach((period, index, array) => {
        if (array.length - 1 === index) return;
        periods[period.code] = period;
      });

      return {
        ...state,
        periods,
      };
    }

    case OTHER_EXPENSES_CANCEL_HISTORY_REQUEST:
    case OTHER_EXPENSES_SAVE_HISTORY_SUCCESS: {
      return {
        ...state,
        editMode: false,
        isSavingHistory: false,
      };
    }

    case OTHER_EXPENSES_SAVE_HISTORY_FAILURE: {
      return {
        ...state,
        isLoading: false,
        isSavingHistory: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case OTHER_EXPENSES_RESERVE_ACCOUNT: {
      const {
        metadata: { isReserveAccount },
        entry,
      } = state;
      const {
        indexation,
        indexation: { period },
        indexation: { period: { start, end } },
      } = entry;
      return {
        ...state,
        periodsDisabled: isReserveAccount,
        entry: {
          ...entry,
          indexation: {
            ...indexation,
            period: {
              ...period,
              start: isReserveAccount ? end : start,
            },
          },
        },
      };
    }

    case OTHER_EXPENSES_SET_BUDGET_ACTUAL: {
      const { entry } = state;
      const { distribution } = entry;

      const option = action.payload;

      const periods = distribution.periods;
      const budgetActualOptions = [];

      periods.forEach((period) => {
        period.budgetActualOption = option;
        budgetActualOptions.push(option);
      });

      return {
        ...state,
        entry: {
          ...entry,
          distribution: {
            ...distribution,
            periods,
            budgetActualOptions,
            budgetActualHeaderOption: option,
          },
        },
      };
    }

    case OTHER_EXPENSES_SET_PREVIOUS_YEAR: {
      const { entry } = state;
      const { distribution } = entry;

      const previousYear = action.payload;

      return {
        ...state,
        entry: {
          ...entry,
          distribution: {
            ...distribution,
            previousYear,
          },
        },
      };
    }

    default:
      return state;
  }
}
