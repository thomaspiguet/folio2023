import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataGridScrollable from '../../components/general/data-grid/data-grid-scorllable';
import { setPeriod, setYear, setPageSize } from './actions';
import { extractBudgets } from './selectors';

import './dashboard-table.scss';

@connect(state => ({
}), (dispatch) => bindActionCreators({
  setPeriod,
  setYear,
}, dispatch))
@connect((state, props) => ({
  tableData: extractBudgets(state, props),
  isLoadingTable: state.dashboard.isLoadingTable,
  pageSize: state.dashboard.pageSize,
}), (dispatch) => bindActionCreators({
  setPageSize,
}, dispatch))
export default class DashboardTable extends PureComponent {
  static propTypes = {
    tableData: PropTypes.array,
    isLoadingTable: PropTypes.bool,
    budgetActualYearLoading: PropTypes.bool,
  };

  render() {
    return (
      <DataGridScrollable
        rows={ this.props.tableData.rows }
        columns={ this.props.tableData.columns }
        isLoading={ this.props.isLoadingTable }
        noPaging={ true }
      >
        { this.props.children }
      </DataGridScrollable>
    );
  }
}
