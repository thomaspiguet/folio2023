import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages, FormattedMessage } from 'react-intl';

import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import DataGridScrollable from '../../components/general/data-grid/data-grid-scorllable';
import { extractDistributionsOtherExpensesDetails } from '../../components/business/distributions/selectors';
import { extractDatesOtherExpensesDetails } from './selectors/other-expenses';
import { formatMoney, getCurrencyOptions } from '../../utils/selectors/currency';

import { getOtherExpensesHistoryDetails } from '../../api/actions';
import { closeOtherExpensesHistoryDetails } from './actions/other-expenses';
import { convertFunctionalCenter } from '../../utils/utils';

import './other-expenses-details.scss';

import { OTHER_EXPENSES_HISTORY_TYPE_CORRECTION } from '../../entities/other-expenses';

defineMessages({
  historyTitle: {
    id: 'other-expenses-details.history-title',
    defaultMessage: 'History',
  },
  indexationTitle: {
    id: 'other-expenses-details.indexation-title',
    defaultMessage: 'Indexation',
  },
  adjustedAmount: {
    id: 'other-expenses-details.adjusted-amount',
    defaultMessage: 'Adjusted amount:',
  },
  amountCorrected: {
    id: 'other-expenses-details.corrected-amount',
    defaultMessage: 'Amount corrected:',
  },
  totalAmount: {
    id: 'other-expenses-details.total-amount',
    defaultMessage: 'Total amount:',
  },
  description: {
    id: 'other-expenses-details.description',
    defaultMessage: 'Description:',
  },
  origin: {
    id: 'other-expenses-details.origin',
    defaultMessage: 'Origin:',
  },
  rate: {
    id: 'other-expenses-details.rate',
    defaultMessage: 'Rate:',
  },
  periodTitle: {
    id: 'other-expenses-details.period-title',
    defaultMessage: 'Period',
  },
  periodStart: {
    id: 'other-expenses-details.period-start',
    defaultMessage: 'Start:',
  },
  periodEnd: {
    id: 'other-expenses-details.period-end',
    defaultMessage: 'End:',
  },
  distributionTitle: {
    id: 'other-expenses-details.distribution-title',
    defaultMessage: 'Distribution',
  },
  distributionMethod: {
    id: 'other-expenses-details.distribution-method',
    defaultMessage: 'Method:',
  },
  distributionModel: {
    id: 'other-expenses-details.distribution-model',
    defaultMessage: 'Model:',
  },
  distributionPreviousYear: {
    id: 'other-expenses-details.distribution-previous-year',
    defaultMessage: 'Previous year:',
  },
  distributionOtherAccount: {
    id: 'other-expenses-details.distribution-other-account',
    defaultMessage: 'Other account:',
  },
});

@connect(state => ({
  isLoadingDetails: state.otherExpensesDetails.isLoadingDetails,
  datesTable: extractDatesOtherExpensesDetails(state),
  distributionsTable: extractDistributionsOtherExpensesDetails(state),
  currencyOptions: getCurrencyOptions(state),
  selectedDataRow: state.otherExpensesDetails.selectedDataRow,
  type: state.otherExpensesDetails.entry.type,
  typeDescription: state.otherExpensesDetails.entry.typeDescription,
  adjustedAmount: state.otherExpensesDetails.entry.adjustedAmount,
  totalAmount: state.otherExpensesDetails.entry.totalAmount,
  description: state.otherExpensesDetails.entry.description,
  indexation: state.otherExpensesDetails.entry.indexation,
  distribution: state.otherExpensesDetails.entry.distribution,
}), (dispatch) => bindActionCreators({
  getOtherExpensesHistoryDetails,
  closeOtherExpensesHistoryDetails,
}, dispatch))
export default class OtherExpensesDetails extends Component {
  static propTypes = {
    getOtherExpensesHistoryDetails: PropTypes.func,
    closeOtherExpensesHistoryDetails: PropTypes.func,
    isLoadingDetails: PropTypes.bool,
    datesTable: PropTypes.object,
    distributionsTable: PropTypes.object,
    currencyOptions: PropTypes.object,
    selectedDataRow: PropTypes.number,
    type: PropTypes.string,
    adjustedAmount: PropTypes.number,
    totalAmount: PropTypes.number,
    description: PropTypes.string,
    indexation: PropTypes.object,
    distribution: PropTypes.object,
  };

  @autobind
  onRowClick(originalRow) {
    const { getOtherExpensesHistoryDetails, selectedDataRow } = this.props;
    if (selectedDataRow !== originalRow.id) {
      getOtherExpensesHistoryDetails(originalRow.id);
    }
  }

  @autobind
  onDetailsCloseClick() {
    this.props.closeOtherExpensesHistoryDetails();
  }

  renderDetailsHeader() {
    const { typeDescription } = this.props;
    return (
      <div className='other-expenses-details__header'>
        <div className='other-expenses-details__header-title'>
          { typeDescription }
        </div>
        <div className='other-expenses-details__header-close' onClick={ this.onDetailsCloseClick } />
      </div>
    );
  }

