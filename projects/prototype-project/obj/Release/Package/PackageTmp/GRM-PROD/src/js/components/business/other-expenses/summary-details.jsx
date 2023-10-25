import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';

import { extractDistributions } from './selectors';

import DataGridScrollable from '../../general/data-grid/data-grid-scorllable';

import { formatMoney } from '../../../utils/selectors/currency';

import './summary-details.scss';

defineMessages({
  totalAmount: {
    id: 'summary-details.total-amount',
    defaultMessage: 'Total amount:',
  },
  actualDetail: {
    id: 'summary-details.actual-detail',
    defaultMessage: 'Actual detail',
  },
  budgetDetail: {
    id: 'summary-details.budget-detail',
    defaultMessage: 'Budget detail',
  },
});

@connect(state => ({
  distributionsTable: extractDistributions(state),
  isLoadingDetails: state.otherExpensesDetails.isLoadingDetails,
  totalAmount: state.otherExpensesDetails.summaryDetails.totalAmount,
}), (dispatch) => bindActionCreators({

}, dispatch))
class SummaryDetails extends Component {
  static defaultProps = {
    distributionsTable: PropTypes.object,
    isLoadingDetails: PropTypes.bool,
    totalAmount: PropTypes.string,
    description: PropTypes.string,
    intlId: PropTypes.string,
  };

  getTitle(description) {
    return `${ this.props.intl.formatMessage({ id: this.props.intlId }) } ${ description }`;
  }

  render() {
    const {
      distributionsTable,
      totalAmount,
      currencyOptions,
      description,
      isLoadingDetails,
    } = this.props;

    const totalAmountLabel = this.props.intl.formatMessage({ id: 'summary-details.total-amount' });
    const title = this.getTitle(description);

    return (
      <div className='summary-details'>
        <div className='summary-details__title'>{ title }</div>
        <div className='summary-details__total-amount'>
          <div className='summary-details__total-amount-label'>{ totalAmountLabel }</div>
          <div className='summary-details__total-amount-value'>{ formatMoney(totalAmount, currencyOptions) }</div>
        </div>
        <div className='summary-details__distributions'>
          <DataGridScrollable
            rows={ distributionsTable.rows }
            columns={ distributionsTable.columns }
            isLoading={ isLoadingDetails }
            standalone
            noPaging
            noPadding
            smokyWhiteBackground
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(SummaryDetails);
