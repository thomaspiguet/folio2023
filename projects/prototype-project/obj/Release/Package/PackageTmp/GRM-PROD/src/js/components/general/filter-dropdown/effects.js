import { call, put, take, fork, cancel, cancelled, select, actionChannel } from 'redux-saga/effects';
import { delay, buffers } from 'redux-saga';
import { fetchData } from '../../../api/fetch-wrapper';
import {
  getFilterElementsKeys,
  GET_FILTER_ELEMENTS_REQUEST,
  getFilterElements,
  GET_FILTER_ELEMENTS_SUCCESS,
  GET_FILTER_ELEMENTS_FAILURE,
} from '../../../api/actions';

import {
  SELECT_DEPARTMENT,
  DEPARTMENT_FILTER_SELECTED,
  DEPARTMENT_FILTER_DESELECTED,
  CLEAR_SELECTED_DEPARTMENT_FILTER,
  FILTER_DEPARTMENT_FILTER_BY_KEYWORD,
  resetFilters,
  clearSelectedDepartmentFilters,
  enableDepartmentFilter,
  disableDepartmentFilter,
} from './actions';

import { dashboardGetData } from '../../../features/dashboard/actions';

import { haveAuth, authenticationSaga } from '../../../features/app/effects/sagas';
import { doLogout } from '../../../features/app/actions';

export const FILTER_MODULE_KEY = 'GLL';

export function* elementsAllKeys() {
  yield put(getFilterElementsKeys());
}

export function* elementsByKey() {
  while (true) {
    const action = yield take(SELECT_DEPARTMENT);

    const {
      scenario: { selectedScenario: { organizationId } },
      filter: { selectedDepartmentFilters, selectedFilterElementsIds },
    } = yield select();
    if (action.payload.code !== 'All') {
      yield put(getFilterElements(action.payload.code, FILTER_MODULE_KEY, organizationId));
      yield put(enableDepartmentFilter());
    } else {
      yield put(disableDepartmentFilter());
    }
    if (selectedDepartmentFilters.length > 0 || selectedFilterElementsIds.length > 0) {
      yield put(clearSelectedDepartmentFilters());
    }
  }
}

export function* throttleFilterByCriteria() {
  const throttleChannel = yield actionChannel(FILTER_DEPARTMENT_FILTER_BY_KEYWORD, buffers.sliding(1));

  while (true) {
    const action = yield take(throttleChannel);
    const {
      filter: { selectedDepartment },
      scenario: { selectedScenario: { organizationId } } } = yield select();

    yield put(getFilterElements(selectedDepartment, FILTER_MODULE_KEY, organizationId, action.payload));
    yield call(delay, 700);
  }
}

export function* handleFilterRequest(action, isAbsoluteUrl) {
  try {
    const { app: { config: { coreUrl, noAuth }, locale, auth: { access_token: accessToken } } } = yield select();
    const { url } = action.payload;
    const apiUrl = isAbsoluteUrl ? url : coreUrl + url;

    const { response, error } = yield call(fetchData, { url: apiUrl, locale, accessToken }, action.payload.options);

    if (response) {
      yield put({ type: GET_FILTER_ELEMENTS_SUCCESS, payload: response });
    } else {
      if (error.status === 401) {
        doLogout(error, noAuth);
      }
      yield put({ type: GET_FILTER_ELEMENTS_FAILURE, error });
    }

  } finally {
    if (yield cancelled()) {
      // do something if task is cancelled
    }
  }
}

export function* takeLatestElementsByKey() {
  let lastTask;
  while (true) {
    const action = yield take(GET_FILTER_ELEMENTS_REQUEST);
    if (lastTask) {
      yield cancel(lastTask);
    }
    const { app } = yield select();
    if (!haveAuth(app)) {
      yield call(authenticationSaga);
    }

    lastTask = yield fork(handleFilterRequest, action);
  }
}

export function* filterDashboardDataWithFilterElements() {
  while (true) {
    yield take([
      DEPARTMENT_FILTER_SELECTED,
      DEPARTMENT_FILTER_DESELECTED,
      CLEAR_SELECTED_DEPARTMENT_FILTER,
    ]);
    yield put(resetFilters());
    yield put(dashboardGetData());
  }
}

