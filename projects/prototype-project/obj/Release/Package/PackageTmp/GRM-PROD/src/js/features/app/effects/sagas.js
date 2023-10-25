import { actionChannel, call, cancel, fork, put, select, spawn, take } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { each, first, isEmpty, isEqual, includes } from 'lodash';

import { sagasRequiredAttendances } from '../../required-attendances/effects/required-attendances';
import { sagasBudgetRequests } from '../../budget-requests/effects';
import { sagasOtherExpenses } from '../../other-expenses/other-expenses-effects';
import { sagasBreadcrumbs } from '../../../components/general/breadcrumbs/effects';

import {
  salariesCollapseAll,
  salariesExpandAll,
  salariesLoadBudgetDetails,
  salariesLoadGroups,
  salariesLoadGroupsData,
  salariesOpenFilters,
  salariesSetFilters,
} from '../../salaries/effects';

import { positionsLoadList } from '../../positions/effects';
import { positionsByJobTitleLoadList } from '../../positions-by-job-title/effects';
import { parametersByStructureLoadList } from '../../parameters-by-structure/effects';
import { otherExpensesLoadList } from '../../other-expenses/effects/other-expenses';
import {
  sagasRequiredAttendanceDashboard,
} from '../../required-attendances/effects/required-attendance-dashboard';
import { generalLedgerAccountsLoadList } from '../../../components/business/account/effects';
import { getRecalculatedDistributions } from '../../../components/business/distributions/effects';

import { getOtherScenariosAfterImportItemReceived, importsLoadList, importAccountsLoadList } from '../../imports/effects/imports';

import {
  checkLdapUser,
  doLogout,
  GET_TOKEN_REFRESH_SUCCESS,
  GET_TOKEN_SUCCESS,
  getConfig,
  getToken,
  getTokenRefresh,
} from '../actions';

import { popupOpen } from '../../../components/general/popup/actions';
import { PopupStyle, PopupActionKind, PopupType } from '../../../components/general/popup/constants';

