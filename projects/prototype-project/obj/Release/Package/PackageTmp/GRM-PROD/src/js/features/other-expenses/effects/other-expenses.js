import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { OTHER_EXPENSES_LOAD_DETAILS } from '../actions/other-expenses';

import { getOtherExpenses } from '../../../api/actions';

export function* otherExpensesLoadList() {
  while (true) {
    const action = yield take(OTHER_EXPENSES_LOAD_DETAILS);
    const { otherExpensesId, force } = action.payload;
    const {
      otherExpenses: {
        isLoading,
        listResource,
      },
    } = yield select();

    const forceLoad = (force); // TODO: add group condition later
    if (!forceLoad) {
      const newQuery = { id: otherExpensesId };
      if (isLoading || isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getOtherExpenses(otherExpensesId));
  }
}
