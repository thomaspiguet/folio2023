import { call, put, take, fork, cancel, cancelled, select, all, actionChannel } from 'redux-saga/effects';
import { delay, buffers } from 'redux-saga';
import { find, size } from 'lodash';
import { fetchData } from '../../../api/fetch-wrapper';

import {
  getScenarioOrganizations,
  GET_ORGANIZATIONS_SUCCESS,
  GET_ORGANIZATIONS_FAILURE,
  getAllFinancialYears,
  GET_ALL_YEARS_SUCCESS,
  GET_ALL_YEARS_FAILURE,
  getOrganizationYears,
  GET_ORGANIZATIONS_YEARS_SUCCESS,
  GET_ORGANIZATIONS_YEARS_FAILURE,
  getBudgetScenarios,
  BUDGET_SCENARIOS_REQUEST,
  BUDGET_SCENARIOS_SUCCESS,
  BUDGET_SCENARIOS_FAILURE,
  getScenarioResponsible,
  GET_RESPONSIBLE_SUCCESS,
  GET_RESPONSIBLE_FAILURE,
  getFunctionalCenters,
  GET_FUNCTIONAL_CENTER_SUCCESS,
  GET_FUNCTIONAL_CENTER_FAILURE,
  getYearPeriods,
  GET_ORGANIZATIONS_PERIODS_SUCCESS,
  GET_ORGANIZATIONS_PERIODS_FAILURE,
  getPeriodsForOrganizationYear,
} from '../../../api/actions';

import {
  scenarioGetData,
  SCENARIO_GET_DATA,
  scenarioGotData,
  ORGANIZATION_SELECTED,
  ORGANIZATION_DESELECTED,
  CLEAR_SELECTED_ORGANIZATIONS,
  YEAR_SELECTED,
  YEAR_DESELECTED,
  CLEAR_SELECTED_YEARS,
  RESPONSIBLE_SELECTED,
  RESPONSIBLE_DESELECTED,
  CLEAR_SELECTED_RESPONSIBLE,
  FUNCTIONAL_CENTER_SELECTED,
  FUNCTIONAL_CENTER_DESELECTED,
  CLEAR_SELECTED_FUNCTIONAL_CENTER,
  FILTER_SCENARIOS_BY_KEYWORD,
  CLEAR_SCENARIOS_KEYWORD,
  SELECT_SCENARIO_ROW,
  TOGGLE_SECONDARY,
  TOGGLE_FOLLOW_UP_REPORT,
  TOGGLE_COMPLETE,
  setPreviouslySelectedOptions,
  SCENARIO_BY_ID_SUCCESS,
  selectScenario,
} from '../actions/scenario';

import { DASHBOARD_SET_YEAR_AND_PERIOD, setYearAndPeriod } from '../../dashboard/actions';

import { haveAuth, authenticationSaga } from '../../app/effects/sagas';
import { doLogout } from '../../app/actions';

export const SCENARIO_DEFAULT_PAGE = 1;
export const SCENARIO_DEFAULT_PAGE_SIZE = 10;

export function* getScenarioDataWithPaging() {
  const { scenario: { paging: { pageSize } } } = yield select();
  yield put(scenarioGetData(false, SCENARIO_DEFAULT_PAGE, pageSize));
}

