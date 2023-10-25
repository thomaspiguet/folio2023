export const BUDGET_REQUEST_SET_GROUPS = 'BUDGET_REQUEST_SET_GROUPS';
export const BUDGET_REQUEST_SUGGESTED_HOURLY_RATE_EXPAND = 'BUDGET_REQUEST_SUGGESTED_HOURLY_RATE_EXPAND ';
export const BUDGET_REQUEST_EDIT_START = 'BUDGET_REQUEST_EDIT_START';
export const BUDGET_REQUEST_EDIT_SAVE = 'BUDGET_REQUEST_EDIT_SAVE';
export const BUDGET_REQUEST_EDIT_CANCEL = 'BUDGET_REQUEST_EDIT_CANCEL';
export const BUDGET_REQUEST_EDIT_CONTINUE = 'BUDGET_REQUEST_EDIT_CONTINUE';
export const BUDGET_REQUEST_DELETE = 'BUDGET_REQUEST_DELETE';
export const BUDGET_REQUEST_SET_ENTRY = 'BUDGET_REQUEST_SET_ENTRY';
export const BUDGET_REQUEST_SET_SEARCH_ENTRY = 'BUDGET_REQUEST_SET_SEARCH_ENTRY';
export const BUDGET_REQUEST_SET_SEARCH_KEYWORD = 'BUDGET_REQUEST_SET_SEARCH_KEYWORD';
export const BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH = 'BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH';
export const BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH = 'BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH';
export const BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH = 'BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH';
export const BUDGET_REQUEST_APPLY_ADVANCED_SEARCH = 'BUDGET_REQUEST_APPLY_ADVANCED_SEARCH';
export const BUDGET_REQUEST_LOAD_LIST = 'BUDGET_REQUEST_LOAD_LIST';

export function setSearchKeyWord(keyword) {
  return {
    type: BUDGET_REQUEST_SET_SEARCH_KEYWORD,
    payload: keyword,
  };
}

export function applyAdvancedSearch() {
  return {
    type: BUDGET_REQUEST_APPLY_ADVANCED_SEARCH,
  };
}

export function toggleAdvancedSearch() {
  return {
    type: BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH,
  };
}

export function clearAdvancedSearch() {
  return {
    type: BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH,
  };
}

export function clearActionAdvancedSearch() {
  return {
    type: BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH,
  };
}

export function setSearchEntry(entry) {
  return {
    type: BUDGET_REQUEST_SET_SEARCH_ENTRY,
    payload: entry,
  };
}

export function setEntry(entry) {
  return {
    type: BUDGET_REQUEST_SET_ENTRY,
    payload: entry,
  };
}

export function setBudgetRequestGroups(groups) {
  return {
    type: BUDGET_REQUEST_SET_GROUPS,
    payload: groups,
  };
}

export function toggleSuggestedHourlyRateExpand() {
  return {
    type: BUDGET_REQUEST_SUGGESTED_HOURLY_RATE_EXPAND,
  };
}

export function editStart(budgetRequestId) {
  return {
    type: BUDGET_REQUEST_EDIT_START,
    payload: { budgetRequestId },
  };
}

export function editSave(budgetRequestId, newEntry) {
  return {
    type: BUDGET_REQUEST_EDIT_SAVE,
    payload: { budgetRequestId, newEntry },
  };
}

export function editCancel(budgetRequestId) {
  return {
    type: BUDGET_REQUEST_EDIT_CANCEL,
    payload: { budgetRequestId },
  };
}

export function editContinue() {
  return {
    type: BUDGET_REQUEST_EDIT_CONTINUE,
  };
}

export function deleteBudgetRequest(args) {
  return {
    type: BUDGET_REQUEST_DELETE,
    payload: {
      budgetRequestId: args.budgetRequestId,
      journal: args.journal,
      budgetRequestTitle: args.budgetRequestTitle,
      scenarioId: args.scenarioId,
    },
  };
}

export function getBudgetRequestsList(pageNo, pageSize, force) {
  return {
    type: BUDGET_REQUEST_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}
