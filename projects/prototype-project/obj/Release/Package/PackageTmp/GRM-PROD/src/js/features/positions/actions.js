export const POSITIONS_SET_GROUPS = 'POSITIONS_SET_GROUPS';
export const POSITIONS_SHOW_OTHER_POSITIONS = 'POSITIONS_SHOW_OTHER_POSITIONS';
export const POSITIONS_ORIGIN_OF_REPLACEMENTS_EXPAND = 'POSITIONS_ORIGIN_OF_REPLACEMENTS_EXPAND';
export const POSITIONS_LOAD_LIST = 'POSITIONS_LOAD_LIST';

export function setGroups(groups) {
  return {
    type: POSITIONS_SET_GROUPS,
    payload: groups,
  };
}

export function toggleShowOtherPositions() {
  return {
    type: POSITIONS_SHOW_OTHER_POSITIONS,
  };
}

export function toggleOriginOfReplacementsExpand() {
  return {
    type: POSITIONS_ORIGIN_OF_REPLACEMENTS_EXPAND,
  };
}

export function getPositionsList(pageNo, pageSize, force) {
  return {
    type: POSITIONS_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}
