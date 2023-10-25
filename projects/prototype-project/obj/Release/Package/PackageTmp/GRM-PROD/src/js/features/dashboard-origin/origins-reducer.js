import {
  ORIGINS_SET_CONTEXT,
  ORIGINS_SET_GROUPS,
  ORIGINS_APPLY_COLUMNS_CUSTOMIZATION,
  ORIGINS_RESTORE_DEFAULT_COLUMNS,
} from './origins-actions';
import {
  BUDGET_DETAILS_ORIGIN_REQUEST,
  BUDGET_DETAILS_ORIGIN_SUCCESS,
  BUDGET_DETAILS_ORIGIN_FAILURE,
  BUDGET_REQUEST_DELETE_SUCCESS,
  BUDGET_DETAILS_REQUEST,
} from '../../api/actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';
import { fillColumnsInfo } from '../../utils/utils';

const initialState = {
  isLoading: false,
  context: {
    detailId: undefined,
    originId: undefined,
    functionalCenterId: undefined,
    scenarioId: undefined,
    filterKey: undefined,
    filterIDs: undefined,
  },
  // 'data-1-1-1': initialData,
  paging: {
    'pageNo': 1, // from 1
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
};

export function getDataKey({ detailId, originId, functionalCenterId }) {
  return `data-${ detailId }-${ originId }-${ functionalCenterId }`;
}

export function getGroupKey({ detailId, originId, functionalCenterId }) {
  return `groups-${ detailId }-${ originId }-${ functionalCenterId }`;
}

export function getColumnsKey({ detailId, originId, functionalCenterId }) {
  return `columns-${ detailId }-${ originId }-${ functionalCenterId }`;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case BUDGET_REQUEST_DELETE_SUCCESS:
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }

    case ORIGINS_SET_CONTEXT: {
      const groupkey = getGroupKey(action.payload);
      return {
        ...state,
        context: action.payload,
        [groupkey]: state[groupkey] || [],
      };
    }

    case BUDGET_DETAILS_REQUEST: {
      const { options: {
        body: {
          scenarioId,
          filterElementKey: filterKey,
          filterElementsIds: filterIDs,
        },
        resource: {
          detailId,
      } } } = action.payload;
      const context = { scenarioId, detailId, filterKey, filterIDs };
      return {
        ...state,
        context,
      };
    }

    case BUDGET_DETAILS_ORIGIN_REQUEST: {
      const { options: {
        body: {
          scenarioId,
          functionalCenterId,
          filterElementKey: filterKey,
          filterElementsIds: filterIDs,
          page,
        },
        resource: { detailId, originId },
      } } = action.payload;
      const context = { scenarioId, detailId, originId, functionalCenterId, filterKey, filterIDs };
      return {
        ...state,
        isLoading: true,
        paging: { ...page },
        context,
      };
    }

    case ORIGINS_SET_GROUPS: {
      return {
        ...state,
        [getGroupKey(state.context)]: action.payload,
      };
    }

    case BUDGET_DETAILS_ORIGIN_SUCCESS: {
      const options = action.options;
      const context = {
        detailId: options.resource.detailId,
        originId: options.resource.originId,
        functionalCenterId: options.body.functionalCenterId,
        scenarioId: options.body.scenarioId,
        filterKey: options.body.filterElementKey,
        filterIDs: options.body.filterElementsIds,
      };
      return {
        ...state,
        isLoading: false,
        context,
        [getDataKey(context)]: action.payload.data,
        paging: action.payload.paging,
      };
    }

    case BUDGET_DETAILS_ORIGIN_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ORIGINS_APPLY_COLUMNS_CUSTOMIZATION: {
      const { context } = state;
      const customColumns = action.payload;

      const columnsKey = getColumnsKey(context);
      const columnsData = { ...state[columnsKey] };
      fillColumnsInfo(columnsData, customColumns.columnsFixed);
      fillColumnsInfo(columnsData, customColumns.columnsScrolled);
      return {
        ...state,
        [columnsKey]: columnsData,
      };
    }

    case ORIGINS_RESTORE_DEFAULT_COLUMNS: {
      const { context } = state;
      const columnsKey = getColumnsKey(context);
      return {
        ...state,
        [columnsKey]: {},
      };
    }

    default:
      return state;
  }
}
