import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { injectIntl } from 'react-intl';

import './distribution-expense.scss';
import { extractExpenseTable } from './selectors/required-attendances';
import { getDistributionExpense } from '../../api/actions';

import GridLoading from '../../components/general/data-grid/grid-loading';
import DataGridScrollable from '../../components/general/data-grid/data-grid-scorllable';

import DistributionExpenseDetails from './distribution-expense-details';


@connect((state, props) => ({
  isLoadingMaster: state.requiredAttendances.isLoadingDistributionsList,
  expenseTable: extractExpenseTable(state, props),
  isNew: state.distributionExpense.isNew,
}), (dispatch) => bindActionCreators({
  getDistributionExpense,
}, dispatch))
class DistributionExpense extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @autobind
  onRowClick(originalRow) {
    const { getDistributionExpense, id, isNew } = this.props;
    if (!isNew && id !== originalRow.id) {
      getDistributionExpense(originalRow.id);
    }
  }

  render() {
    const { isLoadingMaster, expenseTable } = this.props;

    return (
      <div className='distribution-expense'>
        <div className='distribution-expense__master-details'>
          <div className='distribution-expense__master'>
            <DataGridScrollable
              rows={ expenseTable.rows }
              columns={ expenseTable.columns }
              selectedRow={ expenseTable.selectedRow }
              onRowClick={ this.onRowClick }
              minRows={ 15 }
              standalone
              noPaging
              smokyWhiteBackground
              noGridBorders
            />
            { isLoadingMaster &&
            <div className='distribution-expense__loading'>
              <GridLoading />
            </div>
            }
          </div>
          <div className='distribution-expense__details'>
            <DistributionExpenseDetails />
          </div>
        </div>
      </div>
    );
  }

}

export default injectIntl(DistributionExpense);
