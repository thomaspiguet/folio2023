export const POPUP_OPEN = 'POPUP_OPEN';
export const POPUP_CLOSE = 'POPUP_CLOSE';
export const PANEL_OPEN = 'PANEL_OPEN';
export const PANEL_CLOSE = 'PANEL_CLOSE';

export function popupOpen(options, type) {
  return {
    type: POPUP_OPEN,
    payload: {
      options,
      type,
    },
  };
}

export function popupClose() {
  return {
    type: POPUP_CLOSE,
  };
}

export function popupAction(action) {
  return action;
}

export function panelOpen(options) {
  return {
    type: PANEL_OPEN,
    payload: options,
  };
}

export function panelClose() {
  return {
    type: PANEL_CLOSE,
  };
}
