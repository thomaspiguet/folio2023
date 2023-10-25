import { put, take, call, fork, select, all, cancel, cancelled } from 'redux-saga/effects';

import {
  getBudgetOptions,
  BUDGET_OPTIONS_SUCCESS,
  BUDGET_OPTIONS_FAILURE,
  getBudgetSelected,
  BUDGET_SELECTED_SUCCESS,
  BUDGET_SELECTED_FAILURE,
  getBudgetActualPeriod,
  BUDGET_ACTUAL_PERIOD_SUCCESS,
  BUDGET_ACTUAL_PERIOD_FAILURE,
  getBudgetActualYear,
  BUDGET_ACTUAL_YEAR_SUCCESS,
  BUDGET_ACTUAL_YEAR_FAILURE,
  getBudgetOther,
  BUDGET_OTHER_SUCCESS,
  BUDGET_OTHER_FAILURE,
  getOrganizationYears,
  GET_ORGANIZATIONS_YEARS_SUCCESS,
  GET_ORGANIZATIONS_YEARS_FAILURE,
} from '../../api/actions';

import {
  DASHBOARD_GET_DATA,
  DASHBOARD_SET_PERIOD,
  DASHBOARD_SET_YEAR,
  DASHBOARD_SET_YEAR_AND_PERIOD,
  dashboardGetData,
  dashboardGotData,
  dashboardGotYear,
  dashboardGotPeriod,
} from './actions';

import { haveAuth, authenticationSaga } from '../app/effects/sagas';

export function* dashboardActual() {
  while (true) {
    yield take(DASHBOARD_SET_YEAR_AND_PERIOD);
    yield put(dashboardGetData());
  }
}

function getYearId(years, yearCode) {
  const yearObj = years[yearCode];
  return yearObj ? yearObj.id : null;
}

const organizationYearsSelector = state => state.scenario.organizationYears;
const organizationYearsLoadingSelector = state => state.scenario.organizationYearsLoading;
const organizationIdSelector = state => state.scenario.selectedScenario.organizationId;

function* getActualYearId(actualYear) {
  let organizationYears = yield select(organizationYearsSelector);
  let actualYearId = getYearId(organizationYears, actualYear);
  if (actualYearId === null) {
    const isOrganizationYearsLoading = yield select(organizationYearsLoadingSelector);
    if (!isOrganizationYearsLoading) {
      const organizationId = yield select(organizationIdSelector);
      yield put(getOrganizationYears(organizationId));
    }
    yield take([GET_ORGANIZATIONS_YEARS_SUCCESS, GET_ORGANIZATIONS_YEARS_FAILURE]);
    organizationYears = yield select(organizationYearsSelector);
    actualYearId = getYearId(organizationYears, actualYear);
  }
  return actualYearId;
}

export function* dashboardSetYear() {
  while (true) {
    const { year } = yield take(DASHBOARD_SET_YEAR);
    const actualYearId = yield getActualYearId(year);
    const {
      scenario: { selectedScenario: { scenarioId } },
      filter: {
        selectedDepartment,
        selectedFilterElementsIds,
      } } = yield select();

    yield put(getBudgetActualYear(scenarioId, actualYearId, selectedDepartment, selectedFilterElementsIds));
    yield take([BUDGET_ACTUAL_YEAR_SUCCESS, BUDGET_ACTUAL_YEAR_FAILURE]);
    yield put(dashboardGotYear());
  }
}

export function* dashboardSetPeriod() {
  while (true) {
    const { period } = yield take(DASHBOARD_SET_PERIOD);
    const { scenario: { selectedScenario: { scenarioId, yearId } },
      filter: {
        selectedDepartment,
        selectedFilterElementsIds,
      } } = yield select();

    yield put(getBudgetActualPeriod(scenarioId, yearId, period, selectedDepartment, selectedFilterElementsIds));
    yield take([BUDGET_ACTUAL_PERIOD_SUCCESS, BUDGET_ACTUAL_PERIOD_FAILURE]);
    yield put(dashboardGotPeriod());
  }
}

// set parameters for main dashboard request
export function* dashboardData() {
  try {
    const {
      dashboard,
      scenario: {
        selectedScenario: { scenarioId, yearId },
      },
      filter: {
        selectedDepartment,
        selectedFilterElementsIds,
      },
    } = yield select();

    yield put(getBudgetOptions());
    yield put(getBudgetSelected(scenarioId, selectedDepartment, selectedFilterElementsIds));
    yield put(getBudgetOther(yearId, selectedDepartment, selectedFilterElementsIds));
    yield put(getBudgetActualPeriod(scenarioId, yearId, dashboard.budgetActualPeriod, selectedDepartment, selectedFilterElementsIds));
    const actualYearId = yield getActualYearId(dashboard.budgetActualYear);
    yield put(getBudgetActualYear(scenarioId, actualYearId, selectedDepartment, selectedFilterElementsIds));
    yield all([
      take([BUDGET_OPTIONS_SUCCESS, BUDGET_OPTIONS_FAILURE]),
      take([BUDGET_SELECTED_SUCCESS, BUDGET_SELECTED_FAILURE]),
      take([BUDGET_ACTUAL_PERIOD_SUCCESS, BUDGET_ACTUAL_PERIOD_FAILURE]),
      take([BUDGET_ACTUAL_YEAR_SUCCESS, BUDGET_ACTUAL_YEAR_FAILURE]),
      take([BUDGET_OTHER_SUCCESS, BUDGET_OTHER_FAILURE]),
    ]);

    yield put(dashboardGotData());
  } finally {
    if (yield cancelled()) {
      // do something if task is cancelled
    }
  }
}

export function* takeLatestDashboardData() {
  let lastTask;
  while (true) {
    const action = yield take(DASHBOARD_GET_DATA);
    if (lastTask) {
      yield cancel(lastTask);
    }

    const { app } = yield select();
    // check if state has token
    if (!haveAuth(app)) {
      yield call(authenticationSaga);
    }

    lastTask = yield fork(dashboardData, action);
  }
}
