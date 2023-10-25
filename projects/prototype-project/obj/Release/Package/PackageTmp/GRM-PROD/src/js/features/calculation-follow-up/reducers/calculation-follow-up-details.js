import fillDefaults from 'json-schema-fill-defaults';
import {
  CALCULATION_FOLLOW_UP_DETAILS_REQUEST,
  CALCULATION_FOLLOW_UP_DETAILS_SUCCESS,
  CALCULATION_FOLLOW_UP_DETAILS_FAILURE,
} from '../../../api/actions';
import {
  CALCULATION_FOLLOW_UP_OTHER_SECTION_TOGGLE,
  CALCULATION_FOLLOW_UP_FINANCIAL_STRUCTURE_SECTION_TOGGLE,
} from '../actions';

import { calculationFollowUpDetailsSchema } from '../../../entities/calculation-follow-up';

const initialState = {
  isLoading: false,
  editMode: false,
  otherSectionExpanded: true,
  financialStructureSectionExpanded: true,
  entry: fillDefaults({}, calculationFollowUpDetailsSchema),
  calculationId: undefined,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CALCULATION_FOLLOW_UP_DETAILS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: fillDefaults({}, calculationFollowUpDetailsSchema),
      };
    }

    case CALCULATION_FOLLOW_UP_DETAILS_SUCCESS: {
      const entry = action.payload;
      const calculationId = `${ entry.id }`;
      return {
        ...state,
        entry: {
          ...entry,
        },
        calculationId,
        isLoading: false,
        options: action.options.data,
      };
    }

    case CALCULATION_FOLLOW_UP_DETAILS_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: fillDefaults({}, calculationFollowUpDetailsSchema),
      };
    }

    case CALCULATION_FOLLOW_UP_FINANCIAL_STRUCTURE_SECTION_TOGGLE: {
      return {
        ...state,
        financialStructureSectionExpanded: !state.financialStructureSectionExpanded,
      };
    }

    case CALCULATION_FOLLOW_UP_OTHER_SECTION_TOGGLE: {
      return {
        ...state,
        otherSectionExpanded: !state.otherSectionExpanded,
      };
    }

    default:
      return state;
  }
}
