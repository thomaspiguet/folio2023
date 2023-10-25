import { cloneDeep, find } from 'lodash';
import { defineMessages } from 'react-intl';

import * as actions from './actions';

defineMessages({
  dashboard: {
    id: 'side-menu.dashboard',
    defaultMessage: 'DASHBOARD',
  },
  scenarios: {
    id: 'side-menu.scenarios',
    defaultMessage: 'SCENARIOS',
  },
  budgetDetail: {
    id: 'side-menu.budget-detail',
    defaultMessage: ' BUDGET DETAIL',
  },
  positions: {
    id: 'side-menu.positions',
    defaultMessage: 'POSITIONS',
  },
  positionsByJobTitle: {
    id: 'side-menu.positions-by-job-title',
    defaultMessage: 'POSITIONS BY JOB TITLE',
  },
  requiredAttendance: {
    id: 'side-menu.required-attendance',
    defaultMessage: 'REQUIRED ATTENDANCE',
  },
  requiredAttendanceDashbord: {
    id: 'side-menu.required-attendance-dashboard',
    defaultMessage: 'REQ. ATT. DASHBOARD',
  },
  budgetRequests: {
    id: 'side-menu.budget-requests',
    defaultMessage: 'BUDGET REQUESTS',
  },
  imports: {
    id: 'side-menu.imports',
    defaultMessage: 'IMPORTS',
  },
  salaries: {
    id: 'side-menu.salaries',
    defaultMessage: 'SALARIES',
  },
  revenue: {
    id: 'side-menu.revenue',
    defaultMessage: 'REVENUE & EXPENSES',
  },
  report: {
    id: 'side-menu.report',
    defaultMessage: 'REPORTS',
  },
  reference: {
    id: 'side-menu.reference',
    defaultMessage: 'REFERENCE FILES',
  },
  parametersByStructure: {
    id: 'side-menu.parameters-by-structure',
    defaultMessage: 'PARAMETERS BY STRUCTURE',
  },
  globalParameters: {
    id: 'side-menu.global-parameters',
    defaultMessage: 'GLOBAL PARAMETERS',
  },
  revenueAndOtherExpenses: {
    id: 'side-menu.revenue-and-other-expenses',
    defaultMessage: 'Revenue and Other Expenses',
  },
});

const initialState = {
  selected: 'dashboard',
  selectedSubItem: null,
  menuExpanded: true,
  menu: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: 'dashboard',
      expanded: true,
    },
    {
      id: 'budget-detail',
      name: 'Employees',
      icon: 'employees',
      notLink: true,
      expanded: false,
      items: [
        { id: 'positions', intlId: 'side-menu.positions' },
        { id: 'positions-by-job-title', intlId: 'side-menu.positions-by-job-title' },
        { id: 'required-attendance', intlId: 'side-menu.required-attendance' },
        { id: 'required-attendance-dashboard', intlId: 'side-menu.required-attendance-dashboard' },
        { id: 'budget-requests', intlId: 'side-menu.budget-requests' },
        { id: 'imports', intlId: 'side-menu.imports' },
        { id: 'parameters-by-structure', intlId: 'side-menu.parameters-by-structure' },
        { id: 'global-parameters', intlId: 'side-menu.global-parameters' },
        { id: 'revenue-and-other-expenses', intlId: 'side-menu.revenue-and-other-expenses' },
      ],
    },
    {
      id: 'scenarios',
      name: 'Scenarios',
      icon: 'scenarios',
      expanded: false,
      items: [
        { name: 'SGA_2018_ORI', id: 'SGA_2018_ORI' },
        { name: 'SGA_2017_ORI', id: 'SGA_2017_ORI' },
      ],
    },
    {
      id: 'salaries',
      name: 'Salaries',
      icon: 'salaries',
      expanded: false,
      items: [
        { name: 'Employees', id: 'employees' },
        { name: 'Positions', id: 'positions' },
        { name: 'Budget calculations', id: 'budget' },
        { name: 'Batch updates', id: 'batch' },
      ],
    },
    {
      id: 'revenue',
      name: 'Revenue & expenses',
      icon: 'revenue',
      expanded: false,
      items: [
        { name: 'Employees', id: 'Employees' },
      ],
    },
    {
      id: 'report',
      name: 'Reports',
      icon: 'report',
      expanded: false,
      items: [
        { name: 'Quarter 1', id: 'Quarter 1' },
      ],
    },
    {
      id: 'reference',
      name: 'Reference files',
      icon: 'reference',
      expanded: false,
      items: [
        { name: 'file 1', id: 'file 1' },
      ],
    },
  ],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SIDE_MENU_SELECT_ITEM: {
      const { selected, selectedSubItem } = state;
      if (selected === action.id && selectedSubItem === action.subItemId) {
        return state;
      }
      return { ...state, selected: action.id, selectedSubItem: action.subItemId };
    }

    case actions.TOGGLE_EXPAND: {
      const menu = cloneDeep(state.menu);
      const item = find(menu, { id: action.id });
      if (item) {
        item.expanded = !item.expanded;
      }
      return { ...state, menu };
    }

    case actions.TOGGLE_EXPAND_MENU: {
      const menuExpanded = cloneDeep(state.menuExpanded);
      return { ...state, menuExpanded: !menuExpanded };
    }

    default:
      return state;
  }
}
