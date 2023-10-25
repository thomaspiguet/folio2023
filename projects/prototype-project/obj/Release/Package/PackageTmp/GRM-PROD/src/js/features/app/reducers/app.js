import fillDefaults from 'json-schema-fill-defaults';
import { defineMessages } from 'react-intl';

import {
  TOGGLE_PRODUCTS_MENU,
  TOGGLE_PRODUCTS_DOMAIN,
  SET_FILTER,
  SET_LOCALE,
  GET_CONFIG_REQUEST,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_FAILURE,
  GET_TOKEN_REFRESH_SUCCESS,
  GET_TOKEN_SUCCESS,
  GET_TOKEN_REFRESH_FAILURE,
  GET_TOKEN_FAILURE,
  LDAP_CHECK_FAILURE,
  LDAP_CHECK_SUCCESS,
  EDIT_MODE_END,
  EDIT_MODE_START,
} from '../actions';

import {
  USER_INFO_SUCCESS,
  USER_INFO_FAILURE,
  GET_PRODUCTS_REGISTRY_SUCCESS, GET_PRODUCTS_REGISTRY_FAILURE,
} from '../../../api/actions';

import {
  SCENARIO_BY_ID_FAILURE,
  SCENARIO_BY_ID_REQUEST,
  SCENARIO_BY_ID_SUCCESS,
} from '../../scenario/actions/scenario';

import { routes } from '../app';

defineMessages({
  topMenuButtonCalculationFollowUp: {
    id: 'top-menu-button.calculation',
    defaultMessage: 'Calculation follow up',
  },
  topMenuButtonNotes: {
    id: 'top-menu-button.notes',
    defaultMessage: 'Notes',
  },
  topMenuButtonAttachments: {
    id: 'top-menu-button.attachments',
    defaultMessage: 'Attachments',
  },
  topMenuButtonEdit: {
    id: 'top-menu-button.edit',
    defaultMessage: 'Edit',
  },
  topMenuButtonCopy: {
    id: 'top-menu-button.copy',
    defaultMessage: 'Copy',
  },
});

export const TOP_MENU_BUTTON_NOTES = 'TOP_MENU_BUTTON_NOTES';
export const TOP_MENU_BUTTON_ATTACHMENTS = 'TOP_MENU_BUTTON_ATTACHMENTS';
export const TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP = 'TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP';
export const TOP_MENU_BUTTON_BUDGET_CALCULATION = 'TOP_MENU_BUTTON_BUDGET_CALCULATION';
export const TOP_MENU_BUTTON_EDIT = 'TOP_MENU_BUTTON_EDIT';
export const TOP_MENU_BUTTON_COPY = 'TOP_MENU_BUTTON_COPY';

