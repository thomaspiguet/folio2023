import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { isUndefined, get } from 'lodash';

import { setTitle } from '../../components/general/breadcrumbs/actions';

import { FormValidator } from '../../utils/components/form-validator';
import {
  extractDistributionsOtherExpensesHistory,
} from '../../components/business/distributions/selectors';

import Field from '../../components/controls/field';
import Form from '../../components/general/form/form';
import RadioButton from '../../components/controls/radio-button';
import BenefitsModel from '../../components/business/benefits-model/benefits-model';
import Account from '../../components/business/account/account';

import './other-expenses.scss';
import '../../../styles/content-gradient.scss';
import {
  buildAdjustmentModel,
  isHistoryCorrection,
  OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT,
  OTHER_EXPENSES_HISTORY_TYPE_CORRECTION,
  OTHER_EXPENSES_OPTIONS_BUDGET,
} from '../../entities/other-expenses';
import {
  setDetailsEntry,
  saveHistoryStart,
  setBudgetActual,
  setPreviousYear,
} from './actions/other-expenses';
import {
  calculateOtherExpensesHistory,
  cancelOtherExpensesHistory,
} from '../../api/actions';

import AdjustmentDistributionType from '../budget-requests/adjustment-distribution-type';
import { panelClose, panelOpen, popupOpen } from '../../components/general/popup/actions';
import { getDigit2Options } from '../../utils/selectors/currency';
import { removeLastPath } from '../../utils/utils';
import {
  ADJUSTMENT_DISTRIBUTION_TYPE_MODEL,
  isEditableAdjustmentDistributionRatesCell,
  isEditableAdjustmentDistributionAmountsCell,
  isManualAdjustmentDistribution,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR,
  ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE,
  ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT,
} from '../../entities/distribution';
import { PopupActionKind } from '../../components/general/popup/constants';
import { ScrollBox } from '../../components/general/scroll-box';

const { default: Decimal } = require('decimal.js');

const formOptions = {
  tabs: {
  },
  fields: {
    description: {
      path: ['description'],
      metadata: 'Description',
    },
    type: {
      path: ['type'],
    },
    adjustedAmount: {
      path: ['adjustedAmount'],
      metadata: 'AdjustedAmount',
    },
    totalAmount: {
      path: ['totalAmount'],
      metadata: 'TotalAmount',
    },
    distributions: {
      path: ['distribution'],
      metadata: 'Distributions',
      columns: [
        {
          path: ['periods', 'period'],
          id: 'period',
        },
        {
          path: ['periods', 'rate'],
          id: 'rate',
          metadata: ['Periods', 'children', 'Rate'],
          editable: isEditableAdjustmentDistributionRatesCell,
        },
        {
          path: ['periods', 'amount'],
          id: 'amount',
          metadata: ['Periods', 'children', 'Amount'],
          editable: isEditableAdjustmentDistributionAmountsCell,
        },
        {
          path: ['periods', 'budgetActualOption'],
          metadata: ['Periods', 'children', 'BudgetActualOption'],
          id: 'budgetActualOption',
        },
      ],
    },
    distributionType: {
      path: ['distribution', 'method'],
    },
    distributionTemplate: {
      path: ['distribution', 'model'],
      mandatory: true,
      predicate: entry => get(entry, 'distribution.method') === ADJUSTMENT_DISTRIBUTION_TYPE_MODEL,
    },
    previousYear: {
      path: ['distribution', 'previousYear'],
      id: 'previousYear',
    },
    distributionOtherAccount: {
      path: ['distribution', 'otherAccount'],
      mandatory: true,
      predicate: entry => get(entry, 'distribution.method') === ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT,
    },
  },
};

