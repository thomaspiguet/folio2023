import { AppInsights } from 'applicationinsights-js';
import { setBudgets } from '../dashboard/actions';
import { filterBudgets } from '../dashboard/selectors';

import {
  CONFIG_ENDPOINT,
  REDIRECT_ENDPOINT,
  LDAP_CHECK_ENDPOINT,
} from '../../api/endpoints';

export const SET_FILTER = 'SET_FILTER';
export const SET_LOCALE = 'SET_LOCALE';
export const LOAD_DATA_STARTED = 'LOAD_DATA_STARTED';
export const LOAD_DATA_ENDED = 'LOAD_DATA_ENDED';

export const GET_CONFIG_REQUEST = 'GET_CONFIG_REQUEST';
export const GET_CONFIG_SUCCESS = 'GET_CONFIG_SUCCESS';
export const GET_CONFIG_FAILURE = 'GET_CONFIG_FAILURE';
export const GET_TOKEN_REQUEST = 'GET_TOKEN_REQUEST';
export const GET_TOKEN_SUCCESS = 'GET_TOKEN_SUCCESS';
export const GET_TOKEN_FAILURE = 'GET_TOKEN_FAILURE';

export const LDAP_CHECK_REQUEST = 'LDAP_CHECK_REQUEST';
export const LDAP_CHECK_SUCCESS = 'LDAP_CHECK_SUCCESS';
export const LDAP_CHECK_FAILURE = 'LDAP_CHECK_FAILURE';

export const GET_TOKEN_REFRESH_REQUEST = 'GET_TOKEN_REFRESH_REQUEST';
export const GET_TOKEN_REFRESH_SUCCESS = 'GET_TOKEN_REFRESH_SUCCESS';
export const GET_TOKEN_REFRESH_FAILURE = 'GET_TOKEN_REFRESH_FAILURE';

export const TOGGLE_PRODUCTS_MENU = 'TOGGLE_PRODUCTS_MENU';
export const TOGGLE_PRODUCTS_DOMAIN = 'TOGGLE_PRODUCTS_DOMAIN';

export const EDIT_MODE_END = 'EDIT_MODE_END';
export const EDIT_MODE_START = 'EDIT_MODE_START';

export function setFilter(filter, pageName) {
  return (dispatch, getState) => {
    try {
      AppInsights.trackEvent('setFilter action', {
        organization: filter.organization,
        year: filter.year,
        scenario: filter.scenario,
        pageName,
      }, { measurement1: 1 });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }

    dispatch({
      type: SET_FILTER,
      filter,
    });

    dispatch(setBudgets(filterBudgets(getState(), filter)));
  };
}

export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale,
  };
}

export function getConfig() {
  return {
    type: GET_CONFIG_REQUEST,
    payload: {
      url: CONFIG_ENDPOINT,
    },
  };
}

export function getToken() {
  return {
    type: GET_TOKEN_REQUEST,
    payload: {
      url: REDIRECT_ENDPOINT,
      options: {
        method: 'GET',
        data: {
          'info': 'json',
        },
      },
    },
  };
}

export function getTokenRefresh() {
  return {
    type: GET_TOKEN_REFRESH_REQUEST,
    payload: {
      url: REDIRECT_ENDPOINT,
      options: {
        method: 'GET',
        data: {
          'info': 'json',
          'access_token_refresh_interval': 0,
        },
      },
    },
  };
}

export function checkLdapUser() {
  return {
    type: LDAP_CHECK_REQUEST,
    payload: {
      url: LDAP_CHECK_ENDPOINT,
      options: {
        method: 'GET',
      },
    },
  };
}


export function doLogout(error, noAuth) {
  if (noAuth) {
    return;
  }

  window.location.assign(`${ REDIRECT_ENDPOINT }?logout=${ encodeURIComponent(window.location.origin) }/`);
}

export function toggleProductsMenu() {
  return {
    type: TOGGLE_PRODUCTS_MENU,
  };
}

export function toggleDomain(name) {
  return {
    type: TOGGLE_PRODUCTS_DOMAIN,
    payload: name,
  };
}

export function editModeEnd() {
  return (dispatch) => {

    dispatch({
      type: EDIT_MODE_END,
    });
  };
}

export function editModeStart() {
  return (dispatch) => {

    dispatch({
      type: EDIT_MODE_START,
    });
  };
}
