import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { POSITIONS_LOAD_LIST } from './actions';

import { getPositions } from '../../api/actions';


export function* positionsLoadList() {
  while (true) {
    const action = yield take(POSITIONS_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      positions: {
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
      const newQuery = { scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize };
      if ((data || isLoading) && isEqual(newQuery, listResource)) {
        continue;
      }
    }

    yield put(getPositions(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize));
  }
}
