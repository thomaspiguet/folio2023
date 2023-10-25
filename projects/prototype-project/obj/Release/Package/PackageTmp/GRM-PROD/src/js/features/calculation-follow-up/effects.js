import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { CALCULATION_FOLLOW_UP_LOAD_LIST } from './actions';
import { getCalculationFollowUp } from '../../api/actions';


export function* calculationFollowUpLoadList() {
  while (true) {
    const action = yield take(CALCULATION_FOLLOW_UP_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      calculationFollowUp: {
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

    yield put(getCalculationFollowUp(scenarioId, pageNo, pageSize));
  }
}
