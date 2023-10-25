import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { defineMessages } from 'react-intl';
import { bindActionCreators } from 'redux';
import { routes } from '../app/app';

import BaseList from '../../components/general/base-list/base-list';
import { getRevenueAndOtherExpensesList } from './actions';
import { getRevenueAndOtherExpensesDefault } from '../../api/actions';
import { extractData } from './selectors';
import { addScenarioIdToRoute } from '../../utils/utils';


defineMessages({
  revenueAndOtherExpensesTitle: {
    id: 'revenue-and-other-expenses.title',
    defaultMessage: 'Revenue and Other Expenses',
  },
});

@connect(state => ({
  table: extractData(state),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  isLoading: state.revenueAndOtherExpenses.isLoading,
  paging: state.revenueAndOtherExpenses.paging,
}), (dispatch) => bindActionCreators({
  getRevenueAndOtherExpensesList,
  getRevenueAndOtherExpensesDefault,
}, dispatch))
export default class RevenueAndOtherExpenses extends PureComponent {
  static propTypes = {
    table: PropTypes.object,
    scenarioId: PropTypes.number,
    isLoading: PropTypes.bool,

    paging: PropTypes.object,
    getRevenueAndOtherExpensesList: PropTypes.func,
    getRevenueAndOtherExpensesDefault: PropTypes.func,
  };

  componentDidMount() {
    this.init(this.props, true);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props, initial) {
    const { paging } = props;
    this.load(props, paging.pageNo, paging.pageSize, initial);
  }

  load(props, pageNo, pageSize, force = false) {
    const { getRevenueAndOtherExpensesList, isLoading } = props;
    if (!isLoading) {
      getRevenueAndOtherExpensesList(pageNo, pageSize, force);
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

    this.props.history.push(addScenarioIdToRoute(`${ routes.OTHER_EXPENSES.path }/${ id }`, scenarioId));
  }

  @autobind
  onAdd() {
    const { getRevenueAndOtherExpensesDefault, scenarioId } = this.props;
    getRevenueAndOtherExpensesDefault(scenarioId);
  }

  render() {
    const {
      table,
      isLoading,
      paging,
      pageName,
    } = this.props;

    return (
      <BaseList
        pageName={ pageName }
        location={ location }
        rows={ table.rows }
        columns={ table.columns }
        titleIntlId='revenue-and-other-expenses.title'
        titleIcon='employees' // TODO: Change
        isLoading={ isLoading }
        menuItemId='budget-detail'
        menuSubitemId='revenue-and-other-expenses'
        manual={ true }
        pages={ paging.pageCount }
        page={ paging.pageNo - 1 }
        pageSize={ paging.pageSize }
        setPageSize={ this.setPageSize }
        onPageChange={ this.onPageChange }
        onRowClick={ this.onRowClick }
        onAdd={ this.onAdd }
        noPadding
        noGroups
        noCustomizeColumns
      />
    );
  }
}
