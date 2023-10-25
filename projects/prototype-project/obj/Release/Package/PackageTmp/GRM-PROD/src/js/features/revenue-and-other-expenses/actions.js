export const REVENUE_AND_OTHER_EXPENSES_LOAD_LIST = 'REVENUE_AND_OTHER_EXPENSES_LOAD_LIST';

export function getRevenueAndOtherExpensesList(pageNo, pageSize, force) {
  return {
    type: REVENUE_AND_OTHER_EXPENSES_LOAD_LIST,
    payload: { pageNo, pageSize, force },
  };
}
