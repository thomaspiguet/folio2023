import fillDefaults from 'json-schema-fill-defaults';
import { find } from 'lodash';

import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import {
  DISTRIBUTION_EXPENSE_COPY_SET_ENTRY,
  DISTRIBUTION_EXPENSE_COPY_START,
} from '../actions/distribution-expense';
import {
  DISTRIBUTION_EXPENSE_COPY_DEFAULT_EXPENSE_SUCCESS,
  DISTRIBUTION_EXPENSE_COPY_METADATA_SUCCESS,
  DISTRIBUTION_EXPENSE_COPY_SUCCESS,
} from '../../../api/actions';
import { distributionExpenseCopySchema } from '../../../entities/distribution';

export const distributionExpenseCopySelector = state => state.distributionExpenseCopy;

const initialState = {
  isLoading: false,
  validationErrors: undefined,
  metadata: undefined,
  editMode: true,
  entry: fillDefaults({}, distributionExpenseCopySchema),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
      };
    }

    case RESET_FILTERS: {
      return {
        ...initialState,
      };
    }

    case DISTRIBUTION_EXPENSE_COPY_START: {
      const { id, entry } = action.payload;
      return {
        ...initialState,
        entry: {
          ...fillDefaults(entry, distributionExpenseCopySchema),
          targetFunctionalCenter: [],
          targetDistributionExpenses: [],
          sourceIds: [],
        },
        id,
      };
    }

    case DISTRIBUTION_EXPENSE_COPY_DEFAULT_EXPENSE_SUCCESS: {
      const { expenseId: id } = action.options.resource;
      const defaultExpense = find(action.payload, { id });
      return {
        ...state,
        entry: {
          ...state.entry,
          targetDistributionExpenses: (defaultExpense && defaultExpense.expense ? [{ ...defaultExpense.expense, id }] : []),
        },
      };
    }

    case DISTRIBUTION_EXPENSE_COPY_SET_ENTRY: {
      return {
        ...state,
        entry: action.payload,
      };
    }

    case DISTRIBUTION_EXPENSE_COPY_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
      };
    }

    case DISTRIBUTION_EXPENSE_COPY_SUCCESS: {
      return {
        ...state,
        editMode: false,
      };
    }

    default:
      return state;
  }
}
