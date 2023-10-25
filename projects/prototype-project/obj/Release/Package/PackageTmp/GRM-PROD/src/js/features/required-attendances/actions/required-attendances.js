export const REQUIRED_ATTENDANCE_SET_GROUPS = 'REQUIRED_ATTENDANCE_SET_GROUPS';
export const REQUIRED_ATTENDANCE_SUGGESTED_HOURLY_RATE_EXPAND = 'REQUIRED_ATTENDANCE_SUGGESTED_HOURLY_RATE_EXPAND';
export const REQUIRED_ATTENDANCE_ORIGIN_OF_REPLACEMENTS_EXPAND = 'REQUIRED_ATTENDANCE_ORIGIN_OF_REPLACEMENTS_EXPAND';
export const REQUIRED_ATTENDANCE_EDIT_START = 'REQUIRED_ATTENDANCE_EDIT_START';
export const REQUIRED_ATTENDANCE_EDIT_SAVE = 'REQUIRED_ATTENDANCE_EDIT_SAVE';
export const REQUIRED_ATTENDANCE_EDIT_CANCEL = 'REQUIRED_ATTENDANCE_EDIT_CANCEL';
export const REQUIRED_ATTENDANCE_EDIT_CONTINUE = 'REQUIRED_ATTENDANCE_EDIT_CONTINUE';
export const REQUIRED_ATTENDANCE_EDIT_RESTORE_FIELD = 'REQUIRED_ATTENDANCE_EDIT_RESTORE_FIELD';
export const REQUIRED_ATTENDANCE_DELETE = 'REQUIRED_ATTENDANCE_DELETE';
export const REQUIRED_ATTENDANCE_DELETE_FINISHED = 'REQUIRED_ATTENDANCE_DELETE_FINISHED';
export const REQUIRED_ATTENDANCE_COPY_START = 'REQUIRED_ATTENDANCE_COPY_START';
export const REQUIRED_ATTENDANCE_COPY_RUN = 'REQUIRED_ATTENDANCE_COPY_RUN';
export const REQUIRED_ATTENDANCE_COPY_CANCEL = 'REQUIRED_ATTENDANCE_COPY_CANCEL';
export const REQUIRED_ATTENDANCE_COPY_SET_ENTRY = 'REQUIRED_ATTENDANCE_COPY_SET_ENTRY';
export const REQUIRED_ATTENDANCE_COPY_OPTIONS_TOGGLE = 'REQUIRED_ATTENDANCE_COPY_OPTIONS_TOGGLE';
export const REQUIRED_ATTENDANCE_COPY_TARGET_TOGGLE = 'REQUIRED_ATTENDANCE_COPY_TARGET_TOGGLE';
export const REQUIRED_ATTENDANCE_DISTRIBUTION_DELETE = 'REQUIRED_ATTENDANCE_DISTRIBUTION_DELETE';
export const REQUIRED_ATTENDANCE_SET_ENTRY = 'REQUIRED_ATTENDANCE_SET_ENTRY';
export const REQUIRED_ATTENDANCE_DISTRIBUTION_DETAILS_CLOSE = 'REQUIRED_ATTENDANCE_DISTRIBUTION_DETAILS_CLOSE';
export const REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD = 'REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD';
export const REQUIRED_ATTENDANCE_SET_SEARCH_ENTRY = 'REQUIRED_ATTENDANCE_SET_SEARCH_ENTRY';
export const REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH = 'REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH';
export const REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH = 'REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH';
export const REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH = 'REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH';
export const REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH = 'REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH';

export const REQUIRED_ATTENDANCE_LOAD_LIST = 'REQUIRED_ATTENDANCE_LOAD_LIST';

export function applyAdvancedSearch() {
  return {
    type: REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH,
  };
}

export function toggleAdvancedSearch() {
  return {
    type: REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH,
  };
}

export function clearAdvancedSearch() {
  return {
    type: REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH,
  };
}

export function clearActionAdvancedSearch() {
  return {
    type: REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH,
  };
}