import {
  BENEFITS_DISTRIBUTION_TEMPLATES_REQUEST,
  BUDGET_ACTUAL_PERIOD_REQUEST,
  BUDGET_ACTUAL_YEAR_REQUEST,
  BUDGET_DETAILS_GROUPS_REQUEST,
  BUDGET_DETAILS_ORIGIN_REPORT_REQUEST,
  BUDGET_DETAILS_ORIGIN_REQUEST,
  BUDGET_DETAILS_REPORT_REQUEST,
  BUDGET_DETAILS_REQUEST,
  BUDGET_FILTER_VALUES_REQUEST,
  BUDGET_OPTIONS_REQUEST,
  BUDGET_OTHER_REQUEST,
  BUDGET_REQUEST_BENEFITS_REQUEST,
  BUDGET_REQUEST_DELETE_REQUEST,
  BUDGET_REQUEST_DISTRIBUTIONS_REQUEST,
  BUDGET_REQUEST_FTE_CALCULATION_REQUEST,
  BUDGET_REQUEST_METADATA_REQUEST,
  BUDGET_REQUEST_LIST_METADATA_REQUEST,
  BUDGET_REQUEST_DEFAULT_REQUEST,
  BUDGET_REQUEST_REQUEST,
  BUDGET_REQUEST_SAVE_REQUEST,
  BUDGET_REQUEST_CREATE_REQUEST,
  BUDGET_REQUEST_TOTALS_REQUEST,
  BUDGET_REQUESTS_REQUEST,
  BUDGET_SELECTED_REQUEST,
  CALCULATION_FOLLOW_UP_REQUEST,
  CALCULATION_FOLLOW_UP_DETAILS_REQUEST,
  DISTRIBUTION_EXPENSE_CREATE_REQUEST,
  DISTRIBUTION_EXPENSE_DEFAULT_REQUEST,
  DISTRIBUTION_EXPENSE_METADATA_REQUEST,
  DISTRIBUTION_EXPENSE_RECALCULATE_REQUEST,
  DISTRIBUTION_EXPENSE_REQUEST,
  DISTRIBUTION_EXPENSE_SAVE_REQUEST,
  DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_REQUEST,
  DISTRIBUTION_EXPENSE_COPY_REQUEST,
  DISTRIBUTION_EXPENSE_COPY_METADATA_REQUEST,
  DISTRIBUTION_EXPENSE_COPY_DEFAULT_EXPENSE_REQUEST,
  EMPLOYEE_REQUEST,
  ENTITIES_REQUEST,
  GENERAL_LEDGER_ACCOUNT_REQUEST,
  GET_ALL_YEARS_REQUEST,
  GET_FILTER_ELEMENTS_KEYS_REQUEST,
  GET_FUNCTIONAL_CENTER_REQUEST,
  GET_INDEXATION_PERIODS_REQUEST,
  GET_ORGANIZATION_YEAR_PERIODS_REQUEST,
  GET_ORGANIZATIONS_PERIODS_REQUEST,
  GET_ORGANIZATIONS_REQUEST,
  GET_ORGANIZATIONS_YEARS_REQUEST,
  GET_PRODUCTS_REGISTRY_REQUEST,
  GET_RESPONSIBLE_REQUEST,
  GET_SUGGESSTED_HOURLY_RATE_REQUEST,
  GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_REQUEST,
  getProductsRegistry,
  getUserInfo,
  GLOBAL_PARAMETERS_REQUEST,
  GROUP_LEVEL_REQUEST,
  IMPORT_ACCOUNT_DETAILS_REQUEST,
  IMPORT_ACCOUNTS_REQUEST,
  IMPORT_OTHER_SCENARIOS_REQUEST,
  IMPORT_REQUEST,
  IMPORTS_REQUEST,
  ORIGIN_REPLACEMENTS_REQUEST,
  OTHER_EXPENSES_CALCULATE_HISTORY_REQUEST,
  OTHER_EXPENSES_DELETE_REQUEST,
  OTHER_EXPENSES_BUDGET_DETAILS_REQUEST,
  OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST,
  OTHER_EXPENSES_HISTORY_DETAILS_REQUEST,
  OTHER_EXPENSES_HISTORY_METADATA_REQUEST,
  OTHER_EXPENSES_METADATA_REQUEST,
  OTHER_EXPENSES_RECALCULATE_REQUEST,
  OTHER_EXPENSES_REQUEST,
  OTHER_EXPENSES_SAVE_HISTORY_REQUEST,
  OTHER_EXPENSES_SAVE_REQUEST,
  OTHER_RATES_REQUEST,
  PARAMETER_BY_STRUCTURE_REQUEST,
  PARAMETERS_BY_STRUCTURE_REQUEST,
  POSITION_BY_JOB_TITLE_REQUEST,
  POSITION_REQUEST,
  POSITIONS_BY_JOB_TITLE_REQUEST,
  POSITIONS_REQUEST,
  REQUIRED_ATTENDANCE_BENEFITS_DAYS_REQUEST,
  REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_REQUEST,
  REQUIRED_ATTENDANCE_CREATE_REQUEST,
  REQUIRED_ATTENDANCE_COPY_REQUEST,
  REQUIRED_ATTENDANCE_QUERY_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_METADATA_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_SAVE_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_TOTAL_REQUEST,
  REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_REQUEST,
  REQUIRED_ATTENDANCE_DEFAULT_REQUEST,
  REQUIRED_ATTENDANCE_DELETE_REQUEST,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_REQUEST,
  REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_REQUEST,
  REQUIRED_ATTENDANCE_LIST_METADATA_REQUEST,
  REQUIRED_ATTENDANCE_COPY_METADATA_REQUEST,
  REQUIRED_ATTENDANCE_METADATA_REQUEST,
  REQUIRED_ATTENDANCE_PARAMETERS_REQUEST,
  REQUIRED_ATTENDANCE_REQUEST,
  REQUIRED_ATTENDANCE_REFERENCES_REQUEST,
  REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_REQUEST,
  REQUIRED_ATTENDANCE_SAVE_REQUEST,
  REQUIRED_ATTENDANCE_TOTAL_HOURS_REQUEST,
  REQUIRED_ATTENDANCES_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_METADATA_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_CREATE_REQUEST,
  REVENUE_AND_OTHER_EXPENSES_RECALCULATE_REQUEST,
  BUDGET_SCENARIO_COPY_METADATA_REQUEST,
  BUDGET_SCENARIO_COPY_REQUEST,
} from '../../../api/actions';

import { SCENARIO_BY_ID_REQUEST } from '../../scenario/actions/scenario';

