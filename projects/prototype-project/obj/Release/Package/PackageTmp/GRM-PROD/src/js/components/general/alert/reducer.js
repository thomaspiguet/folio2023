import {
  ALERT_OPEN,
  ALERT_CLOSE,
} from './actions';

const initialState = {
  message: undefined,
  type: undefined,
  values: undefined,
  show: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ALERT_OPEN:
      return {
        ...state,
        ...action.payload,
        show: true,
      };

    case ALERT_CLOSE:
      return initialState;

    default:
      return state;
  }
}
