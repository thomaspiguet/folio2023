import { cloneDeep, includes, isUndefined, map, reduce, set, startsWith, toString } from 'lodash';
import { defineMessages } from 'react-intl';
import fillDefaults from 'json-schema-fill-defaults';

import { makeSearchString, unformatDate } from '../../../utils/utils';

import * as scenarioActions from '../actions/scenario';
import * as apiActions from '../../../api/actions';
import { scenarioSchema } from '../entities/scenario';

const GENERAL_LEDGER_PERIOD_CODE = 14;

export const scenarioSelector = state => state.scenario;

defineMessages({
  org: {
    id: 'scenario-table.organization',
    defaultMessage: 'ORG',
  },
  year: {
    id: 'scenario-table.year',
    defaultMessage: 'YEAR',
  },
  scenario: {
    id: 'scenario-table.scenario',
    defaultMessage: 'SCENARIO',
  },
  description: {
    id: 'scenario-table.description',
    defaultMessage: 'DESCRIPTION',
  },
  administrativeUnits: {
    id: 'scenario-table.administrative-units',
    defaultMessage: 'FUNCTIONAL CENTER',
  },
  responsible: {
    id: 'scenario-table.responsible',
    defaultMessage: 'MANAGER',
  },
});

export const initialState = {
  organizations: {},
  selectedOrganizations: [],
  filteredOrganizations: {},
  years: {},
  organizationYearsLoading: false,
  organizationYears: [],
  organizationPeriods: {},
  selectedYears: [],
  filteredYears: {},
  responsible: {},
  selectedResponsible: [],
  filteredResponsible: {},
  functionalCenters: {},
  selectedFunctionalCenters: [],
  filteredFunctionalCenters: {},
  criteria: '',
  data: [],
  isLoadingTable: false,
  checkedSecondary: false,
  checkedFollowUpReport: undefined,
  checkedComplete: undefined,
  paging: {
    'pageNo': 1, // from 1
    'pageSize': 10,
    'pageCount': -1,
    'recordCount': undefined,
  },
  previouslySelectedOptions: {
    organizationIds: undefined,
    financialYears: undefined,
    responsibleIds: undefined,
    functionalCenterIds: undefined,
    criteria: undefined,
  },
  selectedScenario: fillDefaults({}, scenarioSchema),
  durationYears: [],
};

function convertFunctionalCenter(fc) {
  const str = toString(fc).trim();
  if (str.length === 12) {
    return `${ str.substr(0, 6) } ${ str.substr(6, 6) }`;
  }
  return str;
}

function convertScenarios(data) {
  return map(data, row => ({
    ...row,
    functionalCenter: convertFunctionalCenter(row.functionalCenter),
  }));
}

function convertFunctionalCenters(data) {
  return map(data, row => ({
    ...row,
    code: convertFunctionalCenter(row.code),
  }));
}

