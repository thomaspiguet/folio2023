import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Dashboard from '../dashboard/dashboard';
import Salaries from '../salaries/salaries';
import About from '../about/about';
import NotFound from '../not-found/not-found';
import SideMenu from '../../components/general/side-menu/side-menu';
import TopMenu from '../../components/general/top-menu/top-menu';
import TopHeader from '../../components/general/top-header/top-header';
import Scenario from '../scenario/scenario';
import CalculationFollowUp from '../calculation-follow-up/calculation-follow-up';
import CalculationFollowUpDetails from '../calculation-follow-up/calculation-follow-up-details';
import AccessDenied from '../../components/general/access-denied/access-denied';
import DashboardOrigin from '../dashboard-origin/dashboard-origin';
import Positions from '../positions/positions';
import Position from '../positions/position';
import RequiredAttendance from '../required-attendances/required-attendance';
import RequiredAttendances from '../required-attendances/required-attendances';
import Employee from '../employees/employee';
import PositionsByJobTitle from '../positions-by-job-title/positions-by-job-title';
import PositionByJobTitle from '../positions-by-job-title/position-by-job-title';
import BudgetRequest from '../budget-requests/budget-request';
import BudgetRequests from '../budget-requests/budget-requests';
import OtherExpenses from '../other-expenses/other-expenses';
import OtherExpensesIndexation from '../other-expenses/other-expenses-indexation';
import OtherExpensesAdjustment from '../other-expenses/other-expenses-adjustment';
import ImportAccount from '../imports/import-account';
import ImportAccounts from '../imports/import-accounts';
import Imports from '../imports/imports';
import ParametersByStructure from '../parameters-by-structure/parameters-by-structure';
import ParameterByStructure from '../parameters-by-structure/parameter-by-structure';
import GlobalParameters from '../global-parameters/global-parameters';
import RevenueAndOtherExpenses from '../revenue-and-other-expenses/revenue-and-other-expenses';
import Popup from '../../components/general/popup/popup';
import Panel from '../../components/general/popup/panel';
import Alert from '../../components/general/alert/alert';
import { PopupActionKind, PopupStyle } from '../../components/general/popup/constants';
import { popupOpen } from '../../components/general/popup/actions';
import { getScenarioById } from '../scenario/actions/scenario';
import Breadcrumbs from '../../components/general/breadcrumbs/breadcrumbs';
import RequiredAttendanceDashboard from '../required-attendances/required-attendance-dashboard';
import RequiredAttendancesCopy from '../required-attendances/required-attendances-copy';
import RequiredAttendanceQuery from '../required-attendances/required-attendance-query';
import DistributionExpenseCopy from '../required-attendances/distribution-expense-details-copy';
import ScenarioCopy from '../scenario/scenario-copy';

import './app.scss';

const publicPath = '/';
const modalPath = 'modal/';
const publicPathWithScenarioId = '/:scenarioId/';

