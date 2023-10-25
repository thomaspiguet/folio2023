import { put, take, fork, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { popupOpen, popupClose } from '../../components/general/popup/actions';
import { PopupType } from '../../components/general/popup/constants';
import { getHistory, routes } from '../app/app';
import { alertOpen } from '../../components/general/alert/actions';
import { alertType } from '../../components/general/alert/constants';
import { addScenarioAndIdToRoute, addScenarioIdToRoute, isZeroId } from '../../utils/utils';

import {
  BUDGET_REQUEST_EDIT_CANCEL,
  BUDGET_REQUEST_EDIT_CONTINUE,
  BUDGET_REQUEST_EDIT_SAVE,
  BUDGET_REQUEST_EDIT_START,
  BUDGET_REQUEST_DELETE,
  BUDGET_REQUEST_APPLY_ADVANCED_SEARCH,
  BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH,
  BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH,
  BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH,
  BUDGET_REQUEST_SET_SEARCH_KEYWORD,
  BUDGET_REQUEST_LOAD_LIST,
} from './actions';

import {
  getBudgetRequest,
  getBudgetRequestMetadata,
  saveBudgetRequest,
  deleteBudgetRequest,
  getBudgetRequests,
  createBudgetRequest,
  BUDGET_REQUEST_SAVE_FAILURE,
  BUDGET_REQUEST_DELETE_FAILURE,
  BUDGET_REQUEST_DELETE_SUCCESS,
  BUDGET_REQUEST_DEFAULT_REQUEST,
  BUDGET_REQUEST_DEFAULT_SUCCESS,
  BUDGET_REQUEST_DEFAULT_FAILURE,
  BUDGET_REQUEST_CREATE_FAILURE,
  BUDGET_REQUEST_CREATE_SUCCESS,
} from '../../api/actions';
import { convertToSave } from '../../entities/budget-request';
import { deleteFailure, saveFailure } from '../../utils/effects/save-falure';
import { scenarioSelector } from '../scenario/reducers/scenario';
import { budgetRequestsSelector } from './reducer';

export function* budgetRequestsEditStart() {
  while (true) {
    yield take(BUDGET_REQUEST_EDIT_START);
    yield put(getBudgetRequestMetadata());
  }
}

export function* budgetRequestsEditCancel() {
  while (true) {
    yield take(BUDGET_REQUEST_EDIT_CANCEL);
    const { budgetRequestId } = yield select(budgetRequestsSelector);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);

    if (isZeroId(budgetRequestId)) {
      const history = getHistory();
      history.push(addScenarioIdToRoute(routes.BUDGET_REQUESTS.path, scenarioId));
    }
    yield put(getBudgetRequest(budgetRequestId));
  }
}

export function* budgetRequestsEditContinue() {
  while (true) {
    yield take(BUDGET_REQUEST_EDIT_CONTINUE);
  }
}

export function* budgetRequestsEditSave() {
  while (true) {
    const action = yield take(BUDGET_REQUEST_EDIT_SAVE);
    const { budgetRequestId, newEntry } = action.payload;

    if (isZeroId(budgetRequestId)) {
      yield put(createBudgetRequest(convertToSave(newEntry), []));
    } else {
      yield put(saveBudgetRequest(budgetRequestId, convertToSave(newEntry), []));
    }
  }
}

export function* budgetRequestsDelete() {
  while (true) {
    const action = yield take(BUDGET_REQUEST_DELETE);
    const { budgetRequestId, journal, budgetRequestTitle, scenarioId } = action.payload;
    const options = {
      message: 'spinner.action-delete',
    };
    yield put(popupOpen(options, PopupType.spinner));
    yield put(deleteBudgetRequest(budgetRequestId, journal, budgetRequestTitle, scenarioId));
  }
}

export function* budgetRequestsDeleteSuccess() {
  while (true) {
    const action = yield take(BUDGET_REQUEST_DELETE_SUCCESS);
    const { budgetRequestTitle, scenarioId } = action.options.resource;
    const { breadcrumbs } = yield select();

    const message = 'budget-request.deleted-alert';
    const values = { budgetRequestTitle };
    yield put(popupClose());
    yield put(alertOpen(alertType.success, message, values));

    const history = getHistory();
    if (breadcrumbs.items && breadcrumbs.items.length > 1) {
      history.goBack();
    } else {
      history.push(addScenarioIdToRoute(`${ routes.BUDGET_REQUESTS.path }`, scenarioId));
    }
  }
}

export function* budgetRequestSearch() {
  while (true) {
    const action = yield take([
      BUDGET_REQUEST_APPLY_ADVANCED_SEARCH,
      BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH,
      BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH,
      BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH,
      BUDGET_REQUEST_SET_SEARCH_KEYWORD,
    ]);

    const {
      budgetRequests: {
        searchKeyword,
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
    const pageNo = action.type === BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH ? prevPageNo : 1;
    const newResource = { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, searchKeyword, search };
    if (isEqual(listResource, newResource)) {
      continue;
    }

    yield put(getBudgetRequests(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, searchKeyword, search));
  }
}

export function* budgetRequestsAddStart() {
  while (true) {
    yield take(BUDGET_REQUEST_DEFAULT_REQUEST);
    yield put(getBudgetRequestMetadata(true));
  }
}

export function* budgetRequestsAdd() {
  while (true) {
    yield take([BUDGET_REQUEST_DEFAULT_SUCCESS, BUDGET_REQUEST_DEFAULT_FAILURE]); // TODO: remove failure after backend implementation
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const history = getHistory();
    history.push(addScenarioAndIdToRoute(routes.BUDGET_REQUEST_ITEM.path, scenarioId, 0));
  }
}

export function* budgetRequestCreateSuccess() {
  while (true) {
    const action = yield take(BUDGET_REQUEST_CREATE_SUCCESS);
    const { selectedScenario: { scenarioId } } = yield select(scenarioSelector);
    const { id } = action.payload;
    const history = getHistory();
    history.replace(addScenarioAndIdToRoute(routes.BUDGET_REQUEST_ITEM.path, scenarioId, id));
  }
}

export function* budgetRequestLoadList() {
  while (true) {
    const action = yield take(BUDGET_REQUEST_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      budgetRequests: {
        data,
        search,
        searchKeyword,
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
      const newQuery = { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, searchKeyword, search };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getBudgetRequests(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, searchKeyword, search));
  }
}

export function* sagasBudgetRequests() {
  yield fork(budgetRequestsEditStart);
  yield fork(budgetRequestsEditCancel);
  yield fork(budgetRequestsEditContinue);
  yield fork(budgetRequestsEditSave);
  yield fork(saveFailure, BUDGET_REQUEST_SAVE_FAILURE, saveBudgetRequest);
  yield fork(saveFailure, BUDGET_REQUEST_CREATE_FAILURE, (id, newEntry, actionResponses) => createBudgetRequest(newEntry, actionResponses));
  yield fork(budgetRequestsDelete);
  yield fork(deleteFailure, BUDGET_REQUEST_DELETE_FAILURE);
  yield fork(budgetRequestsDeleteSuccess);
  yield fork(budgetRequestSearch);
  yield fork(budgetRequestsAddStart);
  yield fork(budgetRequestsAdd);
  yield fork(budgetRequestCreateSuccess);
  yield fork(budgetRequestLoadList);
}
