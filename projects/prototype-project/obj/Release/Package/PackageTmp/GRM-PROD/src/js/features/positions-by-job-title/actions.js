export const POSITIONS_BY_JOB_TITLE_SET_GROUPS = 'POSITIONS_BY_JOB_TITLE_SET_GROUPS';
export const POSITIONS_BY_JOB_TITLE_SUGGESTED_HOURLY_RATE_EXPAND = 'POSITIONS_BY_JOB_TITLE_SUGGESTED_HOURLY_RATE_EXPAND ';
export const POSITIONS_BY_JOB_TITLE_LOAD_LIST = 'POSITIONS_BY_JOB_TITLE_LOAD_LIST ';

export function setGroups(groups) {
  return {
    type: POSITIONS_BY_JOB_TITLE_SET_GROUPS,
    payload: groups,
  };
}

export function toggleSuggestedHourlyRateExpand() {
  return {
    type: POSITIONS_BY_JOB_TITLE_SUGGESTED_HOURLY_RATE_EXPAND,
  };
}

export function getPositionsByJobTitleList(pageNo, pageSize, force) {
  return {
    type: POSITIONS_BY_JOB_TITLE_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}