export const initialState = {
  locale: 'en-CA',
  // used in mock chart {
  budgets: {
    '5096': { title: 'Budget-RES_2017_ORI', organization: 'o1', year: 2017, color: '#ffb915', status: 'Active', approvedBy: 'Ronald Watkins', approvalDate: '25/01/2017' },
    'b2': { title: 'Budget-SGA_2017_ORI', organization: 'o1', year: 2017, color: '#00bdd5', status: 'Active', approvedBy: 'Ronald Watkins', approvalDate: '05/01/2017' },
    'b3': { title: 'Budget-RES_2017_RE', organization: 'o1', year: 2017, color: '#47d58e', status: 'Active', approvedBy: 'Ronald Watkins', approvalDate: '01/01/2017' },
  },
  years: {
    2018: { title: 2018, id: 153, code: 2018 },
    2017: { title: 2017, id: 152, code: 2017 },
    2016: { title: 2016, id: 151, code: 2016 },
    2015: { title: 2015, id: 150, code: 2015 },
  },
  filter: {
    organization: 2,
    year: 2017,
    scenario: '5096',
  },
  // } mock chart

  auth: {
    // token: null,
    access_token: undefined, // string (the access token)
    iat: undefined, // int (Unix timestamp indicating when this data was created)
    access_token_expires: undefined, // int (Unix timestamp which is a hint about when the access token will expire)
    userinfo: { // object (List of user claim, the claim defined in the offline_access scope claims)
      sub: undefined, // guid (IDS user id)
      id: undefined, // guid (IDS account id),
      email: undefined, // string (Email)
      preferred_username: undefined, // string (User name)
      given_name: undefined, // string (First name),
      family_name: undefined, // string (Last name),
      locale: undefined, // string (Use desired locale - fr-CA, en-CA, etc)
    },
  },

  config: {
    coreUrl: undefined,
    appInsightsInstrumentationKey: undefined,
    productsRegistry: undefined,
    noAuth: false,
  },

  user: {
    id: null,
    userName: null,
    language: null,
    decimalSeparator: null,
    displayName: null,
    groupSeparator: null,
    initials: null,
  },

  productsExpanded: {
  },

  productsItems: {
    'DisplayNames': {},
    'Domains': [],
  },

  // productsItems: {
  //   'DisplayNames': {
  //     'en-CA': 'Logibec CISSS',
  //     'fr-CA': 'CISSS Logibec',
  //   },
  //   'Domains': [
  //     {
  //       'DomainName': 'PLATFORM',
  //       'Applications': [
  //         {
  //           'ApplicationName': 'Platform-CI',
  //           'Env': 'CI',
  //           'ServiceUrl': 'https://platform-core-ci.logibec.com',
  //           'ApplicationUrl': 'https://platform-ci.logibec.com',
  //           'Services': [],
  //         },
  //         {
  //           'ApplicationName': 'Platform-QA',
  //           'Env': 'QA',
  //           'ServiceUrl': 'https://platform-core-qa.logibec.com',
  //           'ApplicationUrl': 'https://platform-qa.logibec.com',
  //           'Services': [],
  //         },
  //       ],
  //     },
  //     {
  //       'DomainName': 'IDS',
  //       'Applications': [
  //         {
  //           'ApplicationName': 'IDS',
  //           'ServiceUrl': 'https://identity-server-core-qa.logibec.com',
  //           'ApplicationUrl': 'https://identity-server-console-qa.logibec.com',
  //           'Services': [
  //             {
  //               'ServiceName': 'AuditProvider',
  //               'ServiceApiUrl': 'https://identity-server-core-qa.logibec.com/api/auditlogs',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       'DomainName': 'GRM',
  //       'Applications': [
  //         {
  //           'ApplicationName': 'GRM-DEV',
  //           'Env': 'DEV',
  //           'ServiceUrl': 'https://grmweb-dev.logibec.com',
  //           'ApplicationUrl': 'https://grmweb-dev.logibec.com',
  //           'Services': [],
  //         },
  //         {
  //           'ApplicationName': 'GRM-NB',
  //           'Env': 'NB',
  //           'ServiceUrl': 'https://grmweb-nb.logibec.com',
  //           'ApplicationUrl': 'https://grmweb-nb.logibec.com',
  //           'Services': [],
  //         },
  //         {
  //           'ApplicationName': 'GRM-QA',
  //           'Env': 'QA',
  //           'ServiceUrl': 'https://grmweb-qa.logibec.com',
  //           'ApplicationUrl': 'https://grmweb-qa.logibec.com',
  //           'Services': [],
  //         },
  //       ],
  //     },
  //     {
  //       'DomainName': 'BI',
  //       'Applications': [
  //         {
  //           'ApplicationName': 'BI-Platform-Local',
  //           'ServiceUrl': 'https://bi-platform-core-local.logibec.com',
  //           'ApplicationUrl': 'https://bi-platform-local.logibec.com',
  //           'Services': [],
  //         },
  //         {
  //           'ApplicationName': 'BI-Platform-NB',
  //           'Env': 'NB',
  //           'ServiceUrl': 'https://bi-platform-core-nb.logibec.com',
  //           'ApplicationUrl': 'https://bi-platform-nb.logibec.com',
  //           'Services': [],
  //         },
  //         {
  //           'ApplicationName': 'BI-Platform-CI',
  //           'Env': 'CI',
  //           'ServiceUrl': 'https://bi-platform-core-ci.logibec.com',
  //           'ApplicationUrl': 'https://bi-platform-ci.logibec.com',
  //           'Services': [],
  //         },
  //       ],
  //     },
  //     {
  //       'DomainName': 'GCH',
  //       'Applications': [
  //         {
  //           'ApplicationName': 'GCH',
  //           'ServiceUrl': 'https://google.com',
  //           'ApplicationUrl': 'https://google.com',
  //           'Target': '_new',
  //           'Services': [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  products: {
    expanded: false,
  },
  topMenuButtons: routes ? [
    { id: 1, active: false, code: TOP_MENU_BUTTON_NOTES, route: routes.ACCESS_DENIED.path, intlId: 'top-menu-button.notes' },
    { id: 2, active: false, code: TOP_MENU_BUTTON_ATTACHMENTS, route: routes.ACCESS_DENIED.path, intlId: 'top-menu-button.attachments' },
    { id: 3, active: true, code: TOP_MENU_BUTTON_CALCULATION_FOLLOW_UP, route: routes.CALCULATION_FOLLOW_UP.path, intlId: 'top-menu-button.calculation' },
    { id: 4, active: false, code: TOP_MENU_BUTTON_EDIT, route: routes.ACCESS_DENIED.path, intlId: 'top-menu-button.edit' },
    { id: 5, active: true, code: TOP_MENU_BUTTON_COPY, route: routes.COPY_SCENARIO.path, intlId: 'top-menu-button.copy' },
  ] : [],
  isLoading: true,
  editMode: false,
};

