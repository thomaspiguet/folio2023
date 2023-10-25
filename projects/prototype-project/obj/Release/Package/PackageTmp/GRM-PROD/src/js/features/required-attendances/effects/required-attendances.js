import { put, take, fork, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { getValidationErrors } from '../../../utils/components/form-validator';
import { popupOpen, popupClose } from '../../../components/general/popup/actions';
import { PopupType } from '../../../components/general/popup/constants';
import { getHistory, routes } from '../../app/app';
import { alertOpen } from '../../../components/general/alert/actions';
import { alertType } from '../../../components/general/alert/constants';
import { addScenarioAndIdToRoute, addScenarioIdToRoute, isZeroId } from '../../../utils/utils';

import {
  distributionsDetailClose,
  deletionOfRequiredAttendanceFinished,
  REQUIRED_ATTENDANCE_EDIT_CANCEL,
  REQUIRED_ATTENDANCE_EDIT_CONTINUE,
  REQUIRED_ATTENDANCE_EDIT_SAVE,
  REQUIRED_ATTENDANCE_EDIT_START,
  REQUIRED_ATTENDANCE_DELETE,
  REQUIRED_ATTENDANCE_DISTRIBUTION_DELETE,
  REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD,
  REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH,
  REQUIRED_ATTENDANCE_COPY_START,
  REQUIRED_ATTENDANCE_COPY_CANCEL,
  REQUIRED_ATTENDANCE_COPY_RUN,
  REQUIRED_ATTENDANCE_LOAD_LIST,
} from '../actions/required-attendances';

import {
  createRequiredAttendance,
  deleteRequiredAttendance,
  deleteDistribution,
  getDistributionsList,
  getRequiredAttendance,
  getRequiredAttendances,
  getRequiredAttendanceMetadata,
  saveRequiredAttendance,
  REQUIRED_ATTENDANCE_SAVE_FAILURE,
  REQUIRED_ATTENDANCE_DELETE_SUCCESS,
  REQUIRED_ATTENDANCE_DELETE_FAILURE,
  REQUIRED_ATTENDANCE_DEFAULT_REQUEST,
  REQUIRED_ATTENDANCE_DEFAULT_SUCCESS,
  REQUIRED_ATTENDANCE_CREATE_SUCCESS,
  REQUIRED_ATTENDANCE_CREATE_FAILURE,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_SUCCESS,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_FAILURE,
  REQUIRED_ATTENDANCE_SAVE_SUCCESS,
  getRequiredAttendanceCopyMetadata,
  REQUIRED_ATTENDANCE_COPY_FAILURE,
  REQUIRED_ATTENDANCE_COPY_SUCCESS,
  copyRequiredAttendance,
  REQUIRED_ATTENDANCES_REQUEST,
} from '../../../api/actions';

import { convertToSave, convertCopyToSave } from '../../../entities/required-attendance';
import { deleteFailure, saveFailure } from '../../../utils/effects/save-falure';
import { requiredAttendancesSelector } from '../reducers/required-attendances';
import { scenarioSelector } from '../../scenario/reducers/scenario';
import { requiredAttendancesCopySelector } from '../reducers/required-attendances-copy';
import { editModeEnd, editModeStart } from '../../app/actions';

export function* requiredAttendancesEditStart() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_EDIT_START);
    const { metadata } = yield select(requiredAttendancesSelector);
    if (!metadata) {
      yield put(getRequiredAttendanceMetadata());
    }
  }
}

export function* requiredAttendancesCopyStart() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_COPY_START);
    const { id } = action.payload;
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(getRequiredAttendanceCopyMetadata());
    yield put(editModeStart());
    // yield take(REQUIRED_ATTENDANCE_COPY_METADATA_SUCCESS);
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCES_COPY.path, scenarioId, id));
  }
}

export function* requiredAttendancesCopyCancel() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_COPY_CANCEL);
    const { id } = action.payload;
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(editModeEnd());
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCE_ITEM.path, scenarioId, id));
  }
}