export function setSearchEntry(entry) {
  return {
    type: REQUIRED_ATTENDANCE_SET_SEARCH_ENTRY,
    payload: entry,
  };
}

export function setEntry(entry) {
  return {
    type: REQUIRED_ATTENDANCE_SET_ENTRY,
    payload: entry,
  };
}

export function setRequiredAttendanceGroups(groups) {
  return {
    type: REQUIRED_ATTENDANCE_SET_GROUPS,
    payload: groups,
  };
}

export function toggleSuggestedHourlyRateExpand() {
  return {
    type: REQUIRED_ATTENDANCE_SUGGESTED_HOURLY_RATE_EXPAND,
  };
}

export function toggleOriginOfReplacementsExpand() {
  return {
    type: REQUIRED_ATTENDANCE_ORIGIN_OF_REPLACEMENTS_EXPAND,
  };
}

export function editStart(requiredAttendanceId) {
  return {
    type: REQUIRED_ATTENDANCE_EDIT_START,
    payload: { requiredAttendanceId },
  };
}

export function copyStart(id, entry) {
  return {
    type: REQUIRED_ATTENDANCE_COPY_START,
    payload: { id, entry },
  };
}

export function copyRun() {
  return {
    type: REQUIRED_ATTENDANCE_COPY_RUN,
  };
}

export function copyOptionsToggle() {
  return {
    type: REQUIRED_ATTENDANCE_COPY_OPTIONS_TOGGLE,
  };
}

export function copyTargetToggle() {
  return {
    type: REQUIRED_ATTENDANCE_COPY_TARGET_TOGGLE,
  };
}

export function copyCancel(id) {
  return {
    type: REQUIRED_ATTENDANCE_COPY_CANCEL,
    payload: { id },
  };
}

export function copySetEntry(entry) {
  return {
    type: REQUIRED_ATTENDANCE_COPY_SET_ENTRY,
    payload: entry,
  };
}

export function editSave(requiredAttendanceId, newEntry) {
  return {
    type: REQUIRED_ATTENDANCE_EDIT_SAVE,
    payload: { requiredAttendanceId, newEntry },
  };
}

export function editCancel(requiredAttendanceId) {
  return {
    type: REQUIRED_ATTENDANCE_EDIT_CANCEL,
    payload: { requiredAttendanceId },
  };
}

export function editRestoreField(field) {
  return {
    type: REQUIRED_ATTENDANCE_EDIT_RESTORE_FIELD,
    payload: { field },
  };
}

export function editContinue() {
  return {
    type: REQUIRED_ATTENDANCE_EDIT_CONTINUE,
  };
}

export function distributionsDetailClose() {
  return {
    type: REQUIRED_ATTENDANCE_DISTRIBUTION_DETAILS_CLOSE,
  };
}

export function deleteRequiredAttendance(args) {
  return {
    type: REQUIRED_ATTENDANCE_DELETE,
    payload: {
      requiredAttendanceId: args.requiredAttendanceId,
      journal: args.journal,
      requiredAttendanceTitle: args.requiredAttendanceTitle,
      scenarioId: args.scenarioId,
    },
  };
}

export function deletionOfRequiredAttendanceFinished() {
  return {
    type: REQUIRED_ATTENDANCE_DELETE_FINISHED,
  };
}

export function deleteRequiredAttendanceDistribution(args) {
  return {
    type: REQUIRED_ATTENDANCE_DISTRIBUTION_DELETE,
    payload: {
      journal: args.journal,
      description: args.expense && args.expense.longDescription,
      id: args.id,
      requiredAttendanceId: args.requiredAttendanceId,
      scenarioId: args.scenarioId,
    },
  };
}

export function setReferenceSearchKeyWord(keyWord) {
  return {
    type: REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD,
    payload: keyWord,
  };
}

export function getRequiredAttendanceList(actionType, pageNo, pageSize, force) {
  return {
    type: REQUIRED_ATTENDANCE_LOAD_LIST,
    payload: { actionType, pageNo, pageSize, force },
  };
}

