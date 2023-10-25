import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { IMPORTS_LOAD_LIST, IMPORT_ACCOUNTS_LOAD_LIST } from '../actions/imports';
import {
  IMPORT_SUCCESS,
  getImports,
  getImportAccounts,
  getImportOtherScenarios,
} from '../../../api/actions';

export const IMPORTS_OTHER_SCENARIOS_DEFAULT_PAGE = 1;
export const IMPORTS_OTHER_SCENARIOS_DEFAULT_PAGE_SIZE = 30;

export function* getOtherScenariosAfterImportItemReceived() {
  while (true) {
    const action = yield take(IMPORT_SUCCESS);

    const {
      scenario: { selectedScenario: { scenarioId } },
      importOtherScenarios: { paging: { pageSize } },
    } = yield select();

    yield put(getImportOtherScenarios(
      scenarioId,
      action.payload.importNumber,
      IMPORTS_OTHER_SCENARIOS_DEFAULT_PAGE,
      pageSize || IMPORTS_OTHER_SCENARIOS_DEFAULT_PAGE_SIZE
    ));
  }
}

export function* importsLoadList() {
  while (true) {
    const action = yield take(IMPORTS_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      imports: {
        data,
        isLoading,
        listResource,
      },
      scenario: {
        selectedScenario: { scenarioId },
      },
    } = yield select();

    const forceLoad = (force); // TODO: add group condition later
    if (!forceLoad) {
      const newQuery = { scenarioId, pageNo, pageSize };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getImports(scenarioId, pageNo, pageSize));
  }
}

export function* importAccountsLoadList() {
  while (true) {
    const action = yield take(IMPORT_ACCOUNTS_LOAD_LIST);
    const { importScenarioId, pageNo, pageSize, force } = action.payload;
    const {
      importAccounts: {
        data,
        isLoading,
        listResource,
      },
    } = yield select();

    const forceLoad = (force); // TODO: add group condition later
    if (!forceLoad) {
      const newQuery = { importScenarioId, pageNo, pageSize };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getImportAccounts(importScenarioId, pageNo, pageSize));
  }
}