export function* requiredAttendancesCopyRun() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_COPY_RUN);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const { requiredAttendanceId } = yield select(requiredAttendancesSelector);
    const { entry } = yield select(requiredAttendancesCopySelector);
    yield put(copyRequiredAttendance(requiredAttendanceId, convertCopyToSave(entry)));
    yield put(popupOpen({ message: 'spinner.action-copy' }, PopupType.spinner));
    const action = yield take([REQUIRED_ATTENDANCE_COPY_SUCCESS, REQUIRED_ATTENDANCE_COPY_FAILURE]);
    yield put(popupClose());

    if (action.type === REQUIRED_ATTENDANCE_COPY_SUCCESS) {
      const message = 'required-attendance.copy-alert';
      const values = { requiredAttendanceTitle: entry.code };
      yield put(editModeEnd());
      yield put(alertOpen(alertType.success, message, values));
      const history = getHistory();
      history.push(addScenarioIdToRoute(routes.REQUIRED_ATTENDANCES.path, scenarioId));
    }
  }
}

export function* requiredAttendancesEditCancel() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_EDIT_CANCEL);
    const { requiredAttendanceId } = yield select(requiredAttendancesSelector);

    if (isZeroId(requiredAttendanceId)) {
      const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
      const history = getHistory();
      history.push(addScenarioIdToRoute(routes.REQUIRED_ATTENDANCES.path, scenarioId));
    } else {
      yield put(getRequiredAttendance(requiredAttendanceId));
    }
  }
}

export function* requiredAttendancesEditContinue() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_EDIT_CONTINUE);
  }
}

export function* requiredAttendancesEditSave() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_EDIT_SAVE);
    const { requiredAttendanceId, newEntry } = action.payload;

    if (isZeroId(requiredAttendanceId)) {
      yield put(createRequiredAttendance(convertToSave(newEntry), []));
    } else {
      yield put(saveRequiredAttendance(requiredAttendanceId, convertToSave(newEntry), []));
    }
  }
}

export function* requiredAttendancesDelete() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DELETE);
    const { requiredAttendanceId, journal, requiredAttendanceTitle, scenarioId } = action.payload;
    const options = {
      message: 'spinner.action-delete',
    };
    yield put(popupOpen(options, PopupType.spinner));
    yield put(deleteRequiredAttendance(requiredAttendanceId, journal, requiredAttendanceTitle, scenarioId));
  }
}

export function* requiredAttendancesDeleteSuccess() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DELETE_SUCCESS);
    const { requiredAttendanceTitle, scenarioId } = action.options.resource;

    const message = 'required-attendance.deleted-alert';
    const values = { requiredAttendanceTitle };
    yield put(popupClose());
    yield put(alertOpen(alertType.success, message, values));

    const history = getHistory();
    history.push(addScenarioIdToRoute(`${ routes.REQUIRED_ATTENDANCES.path }`, scenarioId));
    yield put(deletionOfRequiredAttendanceFinished());
  }
}

export function* requiredAttendanceAdd() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DEFAULT_SUCCESS);
    const { scenario: { selectedScenario: { scenarioId } } } = yield select();
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCE_ITEM.path, scenarioId, 0));
  }
}

export function* requiredAttendanceAddStart() {
  while (true) {
    yield take(REQUIRED_ATTENDANCE_DEFAULT_REQUEST);
    yield put(getRequiredAttendanceMetadata());
  }
}

export function* requiredAttendanceSaveSuccess() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_SAVE_SUCCESS);
    const { scenario: { selectedScenario: { scenarioId } } } = yield select();
    const { id } = action.payload;
    yield put(getDistributionsList(id, scenarioId));
  }
}

export function* requiredAttendanceCreateSuccess() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_CREATE_SUCCESS);
    const { scenario: { selectedScenario: { scenarioId } } } = yield select();
    const { id } = action.payload;
    const history = getHistory();
    history.replace(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCE_ITEM.path, scenarioId, id));
  }
}

export function* requiredAttendanceDistributionDelete() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DISTRIBUTION_DELETE);
    const { id, journal, description, requiredAttendanceId, scenarioId } = action.payload;
    const options = {
      message: 'spinner.action-delete',
    };
    yield put(popupOpen(options, PopupType.spinner));
    yield put(deleteDistribution(id, journal, description, requiredAttendanceId, scenarioId));
  }
}