function addDurationYearPeriod(durationYears, yearIndex, period, periodStartDate) {
  if (isUndefined(durationYears[yearIndex])) {
    return;
  }
  if (durationYears[yearIndex] && (!durationYears[yearIndex].periods || !durationYears[yearIndex].periods.length)) {
    durationYears[yearIndex].periods = [];
  }

  durationYears[yearIndex].periods.push({
    periodNumber: period.code,
    startDate: period.startDate,
    startDay: periodStartDate.getDate(),
    startMonth: periodStartDate.getMonth(),
    startYear: periodStartDate.getFullYear(),
  });
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case apiActions.GET_ORGANIZATIONS_REQUEST: {
      return {
        ...state,
      };
    }

    case apiActions.GET_ORGANIZATIONS_SUCCESS: {
      const updatedOrganizations = {};
      action.payload.forEach((organization) => {
        updatedOrganizations[organization.id] = organization;
      });
      // const sortedOrganizations = sortBy(updatedOrganizations, 'code');
      const sortedOrganizations = updatedOrganizations;
      return {
        ...state,
        organizations: sortedOrganizations,
        filteredOrganizations: sortedOrganizations,
      };
    }

    case apiActions.GET_ORGANIZATIONS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        organizations: initialState.organizations,
        filteredOrganizations: initialState.filteredOrganizations,
        errorMessage: error.message,
      };
    }

    case scenarioActions.ORGANIZATION_SELECTED: {
      const updatedState = cloneDeep(state.selectedOrganizations);
      updatedState.push(action.payload);

      return {
        ...state,
        selectedOrganizations: updatedState,
      };
    }

    case scenarioActions.ORGANIZATION_DESELECTED: {
      // const updatedOrganizations = omit(state.selectedOrganizations, action.payload.id);
      const { code } = action.payload;
      const updatedOrganizations = cloneDeep(state.selectedOrganizations)
        .filter(organization => (organization.code !== code));

      return {
        ...state,
        selectedOrganizations: updatedOrganizations,
      };
    }

    case scenarioActions.CLEAR_SELECTED_ORGANIZATIONS: {
      return {
        ...state,
        selectedOrganizations: [],
      };
    }

    case scenarioActions.FILTER_ORGANIZATIONS_BY_KEYWORD: {
      const search = makeSearchString(action.payload);
      const filtered = reduce(state.organizations, (result, value, key) => (
        (includes(makeSearchString(value.code), search) ||
        includes(makeSearchString(value.description), search)) ?
        set(result, key, value) : result), {});

      return {
        ...state,
        filteredOrganizations: filtered,
      };
    }

    case apiActions.GET_ALL_YEARS_REQUEST: {
      return {
        ...state,
      };
    }

    case apiActions.GET_ALL_YEARS_SUCCESS: {
      const updatedYears = {};
      action.payload.forEach((year) => {
        updatedYears[year] = { code: year };
        updatedYears[year].id = year;
      });

      return {
        ...state,
        years: updatedYears,
        filteredYears: updatedYears,
      };
    }

    case apiActions.GET_ALL_YEARS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        years: initialState.years,
        filteredYears: initialState.filteredYears,
        errorMessage: error.message,
      };
    }

    case apiActions.GET_ORGANIZATIONS_YEARS_REQUEST: {
      return {
        ...state,
        organizationYearsLoading: true,
      };
    }

    case apiActions.GET_ORGANIZATIONS_YEARS_SUCCESS: {
      const updatedYears = {};
      const updatedDurationYears = [];
      action.payload.forEach((year) => {
        updatedYears[year.code] = year;
        updatedDurationYears.push({
          id: year.id,
          year: year.code,
        });
      });

      return {
        ...state,
        organizationYears: updatedYears,
        organizationYearsLoading: false,
        durationYears: updatedDurationYears,
      };
    }

    case apiActions.GET_ORGANIZATION_YEAR_PERIODS_SUCCESS: {
      // remove general ledger period with
      const periods = action.payload.filter(period => period.code !== GENERAL_LEDGER_PERIOD_CODE);
      const yearIndex = action.options.resource.yearIndex;
      const yearCode = action.options.resource.yearCode;
      const updatedDurationYears = cloneDeep(state.durationYears);

      periods.forEach(period => {
        const periodStartDate = unformatDate(period.startDate, new Date());
        const periodYear = periodStartDate.getFullYear();
        if (periodYear === yearCode) {
          addDurationYearPeriod(updatedDurationYears, yearIndex, period, periodStartDate);
        } else {
          addDurationYearPeriod(updatedDurationYears, yearIndex - 1, period, periodStartDate);
        }
      });

      return {
        ...state,
        durationYears: updatedDurationYears,
      };
    }

    case apiActions.GET_ORGANIZATIONS_YEARS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        organizationYears: {},
        organizationYearsLoading: false,
        errorMessage: error.message,
      };
    }

    case apiActions.GET_ORGANIZATIONS_PERIODS_SUCCESS: {
      const updatedPeriods = {};
      action.payload.forEach((period) => {
        updatedPeriods[period.code] = period;
      });

      return {
        ...state,
        organizationPeriods: updatedPeriods,
      };
    }

    case apiActions.GET_ORGANIZATIONS_PERIODS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        organizationPeriods: {},
        errorMessage: error.message,
      };
    }

    case scenarioActions.YEAR_SELECTED: {
      const updatedState = cloneDeep(state.selectedYears);
      updatedState.push(action.payload);

      return {
        ...state,
        selectedYears: updatedState,
      };
    }

    case scenarioActions.YEAR_DESELECTED: {
      const { code } = action.payload;
      const updatedYears = cloneDeep(state.selectedYears)
        .filter(year => (year.code !== code));

      return {
        ...state,
        selectedYears: updatedYears,
      };
    }

    case scenarioActions.CLEAR_SELECTED_YEARS: {
      return {
        ...state,
        selectedYears: [],
      };
    }

    case scenarioActions.FILTER_YEARS_BY_KEYWORD: {
      const filtered = reduce(state.years, (result, value, key) => (
      startsWith(value.code, action.payload) ?
          set(result, key, value) : result), {});

      return {
        ...state,
        filteredYears: filtered,
      };
    }

    case apiActions.BUDGET_SCENARIOS_SUCCESS: {
      return {
        ...state,
        isLoadingTable: false,
        data: convertScenarios(action.payload.data),
        paging: action.payload.paging,
      };
    }

    case apiActions.BUDGET_SCENARIOS_FAILURE: {
      return {
        ...state,
        data: initialState.data,
        isLoadingTable: false,
      };
    }

    case scenarioActions.SCENARIO_GET_DATA: {
      return {
        ...state,
        isLoadingTable: true,
      };
    }

    case scenarioActions.SCENARIO_GOT_DATA: {
      return {
        ...state,
        isLoadingTable: false,
      };
    }

    case scenarioActions.SCENARIO_BY_ID_SUCCESS:
    case scenarioActions.SELECT_SCENARIO_ROW: {
      const selectedRow = action.payload;
      delete selectedRow.selected;

      return {
        ...state,
        selectedScenario: fillDefaults(selectedRow, scenarioSchema),
      };
    }

    case apiActions.GET_RESPONSIBLE_SUCCESS: {
      const updatedResponsible = {};
      action.payload.forEach((responsible) => {
        updatedResponsible[responsible.userName] = responsible;
      });

      return {
        ...state,
        responsible: updatedResponsible,
        filteredResponsible: updatedResponsible,
      };
    }

    case apiActions.GET_RESPONSIBLE_FAILURE: {
      const { error } = action;
      return {
        ...state,
        responsible: initialState.responsible,
        filteredResponsible: initialState.filteredResponsible,
        errorMessage: error.message,
      };
    }

    case scenarioActions.RESPONSIBLE_SELECTED: {
      const updatedState = cloneDeep(state.selectedResponsible);
      updatedState.push(action.payload);

      return {
        ...state,
        selectedResponsible: updatedState,
      };
    }

    case scenarioActions.RESPONSIBLE_DESELECTED: {
      const { id } = action.payload;
      const updatedState = cloneDeep(state.selectedResponsible)
        .filter(responsible => (responsible.id !== id));

      return {
        ...state,
        selectedResponsible: updatedState,
      };
    }

    case scenarioActions.CLEAR_SELECTED_RESPONSIBLE: {
      return {
        ...state,
        selectedResponsible: [],
      };
    }

    case scenarioActions.FILTER_RESPONSIBLE_BY_KEYWORD: {
      const search = makeSearchString(action.payload);
      const filtered = reduce(state.responsible, (result, value, key) => (
        includes(makeSearchString(value.displayName), search) ?
          set(result, key, value) : result), {});

      return {
        ...state,
        filteredResponsible: filtered,
      };
    }

    case apiActions.GET_FUNCTIONAL_CENTER_SUCCESS: {
      const updatedFunctionalCenters = {};
      convertFunctionalCenters(action.payload).forEach((functionalCenter) => {
        updatedFunctionalCenters[functionalCenter.code] = functionalCenter;
      });

      return {
        ...state,
        functionalCenters: updatedFunctionalCenters,
        filteredFunctionalCenters: updatedFunctionalCenters,
      };
    }

    case apiActions.GET_FUNCTIONAL_CENTER_FAILURE: {
      const { error } = action;
      return {
        ...state,
        functionalCenters: initialState.functionalCenters,
        filteredFunctionalCenters: initialState.filteredFunctionalCenters,
        errorMessage: error.message,
      };
    }

    case scenarioActions.FUNCTIONAL_CENTER_SELECTED: {
      const updatedState = cloneDeep(state.selectedFunctionalCenters);
      updatedState.push(action.payload);

      return {
        ...state,
        selectedFunctionalCenters: updatedState,
      };
    }

    case scenarioActions.FUNCTIONAL_CENTER_DESELECTED: {
      const { code } = action.payload;
      const updatedState = cloneDeep(state.selectedFunctionalCenters)
        .filter(functionalCenter => (functionalCenter.code !== code));

      return {
        ...state,
        selectedFunctionalCenters: updatedState,
      };
    }

    case scenarioActions.CLEAR_SELECTED_FUNCTIONAL_CENTER: {
      return {
        ...state,
        selectedFunctionalCenters: [],
      };
    }

    case scenarioActions.FILTER_FUNCTIONAL_CENTER_BY_KEYWORD: {
      const search = makeSearchString(action.payload);
      const filtered = reduce(state.functionalCenters, (result, value, key) => (
        includes(makeSearchString(value.code), search) ||
        includes(makeSearchString(value.longDescription), search) ?
          set(result, key, value) : result), {});

      return {
        ...state,
        filteredFunctionalCenters: filtered,
      };
    }

    case scenarioActions.CLEAR_SCENARIOS_KEYWORD: {
      return {
        ...state,
        criteria: '',
      };
    }

    case scenarioActions.FILTER_SCENARIOS_BY_KEYWORD: {
      return {
        ...state,
        criteria: action.payload,
      };
    }

    case scenarioActions.TOGGLE_SECONDARY: {
      return {
        ...state,
        checkedSecondary: action.payload,
      };
    }

    case scenarioActions.TOGGLE_FOLLOW_UP_REPORT: {
      return {
        ...state,
        checkedFollowUpReport: action.payload,
      };
    }

    case scenarioActions.TOGGLE_COMPLETE: {
      return {
        ...state,
        checkedComplete: action.payload,
      };
    }

    case scenarioActions.PREVIOUSLY_SELECTED_OPTIONS: {
      return {
        ...state,
        previouslySelectedOptions: action.payload,
      };
    }

    default:
      return state;
  }
}
