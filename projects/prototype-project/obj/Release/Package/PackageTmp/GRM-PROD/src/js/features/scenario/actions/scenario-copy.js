export const SCENARIO_COPY_INIT = 'SCENARIO_COPY_INIT';
export const SCENARIO_COPY_RUN = 'SCENARIO_COPY_RUN';
export const SCENARIO_COPY_CANCEL = 'SCENARIO_COPY_CANCEL';
export const SCENARIO_COPY_SET_ENTRY = 'SCENARIO_COPY_SET_ENTRY';

export function copyInit(payload) {
  return {
    type: SCENARIO_COPY_INIT,
    payload,
  };
}

export function copyRun() {
  return {
    type: SCENARIO_COPY_RUN,
  };
}

export function copyCancel() {
  return {
    type: SCENARIO_COPY_CANCEL,
  };
}

export function setEntry(payload) {
  return {
    type: SCENARIO_COPY_SET_ENTRY,
    payload,
  };
}