export function* requiredAttendanceDistributionDeleteFailure() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_FAILURE);
    const { payload, error } = action;
    const { messages } = getValidationErrors({ ...payload, responseError: error });

    const { VersionInconsistency } = payload;
    const actions = [{ kind: 'ok' }];
    const style = 'error';
    if (VersionInconsistency) {
      messages.push({ intlId: 'validation.reload-page' });
    }
    yield put(popupOpen({
      style,
      messages,
      actions,
    }));
  }
}

export function* requiredAttendanceDistributionDeleteSuccess() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_SUCCESS);
    const { description, requiredAttendanceId, scenarioId } = action.options.resource;

    const message = 'required-attendance.deleted-distributions-alert';
    const values = { description };
    yield put(popupClose());
    yield put(alertOpen(alertType.success, message, values));
    yield put(distributionsDetailClose());
    yield put(getDistributionsList(requiredAttendanceId, scenarioId));
  }
}

export function* requiredAttendanceSearchByReference() {
  while (true) {
    const action = yield take([
      REQUIRED_ATTENDANCE_REFERENCE_SEARCH_SET_KEYWORD,
      REQUIRED_ATTENDANCE_APPLY_ADVANCED_SEARCH,
      REQUIRED_ATTENDANCE_CLEAR_ADVANCED_SEARCH,
      REQUIRED_ATTENDANCE_CLEAR_ACTION_ADVANCED_SEARCH,
      REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH,
    ]);

    const {
      requiredAttendances: {
        referenceSearchKeyWord: reference,
        search,
        listResource,
        paging: {
          pageSize,
          pageNo: prevPageNo,
        },
      },
      filter: {
        selectedDepartment: filterElementKey,
        selectedFilterElementsIds: filterElementsIds,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },

    } = yield select();
    const pageNo = action.type === REQUIRED_ATTENDANCE_TOGGLE_ADVANCED_SEARCH ? prevPageNo : 1;
    if (isEqual(listResource, { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, reference, search })) {
      continue;
    }

    yield put(getRequiredAttendances(
      { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, reference, search },
      { actionType: REQUIRED_ATTENDANCES_REQUEST }
    ));
  }
}

export function* requiredAttendanceLoadList() {
  while (true) {
    const action = yield take(REQUIRED_ATTENDANCE_LOAD_LIST);
    const { actionType, pageNo, pageSize, force } = action.payload;
    const {
      requiredAttendances: {
        data,
        search,
        referenceSearchKeyWord: reference,
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
      const newQuery = { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, reference, search };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getRequiredAttendances(
      { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, reference, search },
      { actionType })
    );
  }
}

export function* sagasRequiredAttendances() {
  yield fork(requiredAttendancesEditStart);
  yield fork(requiredAttendancesEditCancel);
  yield fork(requiredAttendancesEditContinue);
  yield fork(requiredAttendancesEditSave);
  yield fork(saveFailure, REQUIRED_ATTENDANCE_SAVE_FAILURE, saveRequiredAttendance);
  yield fork(requiredAttendanceSaveSuccess);
  yield fork(requiredAttendancesDelete);
  yield fork(deleteFailure, REQUIRED_ATTENDANCE_DELETE_FAILURE);
  yield fork(requiredAttendancesDeleteSuccess);
  yield fork(requiredAttendanceAddStart);
  yield fork(requiredAttendanceAdd);
  yield fork(requiredAttendanceCreateSuccess);
  yield fork(requiredAttendanceDistributionDelete);
  yield fork(requiredAttendanceDistributionDeleteFailure);
  yield fork(requiredAttendanceDistributionDeleteSuccess);
  yield fork(saveFailure, REQUIRED_ATTENDANCE_CREATE_FAILURE, (id, newEntry) => createRequiredAttendance(newEntry));
  yield fork(requiredAttendanceSearchByReference);
  yield fork(requiredAttendancesCopyStart);
  yield fork(requiredAttendancesCopyCancel);
  yield fork(requiredAttendancesCopyRun);
  yield fork(saveFailure, REQUIRED_ATTENDANCE_COPY_FAILURE, copyRequiredAttendance);
  yield fork(requiredAttendanceLoadList);
}
