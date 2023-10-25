export const BREADCRUMBS_SET_ROUTE = 'BREADCRUMBS_SET_ROUTE';
export const BREADCRUMBS_SET_TITLE = 'BREADCRUMBS_SET_TITLE';
export const BREADCRUMBS_SET_TITLE_ACTUAL = 'BREADCRUMBS_SET_TITLE_ACTUAL';


export function setRoute(path, scenarioId) {
  return {
    type: BREADCRUMBS_SET_ROUTE,
    payload: { path, scenarioId },
  };
}

export function setTitle(title) {
  return {
    type: BREADCRUMBS_SET_TITLE,
    payload: title,
  };
}

export function setTitleActual(title) {
  return {
    type: BREADCRUMBS_SET_TITLE_ACTUAL,
    payload: title,
  };
}
