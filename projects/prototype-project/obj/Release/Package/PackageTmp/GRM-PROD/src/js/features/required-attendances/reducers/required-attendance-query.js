import fillDefaults from 'json-schema-fill-defaults';

import {
  REQUIRED_ATTENDANCE_QUERY_FAILURE,
  REQUIRED_ATTENDANCE_QUERY_REQUEST,
  REQUIRED_ATTENDANCE_QUERY_SUCCESS,
} from '../../../api/actions';
import { requiredAttendanceQuerySchema } from '../../../entities/query-expenses';

const initialState = {
  isLoading: false,
  data: fillDefaults({}, requiredAttendanceQuerySchema),
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case REQUIRED_ATTENDANCE_QUERY_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case REQUIRED_ATTENDANCE_QUERY_SUCCESS: {
      return {
        ...state,
        data: fillDefaults(action.payload, requiredAttendanceQuerySchema),
        isLoading: false,
      };
    }

    case REQUIRED_ATTENDANCE_QUERY_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
