import { put, take, select } from 'redux-saga/effects';
import { isEqual } from 'lodash';

import { PARAMETERS_BY_STRUCTURE_LOAD_LIST } from './actions';

import { getParametersByStructure } from '../../api/actions';


export function* parametersByStructureLoadList() {
  while (true) {
    const action = yield take(PARAMETERS_BY_STRUCTURE_LOAD_LIST);
    const { pageNo, pageSize, force } = action.payload;
    const {
      parametersByStructure: {
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

    yield put(getParametersByStructure(scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize));
  }
}
