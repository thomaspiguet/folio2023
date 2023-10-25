import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { isUndefined } from 'lodash';

import { formatMoney, getDigit2Options, getCurrencyOptions } from '../../utils/selectors/currency';
import { extractDistributionsOtherExpensesDetails } from '../../components/business/distributions/selectors';

import { setTitle } from '../../components/general/breadcrumbs/actions';
import {
  setDetailsEntry,
  saveHistoryStart,
} from './actions/other-expenses';
import {
  calculateOtherExpensesHistory,
  cancelOtherExpensesHistory,
} from '../../api/actions';
import { popupOpen } from '../../components/general/popup/actions';
import { removeLastPath } from '../../utils/utils';
import { buildIndexationModel } from '../../entities/other-expenses';

import { FormValidator } from '../../utils/components/form-validator';

import Field from '../../components/controls/field';
import Form from '../../components/general/form/form';
import { ScrollBox } from '../../components/general/scroll-box';

import './other-expenses.scss';
import '../../../styles/content-gradient.scss';

const formOptions = {
  tabs: {
  },
  fields: {
    description: {
      path: ['description'],
      metadata: 'Description',
    },
    totalAmount: {
      path: ['totalAmount'],
      metadata: 'TotalAmount',
    },
    rate: {
      path: ['indexation', 'rate'],
      metadata: ['Indexation', 'children', 'Rate'],
      noZero: true,
    },
    distributionType: {
      path: ['distribution', 'method'],
    },
    startPeriod: {
      path: ['indexation', 'period', 'start'],
      endPeriod: 'endPeriod',
    },
    endPeriod: {
      path: ['indexation', 'period', 'end'],
    },
  },
};

defineMessages({
  description: {
    id: 'other-expenses.indexation-description',
    defaultMessage: 'Description:',
  },
  rate: {
    id: 'other-expenses.indexation-rate',
    defaultMessage: 'Indexation rate:',
  },
  startPeriod: {
    id: 'other-expenses.start-period',
    defaultMessage: 'Start period to be indexed:',
  },
  endPeriod: {
    id: 'other-expenses.end-period',
    defaultMessage: 'End period to be indexed:',
  },
  title: {
    id: 'other-expenses.indexation-title',
    defaultMessage: 'Indexation of total budget amount',
  },
  totalAfter: {
    id: 'other-expenses.total-after-indexation',
    defaultMessage: 'Total after indexation:',
  },
  totalBefore: {
    id: 'other-expenses.total-before-indexation',
    defaultMessage: 'Total before indexation:',
  },
  titleIndexation: {
    id: 'other-expenses.indexation.title',
    defaultMessage: 'Budget Amount Indexation',
  },
});

@connect(state => ({
  beforeDistribution: state.otherExpensesDetails.beforeDistribution,
  digit2Options: getDigit2Options(state),
  currencyOptions: getCurrencyOptions(state),
  editMode: state.otherExpensesDetails.editMode,
  entry: state.otherExpensesDetails.entry,
  financialYearGroup: state.otherExpenses.entry.financialYearGroup,
  isLoading: state.otherExpensesDetails.isLoadingDetails,
  metadata: state.otherExpensesDetails.metadata,
  periods: state.otherExpensesDetails.periods,
  isSavingHistory: state.otherExpensesDetails.isSavingHistory,
  revenueOtherExpenseId: state.otherExpenses.entry.id,
  tableDistributions: extractDistributionsOtherExpensesDetails(state),
  totalBefore: state.otherExpensesDetails.totalBefore,
  validationErrors: state.otherExpensesDetails.validationErrors,
  periodsDisabled: state.otherExpensesDetails.periodsDisabled,
}), (dispatch) => bindActionCreators({
  setTitle,
  setEntry: setDetailsEntry,
  calculateOtherExpensesHistory,
  saveHistoryStart,
  popupOpen,
}, dispatch))
class OtherExpensesIndexation extends PureComponent {
  static propTypes = {
    currencyOptions: PropTypes.object,
    digit2Options: PropTypes.object,
    editMode: PropTypes.bool,
    isLoading: PropTypes.bool,
    entry: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
    if (isUndefined(props.revenueOtherExpenseId)) {
      props.history.push(removeLastPath(window.location.pathname));
    }
  }

  init(props) {
    const { metadata, validationErrors, entry, editMode } = props;
    const { onChangeProps } = this.validator;
    onChangeProps({ editMode, metadata, validationErrors, entry });
  }

  calculateDistributions(indexation) {
    const { calculateOtherExpensesHistory } = this.props;
    const data = this.buildModel(indexation);

    calculateOtherExpensesHistory(data);
  }

  buildModel(indexation) {
    const {
      entry,
      revenueOtherExpenseId,
    } = this.props;
    return buildIndexationModel(entry, revenueOtherExpenseId, indexation);
  }