defineMessages({
  description: {
    id: 'other-expenses.adjustment.description',
    defaultMessage: 'Description:',
  },
  titleAdjustment: {
    id: 'other-expenses.adjustment.title-adjustment',
    defaultMessage: 'Budget Amount Adjustment',
  },
  titleCorrection: {
    id: 'other-expenses.adjustment.title-correction',
    defaultMessage: 'Budget Amount Correction',
  },
  labelAdjustment: {
    id: 'other-expenses.adjustment.label-adjustment',
    defaultMessage: 'Adjustment',
  },
  labelCorrection: {
    id: 'other-expenses.adjustment.label-correction',
    defaultMessage: 'Correction',
  },
  budgetAmount: {
    id: 'other-expenses.adjustment.budget-amount',
    defaultMessage: 'Budget amount:',
  },
  adjustmentAmount: {
    id: 'other-expenses.adjustment.adjustment-amount',
    defaultMessage: 'Adjustment amount:',
  },
  totalAmount: {
    id: 'other-expenses.adjustment.total-amount',
    defaultMessage: 'Budget total:',
  },
  otherAccount: {
    id: 'other-expenses.adjustment.other-account',
    defaultMessage: 'Account:',
  },
  distributionType: {
    id: 'other-expenses.adjustment.distribution-type',
    defaultMessage: 'Distribution type',
  },
});

@connect(state => ({
  entry: state.otherExpensesDetails.entry,
  metadata: state.otherExpensesDetails.metadata,
  editMode: state.otherExpensesDetails.editMode,
  totalBefore: state.otherExpensesDetails.totalBefore,
  isLoading: state.otherExpensesDetails.isLoadingDetails,
  validationErrors: state.otherExpensesDetails.validationErrors,
  isSavingHistory: state.otherExpensesDetails.isSavingHistory,
  financialYearGroup: state.otherExpenses.entry.financialYearGroup,
  revenueOtherExpenseId: state.otherExpenses.entry.id,
  tableDistributions: extractDistributionsOtherExpensesHistory(state),
  digit2Options: getDigit2Options(state),
  selectedModel: state.benefitsModel.selectedRow,
  selectedAccount: state.account.selectedRow,
}), (dispatch) => bindActionCreators({
  setTitle,
  setEntry: setDetailsEntry,
  calculateOtherExpensesHistory,
  saveHistoryStart,
  popupOpen,
  panelOpen,
  setBudgetActual,
  setPreviousYear,
}, dispatch))
class OtherExpensesAdjustment extends PureComponent {
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

  calculateDistributions(totalAmount, selectedModel, selectedAccount) {
    const total = this.getTotal();

    const data = isUndefined(totalAmount) ? this.buildModel(total, selectedModel, selectedAccount) : this.buildModel(totalAmount, selectedModel, selectedAccount);
    const { calculateOtherExpensesHistory, entry } = this.props;
    const {
      distribution: {
        method: distributionType,
      },
    } = entry;

    if (distributionType === ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT && !selectedAccount) {
      return;
    }
    calculateOtherExpensesHistory(data);
  }

  buildModel(totalAmount, selectedModel, selectedAccount) {
    const { entry, revenueOtherExpenseId, totalBefore } = this.props;
    return buildAdjustmentModel(entry, revenueOtherExpenseId, totalAmount, selectedModel, totalBefore, selectedAccount);
  }

