export const DISTRIBUTION_EXPENSE_EDIT_START = 'DISTRIBUTION_EXPENSE_EDIT_START';
export const DISTRIBUTION_EXPENSE_CREATE_START = 'DISTRIBUTION_EXPENSE_CREATE_START';
export const DISTRIBUTION_EXPENSE_EDIT_CANCEL = 'DISTRIBUTION_EXPENSE_EDIT_CANCEL';
export const DISTRIBUTION_EXPENSE_EDIT_SAVE = 'DISTRIBUTION_EXPENSE_EDIT_SAVE';
export const DISTRIBUTION_EXPENSE_SET_ENTRY = 'DISTRIBUTION_EXPENSE_SET_ENTRY';
export const DISTRIBUTION_EXPENSE_HOURLY_RATE_EXPAND = 'DISTRIBUTION_EXPENSE_HOURLY_RATE_EXPAND';
export const DISTRIBUTION_EXPENSE_COPY_START = 'DISTRIBUTION_EXPENSE_COPY_START';
export const DISTRIBUTION_EXPENSE_COPY_CANCEL = 'DISTRIBUTION_EXPENSE_COPY_CANCEL';
export const DISTRIBUTION_EXPENSE_COPY_RUN = 'DISTRIBUTION_EXPENSE_COPY_RUN';
export const DISTRIBUTION_EXPENSE_COPY_SET_ENTRY = 'DISTRIBUTION_EXPENSE_COPY_SET_ENTRY';


export function setEntry(entry) {
  return {
    type: DISTRIBUTION_EXPENSE_SET_ENTRY,
    payload: entry,
  };
}

export function editStart(id) {
  return {
    type: DISTRIBUTION_EXPENSE_EDIT_START,
    payload: { id },
  };
}

export function createDistributionExpense(id) {
  return {
    type: DISTRIBUTION_EXPENSE_CREATE_START,
    payload: { id },
  };
}

export function editCancel(id) {
  return {
    type: DISTRIBUTION_EXPENSE_EDIT_CANCEL,
    payload: { id },
  };
}

export function editSave(id, newEntry) {
  return {
    type: DISTRIBUTION_EXPENSE_EDIT_SAVE,
    payload: { id, newEntry },
  };
}

export function toggleSuggestedHourlyRateExpand() {
  return {
    type: DISTRIBUTION_EXPENSE_HOURLY_RATE_EXPAND,
  };
}

export function copyStart(id, entry) {
  return {
    type: DISTRIBUTION_EXPENSE_COPY_START,
    payload: { id, entry },
  };
}

export function copyRun() {
  return {
    type: DISTRIBUTION_EXPENSE_COPY_RUN,
  };
}

export function copyCancel(id) {
  return {
    type: DISTRIBUTION_EXPENSE_COPY_CANCEL,
    payload: { id },
  };
}


export function copySetEntry(entry) {
  return {
    type: DISTRIBUTION_EXPENSE_COPY_SET_ENTRY,
    payload: entry,
  };
}
