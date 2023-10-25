import { createSelector } from 'reselect';

export const entitiesQueryParametersSelector = createSelector(
  [
    (state) => state.scenario.selectedScenario.organizationId,
    (state) => state.filter.selectedDepartment,
    (state) => state.filter.selectedFilterElementsIds,
    (state) => state.scenario.selectedScenario.scenarioId,
  ],
  (organizationId, filterElementKey, filterElementsIds, scenarioId) => {
    return { organizationId, filterElementKey, filterElementsIds, scenarioId };
  }
);