const stringSchema = { type: 'string', default: '', required: true };
const numberSchema = { type: 'number', default: '', required: true };

const authSchema = {
  type: 'object',
  required: true,
  properties: {
    access_token: stringSchema, // string (the access token)
    iat: numberSchema, // int (Unix timestamp indicating when this data was created)
    access_token_expires: numberSchema, // int (Unix timestamp which is a hint about when the access token will expire)
    userinfo: { // object (List of user claim, the claim defined in the offline_access scope claims)
      type: 'object',
      required: true,
      properties: {
        sub: stringSchema, // guid (IDS user id)
        id: stringSchema, // guid (IDS account id),
        email: stringSchema, // string (Email)
        preferred_username: stringSchema, // string (User name)
        given_name: stringSchema, // string (First name),
        family_name: stringSchema, // string (Last name),
        locale: stringSchema, // string (Use desired locale - fr-CA, en-CA, etc)
      },
    },
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case GET_PRODUCTS_REGISTRY_SUCCESS: {
      const tenantName = action.options.resource;
      return {
        ...state,
        productsItems: action.payload[tenantName],
      };
    }

    case GET_PRODUCTS_REGISTRY_FAILURE: {
      return {
        ...state,
        productsItems: initialState.productsItems,
      };
    }

    case TOGGLE_PRODUCTS_DOMAIN: {
      const domain = action.payload;
      const productsExpanded = { ...state.productsExpanded, [domain]: !state.productsExpanded[domain] };
      return {
        ...state,
        productsExpanded,
      };
    }

    case TOGGLE_PRODUCTS_MENU:
      return {
        ...state,
        products: { ...state.products, expanded: !state.products.expanded },
      };

    case USER_INFO_SUCCESS:
      return {
        ...state,
        user: action.payload,
        locale: action.payload.language,
      };

    case USER_INFO_FAILURE:
      return state;

    case SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };

    case SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
      };

    case GET_CONFIG_REQUEST: {
      return state;
    }

    case GET_CONFIG_SUCCESS: {
      return { ...state, config: action.payload };
    }

    case GET_CONFIG_FAILURE: {
      return { ...state, config: initialState.config };
    }

    case GET_TOKEN_REFRESH_SUCCESS:
    case GET_TOKEN_SUCCESS: {
      return { ...state, auth: fillDefaults(action.payload, authSchema) };
    }

    case GET_TOKEN_REFRESH_FAILURE:
    case GET_TOKEN_FAILURE: {
      return { ...state, auth: initialState.auth };
    }

    case LDAP_CHECK_FAILURE:
    case LDAP_CHECK_SUCCESS: {
      return { ...state, isLoading: false };
    }

    case SCENARIO_BY_ID_REQUEST: {
      return { ...state, isLoading: true };
    }

    case SCENARIO_BY_ID_SUCCESS:
    case SCENARIO_BY_ID_FAILURE: {
      return { ...state, isLoading: false };
    }

    case EDIT_MODE_END: {
      return {
        ...state,
        editMode: false,
      };
    }

    case EDIT_MODE_START: {
      return {
        ...state,
        editMode: true,
      };
    }
    default:
      return state;
  }
}
