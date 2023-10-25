import { fork, put, select, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  DISTRIBUTION_EXPENSE_CREATE_START,
  DISTRIBUTION_EXPENSE_EDIT_CANCEL,
  DISTRIBUTION_EXPENSE_EDIT_SAVE,
  DISTRIBUTION_EXPENSE_EDIT_START,
  DISTRIBUTION_EXPENSE_COPY_START,
  DISTRIBUTION_EXPENSE_COPY_CANCEL,
  DISTRIBUTION_EXPENSE_COPY_RUN,
} from '../actions/distribution-expense';
import {
  createDistributionExpense,
  DISTRIBUTION_EXPENSE_CREATE_FAILURE,
  DISTRIBUTION_EXPENSE_CREATE_SUCCESS,
  DISTRIBUTION_EXPENSE_DEFAULT_FAILURE,
  DISTRIBUTION_EXPENSE_DEFAULT_SUCCESS,
  DISTRIBUTION_EXPENSE_METADATA_SUCCESS,
  DISTRIBUTION_EXPENSE_SAVE_FAILURE,
  DISTRIBUTION_EXPENSE_SAVE_SUCCESS,
  DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_SUCCESS,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS,
  getDistributionExpense,
  getDistributionExpenseDefault,
  getDistributionExpenseMetadata,
  getDistributionsList,
  saveDistributionExpense,
  calculateDistributionExpense,
  getDistributionExpenseCopyMetadata,
  DISTRIBUTION_EXPENSE_COPY_SUCCESS,
  DISTRIBUTION_EXPENSE_COPY_FAILURE,
  copyDistributionExpense,
} from '../../../api/actions';
import { buildDistributionExpenseRecalculationModel, distributionExpenseConvertToSave } from '../../../entities/distribution';
import { saveFailure } from '../../../utils/effects/save-falure';
import { distributionsDetailClose } from '../actions/required-attendances';
import { distributionExpenseSelector } from '../reducers/distribution-expense';
import { distributionExpenseCopySelector } from '../reducers/distribution-expense-copy';
import { requiredAttendancesSelector } from '../reducers/required-attendances';
import { scenarioSelector } from '../../scenario/reducers/scenario';
import { getHistory, routes } from '../../app/app';
import { addScenarioAndIdToRoute, addScenarioIdToRoute } from '../../../utils/utils';
import { editModeEnd, editModeStart } from '../../app/actions';
import { convertDistributionsCopyToSave } from '../../../entities/required-attendance';
import { alertOpen } from '../../../components/general/alert/actions';
import { popupClose, popupOpen } from '../../../components/general/popup/actions';
import { alertType } from '../../../components/general/alert/constants';
import { PopupType } from '../../../components/general/popup/constants';

export function* distributionExpenseEditStart() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_EDIT_START);
    const { id } = action.payload;
    yield put(getDistributionExpenseMetadata(id));
  }
}

export function* distributionExpenseCopyStart() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_COPY_START);
    const { id } = action.payload;
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(getDistributionExpenseCopyMetadata());
    yield put(editModeStart());
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.DISTRIBUTION_EXPENSE_COPY.path, scenarioId, id));
  }
}

export function* distributionExpenseCopyCancel() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_COPY_CANCEL);
    const { id } = action.payload;
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    yield put(editModeEnd());
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCE_ITEM.path, scenarioId, id));
  }
}

export function* distributionExpenseCopyRun() {
  while (true) {
    yield take(DISTRIBUTION_EXPENSE_COPY_RUN);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const { requiredAttendanceId } = yield select(requiredAttendancesSelector);
    const { entry } = yield select(distributionExpenseCopySelector);
    yield put(copyDistributionExpense(requiredAttendanceId, entry.id, convertDistributionsCopyToSave(entry)));
    yield put(popupOpen({ message: 'spinner.action-copy' }, PopupType.spinner));
    const action = yield take([DISTRIBUTION_EXPENSE_COPY_SUCCESS, DISTRIBUTION_EXPENSE_COPY_FAILURE]);
    yield put(popupClose());

    if (action.type === DISTRIBUTION_EXPENSE_COPY_SUCCESS) {
      const message = 'distribution-expense-copy.copy-alert';
      const values = { requiredAttendanceTitle: entry.code };
      yield put(editModeEnd());
      yield put(alertOpen(alertType.success, message, values));
      const history = getHistory();
      history.push(addScenarioIdToRoute(routes.REQUIRED_ATTENDANCES.path, scenarioId));
    }
  }
}


