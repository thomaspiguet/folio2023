export const ALERT_OPEN = 'ALERT_OPEN';
export const ALERT_CLOSE = 'ALERT_CLOSE';

export function alertOpen(type, message, values) {
  return {
    type: ALERT_OPEN,
    payload: {
      type,
      message,
      values,
    },
  };
}

export function alertClose() {
  return {
    type: ALERT_CLOSE,
  };
}