export const routes = {
  DASHBOARD: {
    path: `${ publicPathWithScenarioId }dashboard`,
    name: 'Dashboard page',
    intlId: 'dashboard.title',
    noBreadcrumb: true,
  },
  DASHBOARD_ITEM: {
    path: `${ publicPathWithScenarioId }dashboard/:id`,
    name: 'Dashboard item page',
    parent: 'DASHBOARD',
  },
  DASHBOARD_ITEM_POSITIONS: {
    path: `${ publicPathWithScenarioId }dashboard/:id/origin/:origin/:functionalCenterId`,
    name: 'Dashboard origin page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  CALCULATION_FOLLOW_UP: {
    path: `${ publicPathWithScenarioId }calculation-follow-up`,
    name: 'Calculation follow-up page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'calculation-follow-up.title',
  },
  CALCULATION_FOLLOW_UP_DETAILS: {
    path: `${ publicPathWithScenarioId }calculation-follow-up/:id/details`,
    name: 'Calculation follow-up page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'calculation-follow-up.detail-title',
  },
  CALCULATION_FOLLOW_UP_RESULTS: {
    path: `${ publicPathWithScenarioId }calculation-follow-up/:id/results`,
    name: 'Calculation follow-up page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'calculation-follow-up.result-title',
  },
  SALARIES: {
    path: `${ publicPathWithScenarioId }salaries`,
    name: 'Salaries page',
    parent: 'DASHBOARD',
  },
  ABOUT: {
    path: `${ publicPath }about`,
    name: 'About page',
  },
  SCENARIO: {
    path: `${ publicPath }${ modalPath }scenario`,
    name: 'Scenario page',
  },
  MODAL: {
    path: `${ publicPath }${ modalPath }`,
    name: '',
  },
  ACCESS_DENIED: {
    path: `${ publicPath }${ modalPath }access-denied`,
    name: 'Access denied',
  },
  POSITIONS: {
    path: `${ publicPathWithScenarioId }budget-detail/positions`,
    name: 'Positions page',
    parent: 'DASHBOARD',
    intlId: 'positions.title',
  },
  POSITIONS_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/positions/:id`,
    name: 'Position item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'position.title-position',
  },
  REQUIRED_ATTENDANCES: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance`,
    name: 'Required attendance page',
    parent: 'DASHBOARD',
    intlId: 'required-attendance.list-title',
  },
  REQUIRED_ATTENDANCE_DASHBOARD: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance-dashboard`,
    name: 'Required attendance dashboard',
    parent: 'DASHBOARD',
    intlId: 'required-attendance-dashboard.title',
  },
  REQUIRED_ATTENDANCES_COPY: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance/:id/copy`,
    name: 'Required attendance copy page',
    useParentPath: true,
    intlId: 'required-attendance-copy.title',
    parent: 'DASHBOARD',
  },
  REQUIRED_ATTENDANCES_QUERY: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance/:id/query`,
    name: 'Required attendance query page',
    useParentPath: true,
    intlId: 'required-attendance-query.title',
    parent: 'DASHBOARD',
  },
  REQUIRED_ATTENDANCE_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance/:id`,
    name: 'Required attendance item page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  DISTRIBUTION_EXPENSE_COPY: {
    path: `${ publicPathWithScenarioId }budget-detail/required-attendance/:id/copyDistributions`,
    name: 'Required attendance distribution expense copy page',
    useParentPath: true,
    intlId: 'distribution-expense-copy.title',
    parent: 'DASHBOARD',
  },
  EMPLOYEES: {
    path: `${ publicPathWithScenarioId }budget-detail/employees`,
    name: 'Employees page',
    parent: 'DASHBOARD',
  },
  EMPLOYEES_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/employees/:id`,
    name: 'Employees item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'position.title-employee',
  },
  POSITIONS_BY_JOB_TITLE: {
    path: `${ publicPathWithScenarioId }budget-detail/positions-by-job-title`,
    name: 'Positions by job title page',
    parent: 'DASHBOARD',
    intlId: 'positions-by-job-title.title',
  },
  POSITIONS_BY_JOB_TITLE_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/positions-by-job-title/:id`,
    name: 'Position by job title item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'position.position',
  },
  BUDGET_REQUESTS: {
    path: `${ publicPathWithScenarioId }budget-detail/budget-requests`,
    name: 'Budget requests page',
    parent: 'DASHBOARD',
    intlId: 'budget-request.title',
  },
  BUDGET_REQUEST_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/budget-requests/:id`,
    name: 'Budget request item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'budget-request.details-tab-title',
  },
  ORIGIN_BUDGET_REQUEST_ITEM: {
    path: `${ publicPathWithScenarioId }origin/:detailId/budget-requests/:id`,
    name: 'Budget request item page redirected from dashboard',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'budget-request.details-tab-title',
  },
  OTHER_EXPENSES: {
    path: `${ publicPathWithScenarioId }other-expenses`,
    name: 'Other expenses page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  OTHER_EXPENSES_ITEM: {
    path: `${ publicPathWithScenarioId }other-expenses/:id`,
    name: 'Other expenses item page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  OTHER_EXPENSES_INDEXATION: {
    path: `${ publicPathWithScenarioId }other-expenses/:id/indexation`,
    name: 'Other expenses indexation page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  OTHER_EXPENSES_ADJUSTMENT: {
    path: `${ publicPathWithScenarioId }other-expenses/:id/adjustment`,
    name: 'Other expenses adjustment page',
    useParentPath: true,
    parent: 'DASHBOARD',
  },
  IMPORTS: {
    path: `${ publicPathWithScenarioId }budget-detail/imports`,
    name: 'Imports page',
    parent: 'DASHBOARD',
    intlId: 'imports.title',
  },
  IMPORT_ACCOUNTS: {
    path: `${ publicPathWithScenarioId }budget-detail/imports/:id`,
    name: 'Import accounts page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'imports.title-item',
  },
  IMPORT_ACCOUNTS_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/imports/:id/accounts/:accountId`,
    name: 'Import account item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'imports.title-item',
  },
  PARAMETERS_BY_STRUCTURE: {
    path: `${ publicPathWithScenarioId }budget-detail/parameters-by-structure`,
    name: 'Parameters by structure page',
    parent: 'DASHBOARD',
    intlId: 'parameters-by-structure.title',
  },
  PARAMETERS_BY_STRUCTURE_ITEM: {
    path: `${ publicPathWithScenarioId }budget-detail/parameters-by-structure/:id`,
    name: 'Parameters by structure item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'parameters-by-structure.title',
  },
  PARAMETERS_BY_STRUCTURE_ITEM_TAB: {
    path: `${ publicPathWithScenarioId }budget-detail/parameters-by-structure/:id/:activeTab`,
    name: 'Parameters by structure item page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'parameters-by-structure.title',
  },
  GLOBAL_PARAMETERS: {
    path: `${ publicPathWithScenarioId }budget-detail/global-parameters`,
    name: 'Global Parameters page',
    parent: 'DASHBOARD',
    intlId: 'global-parameters.title',
  },
  GLOBAL_PARAMETERS_TAB: {
    path: `${ publicPathWithScenarioId }budget-detail/global-parameters/:activeTab`,
    name: 'Global Parameters page',
    useParentPath: true,
    parent: 'DASHBOARD',
    intlId: 'global-parameters.title',
  },
  REVENUE_AND_OTHER_EXPENSES: {
    path: `${ publicPathWithScenarioId }budget-detail/revenue-and-other-expenses`,
    name: 'Revenue and other expenses page',
    parent: 'DASHBOARD',
    intlId: 'revenue-and-other-expenses.title',
  },
  COPY_SCENARIO: {
    path: `${ publicPathWithScenarioId }budget-detail/copy-scenario`,
    useParentPath: true,
    name: 'Copy scenario',
    parent: 'DASHBOARD',
    intlId: 'scenario-copy.title',
  },
};

