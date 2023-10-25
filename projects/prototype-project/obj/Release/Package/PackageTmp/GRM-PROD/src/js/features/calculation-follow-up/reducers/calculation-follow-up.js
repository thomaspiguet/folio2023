import { defineMessages } from 'react-intl';
import { routes } from '../../app/app';

import {
  CALCULATION_FOLLOW_UP_REQUEST,
  CALCULATION_FOLLOW_UP_SUCCESS,
  CALCULATION_FOLLOW_UP_FAILURE,
} from '../../../api/actions';

const defaultPaging = {
  'pageNo': 1,
  'pageSize': 30,
};

defineMessages({
  detailOption: {
    id: 'calculation-follow-up.detail-option',
    defaultMessage: 'Detail',
  },
  resultOption: {
    id: 'calculation-follow-up.result-option',
    defaultMessage: 'Result',
  },
  detailTitle: {
    id: 'calculation-follow-up.detail-title',
    defaultMessage: 'Calculation Follow-up: Request calculation detail',
  },
  resultTitle: {
    id: 'calculation-follow-up.result-title',
    defaultMessage: 'Calculation Follow-up: Request calculation result',
  },
});

export const MENU_BUTTON_DETAILS = 'MENU_BUTTON_DETAILS';
export const MENU_BUTTON_RESULTS = 'MENU_BUTTON_RESULTS';

const initialState = {
  data: [],
  isLoading: false,
  paging: { ...defaultPaging },
  menuButtons: routes ? [
    { id: 1, active: true, code: MENU_BUTTON_DETAILS, route: routes.CALCULATION_FOLLOW_UP_DETAILS.path, intlId: 'calculation-follow-up.detail-option' },
    { id: 2, active: false, code: MENU_BUTTON_RESULTS, route: routes.CALCULATION_FOLLOW_UP_RESULTS.path, intlId: 'calculation-follow-up.result-option' },
  ] : [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CALCULATION_FOLLOW_UP_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CALCULATION_FOLLOW_UP_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        listResource: resource,
        options: action.options.data,
      };
    }

    case CALCULATION_FOLLOW_UP_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
