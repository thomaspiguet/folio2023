import { take, put } from 'redux-saga/effects';
import { updateIntl } from 'react-intl-redux';

import messagesEnCA from '../../../../i18n/locales/en-CA.json';
import messagesEnUS from '../../../../i18n/locales/en-US.json';
import messagesFrCA from '../../../../i18n/locales/fr-CA.json';
import { SET_LOCALE, setLocale } from '../actions';
import { USER_INFO_SUCCESS } from '../../../api/actions';


export function* setUserLocale() {
  while (true) {
    const action = yield take(USER_INFO_SUCCESS);
    yield put(setLocale(action.payload.language));
  }
}

export function* changeLocale() {
  while (true) {
    const action = yield take(SET_LOCALE);
    const locale = action.payload;
    let messages;
    switch (locale) {
      case 'en-CA':
        messages = messagesEnCA;
        break;
      case 'en-US':
        messages = messagesEnUS;
        break;
      case 'fr-CA':
      default:
        messages = messagesFrCA;
        break;
    }
    yield put(updateIntl({ locale, messages }));
  }
}

