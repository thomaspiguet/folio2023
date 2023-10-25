import { call, put, select, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { first, isEqual, uniqWith } from 'lodash';

import { buildExpandParameters, calculateHash, rootHash } from '../../utils/utils';

import {
  loadBudgetDetails,
  SALARIES_COLLAPSE_ALL,
  SALARIES_EXPAND_ALL,
  SALARIES_LOAD_BUDGET_DETAILS,
  SALARIES_OPEN_FILTER,
  SALARIES_SET_EXPANDED,
  SALARIES_SET_FILTERS,
  SALARIES_SET_GROUPS,
  setDetailId,
  setExpanded,
} from './actions';

import {
  BUDGET_DETAILS_GROUPS_SUCCESS,
  BUDGET_DETAILS_SUCCESS,
  getBudgetDetails,
  getBudgetDetailsGroups,
  getBudgetFilterValues,
} from '../../api/actions';

import {
  buildCustomFilters,
  detailSelector,
  getFilterData,
} from './reducer';

import { selectSideMenu } from '../../components/general/side-menu/actions';

export function* salariesLoadGroups() {
  while (true) {
    const action = yield take(SALARIES_SET_GROUPS);
    const state = yield select();
    const {
      salaries: { detailId },
      filter: { selectedDepartment: filterElementKey, selectedFilterElementsIds: filterElementsIds },
      scenario: { selectedScenario: { scenarioId } },
    } = state;

    const filters = buildCustomFilters(state.salaries, detailId);
    const groups = action.payload;
    const firstGroup = first(groups);
    if (firstGroup) {
      yield put(getBudgetDetailsGroups(detailId, scenarioId, filterElementKey, filterElementsIds, filters, firstGroup.groupId));
    }
  }
}

export function* salariesLoadGroupsData() {
  while (true) {
    const action = yield take(SALARIES_SET_EXPANDED);
    const state = yield select();
    const {
      salaries: { detailId },
      filter: { selectedDepartment: filterElementKey, selectedFilterElementsIds: filterElementsIds },
      scenario: { selectedScenario: { scenarioId } },
    } = state;

    const { groups, dataGroups } = detailSelector(state);

    const { filters: groupFilters, nextGroup, hash, recursive, isExpanded } = action.payload;
    if (!isExpanded) {
      continue;
    }
    const customFilters = buildCustomFilters(state.salaries, detailId);
    const filters = uniqWith([...customFilters, ...groupFilters], isEqual);

    const data = dataGroups[hash];
    const newHash = calculateHash(filters);
    const newData = dataGroups[newHash];

    if (newData) {
      continue;
    }


    if (data) {
      if (nextGroup) {
        yield put(getBudgetDetailsGroups(detailId, scenarioId, filterElementKey, filterElementsIds, filters, nextGroup.groupId, hash, recursive));
      } else {
        const pageNo = 1;
        const pageSize = 80;
        const sorting = {};
        yield put(getBudgetDetails(detailId, scenarioId, filterElementKey, filterElementsIds, pageNo, pageSize, filters, sorting, groups, hash, recursive));
      }

    }
  }
}

function* expandRows(dataGroup, groups, hash) {
  if (!hash) {
    return;
  }
  const hashGroup = dataGroup[hash];
  if (!hashGroup || hashGroup.isLoading) {
    return;
  }

  const { groupId } = hashGroup;
  for (const row of hashGroup.data) {
    const { _expanded, _hash } = row;
    if (!_expanded) {
      const { filters, nextGroup, groupBy } = buildExpandParameters(groups, row, groupId);
      yield delay(300);
      if (_hash) {
        const rowGroup = dataGroup[_hash];
        if (rowGroup && rowGroup.isLoading) {
          continue;
        }
      }
      yield put(setExpanded(filters, groupId, nextGroup, hash, groupBy, true, true));
    }
  }
  yield delay(100);
  for (const row of hashGroup.data) {
    const { _expanded, _hash } = row;
    if (_expanded) {
      yield call(expandRows, dataGroup, groups, _hash);
    }
  }
}

export function* salariesExpandAll() {
  while (true) {
    const action = yield take([SALARIES_EXPAND_ALL, BUDGET_DETAILS_GROUPS_SUCCESS, BUDGET_DETAILS_SUCCESS]);
    switch (action.type) {
      case BUDGET_DETAILS_GROUPS_SUCCESS:
      case BUDGET_DETAILS_SUCCESS: {
        const { recursive } = action.options.resource;
        if (!recursive) {
          continue;
        }
        break;
      }
      default:
        break;
    }
    yield delay(1000);
    const state = yield select();
    const { groups, dataGroups } = detailSelector(state);
    yield call(expandRows, dataGroups, groups, rootHash);
  }
}

function* collapseRows(dataGroup, groups, hash) {
  if (!hash) {
    return;
  }
  const hashGroup = dataGroup[hash];
  if (!hashGroup || hashGroup.isLoading) {
    return;
  }

  const { groupId } = hashGroup;
  for (const row of hashGroup.data) {
    const { _expanded, _hash } = row;
    if (_expanded) {
      yield call(collapseRows, dataGroup, groups, _hash);
    }
  }
  for (const row of hashGroup.data) {
    const { _expanded } = row;
    if (_expanded) {
      const { filters, nextGroup, groupBy } = buildExpandParameters(groups, row, groupId);
      yield put(setExpanded(filters, groupId, nextGroup, hash, groupBy, false, false));
    }
  }
}

export function* salariesCollapseAll() {
  while (true) {
    yield take(SALARIES_COLLAPSE_ALL);
    const state = yield select();
    const { groups, dataGroups } = detailSelector(state);
    yield call(collapseRows, dataGroups, groups, rootHash);
  }
}

export function* salariesOpenFilters() {
  while (true) {
    const action = yield take(SALARIES_OPEN_FILTER);
    const {
      salaries: { detailId },
      filter: { selectedDepartment: filterElementKey, selectedFilterElementsIds: filterElementsIds },
      scenario: { selectedScenario: { scenarioId } },
      salaries,
    } = yield select();

    const columnId = action.payload;
    const filterData = getFilterData(salaries, detailId);
    const values = filterData.all[columnId];

    if (!values) {
      yield put(getBudgetFilterValues(detailId, scenarioId, filterElementKey, filterElementsIds, columnId));
    }
  }
}

export function* salariesSetFilters() {
  while (true) {
    yield take(SALARIES_SET_FILTERS);
    const state = yield select();
    const {
      salaries: {
        detailId,
      },
    } = state;
    const { paging: { pageNo, pageSize } } = detailSelector(state);
    yield put(loadBudgetDetails(detailId, pageNo, pageSize, true));
  }
}

export function* salariesLoadBudgetDetails() {
  while (true) {
    const action = yield take(SALARIES_LOAD_BUDGET_DETAILS);
    const state = yield select();
    const {
      filter: { selectedDepartment: filterKey, selectedFilterElementsIds: filterIDs },
      scenario: { selectedScenario: { scenarioId } },
      salaries: {
        detailId: lastDetailId,
        groups,
        isLoading,
        options: {
          detailId: prevDetailId,
          scenarioId: prevScenarioId,
          filterElementKey: prevFilterKey,
          filterElementsIds: prevFilterIDs,
        },
      },
      sideMenu: { selected, selectedSubItem },
    } = state;

    const { detailId, pageNo, pageSize, sorting, force } = action.payload;
    const { paging: { pageNo: prevPageNo, pageSize: prevPageSize }, resultSorting } = detailSelector(state);

    if (selected !== 'dashboard' || selectedSubItem !== detailId) {
      yield put(selectSideMenu('dashboard', detailId));
    }

    const forceLoad = (force && groups && groups.length);
    if (!forceLoad) {
      if (detailId !== lastDetailId) {
        yield put(setDetailId(detailId));
        continue;
      }


      const newQuery = { detailId, scenarioId, filterKey, filterIDs, groups };
      const oldQuery = {
        detailId: prevDetailId,
        scenarioId: prevScenarioId,
        filterKey: prevFilterKey,
        filterIDs: prevFilterIDs,
      };

      if (isEqual(newQuery, oldQuery)) {
        continue;
      }
    }

    const { data } = detailSelector(state, detailId);
    const newQuery2 = { pageNo, pageSize, sorting };
    const oldQuery2 = { pageNo: prevPageNo, pageSize: prevPageSize, sorting: resultSorting };
    if ((data || isLoading) && isEqual(newQuery2, oldQuery2)) {
      continue;
    }
    const filters = buildCustomFilters(state.salaries, detailId);

    yield put(getBudgetDetails(detailId, scenarioId, filterKey, filterIDs, pageNo, pageSize, filters, sorting));
  }
}