export const routeBreadcrumbs = {
  DASHBOARD: {},
  POSITIONS: {},
};

export const dashboardItems = {
  OTHER_EXPENSES: 8,
  REVENUES: 9,
};

const defaultHistory = {
  push: () => {},
};

let history = defaultHistory;
let routeMessage = '';
export function getHistory() {
  return history;
}
export function setMessage(message) {
  routeMessage = message;
}

class MainRouteSwitchComponent extends Component {
  static propTypes = {
    scenarioId: PropTypes.number,
    pathScenarioId: PropTypes.string,
    getScenarioById: PropTypes.func,
  };

  componentWillMount() {
    const { scenarioId, pathScenarioId, getScenarioById } = this.props;
    if (!scenarioId && pathScenarioId && Number(pathScenarioId)) {
      getScenarioById(pathScenarioId);
    }
  }

  render() {
    const { scenarioId } = this.props;
    if (!scenarioId) {
      return null;
    }

    return (
      <Switch>
        <Route exact path={ publicPath } render={ props => <Dashboard { ...props } pageName={ routes.DASHBOARD.name } /> } />
        <Route
          path={ routes.DASHBOARD_ITEM_POSITIONS.path }
          component={
            props => (
              <DashboardOrigin
                { ...props }
                detailId={ props.match.params.id }
                originId={ props.match.params.origin }
                functionalCenterId={ props.match.params.functionalCenterId }
                pageName={ routes.DASHBOARD_ITEM_POSITIONS.name }
              />
            )
          }
        />
        <Route
          path={ routes.DASHBOARD_ITEM.path }
          component={ props => <Salaries { ...props } detailId={ props.match.params.id } pageName={ routes.DASHBOARD_ITEM.name } /> }
        />
        <Route
          path={ routes.DASHBOARD.path }
          render={ props => <Dashboard { ...props } pageName={ routes.DASHBOARD.name } /> }
        />
        <Route
          path={ routes.CALCULATION_FOLLOW_UP_DETAILS.path }
          render={ props => <CalculationFollowUpDetails { ...props } calculationId={ props.match.params.id } pageName={ routes.CALCULATION_FOLLOW_UP_DETAILS.name } /> }
        />
        <Route
          path={ routes.CALCULATION_FOLLOW_UP.path }
          render={ props => <CalculationFollowUp { ...props } pageName={ routes.CALCULATION_FOLLOW_UP.name } /> }
        />
        <Route
          path={ routes.SALARIES.path }
          render={ props => <Salaries { ...props } pageName={ routes.SALARIES.name } /> }
        />
        <Route
          path={ routes.POSITIONS_ITEM.path }
          component={ props => <Position { ...props } positionId={ props.match.params.id } pageName={ routes.POSITIONS_ITEM.name } /> }
        />
        <Route
          path={ routes.POSITIONS.path }
          render={ props => <Positions { ...props } pageName={ routes.POSITIONS.name } /> }
        />
        <Route
          path={ routes.POSITIONS_BY_JOB_TITLE_ITEM.path }
          component={ props => <PositionByJobTitle { ...props } positionId={ props.match.params.id } pageName={ routes.POSITIONS_BY_JOB_TITLE_ITEM.name } /> }
        />
        <Route
          path={ routes.POSITIONS_BY_JOB_TITLE.path }
          render={ props => <PositionsByJobTitle { ...props } pageName={ routes.POSITIONS_BY_JOB_TITLE.name } /> }
        />
        <Route
          path={ routes.DISTRIBUTION_EXPENSE_COPY.path }
          component={ props => <DistributionExpenseCopy { ...props } requiredAttendanceId={ props.match.params.id } pageName={ routes.DISTRIBUTION_EXPENSE_COPY.name } /> }
        />
        <Route
          path={ routes.REQUIRED_ATTENDANCES_COPY.path }
          component={ props => <RequiredAttendancesCopy { ...props } requiredAttendanceId={ props.match.params.id } pageName={ routes.REQUIRED_ATTENDANCES_COPY.name } /> }
        />
        <Route
          path={ routes.REQUIRED_ATTENDANCES_QUERY.path }
          component={ props => <RequiredAttendanceQuery { ...props } requiredAttendanceId={ props.match.params.id } pageName={ routes.REQUIRED_ATTENDANCES_QUERY.name } /> }
        />
        <Route
          path={ routes.REQUIRED_ATTENDANCE_ITEM.path }
          component={ props => <RequiredAttendance { ...props } requiredAttendanceId={ props.match.params.id } pageName={ routes.REQUIRED_ATTENDANCE_ITEM.name } /> }
        />
        <Route
          path={ routes.REQUIRED_ATTENDANCES.path }
          render={ props => <RequiredAttendances { ...props } pageName={ routes.REQUIRED_ATTENDANCES.name } /> }
        />
        <Route
          path={ routes.REQUIRED_ATTENDANCE_DASHBOARD.path }
          render={ props => <RequiredAttendanceDashboard { ...props } pageName={ routes.REQUIRED_ATTENDANCE_DASHBOARD.name } /> }
        />
        <Route
          path={ routes.ORIGIN_BUDGET_REQUEST_ITEM.path }
          component={ props => <BudgetRequest { ...props } budgetRequestId={ props.match.params.id } originRowDetailId={ props.match.params.detailId } pageName={ routes.ORIGIN_BUDGET_REQUEST_ITEM.name } /> }
        />
        <Route
          path={ routes.BUDGET_REQUEST_ITEM.path }
          component={ props => <BudgetRequest { ...props } budgetRequestId={ props.match.params.id } pageName={ routes.BUDGET_REQUEST_ITEM.name } /> }
        />
        <Route
          path={ routes.BUDGET_REQUESTS.path }
          render={ props => <BudgetRequests { ...props } pageName={ routes.BUDGET_REQUESTS.name } /> }
        />
        <Route
          path={ routes.EMPLOYEES_ITEM.path }
          component={ props => <Employee { ...props } employeeId={ props.match.params.id } pageName={ routes.EMPLOYEES_ITEM.name } /> }
        />
        <Route
          path={ routes.IMPORT_ACCOUNTS_ITEM.path }
          component={ props => <ImportAccount { ...props } importScenarioId={ props.match.params.id } accountId={ props.match.params.accountId } pageName={ routes.IMPORT_ACCOUNTS_ITEM.name } /> }
        />
        <Route
          path={ routes.IMPORT_ACCOUNTS.path }
          component={ props => <ImportAccounts { ...props } importScenarioId={ props.match.params.id } pageName={ routes.IMPORT_ACCOUNTS.name } /> }
        />
        <Route
          path={ routes.IMPORTS.path }
          render={ props => <Imports { ...props } pageName={ routes.IMPORTS.name } /> }
        />
        <Route
          path={ routes.OTHER_EXPENSES_INDEXATION.path }
          component={ props => <OtherExpensesIndexation { ...props } otherExpensesId={ props.match.params.id } pageName={ routes.OTHER_EXPENSES_INDEXATION.name } /> }
        />
        <Route
          path={ routes.OTHER_EXPENSES_ADJUSTMENT.path }
          component={ props => <OtherExpensesAdjustment { ...props } otherExpensesId={ props.match.params.id } pageName={ routes.OTHER_EXPENSES_ADJUSTMENT.name } /> }
        />
        <Route
          path={ routes.OTHER_EXPENSES_ITEM.path }
          component={ props => <OtherExpenses { ...props } otherExpensesId={ props.match.params.id } pageName={ routes.OTHER_EXPENSES_ITEM.name } /> }
        />
        <Route
          path={ routes.PARAMETERS_BY_STRUCTURE_ITEM_TAB.path }
          render={ props => <ParameterByStructure { ...props } id={ props.match.params.id } activeTab={ props.match.params.activeTab } pageName={ routes.PARAMETERS_BY_STRUCTURE_ITEM.name } /> }
        />
        <Route
          path={ routes.PARAMETERS_BY_STRUCTURE_ITEM.path }
          render={ props => <ParameterByStructure { ...props } id={ props.match.params.id } pageName={ routes.PARAMETERS_BY_STRUCTURE_ITEM.name } /> }
        />
        <Route
          path={ routes.PARAMETERS_BY_STRUCTURE.path }
          render={ props => <ParametersByStructure { ...props } pageName={ routes.PARAMETERS_BY_STRUCTURE.name } /> }
        />
        <Route
          path={ routes.GLOBAL_PARAMETERS_TAB.path }
          render={ props => <GlobalParameters { ...props } activeTab={ props.match.params.activeTab } pageName={ routes.GLOBAL_PARAMETERS.name } /> }
        />
        <Route
          path={ routes.GLOBAL_PARAMETERS.path }
          render={ props => <GlobalParameters { ...props } pageName={ routes.GLOBAL_PARAMETERS.name } /> }
        />
        <Route
          path={ routes.REVENUE_AND_OTHER_EXPENSES.path }
          render={ props => <RevenueAndOtherExpenses { ...props } pageName={ routes.REVENUE_AND_OTHER_EXPENSES.name } /> }
        />
        <Route
          path={ routes.COPY_SCENARIO.path }
          render={ props => <ScenarioCopy { ...props } pageName={ routes.COPY_SCENARIO.name } /> }
        />
        <Route path={ routes.ABOUT.path } render={ props => <About { ...props } pageName={ routes.ABOUT.name } /> } />
        <Route path='*' component={ NotFound } />
      </Switch>
    );
  }
}

