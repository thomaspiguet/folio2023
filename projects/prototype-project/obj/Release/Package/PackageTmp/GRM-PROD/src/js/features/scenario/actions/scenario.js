import { SCENARIO_DEFAULT_PAGE, SCENARIO_DEFAULT_PAGE_SIZE } from '../effects/scenario';
import { SCENARIO_BY_ID_ENDPOINT } from '../../../api/endpoints';

export const ORGANIZATION_SELECTED = 'ORGANIZATION_SELECTED';
export const ORGANIZATION_DESELECTED = 'ORGANIZATION_DESELECTED';
export const CLEAR_SELECTED_ORGANIZATIONS = 'CLEAR_SELECTED_ORGANIZATIONS';
export const FILTER_ORGANIZATIONS_BY_KEYWORD = 'FILTER_ORGANIZATIONS_BY_KEYWORD';

export const YEAR_SELECTED = 'YEAR_SELECTED';
export const YEAR_DESELECTED = 'YEAR_DESELECTED';
export const CLEAR_SELECTED_YEARS = 'CLEAR_SELECTED_YEARS';
export const FILTER_YEARS_BY_KEYWORD = 'FILTER_YEARS_BY_KEYWORD';

export const SCENARIO_GET_DATA = 'SCENARIO_GET_DATA';
export const SCENARIO_GOT_DATA = 'SCENARIO_GOT_DATA';

export const SELECT_SCENARIO_ROW = 'SELECT_SCENARIO_ROW';

export const RESPONSIBLE_SELECTED = 'RESPONSIBLE_SELECTED';
export const RESPONSIBLE_DESELECTED = 'RESPONSIBLE_DESELECTED';
export const CLEAR_SELECTED_RESPONSIBLE = 'CLEAR_SELECTED_RESPONSIBLE';
export const FILTER_RESPONSIBLE_BY_KEYWORD = 'FILTER_RESPONSIBLE_BY_KEYWORD';

export const FUNCTIONAL_CENTER_SELECTED = 'FUNCTIONAL_CENTER_SELECTED';
export const FUNCTIONAL_CENTER_DESELECTED = 'FUNCTIONAL_CENTER_DESELECTED';
export const CLEAR_SELECTED_FUNCTIONAL_CENTER = 'CLEAR_SELECTED_FUNCTIONAL_CENTER';
export const FILTER_FUNCTIONAL_CENTER_BY_KEYWORD = 'FILTER_FUNCTIONAL_CENTER_BY_KEYWORD';

export const CLEAR_SCENARIOS_KEYWORD = 'CLEAR_SCENARIOS_KEYWORD';
export const FILTER_SCENARIOS_BY_KEYWORD = 'FILTER_SCENARIOS_BY_KEYWORD';

export const TOGGLE_SECONDARY = 'TOGGLE_SECONDARY';
export const TOGGLE_FOLLOW_UP_REPORT = 'TOGGLE_FOLLOW_UP_REPORT';
export const TOGGLE_COMPLETE = 'TOGGLE_COMPLETE';
export const PREVIOUSLY_SELECTED_OPTIONS = 'PREVIOUSLY_SELECTED_OPTIONS';

export const SCENARIO_BY_ID_REQUEST = 'SCENARIO_BY_ID_REQUEST';
export const SCENARIO_BY_ID_SUCCESS = 'SCENARIO_BY_ID_SUCCESS';
export const SCENARIO_BY_ID_FAILURE = 'SCENARIO_BY_ID_FAILURE';


export function selectOrganization(organization) {
  return {
    type: ORGANIZATION_SELECTED,
    payload: organization,
  };
}

export function deselectOrganization(organization) {
  return {
    type: ORGANIZATION_DESELECTED,
    payload: organization,
  };
}

export function clearSelectedOrganizations() {
  return {
    type: CLEAR_SELECTED_ORGANIZATIONS,
  };
}

export function filterOrganizations(keyword) {
  return {
    type: FILTER_ORGANIZATIONS_BY_KEYWORD,
    payload: keyword,
  };
}

export function selectYear(year) {
  return {
    type: YEAR_SELECTED,
    payload: year,
  };
}

export function deselectYear(year) {
  return {
    type: YEAR_DESELECTED,
    payload: year,
  };
}

export function clearSelectedYears() {
  return {
    type: CLEAR_SELECTED_YEARS,
  };
}

export function filterYears(keyword) {
  return {
    type: FILTER_YEARS_BY_KEYWORD,
    payload: keyword,
  };
}

export function scenarioGetData(init = false, pageNo = SCENARIO_DEFAULT_PAGE, pageSize = SCENARIO_DEFAULT_PAGE_SIZE) {
  return {
    type: SCENARIO_GET_DATA,
    payload: {
      init,
      pageNo,
      pageSize,
    },
  };
}

export function scenarioGotData() {
  return {
    type: SCENARIO_GOT_DATA,
  };
}

export function selectScenario(scenario) {
  return {
    type: SELECT_SCENARIO_ROW,
    payload: scenario,
  };
}

export function selectResponsible(responsible) {
  return {
    type: RESPONSIBLE_SELECTED,
    payload: responsible,
  };
}

export function deselectResponsible(responsible) {
  return {
    type: RESPONSIBLE_DESELECTED,
    payload: responsible,
  };
}

export function clearSelectedResponsible() {
  return {
    type: CLEAR_SELECTED_RESPONSIBLE,
  };
}

export function filterResponsible(keyword) {
  return {
    type: FILTER_RESPONSIBLE_BY_KEYWORD,
    payload: keyword,
  };
}

export function selectFunctionalCenter(functionalCenter) {
  return {
    type: FUNCTIONAL_CENTER_SELECTED,
    payload: functionalCenter,
  };
}

export function deselectFunctionalCenter(functionalCenter) {
  return {
    type: FUNCTIONAL_CENTER_DESELECTED,
    payload: functionalCenter,
  };
}

export function clearSelectedFunctionalCenter() {
  return {
    type: CLEAR_SELECTED_FUNCTIONAL_CENTER,
  };
}

export function filterFunctionalCenter(keyword) {
  return {
    type: FILTER_FUNCTIONAL_CENTER_BY_KEYWORD,
    payload: keyword,
  };
}

export function filterSearchByKeyword(keyword) {
  return {
    type: FILTER_SCENARIOS_BY_KEYWORD,
    payload: keyword,
  };
}

export function clearSearchByKeyword() {
  return {
    type: CLEAR_SCENARIOS_KEYWORD,
  };
}

export function toggleSecondary(value) {
  return {
    type: TOGGLE_SECONDARY,
    payload: value,
  };
}

export function toggleFollowUpReport(value) {
  return {
    type: TOGGLE_FOLLOW_UP_REPORT,
    payload: value,
  };
}

export function toggleComplete(value) {
  return {
    type: TOGGLE_COMPLETE,
    payload: value,
  };
}
export function setPreviouslySelectedOptions(options) {
  return {
    type: PREVIOUSLY_SELECTED_OPTIONS,
    payload: options,
  };
}

export function getScenarioById(scenarioId) {
  return {
    type: SCENARIO_BY_ID_REQUEST,
    payload: {
      url: `${ SCENARIO_BY_ID_ENDPOINT }/${ scenarioId }`,
      options: {
        method: 'GET',
        resource: {
          scenarioId,
        },
      },
    },
  };
}