import {
  changeCompleteSelection,
  changeFollowUpReportSelection,
  changeFunctionalCenterSelection,
  changeOrganizationSelection,
  changeResponsibleSelection,
  changeSecondarySelection,
  changeYearsSelection,
  clearFunctionalCenterSelection,
  clearOrganizationSelection,
  clearResponsibleSelection,
  clearSearchCriteria,
  clearYearsSelection,
  getPeriodsForEachOrganizationYear,
  getScenarioChannel,
  getScenarioYearsAndPeriods,
  scenarioData,
  selectScenarioById,
  takeLatestScenarioData,
  throttleSearchByCriteria,
} from '../../scenario/effects/scenario';

import { dashboardActual, dashboardSetPeriod, dashboardSetYear, takeLatestDashboardData } from '../../dashboard/effects';

import { calculationFollowUpLoadList } from '../../calculation-follow-up/effects';

import {
  elementsAllKeys,
  elementsByKey,
  filterDashboardDataWithFilterElements,
  takeLatestElementsByKey,
  throttleFilterByCriteria,
} from '../../../components/general/filter-dropdown/effects';

import { fetchData } from '../../../api/fetch-wrapper';

import { saveReport } from './reports';

import { changeLocale, setUserLocale } from './locale';

import { startAppInsights } from './app-insights';

import { alertOpen } from '../../../components/general/alert/effects';
import { checkLdap } from './app';
import { sagasDistributionExpense } from '../../required-attendances/effects/distribution-expense';
import { checkEditModeOnSideMenuSelectionChange } from '../../../components/general/side-menu/effect';
import { sagasScenarioCopy } from '../../scenario/effects/scenario-copy';

const NUMBER_OF_CHARACTERS_IN_REQUEST = 7;

function getActionBaseName(type) {
  return type.slice(0, type.length - NUMBER_OF_CHARACTERS_IN_REQUEST);
}

export function* handleRequest(action, isAbsoluteUrl, runningTasks) {
  const nonAuthorized = {
    GET_PRODUCTS_REGISTRY_REQUEST,
  };
  const handledErrorCodes = [404, 500, 501, 502, 503, 504];
  const RESTORE_ERROR_TIMEOUT = 10000;
  const { payload: { url }, type } = action;
  try {
    const { app: { config: { coreUrl, noAuth, allowErrorPopup }, locale, auth: { access_token: accessToken } } } = yield select();
    const apiUrl = isAbsoluteUrl ? url : coreUrl + url;

    const actionBaseName = getActionBaseName(type);
    const { response, error, options } = yield call(fetchData, { url: apiUrl, locale, accessToken }, action.payload.options);

    if (error) {
      if (error.status === 401 && !nonAuthorized[type]) {
        doLogout(error, noAuth);
      }
      if (runningTasks && runningTasks[type] && includes(handledErrorCodes, error.status)) {
        runningTasks[type].responseError = error;
        runningTasks[type].options = options;
        setTimeout(() => {
          runningTasks[type] = undefined;
        }, RESTORE_ERROR_TIMEOUT);

        if (allowErrorPopup) {
          yield put(popupOpen({
            style: PopupStyle.error,
            message: error.message,
            actions: [{ kind: PopupActionKind.ok }],
          }, PopupType.dialog));
        }
      }
      yield put({ type: `${ actionBaseName }FAILURE`, error, options, payload: response });
    } else {
      yield put({ type: `${ actionBaseName }SUCCESS`, payload: response, options });
    }
  } finally {
    if (runningTasks && runningTasks[type] && !runningTasks[type].responseError) {
      runningTasks[type] = undefined;
    }
  }
}

function getUserName() {
  return 'me';
}

export function* refreshToken() {
  const refreshChannel = yield actionChannel([GET_TOKEN_SUCCESS, GET_TOKEN_REFRESH_SUCCESS]);
  while (true) {
    const action = yield take(refreshChannel);
    const { access_token_expires: expires } = action.payload;
    const now = Date.now() / 1000;
    let wakeup = ((expires - now) - 5 * 60) * 1000;
    const wakeupMin = wakeup / 1000 / 60;
    if (wakeupMin < 1 || wakeupMin > 60) {
      wakeup = 55 * 60 * 1000;
    }
    yield delay(wakeup);
    yield call(handleRequest, getTokenRefresh(), true);
  }
}

export function* authenticationSaga() {
  yield call(handleRequest, getConfig(), true);
  // yield call(handleRequest, checkLdapUser()); //to test view
  yield call(handleRequest, getToken(), true);
  yield call(handleRequest, getUserInfo(getUserName()));
  yield call(handleRequest, checkLdapUser());
}

