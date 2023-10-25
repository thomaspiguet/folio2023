import {
  POPUP_OPEN,
  POPUP_CLOSE,
  PANEL_OPEN,
  PANEL_CLOSE,
} from './actions';


const initialState = {
  options: {
    style: undefined,
    message: undefined,
    Body: undefined,
    actions: [],
  },
  type: undefined,
  show: false,
  showPanel: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case POPUP_OPEN:
      return {
        ...state,
        ...action.payload,
        show: true,
      };

    case POPUP_CLOSE:
      return initialState;

    case PANEL_OPEN:
      return {
        ...state,
        options: action.payload,
        showPanel: true,
      };

    case PANEL_CLOSE:
      return initialState;

    default:
      return state;
  }
}
