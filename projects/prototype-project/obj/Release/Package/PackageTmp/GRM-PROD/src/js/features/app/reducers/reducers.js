import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux';

import app from './app';
import sideMenu from '../../../components/general/side-menu/reducer';
import dashboard from '../../dashboard/reducer';
import salaries from '../../salaries/reducer';
import origins from '../../dashboard-origin/origins-reducer';
import scenario from '../../scenario/reducers/scenario';
import scenarioCopy from '../../scenario/reducers/scenario-copy';
import filter from '../../../components/general/filter-dropdown/filter';
import positions from '../../positions/reducer';
import positionsByJobTitle from '../../positions-by-job-title/reducer';
import requiredAttendances from '../../required-attendances/reducers/required-attendances';
import requiredAttendanceQuery from '../../required-attendances/reducers/required-attendance-query';
import revenueAndOtherExpenses from '../../revenue-and-other-expenses/reducer';
import calculationFollowUp from '../../calculation-follow-up/reducers/calculation-follow-up';
import calculationFollowUpDetails from '../../calculation-follow-up/reducers/calculation-follow-up-details';
import budgetRequests from '../../budget-requests/reducer';
import employees from '../../employees/reducer';
import otherExpenses from '../../other-expenses/reducers/other-expenses';
import otherExpensesDetails from '../../other-expenses/reducers/other-expenses-details';
import imports from '../../imports/reducers/imports';
import importAccounts from '../../imports/reducers/import-accounts';
import importOtherScenarios from '../../imports/reducers/import-other-scenarios';
import parametersByStructure from '../../parameters-by-structure/reducer';
import globalParameters from '../../global-parameters/reducer';
import entities from '../../../components/dropdowns/reducers/entities';
import popup from '../../../components/general/popup/reducer';
import otherRates from '../../../components/business/suggested-hourly-rate/reducers/other-rates';
import alert from '../../../components/general/alert/reducer';
import groupLevel from '../../../components/business/suggested-hourly-rate/reducers/group-level';
import breadcrumbs from '../../../components/general/breadcrumbs/reducer';
import benefitsModel from '../../../components/business/benefits-model/reducer';
import requiredAttendanceDashboard from '../../required-attendances/reducers/required-attendance-dashboard';
import account from '../../../components/business/account/reducer';
import distributionExpense from '../../required-attendances/reducers/distribution-expense';
import requiredAttendancesCopy from '../../required-attendances/reducers/required-attendances-copy';
import distributionExpenseCopy from '../../required-attendances/reducers/distribution-expense-copy';

const reducers = combineReducers({
  intl: intlReducer,
  app,
  sideMenu,
  dashboard,
  salaries,
  scenario,
  scenarioCopy,
  origins,
  filter,
  positions,
  positionsByJobTitle,
  requiredAttendances,
  requiredAttendanceQuery,
  revenueAndOtherExpenses,
  calculationFollowUp,
  calculationFollowUpDetails,
  budgetRequests,
  employees,
  otherExpenses,
  otherExpensesDetails,
  imports,
  importAccounts,
  importOtherScenarios,
  parametersByStructure,
  globalParameters,
  entities,
  popup,
  otherRates,
  alert,
  groupLevel,
  breadcrumbs,
  benefitsModel,
  requiredAttendanceDashboard,
  account,
  distributionExpense,
  requiredAttendancesCopy,
  distributionExpenseCopy,
});

export default reducers;
