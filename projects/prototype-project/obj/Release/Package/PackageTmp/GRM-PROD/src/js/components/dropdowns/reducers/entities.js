import { map, filter, cloneDeep } from 'lodash';

import { convertFunctionalCenter, makeArray } from '../../../utils/utils';

import {
  GET_FUNCTIONAL_CENTER_FAILURE,
  GET_FUNCTIONAL_CENTER_REQUEST,
  GET_FUNCTIONAL_CENTER_SUCCESS,
  ENTITIES_REQUEST,
  ENTITIES_SUCCESS,
  ENTITIES_FAILURE,
} from '../../../api/actions';

import { SELECT_SCENARIO_ROW } from '../../../features/scenario/actions/scenario';
import { RESET_FILTERS } from '../../general/filter-dropdown/actions';

import { HOURS_PER_DAY_OTHER } from '../../../features/required-attendances/constants';
import { SECTION as HOURS_PER_DAY_SECTION, HOURS_PER_DAY_RESULT_TYPE } from '../hours-per-day';
import { SECTION as DISTRIBUTION_EXPENSE_SECTION, DISTRIBUTION_EXPENSE_RESULT_TYPE } from '../distribution-expense-type';


const emptyEntities = {
  items: undefined,
  all: undefined,
  isLoading: false,
  parameters: {},
  queryParameters: {},
};

const initialState = {
  functionalCenters: {
    ...emptyEntities,
  },
};

export function getEntitiesSection(state, section) {
  const data = state.entities[section];
  return data || emptyEntities;
}

export function getEntitiesItems(state, section) {
  return getEntitiesSection(state, section).items;
}

export function getEntitiesAll(state, section) {
  return getEntitiesSection(state, section).all;
}

export function getEntitiesIsLoading(state, section) {
  return getEntitiesSection(state, section).isLoading;
}

export function getEntitiesParameters(state, section) {
  return getEntitiesSection(state, section).parameters;
}

export function getEntitiesQueryParameters(state, section) {
  return getEntitiesSection(state, section).queryParameters;
}

export function getEntitiesMetadata(state, section) {
  return getEntitiesSection(state, section).metadata;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
      };
    }

    case GET_FUNCTIONAL_CENTER_REQUEST: {
      const { metadata, parameters, queryParameters, paging } = action.payload.options.resource;
      return {
        ...state,
        functionalCenters: {
          ...state.functionalCenters,
          isLoading: true,
          metadata: cloneDeep(metadata),
          parameters: cloneDeep(parameters),
          queryParameters: cloneDeep(queryParameters),
          paging,
        },
      };
    }

    case GET_FUNCTIONAL_CENTER_FAILURE: {
      return {
        ...state,
        functionalCenters: {
          ...state.functionalCenters,
          isLoading: false,
        },
      };
    }

    case GET_FUNCTIONAL_CENTER_SUCCESS: {
      const { resource: { filterElementKey, filterElementsIds } } = action.options;
      // TODO: check if API execute filtering and remove lines
      const filtered = filter(action.payload, ({ id }) => {
        if (filterElementKey !== 'UNITEADMIN') return true;
        const filt = makeArray(filterElementsIds);
        if (filt.length === 0) return true;
        return filt.indexOf(id) >= 0;
      });
      // TODO: check if API execute filtering and remove lines
      const items = map(filtered, (item) => ({ ...item, code: convertFunctionalCenter(item.code) }));

      return {
        ...state,
        functionalCenters: {
          ...state.functionalCenters,
          items,
          isLoading: false,
        },
      };
    }

    case ENTITIES_REQUEST: {
      const { section, parameters, queryParameters, paging, metadata } = action.payload.options.resource;
      return {
        ...state,
        [section]: {
          ...emptyEntities,
          isLoading: true,
          metadata: cloneDeep(metadata),
          parameters: cloneDeep(parameters),
          queryParameters: cloneDeep(queryParameters),
          paging,
        },
      };
    }

    case ENTITIES_SUCCESS: {
      const { section, metadata } = action.options.resource;
      let items = action.payload;
      if (section === HOURS_PER_DAY_SECTION && metadata.resultType === HOURS_PER_DAY_RESULT_TYPE) {
        items.unshift({ id: 0, value: HOURS_PER_DAY_OTHER });
      }
      if (action.payload && action.payload.data) {
        items = action.payload.data;
      } else if (section === DISTRIBUTION_EXPENSE_SECTION && metadata.resultType === DISTRIBUTION_EXPENSE_RESULT_TYPE) {
        items = action.payload.map(item => ({
          ...item.expense,
          id: item.id,
        }));
      }
      return {
        ...state,
        [section]: {
          ...state[section],
          items,
          isLoading: false,
        },
      };
    }

    case ENTITIES_FAILURE: {
      const { section } = action.options.resource;
      return {
        ...state,
        [section]: { ...emptyEntities, items: [] },
      };
    }

    default:
      return state;
  }
}
