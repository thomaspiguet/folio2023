export const SIDE_MENU_SELECT = 'SIDE_MENU_SELECT';
export const SIDE_MENU_SELECT_ITEM = 'SIDE_MENU_SELECT_ITEM';
export const TOGGLE_EXPAND = 'TOGGLE_EXPAND';
export const TOGGLE_EXPAND_MENU = 'TOGGLE_EXPAND_MENU';

export function selectSideMenu(id, subItemId = null) {
  return {
    type: SIDE_MENU_SELECT,
    id,
    subItemId,
  };
}

export function toggleExpand(id) {
  return {
    type: TOGGLE_EXPAND,
    id,
  };
}

export function toggleExpandMenu() {
  return {
    type: TOGGLE_EXPAND_MENU,
  };
}
