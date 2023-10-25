import { compose } from 'redux';
import { cloneDeep, each, isEqual } from 'lodash';

import {
  BUDGET_DETAILS_FAILURE,
  BUDGET_DETAILS_GROUPS_FAILURE,
  BUDGET_DETAILS_GROUPS_REQUEST,
  BUDGET_DETAILS_GROUPS_SUCCESS,
  BUDGET_DETAILS_REQUEST,
  BUDGET_DETAILS_SUCCESS,
  BUDGET_FILTER_VALUES_SUCCESS,
  BUDGET_REQUEST_DELETE_SUCCESS,
  OTHER_EXPENSES_DELETE_SUCCESS,
} from '../../api/actions';
import {
  SALARIES_APPLY_COLUMNS_CUSTOMIZATION,
  SALARIES_GOT_GROUPS,
  SALARIES_OPEN_FILTER,
  SALARIES_RESTORE_DEFAULT_COLUMNS,
  SALARIES_SET_DETAIL_ID,
  SALARIES_SET_EXPANDED,
  SALARIES_SET_FILTERS,
  SALARIES_SET_GROUPS,
  SALARIES_SET_SORTING,
  SET_DEFAULT_CUSTOMIZED_COLUMNS,
} from './actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';
import { accessElement } from '../../utils/selectors/currency';
import { calculateHash, convertGroupData, setHashRef, fillColumnsInfo } from '../../utils/utils';

const defaultPaging = {
  'pageNo': 1, // from 1
  'pageSize': 30,
  'pageCount': -1,
  'recordCount': undefined,
};

export const initialState = {
  isLoading: 0,
  functionalCenters: {},
  positions: {},
  detailId: undefined,
  options: {},
  cashedKeys: {},
};

const emptyGroupData = {
  isLoading: false,
  filters: [],
  data: [],
  isExpanded: {},
  groupId: undefined,
  paging: {},
};

const emptyFilterData = {
  selected: undefined,
  all: {},
  active: {},
  filterHash: undefined,
};

const initialDetailState = {
  data: undefined,
  paging: { ...defaultPaging },
  dataGroups: {},
  groups: undefined,
  columns: undefined,
  filter: emptyFilterData,
  sorting: {},
  resultSorting: {},
};

export function getDetailKey(detailId) {
  return `detail-${ detailId }`;
}

export function getFilterData(state, detailId) {
  const subState = state[getDetailKey(detailId)];
  return (subState && subState.filter) ? subState.filter : { ...emptyFilterData };
}

function getFiltersHash(parentHash, filters) {
  return calculateHash(filters);
}

function saveCustomizedColumns(state) {
  const detailsColumns = {};
  each(state.cashedKeys, (value, detailKey) => {
    detailsColumns[detailKey] = {
      ...initialDetailState,
      columns: state[detailKey].columns,
    };
  });
  return detailsColumns;
}

function buildColumnFilters(filterData) {
  const filters = [];
  each(filterData.active, (columnFilters) => {
    each(columnFilters, (filter) => {
      filters.push(filter);
    });
  });
  return filters;
}

export function buildCustomFilters(salaries, detailId) {
  const filterData = getFilterData(salaries, detailId);
  return buildColumnFilters(filterData);
}

function fillData(data, functionalCenters, positions) {
  each(data, (item) => {
    const info = item.generalInformation;
    if (info && info.functionalCenterId) {
      functionalCenters[info.functionalCenterId] = info.functionalCenter;
    }
    if (info && info.originDescription) {
      positions[info.originDescription.value] = info.originDescription.displayValue;
    }
  });
}

function calcLoading(state, value, predicate = true) {
  if (!predicate) {
    return state.isLoading;
  }
  const isLoading = state.isLoading + (value ? 1 : -1);
  return isLoading < 0 ? 0 : isLoading;
}

export const detailKeySuccessActionSelector = compose(
  getDetailKey,
  action => action.options.resource.detailId);

export const detailKeyRequestActionSelector = compose(
  getDetailKey,
  action => action.payload.options.resource.detailId);

export const detailKeyStateSelector = compose(
  getDetailKey,
  state => state.detailId);

export const detailSelector = compose(
  ({ salaries, detailId }) => (detailId && salaries[getDetailKey(detailId)] || { ...initialDetailState }),
  (state, detailId) => ({
    salaries: state.salaries,
    detailId: detailId || state.salaries.detailId,
  })
);