export function* getProductsRegistrySaga() {
  const { app: { config: { productsRegistry } } } = yield select();
  const tenantName = encodeURIComponent(window.location.hostname);
  yield fork(handleRequest, getProductsRegistry(productsRegistry, tenantName), true);
}

export function haveAuth(app) {
  return app && app.config && app.config.coreUrl;
  // && state.app.auth && state.app.auth.access_token
}

export function* watchRequests() {
  // buffer all request in given array
  const runningTasks = {};
  const requestChannel = yield actionChannel([
    GET_ORGANIZATIONS_REQUEST,
    GET_ALL_YEARS_REQUEST,
    GET_ORGANIZATIONS_YEARS_REQUEST,
    GET_ORGANIZATIONS_PERIODS_REQUEST,
    GET_ORGANIZATION_YEAR_PERIODS_REQUEST,
    GET_INDEXATION_PERIODS_REQUEST,
    GET_RESPONSIBLE_REQUEST,
    GET_FUNCTIONAL_CENTER_REQUEST,
    BUDGET_OPTIONS_REQUEST,
    BUDGET_SELECTED_REQUEST,
    BUDGET_ACTUAL_PERIOD_REQUEST,
    BUDGET_ACTUAL_YEAR_REQUEST,
    BUDGET_OTHER_REQUEST,
    BUDGET_DETAILS_GROUPS_REQUEST,
    BUDGET_DETAILS_REQUEST,
    BUDGET_DETAILS_REPORT_REQUEST,
    BUDGET_DETAILS_ORIGIN_REQUEST,
    BUDGET_DETAILS_ORIGIN_REPORT_REQUEST,
    CALCULATION_FOLLOW_UP_REQUEST,
    CALCULATION_FOLLOW_UP_DETAILS_REQUEST,
    GET_FILTER_ELEMENTS_KEYS_REQUEST,
    POSITIONS_REQUEST,
    POSITION_REQUEST,
    REQUIRED_ATTENDANCES_REQUEST,
    REQUIRED_ATTENDANCE_REQUEST,
    REQUIRED_ATTENDANCE_REFERENCES_REQUEST,
    REQUIRED_ATTENDANCE_DEFAULT_REFERENCE_REQUEST,
    REQUIRED_ATTENDANCE_SAVE_REQUEST,
    REQUIRED_ATTENDANCE_CREATE_REQUEST,
    REQUIRED_ATTENDANCE_COPY_REQUEST,
    REQUIRED_ATTENDANCE_QUERY_REQUEST,
    REQUIRED_ATTENDANCE_DELETE_REQUEST,
    REQUIRED_ATTENDANCE_METADATA_REQUEST,
    REQUIRED_ATTENDANCE_LIST_METADATA_REQUEST,
    REQUIRED_ATTENDANCE_COPY_METADATA_REQUEST,
    REQUIRED_ATTENDANCE_DEFAULT_REQUEST,
    REVENUE_AND_OTHER_EXPENSES_REQUEST,
    EMPLOYEE_REQUEST,
    POSITIONS_BY_JOB_TITLE_REQUEST,
    POSITION_BY_JOB_TITLE_REQUEST,
    BUDGET_REQUESTS_REQUEST,
    BUDGET_REQUEST_REQUEST,
    BUDGET_REQUEST_SAVE_REQUEST,
    BUDGET_REQUEST_CREATE_REQUEST,
    BUDGET_REQUEST_METADATA_REQUEST,
    BUDGET_REQUEST_LIST_METADATA_REQUEST,
    BUDGET_REQUEST_DEFAULT_REQUEST,
    BUDGET_REQUEST_TOTALS_REQUEST,
    BUDGET_REQUEST_DELETE_REQUEST,
    OTHER_EXPENSES_REQUEST,
    OTHER_EXPENSES_SAVE_REQUEST,
    OTHER_EXPENSES_DELETE_REQUEST,
    OTHER_EXPENSES_METADATA_REQUEST,
    IMPORTS_REQUEST,
    IMPORT_REQUEST,
    IMPORT_ACCOUNTS_REQUEST,
    IMPORT_OTHER_SCENARIOS_REQUEST,
    IMPORT_ACCOUNT_DETAILS_REQUEST,
    BUDGET_FILTER_VALUES_REQUEST,
    PARAMETERS_BY_STRUCTURE_REQUEST,
    PARAMETER_BY_STRUCTURE_REQUEST,
    GLOBAL_PARAMETERS_REQUEST,
    ENTITIES_REQUEST,
    REQUIRED_ATTENDANCE_TOTAL_HOURS_REQUEST,
    REQUIRED_ATTENDANCE_BENEFITS_DAYS_REQUEST,
    REQUIRED_ATTENDANCE_BENEFITS_PERCENTAGES_REQUEST,
    BUDGET_REQUEST_BENEFITS_REQUEST,
    BUDGET_REQUEST_FTE_CALCULATION_REQUEST,
    OTHER_RATES_REQUEST,
    GROUP_LEVEL_REQUEST,
    GET_SUGGESSTED_HOURLY_RATE_REQUEST,
    GET_SUGGESSTED_HOURLY_RATE_DISTRIBUTION_EXPENSE_REQUEST,
    ORIGIN_REPLACEMENTS_REQUEST,
    SCENARIO_BY_ID_REQUEST,
    BENEFITS_DISTRIBUTION_TEMPLATES_REQUEST,
    BUDGET_REQUEST_DISTRIBUTIONS_REQUEST,
    OTHER_EXPENSES_RECALCULATE_REQUEST,
    OTHER_EXPENSES_BUDGET_DETAILS_REQUEST,
    OTHER_EXPENSES_ACTUAL_DETAILS_REQUEST,
    OTHER_EXPENSES_HISTORY_DETAILS_REQUEST,
    OTHER_EXPENSES_SAVE_HISTORY_REQUEST,
    OTHER_EXPENSES_HISTORY_METADATA_REQUEST,
    OTHER_EXPENSES_CALCULATE_HISTORY_REQUEST,
    REQUIRED_ATTENDANCE_DASHBOARD_REQUEST,
    REQUIRED_ATTENDANCE_DASHBOARD_METADATA_REQUEST,
    REQUIRED_ATTENDANCE_DASHBOARD_RECALCULATE_TOTAL_REQUEST,
    REQUIRED_ATTENDANCE_DASHBOARD_INITIALIZE_REQUEST,
    REQUIRED_ATTENDANCE_DASHBOARD_SAVE_REQUEST,
    REQUIRED_ATTENDANCE_PARAMETERS_REQUEST,
    GENERAL_LEDGER_ACCOUNT_REQUEST,
    REQUIRED_ATTENDANCE_DISTRIBUTIONS_LIST_REQUEST,
    REQUIRED_ATTENDANCE_DISTRIBUTIONS_DELETE_REQUEST,
    DISTRIBUTION_EXPENSE_REQUEST,
    DISTRIBUTION_EXPENSE_METADATA_REQUEST,
    DISTRIBUTION_EXPENSE_SAVE_REQUEST,
    DISTRIBUTION_EXPENSE_CREATE_REQUEST,
    DISTRIBUTION_EXPENSE_COPY_REQUEST,
    DISTRIBUTION_EXPENSE_COPY_METADATA_REQUEST,
    DISTRIBUTION_EXPENSE_DEFAULT_REQUEST,
    DISTRIBUTION_EXPENSE_TOTAL_TO_BE_DISTRIBUTED_REQUEST,
    DISTRIBUTION_EXPENSE_RECALCULATE_REQUEST,
    DISTRIBUTION_EXPENSE_COPY_DEFAULT_EXPENSE_REQUEST,
    REVENUE_AND_OTHER_EXPENSES_DEFAULT_REQUEST,
    REVENUE_AND_OTHER_EXPENSES_METADATA_REQUEST,
    REVENUE_AND_OTHER_EXPENSES_CREATE_REQUEST,
    REVENUE_AND_OTHER_EXPENSES_RECALCULATE_REQUEST,
    BUDGET_SCENARIO_COPY_METADATA_REQUEST,
    BUDGET_SCENARIO_COPY_REQUEST,
  ]);

  const nonCancellables = {
    BUDGET_DETAILS_GROUPS_REQUEST,
    BUDGET_DETAILS_REQUEST,
    // GET_FUNCTIONAL_CENTER_REQUEST,
    ENTITIES_REQUEST,
    GET_ORGANIZATION_YEAR_PERIODS_REQUEST,
  };

  const PENDING_ERROR_TIMEOUT = 10000;

  while (true) {
    const action = yield take(requestChannel);
    const prevTask = runningTasks[action.type];

    if (prevTask) {

      if (!nonCancellables[action.type]) {
        yield cancel(prevTask);
      }

      if (prevTask.responseError && isEqual(prevTask.options, action.payload && action.payload.options)) {
        console.error('pending response error:', prevTask.responseError.message);  // eslint-disable-line no-console
        const actionBaseName = getActionBaseName(action.type);
        yield put({ type: `${ actionBaseName }FAILURE`, error: prevTask.responseError, options: action.payload.options });
        yield delay(PENDING_ERROR_TIMEOUT);
        continue;
      }
    }

    const { app } = yield select();
    if (!haveAuth(app)) {
      // make authorization using blocking call
      yield call(authenticationSaga);
    }

    if (action.type === ENTITIES_REQUEST) {
      const options = action.payload.options.resource.metadata.endpoints;
      if (options && options.length > 0) {
        const endpoints = first(options);
        const requiredParameters = {};
        const { scenario: { selectedScenario: { yearId } } } = yield select();
        each(endpoints.requiredParameters, (parameter) => {
          if (parameter === 'financialYearId') {
            requiredParameters[parameter] = yearId;
          }
        });
        if (!isEmpty(requiredParameters)) {
          action.payload.options.data = {
            ...action.payload.options.data,
            ...requiredParameters,
          };
        }
      }
    }

    runningTasks[action.type] = yield fork(handleRequest, action, false, runningTasks);
  }
}


