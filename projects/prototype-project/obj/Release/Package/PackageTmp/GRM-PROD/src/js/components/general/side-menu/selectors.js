import { createSelector } from 'reselect';
import { find, cloneDeep, filter, map, sortBy } from 'lodash';

export const buildMenu = createSelector(
  [
    state => state.app.locale,
    state => state.sideMenu.menu,
    state => state.dashboard.budgetOptions,
  ],
  (locale, smenu, budgetOptions) => {
    const menu = cloneDeep(smenu);
    const dashboard = find(menu, { id: 'dashboard' });
    if (dashboard && budgetOptions.length) {
      const visible = sortBy(filter(budgetOptions, { type: 1 }), 'order');
      dashboard.items = map(visible, (item) => ({
        id: `${ item.id }`,
        // order: `${ item.order }`,
        // id: `${ item.order }`,
        name: item.description,
      }));
    }

    return menu;
  }
);
