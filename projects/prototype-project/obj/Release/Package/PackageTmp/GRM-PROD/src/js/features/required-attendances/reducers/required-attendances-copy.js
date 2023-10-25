import fillDefaults from 'json-schema-fill-defaults';
import { find } from 'lodash';

import { SELECT_SCENARIO_ROW } from '../../scenario/actions/scenario';
import { RESET_FILTERS } from '../../../components/general/filter-dropdown/actions';
import {
  REQUIRED_ATTENDANCE_COPY_OPTIONS_TOGGLE,
  REQUIRED_ATTENDANCE_COPY_SET_ENTRY,
  REQUIRED_ATTENDANCE_COPY_START,
  REQUIRED_ATTENDANCE_COPY_TARGET_TOGGLE,
} from '../actions/required-attendances';
import {
  REQUIRED_ATTENDANCE_COPY_METADATA_SUCCESS,
  REQUIRED_ATTENDANCE_COPY_SUCCESS,
  REQUIRED_ATTENDANCE_REFERENCES_SUCCESS,
  REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_SUCCESS,
} from '../../../api/actions';
import { requiredAttendanceCopySchema } from '../../../entities/required-attendance';
import { filterDefaults } from '../../../utils/selectors/filter-defaults';

export const requiredAttendancesCopySelector = state => state.requiredAttendancesCopy;

const initialState = {
  isLoading: false,
  validationErrors: undefined,
  metadata: undefined,
  targetExpanded: true,
  optionsExpanded: false,
  editMode: true,
  entry: fillDefaults({}, requiredAttendanceCopySchema),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_SCENARIO_ROW: {
      return {
        ...initialState,
      };
    }

    case RESET_FILTERS: {
      return {
        ...initialState,
      };
    }

    case REQUIRED_ATTENDANCE_COPY_START: {
      const { id, entry } = action.payload;
      return {
        ...initialState,
        entry: {
          ...filterDefaults(entry, requiredAttendanceCopySchema),
        },
        id,
      };
    }

    case REQUIRED_ATTENDANCE_REFERENCES_SUCCESS: {
      const entry = action.payload;
      const oldEntry = { ...state.entry };
      return {
        ...state,
        entry: {
          ...filterDefaults(entry, requiredAttendanceCopySchema),
          references: oldEntry.references,
          departments: oldEntry.departments,
          subDepartments: oldEntry.subDepartments,
          programs: oldEntry.programs,
          subPrograms: oldEntry.subPrograms,
          primaryCodeGroups: oldEntry.primaryCodeGroups,
          responsibilityCentersLevel1: oldEntry.responsibilityCentersLevel1,
          responsibilityCentersLevel2: oldEntry.responsibilityCentersLevel2,
          responsibilityCentersLevel3: oldEntry.responsibilityCentersLevel3,
          targetFunctionalCenter: oldEntry.targetFunctionalCenter,
        },
      };
    }

    case REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_SUCCESS: {
      const { id } = action.options.meta;
      const reference = find(action.payload.data, { id });
      const references = reference ? [reference] : [];
      return {
        ...state,
        entry: {
          ...state.entry,
          references,
        },
      };
    }

    case REQUIRED_ATTENDANCE_COPY_SET_ENTRY: {
      return {
        ...state,
        entry: action.payload,
      };
    }

    case REQUIRED_ATTENDANCE_COPY_METADATA_SUCCESS: {
      return {
        ...state,
        metadata: action.payload,
      };
    }

    case REQUIRED_ATTENDANCE_COPY_TARGET_TOGGLE: {
      return {
        ...state,
        targetExpanded: !state.targetExpanded,
      };
    }

    case REQUIRED_ATTENDANCE_COPY_OPTIONS_TOGGLE: {
      return {
        ...state,
        optionsExpanded: !state.optionsExpanded,
      };
    }

    case REQUIRED_ATTENDANCE_COPY_SUCCESS: {
      return {
        ...state,
        editMode: false,
      };
    }

    default:
      return state;
  }
}
