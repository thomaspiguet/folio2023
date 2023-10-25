export const PARAMETERS_BY_STRUCTURE_SET_GROUPS = 'PARAMETERS_BY_STRUCTURE_SET_GROUPS';
export const PARAMETERS_BY_STRUCTURE_LOAD_LIST = 'PARAMETERS_BY_STRUCTURE_LOAD_LIST';

export function setGroups(groups) {
  return {
    type: PARAMETERS_BY_STRUCTURE_SET_GROUPS,
    payload: groups,
  };
}

export function getParametersByStructureList(pageNo, pageSize, force) {
  return {
    type: PARAMETERS_BY_STRUCTURE_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}
