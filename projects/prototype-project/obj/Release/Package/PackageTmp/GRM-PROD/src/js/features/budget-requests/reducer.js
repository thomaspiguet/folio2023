import { cloneDeep, isEqual } from 'lodash';

import fillDefaults from 'json-schema-fill-defaults';
import {
  BUDGET_REQUESTS_REQUEST,
  BUDGET_REQUESTS_SUCCESS,
  BUDGET_REQUESTS_FAILURE,
  BUDGET_REQUEST_REQUEST,
  BUDGET_REQUEST_SUCCESS,
  BUDGET_REQUEST_FAILURE,
  BUDGET_REQUEST_METADATA_SUCCESS,
  BUDGET_REQUEST_SAVE_REQUEST,
  BUDGET_REQUEST_SAVE_SUCCESS,
  BUDGET_REQUEST_SAVE_FAILURE,
  BUDGET_REQUEST_BENEFITS_REQUEST,
  BUDGET_REQUEST_BENEFITS_SUCCESS,
  BUDGET_REQUEST_BENEFITS_FAILURE,
  BUDGET_REQUEST_TOTALS_SUCCESS,
  BUDGET_REQUEST_DELETE_REQUEST,
  BUDGET_REQUEST_DELETE_SUCCESS,
  BUDGET_REQUEST_DELETE_FAILURE,
  BUDGET_REQUEST_FTE_CALCULATION_REQUEST,
  BUDGET_REQUEST_FTE_CALCULATION_SUCCESS,
  BUDGET_REQUEST_FTE_CALCULATION_FAILURE,
  GET_SUGGESSTED_HOURLY_RATE_REQUEST,
  GET_SUGGESSTED_HOURLY_RATE_SUCCESS,
  GET_SUGGESSTED_HOURLY_RATE_FAILURE,
  BUDGET_REQUEST_DISTRIBUTIONS_REQUEST,
  BUDGET_REQUEST_DISTRIBUTIONS_SUCCESS,
  BUDGET_REQUEST_DISTRIBUTIONS_FAILURE,
  BUDGET_REQUEST_LIST_METADATA_SUCCESS,
  BUDGET_REQUEST_LIST_METADATA_FAILURE,
  BUDGET_REQUEST_LIST_METADATA_REQUEST,
  BUDGET_REQUEST_DEFAULT_SUCCESS,
  BUDGET_REQUEST_CREATE_SUCCESS,
  BUDGET_REQUEST_DEFAULT_FAILURE,
  BUDGET_REQUEST_CREATE_FAILURE,
  BUDGET_REQUEST_CREATE_REQUEST,
} from '../../api/actions';
import {
  BUDGET_REQUEST_SET_GROUPS,
  BUDGET_REQUEST_SUGGESTED_HOURLY_RATE_EXPAND,
  BUDGET_REQUEST_EDIT_START,
  BUDGET_REQUEST_SET_ENTRY,
  BUDGET_REQUEST_APPLY_ADVANCED_SEARCH,
  BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH,
  BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH,
  BUDGET_REQUEST_SET_SEARCH_ENTRY,
  BUDGET_REQUEST_SET_SEARCH_KEYWORD,
  BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH,
} from './actions';
import { SELECT_SCENARIO_ROW } from '../scenario/actions/scenario';
import { RESET_FILTERS } from '../../components/general/filter-dropdown/actions';
import { benefitsBudgetRequestSchema, percentagesSchema } from '../../entities/benefits';
import { distributionsSchema, distributionTemplateSchema } from '../../entities/distribution';
import { budgetRequestSchema } from '../../entities/budget-request';
import { omitZeroIdObjects } from '../../utils/utils';

const emptyEntry = {
  'number': undefined,
  'description': undefined,
  'isSpecificRequest': undefined,
  'forThisScenario': undefined,
  'functionalCenter': { 'code': undefined, 'longDescription': undefined },
  'requestType': { 'code': undefined, 'longDescription': undefined },
  'natureOfExpense': { 'code': undefined, 'longDescription': undefined },
  'type': { 'code': undefined, 'longDescription': undefined },
  'jobTitle': { 'description': undefined, 'notaryEmploymentCode': undefined },
  'jobStatus': { 'code': undefined, 'longDescription': undefined },
  'jobType': { 'code': undefined, 'shortDescription': undefined },
  'jobTitleGroup': { 'code': undefined, 'longDescription': undefined },
  'union': { 'code': undefined, 'shortDescription': undefined },
  'benefits': fillDefaults({}, benefitsBudgetRequestSchema),
  'isAmountToDistribute': undefined,
  'valuesToDestribute': undefined,
  'hourlyFactor': undefined,
  'isFteCalculation': undefined,
  'isCalculatingPayrollDeductions': undefined,
  'isCalculatingBenefits': undefined,
  'fte': undefined,
  'calculationBase': {
    'longDescription': undefined,
  },
  'totalValue': undefined,
  'distributions': {},
  'distributionTemplate': fillDefaults({}, distributionTemplateSchema),
  'financialYearGroup': {
    'description': undefined,
    'valueType': undefined,
  },
  'suggestedHourlyRate': {
    'suggestedHourlyRate': undefined,
    'specificHourlyRate': undefined,
    'rateOriginType': undefined,
    'rateOriginDescription': undefined,
    'rateOriginFunctionalCenter': {
      'shortDescription': undefined,
      'longDescription': undefined,
      'code': undefined,
      'id': undefined,
      'codeDescription': undefined,
    },
  },
};

