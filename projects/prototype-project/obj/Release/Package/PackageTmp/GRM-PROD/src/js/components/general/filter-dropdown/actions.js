import { AppInsights } from 'applicationinsights-js';

export const DEPARTMENT_FILTER_SELECTED = 'DEPARTMENT_FILTER_SELECTED';
export const DEPARTMENT_FILTER_DESELECTED = 'DEPARTMENT_FILTER_DESELECTED';
export const CLEAR_SELECTED_DEPARTMENT_FILTER = 'CLEAR_SELECTED_DEPARTMENT_FILTER';
export const FILTER_DEPARTMENT_FILTER_BY_KEYWORD = 'FILTER_DEPARTMENT_FILTER_BY_KEYWORD';

export const SELECT_DEPARTMENT = 'SELECT_DEPARTMENT';
export const RESET_FILTERS = 'RESET_FILTERS';

export const ENABLE_DEPARTMENT_FILTER = 'ENABLE_DEPARTMENT_FILTER';
export const DISABLE_DEPARTMENT_FILTER = 'DISABLE_DEPARTMENT_FILTER';
export const ENABLE_SELECT_DEPARTMENT = 'ENABLE_SELECT_DEPARTMENT';
export const DISABLE_SELECT_DEPARTMENT = 'DISABLE_SELECT_DEPARTMENT';

export function resetFilters() {
  return {
    type: RESET_FILTERS,
  };
}

function appInsightsTrackAction(actionName, pageName, payload) {
  try {
    AppInsights.trackEvent(actionName, {
      payload: JSON.stringify(payload, null, '  '),
      pageName,
    }, { measurement1: 1 });
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
}

export function setDepartment(department) {
  return {
    type: SELECT_DEPARTMENT,
    payload: department,
  };
}

export function selectDepartmentFilter(departmentFilter, pageName) {
  return (dispatch) => {
    appInsightsTrackAction('select department filter action', pageName, departmentFilter);

    dispatch({
      type: DEPARTMENT_FILTER_SELECTED,
      payload: departmentFilter,
    });
  };
}

export function deselectDepartmentFilter(departmentFilter, pageName) {
  return (dispatch) => {
    appInsightsTrackAction('deselect department filter action', pageName, departmentFilter);

    dispatch({
      type: DEPARTMENT_FILTER_DESELECTED,
      payload: departmentFilter,
    });
  };
}

export function clearSelectedDepartmentFilters(pageName) {
  return (dispatch) => {
    appInsightsTrackAction('clear selected department filters action', pageName);

    dispatch({
      type: CLEAR_SELECTED_DEPARTMENT_FILTER,
    });
  };
}

export function filterDepartmentFilter(keyword) {
  return (dispatch) => {

    dispatch({
      type: FILTER_DEPARTMENT_FILTER_BY_KEYWORD,
      payload: keyword,
    });
  };
}

export function enableDepartmentFilter() {
  return (dispatch) => {

    dispatch({
      type: ENABLE_DEPARTMENT_FILTER,
    });
  };
}

export function disableDepartmentFilter() {
  return (dispatch) => {

    dispatch({
      type: DISABLE_DEPARTMENT_FILTER,
    });
  };
}

export function enableSelectDepartment() {
  return (dispatch) => {

    dispatch({
      type: ENABLE_SELECT_DEPARTMENT,
    });
  };
}

export function disableSelectDepartment() {
  return (dispatch) => {

    dispatch({
      type: DISABLE_SELECT_DEPARTMENT,
    });
  };
}

