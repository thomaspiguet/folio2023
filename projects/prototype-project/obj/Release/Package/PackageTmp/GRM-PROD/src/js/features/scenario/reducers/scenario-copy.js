import { get } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';

import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import {
  SCENARIO_COPY_CANCEL,
  SCENARIO_COPY_INIT,
  SCENARIO_COPY_SET_ENTRY,
} from '../actions/scenario-copy';
import { scenarioCopySchema } from '../entities/scenario';
import { filterDefaults } from '../../../utils/selectors/filter-defaults';
import {
  BUDGET_SCENARIO_COPY_FAILURE,
  BUDGET_SCENARIO_COPY_METADATA_SUCCESS,
  BUDGET_SCENARIO_COPY_SUCCESS,
} from '../../../api/actions';

export const scenarioCopySelector = state => state.scenarioCopy;

const initialState = {
  isLoading: false,
  validationErrors: undefined,
  metadata: undefined,
  editMode: true,
  entry: fillDefaults({}, scenarioCopySchema),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case RESET_FILTERS: {
      return {
        ...initialState,
      };
    }

    case SCENARIO_COPY_INIT: {
      const scenario = action.payload;
      const id = get(scenario, 'scenarioId');
      return {
        ...initialState,
        entry: filterDefaults({
          id,
          scenario,
          targetFinancialYear: {
            id: scenario.yearId,
            value: scenario.year,
          },
          organization: scenario.organization,
          financialYear: scenario.year,
        }, scenarioCopySchema),
      };
    }

    case SCENARIO_COPY_SET_ENTRY: {
      return {
        ...state,
        entry: action.payload,
      };
    }

    case SCENARIO_COPY_CANCEL: {
      return {
        ...state,
        editMode: false,
      };
    }

    case BUDGET_SCENARIO_COPY_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
      };
    }

    case BUDGET_SCENARIO_COPY_SUCCESS: {
      return {
        ...state,
        editMode: false,
      };
    }

    case BUDGET_SCENARIO_COPY_FAILURE: {
      return {
        ...state,
        editMode: true,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    default:
      return state;
  }
}