const emptyFields = {
  validationErrors: null,
  isLoading: false,
};

const emptySearch = {
  functionalCenter: [],
  requestType: [],
  natureOfExpense: [],
  secondaryCode: [],
  description: undefined,
  jobTitle: [],
  jobTitleGroup: [],
  isSpecificRequest: undefined,
  isAmountToDistribute: undefined,
  forThisScenario: false,
  union: [],
};

const initialState = {
  isLoading: false,
  isLoadingDistributions: false,
  data: null,
  metadata: undefined,
  listMetadata: undefined,
  listMetadataLoading: false,
  editMode: false,
  paging: {
    'pageNo': 1,
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
  groups: [],
  budgetRequests: {},
  options: {},
  entry: emptyEntry,
  isSuggestedHourlyRateExpanded: false,
  isChamMode: false,
  showAdvancedSearch: false,
  haveAdvancedSearch: false,
  applyAdvancedSearch: false,
  advancedSearch: emptySearch,
  search: emptySearch,
  searchKeyword: '',
};

export const budgetRequestsSelector = state => state.budgetRequests;

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW:
    case RESET_FILTERS: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }

    case BUDGET_REQUEST_SET_GROUPS: {
      return {
        ...state,
        groups: action.payload,
      };
    }

    case BUDGET_REQUESTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case BUDGET_REQUESTS_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        isLoading: false,
        data: action.payload.data,
        options: action.options.data,
        paging: action.payload.paging,
        listResource: resource,
      };
    }

    case BUDGET_REQUESTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case BUDGET_REQUEST_REQUEST: {
      return {
        ...state,
        isLoading: true,
        entry: emptyEntry,
        isSuggestedHourlyRateExpanded: false,
        validationErrors: null,
      };
    }

    case BUDGET_REQUEST_CREATE_SUCCESS:
    case BUDGET_REQUEST_SAVE_SUCCESS:
    case BUDGET_REQUEST_SUCCESS: {
      const entry = action.payload;
      const { natureOfExpense, benefits, distributionTemplate } = entry;
      const budgetRequestId = `${ entry.id }`;

      return {
        ...state,
        editMode: false,
        entry: {
          ...emptyEntry,
          ...entry,
          benefits: fillDefaults(benefits, benefitsBudgetRequestSchema),
          distributionTemplate: fillDefaults(distributionTemplate, distributionTemplateSchema),
        },
        budgetRequestId,
        isChamMode: !!natureOfExpense,
        oldEntry: undefined,
        ...emptyFields,
      };
    }

    case BUDGET_REQUEST_FAILURE: {
      return {
        ...state,
        isLoading: false,
        entry: emptyEntry,
      };
    }

    case BUDGET_REQUEST_SUGGESTED_HOURLY_RATE_EXPAND: {
      return {
        ...state,
        isSuggestedHourlyRateExpanded: !state.isSuggestedHourlyRateExpanded,
      };
    }

    case BUDGET_REQUEST_EDIT_START: {
      return {
        ...state,
        editMode: !!state.metadata,
      };
    }

    case BUDGET_REQUEST_METADATA_SUCCESS: {
      const metadata = action.payload;
      return {
        ...state,
        metadata,
        editMode: true,
        oldEntry: cloneDeep(state.entry),
        isChamMode: metadata.isChamMode,
      };
    }

    case BUDGET_REQUEST_SET_ENTRY: {
      return {
        ...state,
        entry: action.payload,
      };
    }

    case BUDGET_REQUEST_CREATE_REQUEST:
    case BUDGET_REQUEST_SAVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
      };
    }

    case BUDGET_REQUEST_CREATE_FAILURE:
    case BUDGET_REQUEST_SAVE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case BUDGET_REQUEST_BENEFITS_REQUEST: {
      return {
        ...state,
      };
    }

    case BUDGET_REQUEST_BENEFITS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          benefits: {
            ...state.entry.benefits,
            origin: undefined,
            percenteges: fillDefaults(action.payload, percentagesSchema),
          },
        },
      };
    }

    case BUDGET_REQUEST_BENEFITS_FAILURE: {
      return {
        ...state,
      };
    }

    case BUDGET_REQUEST_TOTALS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          totalValue: action.payload,
        },
      };
    }

    case BUDGET_REQUEST_DELETE_REQUEST: {
      return {
        ...state,
        validationErrors: null,
      };
    }

    case BUDGET_REQUEST_DELETE_FAILURE: {
      return {
        ...state,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case BUDGET_REQUEST_DELETE_SUCCESS: {
      return {
        ...initialState,
        validationErrors: null,
      };
    }

    case BUDGET_REQUEST_FTE_CALCULATION_REQUEST: {
      return {
        ...state,
      };
    }

    case BUDGET_REQUEST_FTE_CALCULATION_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fte: action.payload,
        },
      };
    }

    case BUDGET_REQUEST_FTE_CALCULATION_FAILURE: {
      return {
        ...state,
        entry: {
          ...state.entry,
          fte: 0,
        },
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_REQUEST:
    case GET_SUGGESSTED_HOURLY_RATE_FAILURE: {
      return {
        ...state,
        calculatedSuggestedHourlyRate: undefined,
      };
    }

    case GET_SUGGESSTED_HOURLY_RATE_SUCCESS: {
      const { resource: { setValue } } = action.options;
      const newState = {
        ...state,
        calculatedSuggestedHourlyRate: action.payload,
      };
      if (setValue) {
        newState.entry.suggestedHourlyRate.suggestedHourlyRate = action.payload;
      }
      return newState;
    }

    case BUDGET_REQUEST_DISTRIBUTIONS_REQUEST: {
      return {
        ...state,
        isLoadingDistributions: true,
      };
    }

    case BUDGET_REQUEST_DISTRIBUTIONS_SUCCESS: {
      return {
        ...state,
        entry: {
          ...state.entry,
          distributions: fillDefaults(action.payload, distributionsSchema),
        },
        isLoadingDistributions: false,
      };
    }

    case BUDGET_REQUEST_DISTRIBUTIONS_FAILURE: {
      return {
        ...state,
        isLoadingDistributions: false,
      };
    }

    case BUDGET_REQUEST_LIST_METADATA_REQUEST: {
      return {
        ...state,
        listMetadata: undefined,
        listMetadataLoading: true,
      };
    }

    case BUDGET_REQUEST_LIST_METADATA_FAILURE: {
      return {
        ...state,
        listMetadataLoading: false,
        listMetadata: {},
      };
    }

    case BUDGET_REQUEST_LIST_METADATA_SUCCESS: {
      return {
        ...state,
        listMetadata: action.payload,
        listMetadataLoading: false,
      };
    }

    case BUDGET_REQUEST_TOGGLE_ADVANCED_SEARCH: {
      return {
        ...state,
        showAdvancedSearch: !state.showAdvancedSearch,
        search: cloneDeep(state.advancedSearch),
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case BUDGET_REQUEST_CLEAR_ADVANCED_SEARCH: {
      return {
        ...state,
        advancedSearch: emptySearch,
        search: emptySearch,
        haveAdvancedSearch: false,
      };
    }

    case BUDGET_REQUEST_CLEAR_ACTION_ADVANCED_SEARCH: {
      return {
        ...state,
        advancedSearch: emptySearch,
        search: emptySearch,
        haveAdvancedSearch: false,
      };
    }

    case BUDGET_REQUEST_APPLY_ADVANCED_SEARCH: {
      return {
        ...state,
        search: cloneDeep(state.advancedSearch),
        showAdvancedSearch: false,
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case BUDGET_REQUEST_SET_SEARCH_ENTRY: {
      const advancedSearch = action.payload;
      return {
        ...state,
        advancedSearch,
        haveAdvancedSearch: !isEqual(state.advancedSearch, emptySearch),
      };
    }

    case BUDGET_REQUEST_SET_SEARCH_KEYWORD: {
      return {
        ...state,
        searchKeyword: action.payload,
      };
    }

    case BUDGET_REQUEST_DEFAULT_SUCCESS: {
      const entry = action.payload;
      return {
        ...state,
        editMode: true,
        entry: omitZeroIdObjects(fillDefaults(entry, budgetRequestSchema)),
        budgetRequestId: 0,
        oldEntry: undefined,
        metadata: state.metadata,
        ...emptyFields,
      };
    }

    case BUDGET_REQUEST_DEFAULT_FAILURE: { // TODO: remove when the backend will be implemented
      return {
        ...state,
        editMode: true,
        entry: {
          ...emptyEntry,
        },
        budgetRequestId: 0,
      };
    }

    default:
      return state;
  }
}