export const MainRouteSwitch = withRouter(MainRouteSwitchComponent);

@DragDropContext(HTML5Backend)
@connect(state => ({
  auth: state.app.auth,
  locale: state.app.locale,
  isLoading: state.app.isLoading,
  scenarioId: state.scenario.selectedScenario.scenarioId,
}), (dispatch) => bindActionCreators({
  getScenarioById,
  popupOpen,
}, dispatch))
export default class App extends Component {
  static propTypes = {
    auth: PropTypes.object,
    locale: PropTypes.string,
    isLoading: PropTypes.bool,
    scenarioId: PropTypes.number,
    getScenarioById: PropTypes.func,
    popupOpen: PropTypes.func,
  };

  @autobind
  getUserConfirmation(message, callback) {
    const { popupOpen } = this.props;
    popupOpen({
      style: PopupStyle.confirm,
      message,
      actions: [
        { kind: PopupActionKind.ok, func: callback, arg: false },
      ],
    });
  }

  @autobind
  setHistory(instance) {
    history = instance ? instance.history : defaultHistory;
  }

  renderMainRoute(pathScenarioId) {
    const { scenarioId, getScenarioById } = this.props;
    if ((!scenarioId && !pathScenarioId) || (isNaN(Number(pathScenarioId)))) {
      return (
        <Redirect to={ routes.SCENARIO.path } />
      );
    }

    return (
      <div className='app__vbox'>
        <div className='app__box'>
          <div className='app__side-menu'> <SideMenu /> </div>
          <div className='app__content'>
            <div className='app__top-menu'> <TopMenu /> </div>
            <div className='app__breadcrumbs'> <Breadcrumbs /> </div>
            <div className='app__view'>
              <MainRouteSwitch
                scenarioId={ scenarioId }
                pathScenarioId={ pathScenarioId }
                getScenarioById={ getScenarioById }
              />
              <Popup />
              <Panel />
              <Alert />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderModalRoutes() {
    return (
      <div className='app__modal'>
        <Switch>
          <Route exact path={ publicPath } render={ props => <Scenario { ...props } pageName={ routes.SCENARIO.name } /> } />
          <Route path={ routes.SCENARIO.path } render={ props => <Scenario { ...props } pageName={ routes.SCENARIO.name } /> } />
          <Route
            path={ routes.ACCESS_DENIED.path }
            render={ props => <AccessDenied { ...props } message={ routeMessage } pageName={ routes.ACCESS_DENIED.name } /> }
          />
        </Switch>
        <Popup />
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;

    return (
      <BrowserRouter getUserConfirmation={ this.getUserConfirmation } ref={ this.setHistory }>
        <div className='app'>
          <div className='app__top-header'> <TopHeader /> </div>
          { !isLoading &&
            <Switch>
              <Route exact path={ publicPath } render={ this.renderModalRoutes } />
              <Route exact path={ routes.SCENARIO.path } render={ this.renderModalRoutes } />
              <Route exact path={ routes.ACCESS_DENIED.path } render={ this.renderModalRoutes } />
              <Route
                path={ publicPathWithScenarioId }
                children={ ({ match }) => (match ? this.renderMainRoute(match.params.scenarioId) : null) }
              />
            </Switch>
          }
        </div>
      </BrowserRouter>
    );
  }
}