  componentDidMount() {
    const { entry: { totalAmount } } = this.props;
    this.init(this.props);
    this.calculateDistributions(totalAmount);
    const { intl, setTitle } = this.props;
    const title = intl.formatMessage({ id: 'other-expenses.adjustment.title-correction' });
    setTitle(title);
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  getTotal() {
    const {
      entry,
      totalBefore,
    } = this.props;
    const {
      type,
      adjustedAmount,
      totalAmount,
    } = entry;

    const isCorrection = isHistoryCorrection(type);
    if (isCorrection) {
      return isUndefined(totalAmount) ? totalBefore : totalAmount;
    }
    return Decimal.add(totalBefore, isUndefined(adjustedAmount) ? 0 : adjustedAmount).toNumber();
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

  getTitleId() {
    const { entry: { type } } = this.props;
    return isHistoryCorrection(type) ? 'other-expenses.adjustment.title-correction' : 'other-expenses.adjustment.title-adjustment';
  }

  @autobind
  onChangeAdjustmentAmount() {
    this.calculateDistributions();
  }

  @autobind
  onChangeTotalAmount(totalAmount) {
    this.calculateDistributions(totalAmount);
  }

  @autobind
  onChangeDistributions() {
    this.props.setPreviousYear(0);
    this.props.setBudgetActual(OTHER_EXPENSES_OPTIONS_BUDGET);
    this.calculateDistributions();
  }

  @autobind
  onDistributionTemplateOk() {
    const { selectedModel: { id, number, name } } = this.props;
    const model = { id, number, name };
    this.validator.fields.distributionTemplate.onChange(model);
    this.calculateDistributions(undefined, model);
  }

  @autobind
  onChangeDistributionTemplate() {
    const { panelOpen } = this.props;
    panelOpen({
      Body: <BenefitsModel />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose },
        { kind: PopupActionKind.ok, func: this.onDistributionTemplateOk },
      ],
    });
  }

  @autobind
  onClearDistributionTemplate() {
    this.validator.fields.distributionTemplate.onClear();
  }

  @autobind
  onDistributionsChange() {
    const { entry: { distribution: { method } } } = this.props;
    if (isManualAdjustmentDistribution(method)) {
      this.calculateDistributions();
    }
  }

  @autobind
  onOtherAccountOkClick() {
    const { selectedAccount: { id, accountNumber, description, isFinancial } } = this.props;
    const account = { id, accountNumber, description, isFinancial };
    this.validator.fields.distributionOtherAccount.onChange(account);
    this.calculateDistributions(undefined, undefined, account);
  }

