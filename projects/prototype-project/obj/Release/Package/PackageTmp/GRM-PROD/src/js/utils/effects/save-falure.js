import { map } from 'lodash';
import { take, put } from 'redux-saga/effects';

import { getValidationErrors } from '../components/form-validator';
import { popupOpen } from '../../components/general/popup/actions';

const YES_NO_CONFIRMATION_WITH_YES_DEFAULT_ACTION = 1;
const YES_NO_CONFIRMATION_WITH_NO_DEFAULT_ACTION = 2;
const OK_CONFIRMATION_WITH_OK_DEFAULT_ACTION = 3;

export function* saveFailure(actionType, saveAction) {
  while (true) {
    const action = yield take(actionType);
    const { payload, error, options: { body: { data: newEntry, id } } } = action;
    const { messages, expectedUserResponse, actionTypes } = getValidationErrors({ ...payload, responseError: error });

    const actions = [];
    let style = 'confirm';

    // show backend validation messages and confirm with ok button without action
    if (!expectedUserResponse) {
      style = 'error';
      actions.push({ kind: 'ok' });
    } else {
      // show confirmation messages with info-text from backend response
      const actionResponses = map(actionTypes, (action) => ({ action, userResponse: expectedUserResponse }));
      if (expectedUserResponse === YES_NO_CONFIRMATION_WITH_YES_DEFAULT_ACTION) {
        actions.push({ kind: 'yes', action: saveAction(id, newEntry, actionResponses) });
        actions.push({ kind: 'no' });
      }
      if (expectedUserResponse === YES_NO_CONFIRMATION_WITH_NO_DEFAULT_ACTION) {
        actions.push({ kind: 'yes' });
        actions.push({ kind: 'no', action: saveAction(id, newEntry, actionResponses) });
      }
      if (expectedUserResponse === OK_CONFIRMATION_WITH_OK_DEFAULT_ACTION) {
        actions.push({ kind: 'ok', action: saveAction(id, newEntry, actionResponses) });
      }
    }

    yield put(popupOpen({
      style,
      messages,
      actions,
    }));

  }
}

export function* deleteFailure(actionType) {
  while (true) {
    const action = yield take(actionType);
    const { payload, error } = action;
    const { messages } = getValidationErrors({ ...payload, responseError: error });

    const { VersionInconsistency } = payload;
    const actions = [{ kind: 'ok' }];
    const style = 'error';
    if (VersionInconsistency) {
      messages.push({ intlId: 'validation.reload-page' });
    }
    yield put(popupOpen({
      style,
      messages,
      actions,
    }));
  }
}
