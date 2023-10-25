export const CLEAR_ACCOUNT_KEYWORD = 'CLEAR_ACCOUNT_KEYWORD';
export const FILTER_ACCOUNT_BY_KEYWORD = 'FILTER_ACCOUNT_BY_KEYWORD';
export const SET_SELECTED_ACCOUNT = 'SET_SELECTED_ACCOUNT';
export const ACCOUNTS_LOAD_LIST = 'ACCOUNTS_LOAD_LIST';

export function filterAccountByKeyword(searchKeyword) {
  return {
    type: FILTER_ACCOUNT_BY_KEYWORD,
    payload: searchKeyword,
  };
}

export function clearAccountKeyword() {
  return {
    type: CLEAR_ACCOUNT_KEYWORD,
  };
}

export function setSelectedAccount(originalRow) {
  return {
    type: SET_SELECTED_ACCOUNT,
    payload: { ...originalRow },
  };
}

export function getAccountsList(filterByOrganizationId, pageNo, pageSize, force) {
  return {
    type: ACCOUNTS_LOAD_LIST,
    payload: { filterByOrganizationId, pageNo, pageSize, force },
  };
}
