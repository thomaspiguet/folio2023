import { delay } from 'redux-saga';
import { put, take, call } from 'redux-saga/effects';
import { alertClose, ALERT_OPEN } from './actions';

export function* alertOpen() {
  while (true) {
    yield take(ALERT_OPEN);
    yield call(delay, 5000);
    yield put(alertClose());
  }
}

