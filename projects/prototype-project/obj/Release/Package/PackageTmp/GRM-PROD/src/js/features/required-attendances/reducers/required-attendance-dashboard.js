import { cloneDeep, get, set } from 'lodash';

import {
  REQUIRED_ATTENDANCE_DASHBOARD_FAILURE,
  REQUIRED_ATTENDANCE_DASHBOARD_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_METADATA_SUCCESS,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_FAILURE,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_SUCCESS,
  REQUIRED_ATTENDANCE_DASHBOARD_SUCCESS,
  REQUIRED_ATTENDANCE_PARAMETERS_FAILURE,
  REQUIRED_ATTENDANCE_PARAMETERS_REQUEST,
  REQUIRED_ATTENDANCE_PARAMETERS_SUCCESS, REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_TOTAL_SUCCESS,
} from '../../../api/actions';

import {
  REQUIRED_ATTENDANCE_DASHBOARD_APPLY_COLUMNS_CUSTOMIZATION,
  REQUIRED_ATTENDANCE_DASHBOARD_EDIT_CANCEL,
  REQUIRED_ATTENDANCE_DASHBOARD_EDIT_START,
  REQUIRED_ATTENDANCE_DASHBOARD_RESET_COLUMNS_CUSTOMIZATION,
  REQUIRED_ATTENDANCE_DASHBOARD_SET_ENTRY,
} from '../actions/required-attendance-dashboard';

import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import { fillColumnsInfo, getDefaultCostomizedColumns } from '../../../utils/utils';
import { getAllColumns } from '../selectors/required-attendance-dashboard';

export const requiredAttendanceDashboardSelector = state => state.requiredAttendanceDashboard;

export function getReferenceKey(row, key) {
  const { reference, type, functionalCenter: { code } } = row.generalInformation;
  return `${ reference }.${ type }.${ code }.${ key }`;
}

const initialState = {
  isLoading: false,
  data: null,
  lastData: null,
  customizedColumns: getDefaultCostomizedColumns(getAllColumns()),
  paging: {
    'pageNo': 1,
    'pageSize': 30,
    'pageCount': -1,
    'recordCount': undefined,
  },
  parameters: null,
  isParamsLoading: false,
  editMode: false,
  changedData: {},
  validationErrors: null,
};

function setChangedValue(changedData, row, key, value, index = undefined, lastRow = undefined) {
  set(row, key, value);
  changedData[getReferenceKey(row, key)] = { value, key, index, row: lastRow, ref: getReferenceKey(row, '') };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }
    case RESET_FILTERS: {
      return {
        ...initialState,
        parameters: { ...state.parameters },
        paging: { ...initialState.paging, pageSize: state.paging.pageSize },
      };
    }
    case REQUIRED_ATTENDANCE_DASHBOARD_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_SUCCESS: {
      const { resource } = action.options;
      return {
        ...state,
        isLoading: false,
        paging: action.payload.paging,
        data: action.payload.data,
        lastData: action.payload.data,
        listResource: resource,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_PARAMETERS_REQUEST: {
      return {
        ...state,
        isParamsLoading: true,
      };
    }

    case REQUIRED_ATTENDANCE_PARAMETERS_SUCCESS: {
      return {
        ...state,
        isParamsLoading: false,
        parameters: action.payload,
      };
    }

    case REQUIRED_ATTENDANCE_PARAMETERS_FAILURE: {
      return {
        ...state,
        isParamsLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_APPLY_COLUMNS_CUSTOMIZATION: {
      const customColumns = action.payload;
      const customizedColumns = { ...state.customizedColumns };
      fillColumnsInfo(customizedColumns, customColumns.columnsFixed);
      fillColumnsInfo(customizedColumns, customColumns.columnsScrolled);
      return {
        ...state,
        customizedColumns,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_RESET_COLUMNS_CUSTOMIZATION: {
      return {
        ...state,
        customizedColumns: { ...initialState.customizedColumns },
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_EDIT_START: {
      return {
        ...state,
        editMode: true,
        changedData: {},
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_EDIT_CANCEL: {
      return {
        ...state,
        editMode: false,
        changedData: {},
        data: state.lastData,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_SET_ENTRY: {
      const { key, index, value } = action.options;
      const data = cloneDeep(state.data);
      const changedData = cloneDeep(state.changedData);
      const row = data[index];
      const lastRow = state.lastData[index];
      const prev = get(row, key);
      if (prev !== value) {
        setChangedValue(changedData, row, key, value, index, lastRow);
      }
      return {
        ...state,
        data,
        changedData,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_SAVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_SAVE_FAILURE: {
      return {
        ...state,
        isLoading: false,
        validationErrors: { ...action.payload, responseError: action.error },
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_SAVE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        editMode: false,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_METADATA_SUCCESS: {
      const metadata = action.payload;
      return {
        ...state,
        metadata,
        editMode: true,
        changedData: {},
        validationErrors: null,
      };
    }

    case REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_TOTAL_SUCCESS: {
      const {
        requiredAttendanceTotalHours: totalHours,
        scheduleTotalWorkload: totalAttendance,
      } = action.payload;
      const {
        index,
      } = action.options.resource;
      const data = cloneDeep(state.data);
      const changedData = cloneDeep(state.changedData);
      const row = data[index];
      setChangedValue(changedData, row, 'totalAttendance', totalAttendance);
      setChangedValue(changedData, row, 'totalHours', totalHours);
      return {
        ...state,
        data,
        changedData,
      };
    }

    default:
      return state;
  }
}
