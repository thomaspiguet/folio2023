import { put, take, fork, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { isEqual } from 'lodash';

import React from 'react';

import { popupOpen, popupClose, panelOpen, panelClose } from '../../components/general/popup/actions';
import { PopupActionKind, PopupType } from '../../components/general/popup/constants';
import {
  buildAdjustmentModel,
  buildIndexationModel,
  convertToSave,
  convertCreatedEntryToSave,
  isHistoryAdjustment,
  isHistoryCorrection,
  isHistoryIndexation,
} from '../../entities/other-expenses';
import { getValidationErrors } from '../../utils/components/form-validator';
import { saveFailure } from '../../utils/effects/save-falure';
import { dashboardItems, getHistory, routes } from '../app/app';
import { alertOpen } from '../../components/general/alert/actions';
import { alertType } from '../../components/general/alert/constants';
import { addScenarioAndIdToRoute, addScenarioIdToRoute, isZeroId } from '../../utils/utils';

import { editModeEnd, editModeStart } from '../app/actions';

import SummaryDetails from '../../components/business/other-expenses/summary-details';

import {
  OTHER_EXPENSES_DELETE,
  OTHER_EXPENSES_EDIT_CANCEL,
  OTHER_EXPENSES_EDIT_CONTINUE,
  OTHER_EXPENSES_EDIT_SAVE,
  OTHER_EXPENSES_EDIT_START,
  OTHER_EXPENSES_SAVE_HISTORY_START,
  OTHER_EXPENSES_HISTORY_ADD_INDEXATION,
  OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT,
} from './actions/other-expenses';

import {
  OTHER_EXPENSES_DELETE_FAILURE,
  OTHER_EXPENSES_DELETE_SUCCESS,
  OTHER_EXPENSES_REQUEST,
  OTHER_EXPENSES_SAVE_FAILURE,
  OTHER_EXPENSES_SAVE_HISTORY_SUCCESS,
  OTHER_EXPENSES_CANCEL_HISTORY_REQUEST,
  OTHER_EXPENSES_HISTORY_METADATA_SUCCESS,
  deleteOtherExpenses,
  getOtherExpenses,
  getOtherExpensesMetadata,
  saveOtherExpenses,
  saveOtherExpensesHistory,
  otherExpensesSetReserveAccount,
  OTHER_EXPENSES_SAVE_HISTORY_FAILURE,
  OTHER_EXPENSES_BUDGET_DETAILS_REQUEST,
  OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST,
  getRevenueAndOtherExpenses,
  getRevenueAndOtherExpensesMetadata,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS,
  createRevenueAndOtherExpenses,
  REVENUE_AND_OTHER_EXPENSES_CREATE_SUCCESS,
  REVENUE_AND_OTHER_EXPENSES_CREATE_FAILURE,
} from '../../api/actions';

import { REVENUE_AND_OTHER_EXPENSES_LOAD_LIST } from '../revenue-and-other-expenses/actions';
import { scenarioSelector } from '../scenario/reducers/scenario';

export function* otherExpensesDelete() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_DELETE);
    const { otherExpensesId, journal, otherExpensesTitle, scenarioId } = action.payload;
    const options = {
      message: 'spinner.action-delete',
    };
    yield put(popupOpen(options, PopupType.spinner));
    yield put(deleteOtherExpenses(otherExpensesId, journal, otherExpensesTitle, scenarioId));
  }
}

export function* otherExpensesDeleteFailure() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_DELETE_FAILURE);
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

export function* otherExpensesDeleteSuccess() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_DELETE_SUCCESS);
    const { otherExpensesTitle, scenarioId } = action.options.resource;
    const { breadcrumbs } = yield select();

    const message = 'other-expenses.deleted-alert';
    const values = { otherExpensesTitle };
    yield put(popupClose());
    yield put(alertOpen(alertType.success, message, values));

    const history = getHistory();
    if (breadcrumbs.items && breadcrumbs.items.length > 1) {
      history.goBack();
    } else {
      history.push(addScenarioIdToRoute(`${ routes.DASHBOARD.path }/${ dashboardItems.OTHER_EXPENSES }`, scenarioId));
    }
  }
}

export function* otherExpensesEditStart() {
  while (true) {
    yield take(OTHER_EXPENSES_EDIT_START);
  }
}

export function* otherExpensesEditCancel() {
  while (true) {
    yield take(OTHER_EXPENSES_EDIT_CANCEL);
    const { otherExpenses: { otherExpensesId } } = yield select();

    if (isZeroId(otherExpensesId)) {
      const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
      const history = getHistory();
      history.push(addScenarioAndIdToRoute(routes.REVENUE_AND_OTHER_EXPENSES.path, scenarioId));
    } else {
      yield put(getOtherExpenses(otherExpensesId));
    }
  }
}

export function* otherExpensesEditContinue() {
  while (true) {
    yield take(OTHER_EXPENSES_EDIT_CONTINUE);
  }
}

export function* otherExpensesEditSave() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_EDIT_SAVE);
    const { otherExpensesId } = action.payload;
    let newEntry;
    while (true) {
      const { otherExpenses: { isRecalculating, entry } } = yield select();
      if (!isRecalculating) {
        newEntry = entry;
        break;
      }
      yield delay(100);
    }

    if (isZeroId(otherExpensesId)) {
      yield put(createRevenueAndOtherExpenses(convertCreatedEntryToSave(newEntry), []));
    } else {
      yield put(saveOtherExpenses(otherExpensesId, convertToSave(newEntry), []));
    }
  }
}

