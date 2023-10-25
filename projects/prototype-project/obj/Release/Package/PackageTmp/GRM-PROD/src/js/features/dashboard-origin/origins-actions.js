export const ORIGINS_SET_CONTEXT = 'ORIGINS_SET_CONTEXT';
export const ORIGINS_SET_GROUPS = 'ORIGINS_SET_GROUPS';
export const ORIGINS_APPLY_COLUMNS_CUSTOMIZATION = 'ORIGINS_APPLY_COLUMNS_CUSTOMIZATION';
export const ORIGINS_RESTORE_DEFAULT_COLUMNS = 'ORIGINS_RESTORE_DEFAULT_COLUMNS';

export function setContext(context) {
  return {
    type: ORIGINS_SET_CONTEXT,
    payload: context,
  };
}

export function setGroups(groups) {
  return {
    type: ORIGINS_SET_GROUPS,
    payload: groups,
  };
}

export function applyColumnsCustomization(customizedColumns) {
  return {
    type: ORIGINS_APPLY_COLUMNS_CUSTOMIZATION,
    payload: customizedColumns,
  };
}

export function restoreDefaultColumns() {
  return {
    type: ORIGINS_RESTORE_DEFAULT_COLUMNS,
  };
}