  renderDetailsAmounts() {
    const { type, totalAmount, adjustedAmount, currencyOptions } = this.props;

    return (
      <div className='other-expenses-details__amounts'>
        { type !== OTHER_EXPENSES_HISTORY_TYPE_CORRECTION &&
        <Form.Row noTopMargin={ true }>
          <Form.Column2>
            <Field value={ formatMoney(adjustedAmount, currencyOptions) } labelIntlId='other-expenses-details.adjusted-amount' />
          </Form.Column2>
          <Form.Column2>
            <Field value={ formatMoney(totalAmount, currencyOptions) } labelIntlId='other-expenses-details.total-amount' />
          </Form.Column2>
        </Form.Row>
        }
        { type === OTHER_EXPENSES_HISTORY_TYPE_CORRECTION &&
        <Form.Row noTopMargin={ true }>
          <Form.Column2>
            <Field value={ formatMoney(totalAmount, currencyOptions) } labelIntlId='other-expenses-details.corrected-amount' />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        }
      </div>
    );
  }

  render() {
    const {
      datesTable,
      distributionsTable,
      isLoadingDetails,
      description,
      indexation: {
        originDescription: indexationOrigin,
        rate: indexationRate,
        period: {
          start: indexationPeriodStart,
          end: indexationPeriodEnd,
        },
      },
      distribution: {
        methodDescription: distributionMethod,
        model: {
          name: distributionModelName,
        },
        previousYearDescription: distributionPreviousYearDescription,
        otherAccount: {
          accountNumber: distributionOtherAccountNumber,
        },
      },
    } = this.props;
    return (
      <div className='other-expenses-details'>
        <div className='other-expenses-details__title'>
          <FormattedMessage
            id='other-expenses-details.history-title'
            defaultMessage='History'
          />
        </div>
        <div className='other-expenses-details__history-grid'>
          <div className='other-expenses-details__history-grid--left'>
            <DataGridScrollable
              rows={ datesTable.rows }
              columns={ datesTable.columns }
              selectedRow={ datesTable.selectedRow }
              onRowClick={ this.onRowClick }
              minRows={ 15 }
              standalone
              noPaging
              smokyWhiteBackground
              noGridBorders
            />
          </div>
          <div className='other-expenses-details__history-grid--details'>
            { this.renderDetailsHeader() }
            <div className='other-expenses-details__details-grid'>
              <div className='other-expenses-details__details-grid--middle'>
                { this.renderDetailsAmounts() }
                <Form.Row>
                  <Form.Column4>
                    <Field value={ description } labelIntlId='other-expenses-details.description' />
                  </Form.Column4>
                </Form.Row>
                <Form.Row>
                  <Form.Column2>
                    <Field value={ indexationOrigin } labelIntlId='other-expenses-details.origin' />
                  </Form.Column2>
                  <Form.Column2>
                    <Field.Number2 value={ indexationRate } labelIntlId='other-expenses-details.rate' />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column4>
                    <div className='other-expenses-details__column-header--bold'>
                      <FormattedMessage
                        id='other-expenses-details.period-title'
                        defaultMessage='Period'
                      />
                    </div>
                  </Form.Column4>
                </Form.Row>
                <Form.Row halfTopMargin={ true }>
                  <Form.Column2>
                    <Field.Number0 value={ indexationPeriodStart } labelIntlId='other-expenses-details.period-start' />
                  </Form.Column2>
                  <Form.Column2>
                    <Field.Number0 value={ indexationPeriodEnd } labelIntlId='other-expenses-details.period-end' />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column4>
                    <div className='other-expenses-details__column-header--bold'>
                      <FormattedMessage
                        id='other-expenses-details.distribution-title'
                        defaultMessage='Distribution'
                      />
                    </div>
                  </Form.Column4>
                </Form.Row>
                <Form.Row halfTopMargin={ true }>
                  <Form.Column2>
                    <Field value={ distributionMethod } labelIntlId='other-expenses-details.distribution-method' />
                  </Form.Column2>
                  <Form.Column2>
                    <Field value={ distributionModelName } labelIntlId='other-expenses-details.distribution-model' />
                  </Form.Column2>
                </Form.Row>
                <Form.Row>
                  <Form.Column2>
                    <Field value={ distributionPreviousYearDescription } labelIntlId='other-expenses-details.distribution-previous-year' />
                  </Form.Column2>
                  <Form.Column2>
                    <Field value={ convertFunctionalCenter(distributionOtherAccountNumber) } labelIntlId='other-expenses-details.distribution-other-account' />
                  </Form.Column2>
                </Form.Row>
              </div>
              <div className='other-expenses-details__details-grid--right'>
                <DataGridScrollable
                  rows={ distributionsTable.rows }
                  columns={ distributionsTable.columns }
                  isLoading={ isLoadingDetails }
                  standalone
                  noPaging
                  smokyWhiteBackground
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
