import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { ACCOUNTS_LOAD_LIST } from './actions';

import { getGeneralLedgerAccount } from '../../../api/actions';

export function* generalLedgerAccountsLoadList() {
  while (true) {
    const action = yield take(ACCOUNTS_LOAD_LIST);
    const { filterByOrganizationId, pageNo, pageSize, force } = action.payload;
    const {
      account: {
        data,
        isLoading,
        filterKeyword,
        listResource,
      },
      scenario: {
        selectedScenario: { scenarioId, organizationId },
      },
    } = yield select();

    if (!force) {
      const newQuery = (filterByOrganizationId ?
        { scenarioId, organizationId, filterKeyword, pageNo, pageSize } :
        { scenarioId, filterKeyword, pageNo, pageSize }
      );
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getGeneralLedgerAccount(scenarioId, (filterByOrganizationId ? organizationId : undefined), filterKeyword, pageNo, pageSize));
  }
}
