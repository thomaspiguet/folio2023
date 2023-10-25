import { take } from 'redux-saga/effects';
import { defineMessages } from 'react-intl';

import { LDAP_CHECK_FAILURE, LDAP_CHECK_SUCCESS } from '../actions';
import { getHistory, setMessage, routes } from '../app';

defineMessages({
  first: {
    id: 'app.check-ldap',
    defaultMessage: 'Your network account is not available for the product, please contact the Administrator.',
  },
});

export function* checkLdap() {
  while (true) {
    const action = yield take([LDAP_CHECK_FAILURE, LDAP_CHECK_SUCCESS]);
    if (action.type === LDAP_CHECK_SUCCESS) {
      continue;
    }
    const history = getHistory();
    setMessage(action.payload || action.error.message);
    history.push(routes.ACCESS_DENIED.path);
  }
}
