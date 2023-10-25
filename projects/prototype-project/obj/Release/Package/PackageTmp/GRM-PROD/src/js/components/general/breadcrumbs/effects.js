import { fork, take, put, actionChannel, select } from 'redux-saga/effects';
import { delay, buffers } from 'redux-saga';

import { BREADCRUMBS_SET_TITLE, setTitleActual } from './actions';

export function* setTitleWithDelay() {
  const channel = yield actionChannel([BREADCRUMBS_SET_TITLE], buffers.sliding(20));
  while (true) {
    const action = yield take(channel);
    const { breadcrumbs: { title: oldTitle } } = yield select();
    const title = action.payload;
    if (title === oldTitle) {
      continue;
    }
    yield delay(10);
    yield put(setTitleActual(action.payload));
  }
}

export function* sagasBreadcrumbs() {
  yield fork(setTitleWithDelay);
}
