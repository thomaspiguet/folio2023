import { each, findLastIndex } from 'lodash';

import {
  BREADCRUMBS_SET_ROUTE,
  BREADCRUMBS_SET_TITLE_ACTUAL,
} from './actions';

import { addScenarioIdToRoute } from '../../../utils/utils';
import { routes } from '../../../features/app/app';

const initialState = {
  items: [],
  title: undefined,
};

function parseRoute(path) {
  const pathChunks = path.split('/');
  let matchRoute = {};
  let matchKey;
  each(routes, (route, key) => {
    const templateChunks = route.path.split('/');
    if (pathChunks.length !== templateChunks.length) {
      return true;
    }
    let match = true;
    for (let ind = 0; ind < pathChunks.length; ind++) {
      const pathItem = pathChunks[ind];
      const templateItem = templateChunks[ind];
      if (pathItem === templateItem) {
        continue;
      }
      if (templateItem[0] === ':') {
        continue;
      }
      match = false;
      break;
    }
    if (match) {
      matchRoute = route;
      matchKey = key;
      return false;
    }
    return true;
  });

  return { path, route: matchRoute, key: matchKey };
}

function getItems(items, newItem, scenarioId) {

  if (newItem.route.noBreadcrumb) {
    return [];
  }

  let result = [];
  const ind = findLastIndex(items, (item) => (item.path === newItem.path));
  if (ind >= 0) {
    result = [...items];
    result.splice(ind + 1);
  } else if (newItem.route.useParentPath) {
    result = [...items, newItem];
  } else if (newItem.route.parent) {
    const key = newItem.route.parent;
    const route = routes[key];
    result = [{ route, path: route.path, key }, newItem];
  } else {
    result = [newItem];
  }

  if (scenarioId !== undefined) {
    each(result, (item) => {
      item.path = addScenarioIdToRoute(item.path, scenarioId);
    });
  }

  return result;
}

function setTitle(items, title) {
  const len = items.length;
  if (!len) {
    return items;
  }
  const result = [...items];
  const last = result[len - 1];
  result.splice(len - 1, 1, { ...last, title });
  return result;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case BREADCRUMBS_SET_ROUTE: {
      const { path, scenarioId } = action.payload;
      return {
        ...state,
        items: getItems(state.items, parseRoute(path), scenarioId),
      };
    }

    case BREADCRUMBS_SET_TITLE_ACTUAL: {
      const title = action.payload;
      return {
        ...state,
        items: setTitle(state.items, title),
        title,
      };
    }

    default:
      return state;
  }
}
