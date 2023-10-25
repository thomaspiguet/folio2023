export const SALARIES_SET_DETAIL_ID = 'SALARIES_SET_DETAIL_ID';
export const SALARIES_SET_GROUPS = 'SALARIES_SET_GROUPS';
export const SALARIES_APPLY_COLUMNS_CUSTOMIZATION = 'SALARIES_APPLY_COLUMNS_CUSTOMIZATION';
export const SALARIES_RESTORE_DEFAULT_COLUMNS = 'SALARIES_RESTORE_DEFAULT_COLUMNS';

export const SALARIES_GOT_GROUPS = 'SALARIES_GOT_GROUPS';
export const SALARIES_SET_EXPANDED = 'SALARIES_SET_EXPANDED';
export const SALARIES_SET_FILTERS = 'SALARIES_SET_FILTERS';
export const SALARIES_SET_SORTING = 'SALARIES_SET_SORTING';

export const SALARIES_EXPAND_ALL = 'SALARIES_EXPAND_ALL';
export const SALARIES_COLLAPSE_ALL = 'SALARIES_COLLAPSE_ALL';

export const SALARIES_OPEN_FILTER = 'SALARIES_OPEN_FILTER';
export const SALARIES_LOAD_BUDGET_DETAILS = 'SALARIES_LOAD_BUDGET_DETAILS';

export const SET_DEFAULT_CUSTOMIZED_COLUMNS = 'SET_DEFAULT_CUSTOMIZED_COLUMNS';

export function setDetailId(detailsId) {
  return {
    type: SALARIES_SET_DETAIL_ID,
    payload: detailsId,
  };
}

export function setDefaultCustomizedColumns(columns) {
  return {
    type: SET_DEFAULT_CUSTOMIZED_COLUMNS,
    payload: columns,
  };
}

export function setGroups(groups) {
  return {
    type: SALARIES_SET_GROUPS,
    payload: groups,
  };
}

export function gotGroups(groups, values) {
  return {
    type: SALARIES_GOT_GROUPS,
    payload: { groups, values },
  };
}

export function setExpanded(filters, groupId, nextGroup, hash, groupBy, isExpanded, recursive) {
  return {
    type: SALARIES_SET_EXPANDED,
    payload: { filters, groupId, nextGroup, hash, groupBy, isExpanded, recursive },
  };
}

export function applyColumnsCustomization(customizedColumns) {
  return {
    type: SALARIES_APPLY_COLUMNS_CUSTOMIZATION,
    payload: customizedColumns,
  };
}

export function restoreDefaultColumns() {
  return {
    type: SALARIES_RESTORE_DEFAULT_COLUMNS,
  };
}

export function expandAll() {
  return {
    type: SALARIES_EXPAND_ALL,
  };
}

export function collapseAll() {
  return {
    type: SALARIES_COLLAPSE_ALL,
  };
}

export function openFilter(columnId) {
  return {
    type: SALARIES_OPEN_FILTER,
    payload: columnId,
  };
}

export function setFilters(columnId, filters) {
  return {
    type: SALARIES_SET_FILTERS,
    payload: { columnId, filters },
  };
}

export function setSorting(columnId, order) {
  return {
    type: SALARIES_SET_SORTING,
    payload: { columnId, order },
  };
}

export function loadBudgetDetails(detailId, pageNo, pageSize, sorting, force) {
  return {
    type: SALARIES_LOAD_BUDGET_DETAILS,
    payload: { detailId, pageNo, pageSize, sorting, force },
  };
}