  componentDidMount() {
    this.init(this.props);
    this.calculateDistributions();
    const { intl, setTitle } = this.props;
    const title = intl.formatMessage({ id: 'other-expenses.indexation.title' });
    setTitle(title);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  getTitleId() {
    return 'other-expenses.indexation-title';
  }

  @autobind
  onCancel() {
    const { popupOpen } = this.props;
    popupOpen({
      style: 'confirm',
      message: this.props.intl.formatMessage({ id: 'required-attendance.edit-cancel' }),
      actions: [
        { kind: 'continue', action: cancelOtherExpensesHistory() },
        { kind: 'cancel' },
      ],
    });
  }

  @autobind
  onSave() {
    if (this.validator.onSave(this)) {
      this.props.saveHistoryStart();
    }
  }

  @autobind
  onStartPeriodChange(value) {
    this.calculateDistributions({ period: { start: value } });
  }

  @autobind
  onEndPeriodChange(value) {
    this.calculateDistributions({ period: { end: value } });
  }

  @autobind
  onIndexationChange(value) {
    this.calculateDistributions({ rate: value });
  }

  renderTotals() {
    const { entry, currencyOptions, totalBefore } = this.props;
    const { totalAmount } = entry;
    const { flashErrors } = this.state;
    const { fields } = this.validator;

    return (
      <div className='other-expenses-details__amounts other-expenses-details__amounts--with-separator'>
        <Form.Row noTopMargin={ true }>
          <Form.Column2>
            <Field value={ formatMoney(totalBefore, currencyOptions) } labelIntlId='other-expenses.total-before-indexation' />
          </Form.Column2>
          <Form.Column2>
            <Field
              value={ formatMoney(totalAmount, currencyOptions) }
              labelIntlId='other-expenses.total-after-indexation'
              validator={ fields.totalAmount }
              flashErrors={ flashErrors }
              checkErrors
            />
          </Form.Column2>
        </Form.Row>
      </div>
    );
  }

  render() {
    const { entry, tableDistributions, periods, periodsDisabled, isSavingHistory } = this.props;
    const { description, indexation: { rate, period: { start, end } } } = entry;
    const { flashErrors } = this.state;
    const { invalid, fields } = this.validator;

    return (
      <div className='other-expenses'>
        <div className='other-expenses__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='other-expenses__form'>
            <Form
              editMode
              invalid={ invalid }
              flashErrors={ flashErrors }
            >
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title
                    intlId={ this.getTitleId() }
                  />
                </Form.ActionsLeft>
              </Form.Actions>
              <div className='form-tabs__body'>
                <div className='form__tab'>
                  <Form.Row>
                    <Form.Column2>
                      <Form.Row>
                        <Form.Column4>
                          <Field.Input
                            editMode
                            labelIntlId='other-expenses.indexation-description'
                            value={ description }
                            validator={ fields.description }
                          />
                        </Form.Column4>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column2>
                          <Field.Number2
                            editMode
                            flashErrors={ flashErrors }
                            labelIntlId='other-expenses.indexation-rate'
                            value={ rate }
                            validator={ fields.rate }
                            onChange={ this.onIndexationChange }
                          />
                        </Form.Column2>
                      </Form.Row>
                      <Form.Separator />
                      <Form.Row>
                        <Form.Column2>
                          <Field.Dropdown
                            disabled={ periodsDisabled }
                            labelIntlId='other-expenses.start-period'
                            validator={ fields.startPeriod }
                            value={ start }
                            values={ periods }
                            onChange={ this.onStartPeriodChange }
                          />
                        </Form.Column2>
                        <Form.Column2>
                          <Field.Dropdown
                            disabled={ periodsDisabled }
                            labelIntlId='other-expenses.end-period'
                            validator={ fields.endPeriod }
                            value={ end }
                            values={ periods }
                            onChange={ this.onEndPeriodChange }
                          />
                        </Form.Column2>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column4>
                          { this.renderTotals() }
                        </Form.Column4>
                      </Form.Row>
                    </Form.Column2>
                    <Form.Column2>
                      <Form.Row>
                        <Form.Column4 noTitle>
                          <Form.Grid
                            columns={ tableDistributions.columns }
                            rows={ tableDistributions.rows }
                          />
                        </Form.Column4>
                      </Form.Row>
                    </Form.Column2>
                  </Form.Row>
                </div>
              </div>
              <Form.FooterActions>
                <Form.Action type='cancel' disabled={ isSavingHistory } intlId='action.cancel' onClick={ this.onCancel } />
                <Form.Action type='save' disabled={ isSavingHistory } intlId='action.save' onClick={ this.onSave } validator={ this.validator } isLast />
              </Form.FooterActions>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(OtherExpensesIndexation);
