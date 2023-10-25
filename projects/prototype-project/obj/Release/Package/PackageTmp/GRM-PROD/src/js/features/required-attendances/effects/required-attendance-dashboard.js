import { put, take, select, fork } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import {
  REQUIRED_ATTENDANCE_DASHBOARD_EDIT_CANCEL,
  REQUIRED_ATTENDANCE_DASHBOARD_EDIT_SAVE,
  REQUIRED_ATTENDANCE_DASHBOARD_EDIT_START,
  REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE,
  REQUIRED_ATTENDANCE_DASHBOARD_LOAD_LIST,
  REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_ROW_TOTAL,
} from '../actions/required-attendance-dashboard';

import {
  getRequiredAttendanceDashboard,
  getRequiredAttendanceDashboardMetadata,
  postRequiredAttencaneDashboardRecalculate,
  postRequiredAttendanceDashboardInitialize,
  putRequiredAttendanceDashboard,
  REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_FAILURE,
  REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_SUCCESS,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_FAILURE,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_SUCCESS,
} from '../../../api/actions';

import { requiredAttendanceDashboardSelector } from '../reducers/required-attendance-dashboard';
import { convertToSave } from '../entities/required-attendance-dashboard';
import { saveFailure } from '../../../utils/effects/save-falure';
import { editModeEnd, editModeStart } from '../../app/actions';
import { PopupType } from '../../../components/general/popup/constants';
import { popupClose, popupOpen } from '../../../components/general/popup/actions';

export function* requiredAttendanceDashboardLoadList() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DASHBOARD_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      requiredAttendanceDashboard: {
        data,
        isLoading,
        listResource,
      },
      filter: {
        selectedDepartment: filterElementKey,
        selectedFilterElementsIds: filterElementsIds,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },
    } = yield select();

    const forceLoad = (force); // TODO: add group condition later
    if (!forceLoad) {
      const newQuery = { scenarioId, filterElementKey, filterElementsIds, page: { pageNo, pageSize } };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getRequiredAttendanceDashboard(scenarioId, { pageNo, pageSize }, filterElementKey, filterElementsIds));
  }
}

export function* requiredAttendanceDashboardSave() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_EDIT_SAVE);
    const { changedData } = yield select(requiredAttendanceDashboardSelector);
    yield put(putRequiredAttendanceDashboard(convertToSave(changedData)));
  }
}

export function* requiredAttendanceDashboardStart() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_EDIT_START);
    yield put(getRequiredAttendanceDashboardMetadata());
    yield put(editModeStart());
  }
}

export function* requiredAttendanceDashboardCancel() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_EDIT_CANCEL);
    yield put(editModeEnd());
  }
}

export function* requiredAttendanceDashboardRecalculateTotal() {
  while (true) {
    const { payload: index } = yield take(REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_ROW_TOTAL);
    const { data } = yield select(requiredAttendanceDashboardSelector);
    const row = data[index];
    yield put(postRequiredAttencaneDashboardRecalculate(row, index));
  }
}

export function* requiredAttendanceDashboardSaveSuccess() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_SAVE_SUCCESS);
    const {
      requiredAttendanceDashboard: {
        paging: { pageNo, pageSize },
      },
      filter: {
        selectedDepartment: filterElementKey,
        selectedFilterElementsIds: filterElementsIds,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },
    } = yield select();
    yield put(getRequiredAttendanceDashboard(scenarioId, { pageNo, pageSize }, filterElementKey, filterElementsIds));
    yield put(editModeEnd());
  }
}

export function* requiredAttendanceDashboardInitialize() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE);
    const {
      filter: {
        selectedDepartment: filterElementKey,
        selectedFilterElementsIds: filterElementsIds,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },
    } = yield select();
    const options = {
      message: 'spinner.action-initializing',
    };
    yield put(popupOpen(options, PopupType.spinner));
    yield put(postRequiredAttendanceDashboardInitialize(scenarioId, filterElementKey, filterElementsIds));
  }
}

export function* requiredAttendanceDashboardInitializeSuccess() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_SUCCESS);
    const {
      requiredAttendanceDashboard: {
        paging: { pageNo, pageSize },
      },
      filter: {
        selectedDepartment: filterElementKey,
        selectedFilterElementsIds: filterElementsIds,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },
    } = yield select();

    yield put(popupClose());
    yield put(getRequiredAttendanceDashboard(scenarioId, { pageNo, pageSize }, filterElementKey, filterElementsIds));
  }
}

export function* requiredAttendanceDashboardInitializeFailure() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_FAILURE);
    yield put(popupClose());
  }
}

export function* sagasRequiredAttendanceDashboard() {
  yield fork(requiredAttendanceDashboardLoadList);
  yield fork(requiredAttendanceDashboardSave);
  yield fork(requiredAttendanceDashboardSaveSuccess);
  yield fork(requiredAttendanceDashboardStart);
  yield fork(requiredAttendanceDashboardCancel);
  yield fork(requiredAttendanceDashboardRecalculateTotal);
  yield fork(requiredAttendanceDashboardInitialize);
  yield fork(requiredAttendanceDashboardInitializeSuccess);
  yield fork(requiredAttendanceDashboardInitializeFailure);
  yield fork(saveFailure, REQUIRED_ATTENDANCE_DASHBOARD_SAVE_FAILURE, (id, entry) => putRequiredAttendanceDashboard(entry));
  yield fork(saveFailure, REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_FAILURE, (id, entry) => {});
}