export function* otherExpensesRequest() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_REQUEST);
    const { options: { resource: { id } } } = action.payload;
    yield put(getOtherExpensesMetadata(id));
  }
}

export function* otherExpensesHistorySaveStart() {
  while (true) {
    yield take(OTHER_EXPENSES_SAVE_HISTORY_START);
    let newEntry, id, totalBefore;
    while (true) {
      const { otherExpensesDetails: { isRecalculating, entry, totalBefore: totalBeforeS }, otherExpenses } = yield select();
      if (!isRecalculating) {
        newEntry = entry;
        id = otherExpenses.entry.id;
        totalBefore = totalBeforeS;
        break;
      }
      yield delay(100);
    }

    if (isHistoryAdjustment(newEntry.type) || isHistoryCorrection(newEntry.type)) {
      yield put(saveOtherExpensesHistory(id, buildAdjustmentModel(newEntry, id, undefined, undefined, totalBefore, undefined)));
    } else if (isHistoryIndexation(newEntry.type)) {
      yield put(saveOtherExpensesHistory(id, buildIndexationModel(newEntry, id)));
    }
  }
}

export function* otherExpensesSaveRequest() {
  while (true) {
    yield take([OTHER_EXPENSES_SAVE_HISTORY_SUCCESS, OTHER_EXPENSES_CANCEL_HISTORY_REQUEST]);
    const history = getHistory();
    history.goBack();
  }
}

export function* otherExpensesReserveAccount() {
  while (true) {
    yield all([
      take(OTHER_EXPENSES_HISTORY_METADATA_SUCCESS),
      take(OTHER_EXPENSES_HISTORY_ADD_INDEXATION),
    ]);
    yield put(otherExpensesSetReserveAccount());
  }
}

export function* otherExpensesDisableGlobalFilter() {
  while (true) {
    yield take([OTHER_EXPENSES_HISTORY_ADD_INDEXATION, OTHER_EXPENSES_HISTORY_ADD_ADJUSTMENT]);
    yield put(editModeStart());
  }
}

export function* otherExpensesEnableGlobalFilter() {
  while (true) {
    yield take([OTHER_EXPENSES_CANCEL_HISTORY_REQUEST, OTHER_EXPENSES_SAVE_HISTORY_SUCCESS]);
    yield put(editModeEnd());
  }
}

export function* getOtherExpensesSummaryDetails() {
  while (true) {
    const action = yield take([OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST, OTHER_EXPENSES_BUDGET_DETAILS_REQUEST]);
    const { options: { resource: { description } } } = action.payload;

    const intlId = {
      OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST: 'summary-details.actual-detail',
      OTHER_EXPENSES_BUDGET_DETAILS_REQUEST: 'summary-details.budget-detail',
    };

    yield put(
      panelOpen({
        Body: <SummaryDetails description={ description } intlId={ intlId[action.type] } />,
        actions: [
          { kind: PopupActionKind.close, action: panelClose },
        ],
      })
    );
  }
}

export function* revenueAndOtherExpensesLoadList() {
  while (true) {
    const action = yield take(REVENUE_AND_OTHER_EXPENSES_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      revenueAndOtherExpenses: {
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

    const forceLoad = (force); // TODO: Add group condition later
    if (!forceLoad) {
      const newQuery = { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getRevenueAndOtherExpenses(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize));
  }
}

export function* revenueAndOtherExpensesAddStart() {
  while (true) {
    yield take(REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST);
    yield put(getRevenueAndOtherExpensesMetadata());
  }
}

export function* revenueAndOtherExpensesAdd() {
  while (true) {
    yield take(REVENUE_AND_OTHER_EXPENSES_DEFAULT_SUCCESS);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.OTHER_EXPENSES_ITEM.path, scenarioId, 0));
  }
}

export function* revenueAndOtherExpensesCreateSuccess() {
  while (true) {
    const action = yield take(REVENUE_AND_OTHER_EXPENSES_CREATE_SUCCESS);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const { id } = action.payload;
    const history = getHistory();
    history.replace(addScenarioAndIdToRoute(routes.OTHER_EXPENSES_ITEM.path, scenarioId, id));
  }
}


export function* sagasOtherExpenses() {
  yield fork(otherExpensesDelete);
  yield fork(otherExpensesDeleteFailure);
  yield fork(otherExpensesDeleteSuccess);
  yield fork(otherExpensesEditStart);
  yield fork(otherExpensesEditCancel);
  yield fork(otherExpensesEditContinue);
  yield fork(otherExpensesEditSave);
  yield fork(otherExpensesRequest);
  yield fork(otherExpensesSaveRequest);
  yield fork(otherExpensesHistorySaveStart);
  yield fork(otherExpensesReserveAccount);
  yield fork(saveFailure, OTHER_EXPENSES_SAVE_FAILURE, saveOtherExpenses);
  yield fork(saveFailure, OTHER_EXPENSES_SAVE_HISTORY_FAILURE, saveOtherExpensesHistory);
  yield fork(saveFailure, REVENUE_AND_OTHER_EXPENSES_CREATE_FAILURE, (id, newEntry, actionResponses) => createRevenueAndOtherExpenses(newEntry, actionResponses));
  yield fork(otherExpensesDisableGlobalFilter);
  yield fork(otherExpensesEnableGlobalFilter);
  yield fork(getOtherExpensesSummaryDetails);
  yield fork(revenueAndOtherExpensesLoadList);
  yield fork(revenueAndOtherExpensesAdd);
  yield fork(revenueAndOtherExpensesAddStart);
  yield fork(revenueAndOtherExpensesCreateSuccess);
}