export function* changeOrganizationSelection() {
  while (true) {
    yield take([ORGANIZATION_SELECTED, ORGANIZATION_DESELECTED]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* clearOrganizationSelection() {
  while (true) {
    yield take(CLEAR_SELECTED_ORGANIZATIONS);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeYearsSelection() {
  while (true) {
    yield take([YEAR_SELECTED, YEAR_DESELECTED]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* clearYearsSelection() {
  while (true) {
    yield take(CLEAR_SELECTED_YEARS);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeResponsibleSelection() {
  while (true) {
    yield take([RESPONSIBLE_SELECTED, RESPONSIBLE_DESELECTED]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* clearResponsibleSelection() {
  while (true) {
    yield take(CLEAR_SELECTED_RESPONSIBLE);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeSecondarySelection() {
  while (true) {
    yield take([TOGGLE_SECONDARY]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeFollowUpReportSelection() {
  while (true) {
    yield take([TOGGLE_FOLLOW_UP_REPORT]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeCompleteSelection() {
  while (true) {
    yield take([TOGGLE_COMPLETE]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* changeFunctionalCenterSelection() {
  while (true) {
    yield take([FUNCTIONAL_CENTER_SELECTED, FUNCTIONAL_CENTER_DESELECTED]);
    yield call(getScenarioDataWithPaging);
  }
}

export function* clearFunctionalCenterSelection() {
  while (true) {
    yield take(CLEAR_SELECTED_FUNCTIONAL_CENTER);
    yield call(getScenarioDataWithPaging);
  }
}

export function* clearSearchCriteria() {
  while (true) {
    yield take(CLEAR_SCENARIOS_KEYWORD);
    yield call(getScenarioDataWithPaging);
  }
}

export function* throttleSearchByCriteria() {
  // store only the last action
  const throttleChannel = yield actionChannel(FILTER_SCENARIOS_BY_KEYWORD, buffers.sliding(1));

  while (true) {
    yield take(throttleChannel);
    yield put(scenarioGetData(false));
    // delay next call for 700ms
    yield call(delay, 700);
  }
}

export function* handleBudgetScenarioRequest(action, isAbsoluteUrl) {
  try {
    const { app: { config: { coreUrl, noAuth }, locale, auth: { access_token: accessToken } } } = yield select();
    const { url } = action.payload;
    const apiUrl = isAbsoluteUrl ? url : coreUrl + url;

    const { response, error } = yield call(fetchData, { url: apiUrl, locale, accessToken }, action.payload.options);

    if (response) {
      yield put({ type: BUDGET_SCENARIOS_SUCCESS, payload: response });
    } else {
      if (error.status === 401) {
        doLogout(error, noAuth);
      }
      yield put({ type: BUDGET_SCENARIOS_FAILURE, error });
    }

    yield put(scenarioGotData());
  } finally {
    if (yield cancelled()) {
      // do something if task is cancelled
    }
  }
}

export function* takeLatestScenarioData() {
  let lastTask;
  while (true) {
    const action = yield take(BUDGET_SCENARIOS_REQUEST);
    if (lastTask) {
      yield cancel(lastTask);
    }

    const {
      app,
      scenario: {
        selectedOrganizations,
        selectedYears,
        selectedResponsible,
        selectedFunctionalCenters,
        checkedSecondary: isSecondaryScenario,
        checkedFollowUpReport: isRetainedForTheFollowUpReport,
        checkedComplete: isComplete,
        criteria,
      },
    } = yield select();
    const organizationIds = selectedOrganizations.map((org) => org.id);
    const financialYears = selectedYears.map((year) => year.code);
    const responsibleIds = selectedResponsible.map((responsible) => responsible.id);
    const functionalCenterIds = selectedFunctionalCenters.map((functionalCenter) => functionalCenter.id);

    // check if state has token
    if (!haveAuth(app)) {
      yield call(authenticationSaga);
    }
    action.payload.options = {
      data: {
        organizationIds,
        financialYears,
        responsibleIds,
        functionalCenterIds,
        criteria,
        isSecondaryScenario,
        isRetainedForTheFollowUpReport,
        isComplete,
        pageNo: action.payload.options.data.pageNo,
        pageSize: action.payload.options.data.pageSize,
      },
    };
    yield put(setPreviouslySelectedOptions({ selectedOrganizations, selectedYears, selectedResponsible, selectedFunctionalCenters, criteria }));

    lastTask = yield fork(handleBudgetScenarioRequest, action);
  }
}

let scenarioChannel;
export function* getScenarioChannel() {
  scenarioChannel = yield actionChannel(SCENARIO_GET_DATA);
}

export function* scenarioData() {
  while (true) {
    const action = yield take(scenarioChannel);

    // check if it's an initial call
    if (action.payload.init) {
      yield put(getScenarioOrganizations());
      yield put(getAllFinancialYears());
      yield put(getScenarioResponsible());
      yield put(getFunctionalCenters({}, {}, {}, ''));

      // wait for state changing actions
      yield all([
        take([GET_ORGANIZATIONS_SUCCESS, GET_ORGANIZATIONS_FAILURE]),
        take([GET_ALL_YEARS_SUCCESS, GET_ALL_YEARS_FAILURE]),
        take([GET_RESPONSIBLE_SUCCESS, GET_RESPONSIBLE_FAILURE]),
        take([GET_FUNCTIONAL_CENTER_SUCCESS, GET_FUNCTIONAL_CENTER_FAILURE]),
      ]);
    }
    yield put(getBudgetScenarios(action.payload));
  }
}

export function* getScenarioYearsAndPeriods() {
  while (true) {
    const action = yield take(SELECT_SCENARIO_ROW);
    yield put(getOrganizationYears(action.payload.organizationId));
    yield put(getYearPeriods(action.payload.yearId));
    yield all([
      take([GET_ORGANIZATIONS_YEARS_SUCCESS, GET_ORGANIZATIONS_YEARS_FAILURE]),
      take([GET_ORGANIZATIONS_PERIODS_SUCCESS, GET_ORGANIZATIONS_PERIODS_FAILURE]),
    ]);

    const { scenario: { organizationPeriods } } = yield select();
    let currentPeriod = find(organizationPeriods, 'isCurrent');
    if (!currentPeriod) {
      const lastIndex = size(organizationPeriods);
      // exclude general ledger period, the last one
      currentPeriod = organizationPeriods[lastIndex - 1];
    }
    yield put(setYearAndPeriod(action.payload.year - 1, currentPeriod.code));
  }
}

export function* getPeriodsForEachOrganizationYear() {
  while (true) {
    yield take(DASHBOARD_SET_YEAR_AND_PERIOD);
    const { scenario: { durationYears } } = yield select();

    for (let i = 0; i < durationYears.length; i++) {
      yield put(getPeriodsForOrganizationYear(durationYears[i].id, i, durationYears[i].year));
    }
  }
}

export function* selectScenarioById() {
  while (true) {
    const action = yield take(SCENARIO_BY_ID_SUCCESS);
    yield put(selectScenario(action.payload));
  }
}
