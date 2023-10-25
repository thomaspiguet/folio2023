export const OTHER_EXPENSES_DELETE = 'OTHER_EXPENSES_DELETE';

export const OTHER_EXPENSES_EDIT_START = 'OTHER_EXPENSES_EDIT_START';
export const OTHER_EXPENSES_EDIT_SAVE = 'OTHER_EXPENSES_EDIT_SAVE';
export const OTHER_EXPENSES_EDIT_CANCEL = 'OTHER_EXPENSES_EDIT_CANCEL';
export const OTHER_EXPENSES_EDIT_CONTINUE = 'OTHER_EXPENSES_EDIT_CONTINUE';

export const OTHER_EXPENSES_SET_ENTRY = 'OTHER_EXPENSES_SET_ENTRY';
export const OTHER_EXPENSES_SET_DETAILS_ENTRY = 'OTHER_EXPENSES_SET_DETAILS_ENTRY';

export const OTHER_EXPENSES_HISTORY_DETAILS_CLOSE = 'OTHER_EXPENSES_HISTORY_DETAILS_CLOSE';
export const OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT = 'OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT';
export const OTHER_EXPENSES_HISTORY_ADD_INDEXATION = 'OTHER_EXPENSES_HISTORY_ADD_INDEXATION';

export const OTHER_EXPENSES_SAVE_HISTORY_START = 'OTHER_EXPENSES_SAVE_HISTORY_START';

export const OTHER_EXPENSES_SET_BUDGET_ACTUAL = 'OTHER_EXPENSES_SET_BUDGET_ACTUAL';
export const OTHER_EXPENSES_SET_PREVIOUS_YEAR = 'OTHER_EXPENSES_SET_PREVIOUS_YEAR';
export const OTHER_EXPENSES_LOAD_DETAILS = 'OTHER_EXPENSES_LOAD_DETAILS';

export function deleteOtherExpenses(args) {
  return {
    type: OTHER_EXPENSES_DELETE,
    payload: {
      otherExpensesId: args.otherExpensesId,
      journal: args.journal,
      otherExpensesTitle: args.otherExpensesTitle,
      scenarioId: args.scenarioId,
    },
  };
}

export function editStart(otherExpensesId) {
  return {
    type: OTHER_EXPENSES_EDIT_START,
    payload: { otherExpensesId },
  };
}

export function editSave(otherExpensesId, newEntry) {
  return {
    type: OTHER_EXPENSES_EDIT_SAVE,
    payload: { otherExpensesId, newEntry },
  };
}

export function editCancel(otherExpensesId) {
  return {
    type: OTHER_EXPENSES_EDIT_CANCEL,
    payload: { otherExpensesId },
  };
}

export function editContinue() {
  return {
    type: OTHER_EXPENSES_EDIT_CONTINUE,
  };
}

export function setEntry(entry) {
  return {
    type: OTHER_EXPENSES_SET_ENTRY,
    payload: entry,
  };
}

export function closeOtherExpensesHistoryDetails() {
  return {
    type: OTHER_EXPENSES_HISTORY_DETAILS_CLOSE,
  };
}

export function addOtherExpensesHistoryAdjustment(totalAmount) {
  return {
    type: OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT,
    payload: {
      totalAmount,
    },
  };
}

export function addOtherExpensesHistoryIndexation(totalAmount) {
  return {
    type: OTHER_EXPENSES_HISTORY_ADD_INDEXATION,
    payload: {
      totalAmount,
    },
  };
}

export function setDetailsEntry(entry) {
  return {
    type: OTHER_EXPENSES_SET_DETAILS_ENTRY,
    payload: entry,
  };
}


export function saveHistoryStart() {
  return {
    type: OTHER_EXPENSES_SAVE_HISTORY_START,
  };
}

export function setBudgetActual(value) {
  return {
    type: OTHER_EXPENSES_SET_BUDGET_ACTUAL,
    payload: value,
  };
}

export function setPreviousYear(value) {
  return {
    type: OTHER_EXPENSES_SET_PREVIOUS_YEAR,
    payload: value,
  };
}

export function getOtherExpensesList(otherExpensesId, force) {
  return {
    type: OTHER_EXPENSES_LOAD_DETAILS,
    payload: { otherExpensesId, force },
  };
}
