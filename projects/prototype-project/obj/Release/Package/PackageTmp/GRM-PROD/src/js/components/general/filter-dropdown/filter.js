import { cloneDeep, map, remove, toString } from 'lodash';

import * as filterActions from './actions';
import * as scenarioActions from '../../../features/scenario/actions/scenario';
import * as apiActions from '../../../api/actions';
import { EDIT_MODE_END, EDIT_MODE_START } from '../../../features/app/actions';

const initialState = {
  departments: [
    { code: 'All', intlId: 'dropdown-department.every' },
    { code: 'DIRECTION', intlId: 'dropdown-department.DIRECTION' },
    { code: 'SOUSDIRECTION', intlId: 'dropdown-department.SOUSDIRECTION' },
    { code: 'PROGRAMMEFINANCE', intlId: 'dropdown-department.PROGRAMMEFINANCE' },
    { code: 'SOUSPROGRAMMEFINANCE', intlId: 'dropdown-department.SOUSPROGRAMMEFINANCE' },
    { code: 'CENTREACTIVITEFINANCE', intlId: 'dropdown-department.CENTREACTIVITEFINANCE' },
    { code: 'SOUSCENTREACTIVITEFINANCE', intlId: 'dropdown-department.SOUSCENTREACTIVITEFINANCE' },
    { code: 'SOUSSOUSCENTREACTIVITE', intlId: 'dropdown-department.SOUSSOUSCENTREACTIVITE' },
    { code: 'INSTALLATION', intlId: 'dropdown-department.INSTALLATION' },
    { code: 'GROUPECODEPRIMAIRE', intlId: 'dropdown-department.GROUPECODEPRIMAIRE' },
    { code: 'UNITEADMIN', intlId: 'dropdown-department.UNITEADMIN' },
  ],
  selectedDepartment: '',
  departmentFilters: [],
  selectedDepartmentFilters: [],
  filteredDepartmentFilters: [],
  selectedFilterElementsIds: [],
  criteria: '',
  departmentFilterEnabled: false,
  selectDepartmentEnabled: true,
  savedDepartmentFilterEnabled: false,
};

function convertFunctionalCenter(fc) {
  const str = toString(fc).replace(/\s/g, '');
  return `${ str.substr(0, 6) } ${ str.substr(6, 6) }`;
}

function convertFunctionalCenters(data) {
  return map(data, row => ({
    ...row,
    code: convertFunctionalCenter(row.code),
  }));
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case filterActions.SELECT_DEPARTMENT: {
      return {
        ...state,
        selectedDepartment: action.payload.code,
        departmentFilters: initialState.departmentFilters,
        filteredDepartmentFilters: initialState.filteredDepartmentFilters,
        criteria: initialState.criteria,
      };
    }

    case scenarioActions.SELECT_SCENARIO_ROW: {
      return {
        ...state,
        selectedDepartment: initialState.selectedDepartment,
        departmentFilters: initialState.departmentFilters,
        selectedDepartmentFilters: initialState.selectedDepartmentFilters,
        filteredDepartmentFilters: initialState.filteredDepartmentFilters,
        criteria: initialState.criteria,
        selectedFilterElementsIds: initialState.selectedFilterElementsIds,
      };
    }

    case apiActions.GET_FILTER_ELEMENTS_KEYS_SUCCESS: {
      const availableFilterElements = action.payload;
      const updatedDepartments = cloneDeep(initialState.departments);

      updatedDepartments.forEach((department) => {
        if (department.code !== 'All') {
          if (!availableFilterElements.find(element => element === department.code)) {
            department.remove = true;
          }
        }
      });

      remove(updatedDepartments, department => department.remove);
      return {
        ...state,
        departments: updatedDepartments,
      };
    }

    case apiActions.GET_FILTER_ELEMENTS_KEYS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        departments: initialState.departments,
        errorMessage: error.message,
      };
    }

    case apiActions.GET_FILTER_ELEMENTS_REQUEST: {
      return {
        ...state,
        departmentFilters: initialState.departmentFilters,
      };
    }

    case apiActions.GET_FILTER_ELEMENTS_SUCCESS: {
      let updatedDepartmentFilters = [];
      if (state.selectedDepartment === 'UNITEADMIN') {
        convertFunctionalCenters(action.payload).forEach((functionalCenter) => {
          updatedDepartmentFilters.push(functionalCenter);
        });
      } else {
        updatedDepartmentFilters = action.payload;
      }

      return {
        ...state,
        departmentFilters: updatedDepartmentFilters,
        filteredDepartmentFilters: updatedDepartmentFilters,
      };
    }

    case apiActions.GET_FILTER_ELEMENTS_FAILURE: {
      const { error } = action;
      return {
        ...state,
        departmentFilters: initialState.departmentFilters,
        filteredDepartmentFilters: initialState.filteredDepartmentFilters,
        errorMessage: error.message,
      };
    }

    case filterActions.DEPARTMENT_FILTER_SELECTED: {
      const updatedState = cloneDeep(state.selectedDepartmentFilters);
      updatedState.push(action.payload);
      const selectedFilterElementsIds = updatedState.map(departmentFilter => departmentFilter.id);

      return {
        ...state,
        selectedDepartmentFilters: updatedState,
        selectedFilterElementsIds,
      };
    }

    case filterActions.DEPARTMENT_FILTER_DESELECTED: {
      const { id } = action.payload;
      const updatedDepartmentFilters = cloneDeep(state.selectedDepartmentFilters)
        .filter(departmentFilter => (departmentFilter.id !== id));
      const selectedFilterElementsIds = updatedDepartmentFilters.map(departmentFilter => departmentFilter.id);

      return {
        ...state,
        selectedDepartmentFilters: updatedDepartmentFilters,
        selectedFilterElementsIds,
      };
    }

    case filterActions.CLEAR_SELECTED_DEPARTMENT_FILTER: {
      return {
        ...state,
        criteria: '',
        selectedDepartmentFilters: [],
        selectedFilterElementsIds: [],
      };
    }

    case filterActions.FILTER_DEPARTMENT_FILTER_BY_KEYWORD: {
      return {
        ...state,
        criteria: action.payload,
      };
    }

    case filterActions.ENABLE_DEPARTMENT_FILTER: {
      return {
        ...state,
        departmentFilterEnabled: true,
      };
    }

    case filterActions.DISABLE_DEPARTMENT_FILTER: {
      return {
        ...state,
        departmentFilterEnabled: false,
      };
    }

    case filterActions.ENABLE_SELECT_DEPARTMENT: {
      return {
        ...state,
        selectDepartmentEnabled: true,
      };
    }

    case filterActions.DISABLE_SELECT_DEPARTMENT: {
      return {
        ...state,
        selectDepartmentEnabled: false,
      };
    }

    case EDIT_MODE_END: {
      return {
        ...state,
        selectDepartmentEnabled: true,
        departmentFilterEnabled: state.savedDepartmentFilterEnabled,
      };
    }

    case EDIT_MODE_START: {
      return {
        ...state,
        selectDepartmentEnabled: false,
        departmentFilterEnabled: false,
        savedDepartmentFilterEnabled: state.departmentFilterEnabled,
      };
    }

    default:
      return state;
  }
}
