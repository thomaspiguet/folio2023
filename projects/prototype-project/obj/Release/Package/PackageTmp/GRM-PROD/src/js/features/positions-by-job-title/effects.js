import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { POSITIONS_BY_JOB_TITLE_LOAD_LIST } from './actions';

import { getPositionsByJobTitle } from '../../api/actions';


export function* positionsByJobTitleLoadList() {
  while (true) {
    const action = yield take(POSITIONS_BY_JOB_TITLE_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      positionsByJobTitle: {
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

    yield put(getPositionsByJobTitle(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize));
  }
}
