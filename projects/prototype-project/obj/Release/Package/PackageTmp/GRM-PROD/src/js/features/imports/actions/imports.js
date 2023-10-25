export const IMPORT_SET_GROUPS = 'IMPORT_SET_GROUPS';
export const IMPORT_ACCOUNTS_SET_GROUPS = 'IMPORT_ACCOUNTS_SET_GROUPS';
export const IMPORT_OTHER_SCENARIOS_SET_GROUPS = 'IMPORT_OTHER_SCENARIOS_SET_GROUPS';
export const IMPORTS_LOAD_LIST = 'IMPORTS_LOAD_LIST';
export const IMPORT_ACCOUNTS_LOAD_LIST = 'IMPORT_ACCOUNTS_LOAD_LIST';

export function setImportsGroups(groups) {
  return {
    type: IMPORT_SET_GROUPS,
    payload: groups,
  };
}

export function setImportAccountsGroups(groups) {
  return {
    type: IMPORT_ACCOUNTS_SET_GROUPS,
    payload: groups,
  };
}

export function setImportOtherScenariosGroups(groups) {
  return {
    type: IMPORT_OTHER_SCENARIOS_SET_GROUPS,
    payload: groups,
  };
}

export function getImportsList(pageNo, pageSize, force) {
  return {
    type: IMPORTS_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}

export function getImportAccountsList(importScenarioId, pageNo, pageSize, force) {
  return {
    type: IMPORT_ACCOUNTS_LOAD_LIST,
    payload: { importScenarioId, pageNo, pageSize, force },
  };
}
