export const DASHBOARD_SET_BUDGETS = 'DASHBOARD_SET_BUDGETS';
export const DASHBOARD_GET_DATA = 'DASHBOARD_GET_DATA';
export const DASHBOARD_GOT_DATA = 'DASHBOARD_GOT_DATA';
export const DASHBOARD_SET_PERIOD = 'DASHBOARD_SET_PERIOD';
export const DASHBOARD_GOT_PERIOD = 'DASHBOARD_GOT_PERIOD';
export const DASHBOARD_SET_YEAR = 'DASHBOARD_SET_YEAR';
export const DASHBOARD_GOT_YEAR = 'DASHBOARD_GOT_YEAR';
export const DASHBOARD_SET_YEAR_AND_PERIOD = 'DASHBOARD_SET_YEAR_AND_PERIOD';
export const DASHBOARD_EXPAND_CHART = 'DASHBOARD_EXPAND_CHART';
export const DASHBOARD_SET_PAGE_SIZE = 'DASHBOARD_SET_PAGE_SIZE';

export function toggleExpandChart() {
  return {
    type: DASHBOARD_EXPAND_CHART,
  };
}

export function setBudgets(budgets) {
  return {
    type: DASHBOARD_SET_BUDGETS,
    budgets,
  };
}

export function dashboardGetData() {
  return {
    type: DASHBOARD_GET_DATA,
  };
}

export function dashboardGotData() {
  return {
    type: DASHBOARD_GOT_DATA,
  };
}

export function setYear(year) {
  return {
    type: DASHBOARD_SET_YEAR,
    year: +year,
  };
}

export function dashboardGotYear() {
  return {
    type: DASHBOARD_GOT_YEAR,
  };
}

export function setPeriod(period) {
  return {
    type: DASHBOARD_SET_PERIOD,
    period: +period,
  };
}

export function dashboardGotPeriod() {
  return {
    type: DASHBOARD_GOT_PERIOD,
  };
}

export function setYearAndPeriod(year, period) {
  return {
    type: DASHBOARD_SET_YEAR_AND_PERIOD,
    period: +period,
    year: +year,
  };
}

export function setPageSize(pageSize) {
  return {
    type: DASHBOARD_SET_PAGE_SIZE,
    payload: pageSize,
  };
}