export function* distributionExpenseRecalculate() {
  while (true) {
    yield take(DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_SUCCESS);

    const { selectedScenario: { yearId } } = yield select(scenarioSelector);
    const { entry } = yield select(distributionExpenseSelector);

    yield put(calculateDistributionExpense(buildDistributionExpenseRecalculationModel(yearId, entry)));
  }
}

export function* distributionExpenseCreateStart() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_CREATE_START);
    const { id } = action.payload;
    yield put(getDistributionExpenseMetadata(0));
    yield take(DISTRIBUTION_EXPENSE_METADATA_SUCCESS);
    yield put(getDistributionExpenseDefault(id));

    yield take([DISTRIBUTION_EXPENSE_DEFAULT_SUCCESS, DISTRIBUTION_EXPENSE_DEFAULT_FAILURE]);
    const { selectedScenario: { yearId } } = yield select(scenarioSelector);
    const { entry } = yield select(distributionExpenseSelector);
    yield put(calculateDistributionExpense(buildDistributionExpenseRecalculationModel(yearId, entry)));
  }
}

export function* distributionExpenseEditCancel() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_EDIT_CANCEL);
    const { id } = action.payload;
    if (id) {
      yield put(getDistributionExpense(id));
    } else {
      const {
        requiredAttendances: { requiredAttendanceId },
        scenario: { selectedScenario: { scenarioId } },
      } = yield select();

      yield put(distributionsDetailClose());
      yield put(getDistributionsList(requiredAttendanceId, scenarioId));
    }
  }
}

export function* distributionExpenseEditSaveSuccess() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_SAVE_SUCCESS);
    const { id } = action.options.resource;
    yield put(getDistributionExpense(id));
  }
}

export function* distributionExpenseEditSave() {
  while (true) {
    const action = yield take(DISTRIBUTION_EXPENSE_EDIT_SAVE);
    const { id } = action.payload;
    let newEntry;
    while (true) {
      const { isRecalculating, entry } = yield select(distributionExpenseSelector);
      if (!isRecalculating) {
        newEntry = entry;
        break;
      }
      yield delay(100);
    }

    if (id) {
      yield put(saveDistributionExpense(id, distributionExpenseConvertToSave(newEntry)));
    } else {
      const { requiredAttendanceId } = yield select(requiredAttendancesSelector);
      yield put(createDistributionExpense(requiredAttendanceId, distributionExpenseConvertToSave(newEntry)));
    }
  }
}

export function* distributionExpenseCreateSuccess() {
  while (true) {
    const action = yield take([
      DISTRIBUTION_EXPENSE_CREATE_SUCCESS,
      DISTRIBUTION_EXPENSE_SAVE_SUCCESS,
    ]);
    const {
      requiredAttendances: { requiredAttendanceId },
      scenario: { selectedScenario: { scenarioId } },
    } = yield select();
    const { id } = action.payload;

    yield put(getDistributionsList(requiredAttendanceId, scenarioId));
    yield take(REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_SUCCESS);
    yield put(getDistributionExpense(id));
  }
}

export function* sagasDistributionExpense() {
  yield fork(distributionExpenseRecalculate);
  yield fork(distributionExpenseEditStart);
  yield fork(distributionExpenseEditSave);
  yield fork(distributionExpenseEditSaveSuccess);
  yield fork(distributionExpenseEditCancel);
  yield fork(distributionExpenseCreateStart);
  yield fork(distributionExpenseCreateSuccess);
  yield fork(distributionExpenseCopyStart);
  yield fork(distributionExpenseCopyCancel);
  yield fork(distributionExpenseCopyRun);
  yield fork(saveFailure, DISTRIBUTION_EXPENSE_SAVE_FAILURE, saveDistributionExpense);
  yield fork(saveFailure, DISTRIBUTION_EXPENSE_CREATE_FAILURE, createDistributionExpense);
  yield fork(saveFailure, DISTRIBUTION_EXPENSE_COPY_FAILURE, copyDistributionExpense);
}