  @autobind
  onChangeOtherAccount() {
    const { panelOpen } = this.props;
    panelOpen({
      Body: <Account />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose },
        { kind: PopupActionKind.ok, func: this.onOtherAccountOkClick },
      ],
    });
  }

  @autobind
  onClearOtherAccount() {
    this.validator.fields.distributionOtherAccount.onClear();
  }

  renderDistributionMethodHeader(fields, distribution) {
    const { intl } = this.props;
    const {
      method: distributionType,
      model: distributionTemplate,
      previousYear,
      previousYearOptions,
      otherAccount: distributionOtherAccount,
    } = distribution;

    const distributionsTitle = (distributionTemplate && distributionTemplate.name) ?
      intl.formatMessage({ id: 'budget-request.distributions-years' }, { years: `${ distributionTemplate.name }` }) : '';

    if (distributionType === ADJUSTMENT_DISTRIBUTION_TYPE_MODEL) {
      return (
        <Form.Row noTopMargin={ distributionsTitle !== '' }>
          <Form.Column4>
            <div className='budget-request__column-header--bold'>{ distributionsTitle }</div>
            <Field.InputSearch
              editMode
              value={ distributionTemplate && distributionTemplate.number }
              validator={ fields.distributionTemplate }
              fieldName='distributionTemplate'
              onClick={ this.onChangeDistributionTemplate }
              onClear={ this.onClearDistributionTemplate }
              labelIntlId='budget-request.distributions-model'
            />
          </Form.Column4>
        </Form.Row>
      );
    }

    if (distributionType === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR
      || distributionType === ADJUSTMENT_DISTRIBUTION_TYPE_RATE_BASED_ON_PREVIOUS_YEAR_MINUS_ONE) {
      return (
        <Form.Row>
          <Form.Column4>
            <Field.Dropdown
              value={ previousYear }
              values={ previousYearOptions }
              validator={ fields.previousYear }
              onChange={ this.onDistributionsChange }
              labelIntlId='other-expenses.adjustment.distribution-type'
            />
          </Form.Column4>
        </Form.Row>
      );
    }

    if (distributionType === ADJUSTMENT_DISTRIBUTION_TYPE_BASED_ON_OTHER_ACCOUNT) {
      return (
        <Form.Row>
          <Form.Column4>
            <Field.InputSearch
              editMode
              value={ distributionOtherAccount && distributionOtherAccount.accountNumber }
              validator={ fields.distributionOtherAccount }
              fieldName='distributionOtherAccount'
              onClick={ this.onChangeOtherAccount }
              onClear={ this.onClearOtherAccount }
              labelIntlId='other-expenses.adjustment.other-account'
            />
          </Form.Column4>
        </Form.Row>
      );
    }
    return (
      <div className='other-expenses__distributions-margin' />
    );
  }

  render() {
    const {
      tableDistributions,
      entry,
      financialYearGroup,
      totalBefore,
      isSavingHistory,
      validationErrors,
    } = this.props;
    const {
      type,
      description,
      adjustedAmount,
      distribution: {
        method: distributionType,
      },
      distribution,
    } = entry;
    const { flashErrors } = this.state;
    const { invalid, fields } = this.validator;
    const total = this.getTotal();

    const isCorrection = isHistoryCorrection(type);

    return (
      <div className='other-expenses'>
        <div className='other-expenses__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='other-expenses__form'>
            <Form
              invalid={ invalid }
              flashErrors={ flashErrors }
              editMode
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
                            value={ description }
                            validator={ fields.description }
                            editMode
                            labelIntlId='other-expenses.adjustment.description'
                          />
                        </Form.Column4>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column4>
                          <RadioButton
                            value={ type }
                            values={ [
                            { value: OTHER_EXPENSES_HISTORY_TYPE_ADJUSTMENT, id: 'adjustment', intlId: 'other-expenses.adjustment.label-adjustment' },
                            { value: OTHER_EXPENSES_HISTORY_TYPE_CORRECTION, id: 'correction', intlId: 'other-expenses.adjustment.label-correction' },
                            ] }
                            editMode
                            validator={ fields.type }
                          />
                        </Form.Column4>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column2>
                          <Form.Column4 noLeftPadding>
                            <Field.Number2
                              value={ totalBefore }
                              editMode
                              disabled
                              labelIntlId='other-expenses.adjustment.budget-amount'
                            />
                            <Field.Padding />
                            <Field.Number2
                              value={ adjustedAmount }
                              validator={ fields.adjustedAmount }
                              editMode
                              labelIntlId='other-expenses.adjustment.adjustment-amount'
                              onChange={ this.onChangeAdjustmentAmount }
                              disabled={ isCorrection }
                            />
                          </Form.Column4>
                        </Form.Column2>
                        <Form.Column2>
                          <Field.Summary
                            value={ total }
                            labelIntlId='other-expenses.adjustment.total-amount'
                            validator={ fields.totalAmount }
                            editMode={ isCorrection }
                            onChange={ this.onChangeTotalAmount }
                            noEmpty
                            validationErrors={ validationErrors }
                          />
                        </Form.Column2>
                      </Form.Row>
                      <Form.Row>
                        <Form.Column4>
                          <AdjustmentDistributionType
                            distributionType={ distributionType }
                            financialYearGroup={ financialYearGroup }
                            totalValue={ total }
                            editMode
                            validator={ fields.distributionType }
                            onChange={ this.onChangeDistributions }
                          />
                        </Form.Column4>
                      </Form.Row>
                    </Form.Column2>
                    <Form.Column2>
                      { this.renderDistributionMethodHeader(fields, distribution) }
                      <Form.Row>
                        <Form.Column4>
                          <Form.Grid
                            rows={ tableDistributions.rows }
                            columns={ tableDistributions.columns }
                            entry={ entry }
                            validator={ fields.distributions }
                            onChangeValue={ this.onDistributionsChange }
                            editMode
                            canRemoveRow={ false }
                            canAddRow={ false }
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

export default injectIntl(OtherExpensesAdjustment);
