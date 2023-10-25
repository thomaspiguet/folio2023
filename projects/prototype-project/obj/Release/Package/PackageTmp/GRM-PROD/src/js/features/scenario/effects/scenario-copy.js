import { put, take, fork, select } from 'redux-saga/effects';

import { getHistory, routes } from '../../app/app';

import { editModeEnd, editModeStart } from '../../app/actions';
import { scenarioSelector } from '../reducers/scenario';
import { saveFailure } from '../../../utils/effects/save-falure';
import { SCENARIO_COPY_CANCEL, SCENARIO_COPY_INIT, SCENARIO_COPY_RUN } from '../actions/scenario-copy';
import {
  BUDGET_SCENARIO_COPY_FAILURE,
  BUDGET_SCENARIO_COPY_SUCCESS,
  getScenarioCopyMetadata, postScenarioCopy,
} from '../../../api/actions';
import { PopupType } from '../../../components/general/popup/constants';
import { popupClose, popupOpen } from '../../../components/general/popup/actions';
import { alertType } from '../../../components/general/alert/constants';
import { convertCopyToSave } from '../entities/scenario';
import { alertOpen } from '../../../components/general/alert/actions';
import { scenarioCopySelector } from '../reducers/scenario-copy';

export function* scenarioCopyStart() {
  while (true) {
    yield take(SCENARIO_COPY_INIT);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(getScenarioCopyMetadata(scenarioId));
    yield put(editModeStart());
  }
}

function goToLastPath(scenarioId) {
  const history = getHistory();
  if (!scenarioId) {
    history.push(routes.SCENARIO.path);
  } else {
    history.goBack();
  }
}

export function* scenarioCopyCancel() {
  while (true) {
    yield take(SCENARIO_COPY_CANCEL);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(editModeEnd());
    goToLastPath(scenarioId);
  }
}

export function* scenarioCopyRun() {
  while (true) {
    yield take(SCENARIO_COPY_RUN);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const { entry } = yield select(scenarioCopySelector);
    yield put(postScenarioCopy(scenarioId, convertCopyToSave(entry)));
    yield put(popupOpen({ message: 'spinner.action-copy' }, PopupType.spinner));
    const action = yield take([BUDGET_SCENARIO_COPY_SUCCESS, BUDGET_SCENARIO_COPY_FAILURE]);
    yield put(popupClose());

    if (action.type === BUDGET_SCENARIO_COPY_SUCCESS) {
      const message = 'scenario-copy.copy-success';
      yield put(editModeEnd());
      yield put(alertOpen(alertType.success, message));
      goToLastPath(scenarioId);
    }
  }
}

export function* sagasScenarioCopy() {
  yield fork(scenarioCopyStart);
  yield fork(scenarioCopyCancel);
  yield fork(scenarioCopyRun);
  yield fork(saveFailure, BUDGET_SCENARIO_COPY_FAILURE, postScenarioCopy);
}