// single entry point to start all Sagas at once
export function* rootSaga() {
  yield fork(startAppInsights);
  yield fork(getScenarioChannel);
  yield fork(watchRequests);

  yield fork(changeLocale);
  yield fork(setUserLocale);
  yield fork(refreshToken);
  yield fork(checkLdap);
  yield call(authenticationSaga);

  yield fork(getProductsRegistrySaga);

  yield fork(dashboardActual);
  yield fork(dashboardSetYear);
  yield fork(dashboardSetPeriod);
  yield fork(takeLatestDashboardData);

  yield fork(scenarioData);
  yield fork(takeLatestScenarioData);
  yield fork(changeOrganizationSelection);
  yield fork(clearOrganizationSelection);
  yield fork(changeYearsSelection);
  yield fork(clearYearsSelection);
  yield fork(changeResponsibleSelection);
  yield fork(clearResponsibleSelection);
  yield fork(changeFunctionalCenterSelection);
  yield fork(clearFunctionalCenterSelection);
  yield fork(clearSearchCriteria);
  yield fork(throttleSearchByCriteria);
  yield fork(getScenarioYearsAndPeriods);
  yield fork(getPeriodsForEachOrganizationYear);
  yield fork(changeSecondarySelection);
  yield fork(changeCompleteSelection);
  yield fork(changeFollowUpReportSelection);
  yield fork(selectScenarioById);

  yield fork(saveReport);

  yield fork(elementsAllKeys);
  yield fork(elementsByKey);
  yield fork(takeLatestElementsByKey);
  yield fork(throttleFilterByCriteria);
  yield fork(filterDashboardDataWithFilterElements);

  yield fork(salariesLoadGroups);
  yield fork(salariesLoadGroupsData);
  yield fork(salariesExpandAll);
  yield fork(salariesCollapseAll);

  yield fork(salariesOpenFilters);
  yield fork(salariesLoadBudgetDetails);
  yield fork(salariesSetFilters);

  yield fork(getOtherScenariosAfterImportItemReceived);

  yield fork(alertOpen);
  yield fork(checkEditModeOnSideMenuSelectionChange);

  yield fork(positionsLoadList);
  yield fork(positionsByJobTitleLoadList);
  yield fork(parametersByStructureLoadList);
  yield fork(importsLoadList);
  yield fork(importAccountsLoadList);
  yield fork(otherExpensesLoadList);
  yield fork(generalLedgerAccountsLoadList);

  yield fork(calculationFollowUpLoadList);

  yield fork(getRecalculatedDistributions);

  yield spawn(sagasBudgetRequests);
  yield spawn(sagasOtherExpenses);
  yield spawn(sagasRequiredAttendances);
  yield spawn(sagasBreadcrumbs);
  yield spawn(sagasDistributionExpense);
  yield spawn(sagasRequiredAttendanceDashboard);
  yield spawn(sagasScenarioCopy);
}
