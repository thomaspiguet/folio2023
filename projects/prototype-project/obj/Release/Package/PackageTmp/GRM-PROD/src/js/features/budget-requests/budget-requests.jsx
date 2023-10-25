import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';
import { routes } from '../app/app';

import BaseList from '../../components/general/base-list/base-list';
import { setBudgetRequestGroups, getBudgetRequestsList } from './actions';
import { getBudgetRequestListMetadata, getBudgetRequestDefault } from '../../api/actions';
import { extractData } from '../../components/business/distributions/selectors';
import { addScenarioIdToRoute } from '../../utils/utils';

import SearchSimple from './search-simple';
import SearchAction from './search-action';
import SearchAdvanced from './search-advanced';

import '../../../styles/content-gradient.scss';
import './budget-requests.scss';

defineMessages({
  title: {
    id: 'budget-request.title',
    defaultMessage: 'Budget Requests',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.budgetRequests.isLoading,
  groups: state.budgetRequests.groups,
  listMetadata: state.budgetRequests.listMetadata,
  listMetadataLoading: state.budgetRequests.listMetadataLoading,
  search: state.budgetRequests.search,
  searchKeyword: state.budgetRequests.searchKeyword,
  paging: state.budgetRequests.paging,
}), (dispatch) => bindActionCreators({
  getBudgetRequestsList,
  setBudgetRequestGroups,
  getBudgetRequestDefault,
  getBudgetRequestListMetadata,
}, dispatch))
export default class BudgetRequests extends PureComponent {
  static propTypes = {
    scenarioId: PropTypes.number,
    rows: PropTypes.array,
    isLoading: PropTypes.any,
    groups: PropTypes.array,
    paging: PropTypes.object,
    getBudgetRequestsList: PropTypes.func,
    setBudgetRequestGroups: PropTypes.func,
    getBudgetRequestDefault: PropTypes.func,
    getBudgetRequestListMetadata: PropTypes.func,
  };

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging, listMetadata, listMetadataLoading, getBudgetRequestListMetadata } = props;
    if (!listMetadata && !listMetadataLoading) {
      getBudgetRequestListMetadata();
    }
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { isLoading, getBudgetRequestsList } = props;
    if (!isLoading) {
      getBudgetRequestsList(pageNo, pageSize, force);
    }
  }

  @autobind
  setPageSize(pageSize) {
    const { paging } = this.props;
    this.load(this.props, paging.pageNo, pageSize);
  }

  @autobind
  onPageChange(page) {
    const { paging } = this.props;
    this.load(this.props, page + 1, paging.pageSize);
  }

  @autobind
  onRowClick(originalRow) {
    const { id } = originalRow;
    const { scenarioId } = this.props;
    this.props.history.push(addScenarioIdToRoute(`${ routes.BUDGET_REQUESTS.path }/${ id }`, scenarioId));
  }

  @autobind
  onAdd() {
    const { getBudgetRequestDefault, scenarioId } = this.props;
    getBudgetRequestDefault(scenarioId);
  }

  render() {
    const { table, isLoading, groups, setBudgetRequestGroups, paging, pageName, location } = this.props;
    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='budget-request.title'
        titleIcon='employees'
        isLoading={ isLoading }
        groups={ groups }
        setGroups={ setBudgetRequestGroups }
        menuItemId='budget-detail'
        menuSubitemId='budget-requests'
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        onRowClick={ this.onRowClick }
        onAdd={ this.onAdd }
        SearchSimple={ SearchSimple }
        SearchAction={ SearchAction }
        SearchAdvanced={ SearchAdvanced }
        noPadding
        noGroups
        noCustomizeColumns
      />
    );
  }
}