export function detailReducer(state = initialDetailState, action, context) {
  switch (action.type) {

    case BUDGET_FILTER_VALUES_SUCCESS: {
      const { columnId } = action.options.resource;
      const filter = state.filter;
      return {
        ...state,
        filter: { ...filter, all: { ...filter.all, [columnId]: action.payload.data } },
      };
    }

    case SALARIES_OPEN_FILTER: {
      const columnId = action.payload;
      const filter = state.filter;
      const selected = filter.selected === columnId ? undefined : columnId;
      return {
        ...state,
        filter: { ...filter, selected },
      };
    }

    case SALARIES_SET_FILTERS: {
      const { columnId, filters } = action.payload;
      const filterData = state.filter;
      const customFilters = buildColumnFilters(filterData);
      const filterHash = calculateHash(customFilters);
      return {
        ...initialDetailState,
        columns: state.columns,
        groups: [],
        filter: { ...filterData, active: { ...filterData.active, [columnId]: filters }, filterHash },
        paging: { ...defaultPaging },
        sorting: state.sorting,
      };
    }

    case SALARIES_SET_SORTING: {
      const { columnId, order } = action.payload;
      return {
        ...state,
        sorting: { columnId, order },
      };
    }

    case SALARIES_SET_EXPANDED: {
      const { hash, isExpanded, groupBy, groupId } = action.payload;
      const groupData = state.dataGroups;
      if (!groupData) {
        return state;
      }
      const subGroup = groupData[hash];
      if (!subGroup) {
        return state;
      }
      each(subGroup.data, (row) => {
        if (isEqual(accessElement(row, groupId), groupBy)) {
          row._expanded = isExpanded;
        }
      });
      return {
        ...state,
        dataGroups: {
          ...groupData,
          [hash]: { ...subGroup },
        },
      };
    }

    case SALARIES_SET_GROUPS: {
      const groups = action.payload;
      return {
        ...initialDetailState,
        columns: state.columns,
        groups,
        dataGroups: {},
        paging: { ...defaultPaging },
      };
    }

    case SALARIES_GOT_GROUPS: {
      const { groups } = action.payload;
      return {
        ...state,
        groups,
      };
    }

    case SALARIES_SET_DETAIL_ID: {
      return {
        ...state,
        groups: state.groups || [],
        paging: state.paging || { ...defaultPaging },
      };
    }

    case BUDGET_DETAILS_REQUEST: {
      const { filters, groups, parentHash } = action.payload.options.resource;
      if (filters && groups && groups.length) {
        const groupData = state.dataGroups;
        const hash = getFiltersHash(parentHash, filters);
        setHashRef(parentHash, hash, groupData, filters);
        groupData[hash] = { ...cloneDeep(emptyGroupData), filter: filters, isLoading: true };
        context.isLoading = calcLoading(context, true, !filters.length);
        return {
          ...state,
          dataGroups: { ...groupData },
        };
      }
      context.isLoading = calcLoading(context, true);
      return state;
    }

    case BUDGET_DETAILS_SUCCESS: {
      const functionalCenters = { ...context.functionalCenters };
      const positions = { ...context.positions };
      fillData(action.payload.data, functionalCenters, positions);
      const { filters, groups, parentHash, sorting } = action.options.resource;

      context.functionalCenters = functionalCenters;
      context.positions = positions;
      if (filters && groups && groups.length) {
        const hash = getFiltersHash(parentHash, filters);
        const groupData = { ...state.dataGroups };
        setHashRef(parentHash, hash, groupData, filters);
        groupData[hash] = { ...cloneDeep(emptyGroupData), filters: cloneDeep(filters), data: action.payload.data, isLoading: false };
        context.isLoading = calcLoading(context, false, !filters.length);
        return {
          ...state,
          dataGroups: { ...groupData },
        };
      }

      context.isLoading = calcLoading(context, false);
      context.options = {
        ...action.options.data,
        detailId: action.options.resource.detailId,
      };
      return {
        ...state,
        data: action.payload.data,
        paging: action.payload.paging,
        lastDetailId: action.options.resource.detailId,
        resultSorting: sorting,
      };
    }

    case BUDGET_DETAILS_FAILURE: {
      context.isLoading = calcLoading(context, false);
      return state;
    }

    case BUDGET_DETAILS_GROUPS_REQUEST: {
      const { filters: filter, groupId, parentHash } = action.payload.options.resource;
      const groupData = { ...state.dataGroups };
      const hash = getFiltersHash(parentHash, filter);
      setHashRef(parentHash, hash, groupData, filter);
      groupData[hash] = { ...cloneDeep(emptyGroupData), filter, groupId, isLoading: true, paging: undefined };
      context.isLoading = calcLoading(context, true, !filter.length);
      return {
        ...state,
        dataGroups: { ...groupData },
      };
    }

    case BUDGET_DETAILS_GROUPS_SUCCESS: {
      const { filters, groupId, parentHash } = action.options.resource;
      const { data } = action.payload;
      const groupData = { ...state.dataGroups };
      const hash = getFiltersHash(parentHash, filters);
      setHashRef(parentHash, hash, groupData, filters);
      groupData[hash] = {
        ...cloneDeep(emptyGroupData),
        filters: cloneDeep(filters),
        groupId,
        data: convertGroupData(filters, groupId, data),
        isLoading: false,
      };
      context.isLoading = calcLoading(context, false, !filters.length);
      return {
        ...state,
        dataGroups: { ...groupData },
      };
    }

    case BUDGET_DETAILS_GROUPS_FAILURE: {
      const { filters, parentHash } = action.options.resource;
      const groupData = { ...state.dataGroups };
      const hash = getFiltersHash(parentHash, filters);
      groupData[hash] = { ...emptyGroupData, paging: undefined };
      context.isLoading = calcLoading(context, false);
      return {
        ...state,
        dataGroups: { ...groupData },
      };
    }

    case SALARIES_APPLY_COLUMNS_CUSTOMIZATION: {
      const customColumns = action.payload;

      const columnsData = { ...state.columns };
      fillColumnsInfo(columnsData, customColumns.columnsFixed);
      fillColumnsInfo(columnsData, customColumns.columnsScrolled);
      return {
        ...state,
        columns: columnsData,
      };
    }

    case SET_DEFAULT_CUSTOMIZED_COLUMNS : {
      return {
        ...state,
        columns: action.payload,
      };
    }

    case SALARIES_RESTORE_DEFAULT_COLUMNS: {
      return {
        ...state,
        columns: undefined,
      };
    }

    default:
      return state;
  }

}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case BUDGET_DETAILS_GROUPS_SUCCESS:
    case BUDGET_DETAILS_GROUPS_FAILURE:
    case BUDGET_DETAILS_FAILURE:
    case BUDGET_FILTER_VALUES_SUCCESS: {
      const key = detailKeySuccessActionSelector(action);
      const { isLoading, functionalCenters, positions } = state;
      const context = { isLoading, functionalCenters, positions };
      const value = detailReducer(state[key], action, context);
      return {
        ...state,
        [key]: value,
        ...context,
      };
    }

    case BUDGET_DETAILS_SUCCESS: {
      const key = detailKeySuccessActionSelector(action);
      const context = { isLoading: state.isLoading };
      const value = detailReducer(state[key], action, context);
      return {
        ...state,
        [key]: value,
        ...context,
      };
    }


    case BUDGET_DETAILS_GROUPS_REQUEST:
    case BUDGET_DETAILS_REQUEST: {
      const key = detailKeyRequestActionSelector(action);
      const context = { isLoading: state.isLoading };
      const value = detailReducer(state[key], action, context);
      return {
        ...state,
        [key]: value,
        ...context,
      };
    }

    case SALARIES_RESTORE_DEFAULT_COLUMNS:
    case SALARIES_APPLY_COLUMNS_CUSTOMIZATION:
    case SALARIES_GOT_GROUPS:
    case SALARIES_SET_EXPANDED:
    case SALARIES_SET_SORTING:
    case SALARIES_OPEN_FILTER: {
      const key = detailKeyStateSelector(state);
      return {
        ...state,
        [key]: detailReducer(state[key], action, {}),
      };
    }

    case SALARIES_SET_GROUPS:
    case SALARIES_SET_FILTERS: {
      const { detailId, cashedKeys } = state;
      const key = detailKeyStateSelector(state);
      const detailsColumns = saveCustomizedColumns(state);
      return {
        ...initialState,
        detailId,
        ...detailsColumns,
        [key]: detailReducer(state[key], action, {}),
        cashedKeys,
      };
    }

    case BUDGET_REQUEST_DELETE_SUCCESS:
    case OTHER_EXPENSES_DELETE_SUCCESS:
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      const { cashedKeys } = state;
      const detailsColumns = saveCustomizedColumns(state);
      return {
        ...initialState,
        ...detailsColumns,
        cashedKeys,
      };
    }

    case SALARIES_SET_DETAIL_ID: {
      const detailId = action.payload;
      const key = getDetailKey(detailId);
      const updatedCashedKeys = { ...state.cashedKeys };
      if (!updatedCashedKeys[key]) {
        updatedCashedKeys[key] = true;
      }
      return {
        ...state,
        detailId,
        [key]: detailReducer(state[key], action),
        cashedKeys: updatedCashedKeys,
      };
    }

    case SET_DEFAULT_CUSTOMIZED_COLUMNS : {
      const key = detailKeyStateSelector(state);
      return {
        ...state,
        [key]: detailReducer(state[key], action, {}),
      };
    }

    default:
      return state;
  }
}
