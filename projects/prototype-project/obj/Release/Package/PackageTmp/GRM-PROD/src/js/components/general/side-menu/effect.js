import { take, put, select } from 'redux-saga/effects';
import { SIDE_MENU_SELECT, SIDE_MENU_SELECT_ITEM } from './actions';

export function* checkEditModeOnSideMenuSelectionChange() {
  while (true) {
    const action = yield take(SIDE_MENU_SELECT);
    const { app: { editMode } } = yield select();
    if (!editMode) {
      // let user change side-menu selection only when editMode is turned off
      action.type = SIDE_MENU_SELECT_ITEM;
      yield put(action);
    }
  }
}
