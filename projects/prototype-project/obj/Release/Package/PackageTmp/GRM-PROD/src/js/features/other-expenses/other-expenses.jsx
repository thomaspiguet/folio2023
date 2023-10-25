import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';
import { isEqual, head } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';

import { routes } from '../app/app';

import { ScrollBox } from '../../components/general/scroll-box';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import { FormValidator } from '../../utils/components/form-validator';
import OtherExpensesDetails from '../other-expenses/other-expenses-details';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Account from '../../components/business/account/account';
import {
  Distributions,
  RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS,
} from '../../components/business/distributions/distributions';
import { requestRecalculatedDistributions } from '../../components/business/distributions/actions';
import CalculationBase, {
  CALCULATION_BASE_SECTION,
  CALCULATION_BASE_YEAR_EN,
  getDefaultCalculationBase,
} from '../../components/dropdowns/calculation-base';
import FinancialYearGroup, {
  getDefaultValuesToDistribute,
  isFinancialGroupPercentage,
} from '../../components/dropdowns/financial-year-group';
import { getEntitiesItems } from '../../components/dropdowns/reducers/entities';

import {
  getOtherExpensesMetadata,
  recalculateOtherExpensesHistoryAndDistributions,
  getOtherExpensesHistoryMetadata,
  getIndexationPeriods,
} from '../../api/actions';
import {
  deleteOtherExpenses,
  editCancel,
  editContinue,
  editSave,
  editStart,
  setEntry,
  addOtherExpensesHistoryAdjustment,
  addOtherExpensesHistoryIndexation,
  getOtherExpensesList,
} from './actions/other-expenses';
import { panelClose, panelOpen, popupOpen } from '../../components/general/popup/actions';
import { PopupActionKind } from '../../components/general/popup/constants';
import { editModeStart, editModeEnd } from '../app/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';

import { getDigit2Options, formatDigits } from '../../utils/selectors/currency';
import { getHistorySummaryLines, getHistoryTableLines } from './selectors/other-expenses';
import { extractDistributionsOtherExpenses, extractDistributionsForNewOtherExpense } from '../../components/business/distributions/selectors';
import { getTitle } from '../salaries/selectors';

import { addScenarioAndIdToRoute, addScenarioIdToRoute, isZeroId } from '../../utils/utils';
import { normalizeToSave } from '../../utils/selectors/normalize-to-save';
import { historySchema } from '../../entities/history';
import { distributionOtherAccountSchema } from '../../entities/other-expenses';

import { formOptions } from './constants';

import './other-expenses.scss';
import '../../../styles/content-gradient.scss';


const titleIcon = 'position';

@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  scenarioCode: state.scenario.selectedScenario.scenarioCode,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  year: state.scenario.selectedScenario.year,
  financialYearId: state.scenario.selectedScenario.yearId,
  entry: state.otherExpenses.entry,
  prevHistory: state.otherExpenses.prevHistory,
  isLoading: state.otherExpenses.isLoading,
  digit2Options: getDigit2Options(state),
  historySummaryTable: getHistorySummaryLines(state),
  historyTable: getHistoryTableLines(state),
  tableDistributions: extractDistributionsOtherExpenses(state),
  tableNewOtherExpenseDistribution: extractDistributionsForNewOtherExpense(state),
  title: getTitle(state),
  editMode: state.otherExpenses.editMode,
  metadata: state.otherExpenses.metadata,
  validationErrors: state.otherExpenses.validationErrors,
  isMasterDetailViewActive: state.otherExpensesDetails.isMasterDetailViewActive,
  isRecalculating: state.otherExpenses.isRecalculating,
  selectedModel: state.benefitsModel.selectedRow,
  selectedAccount: state.account.selectedRow,
  calculationBaseEntities: getEntitiesItems(state, CALCULATION_BASE_SECTION),
}), (dispatch) => bindActionCreators({
  deleteOtherExpenses,
  editCancel,
  editContinue,
  editModeEnd,
  editModeStart,
  editSave,
  editStart,
  getOtherExpensesList,
  recalculateOtherExpensesHistoryAndDistributions,
  requestRecalculatedDistributions,
  getOtherExpensesMetadata,
  popupOpen,
  panelOpen,
  panelClose,
  setEntry,
  setTitle,
  addOtherExpensesHistoryAdjustment,
  addOtherExpensesHistoryIndexation,
  getOtherExpensesHistoryMetadata,
  getIndexationPeriods,
}, dispatch))
class OtherExpenses extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.bool,
    otherExpensesId: PropTypes.string,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    digit2Options: PropTypes.object,
    scenarioId: PropTypes.number,
    tableDistributions: PropTypes.object,
    tableNewOtherExpenseDistribution: PropTypes.object,
    isMasterDetailViewActive: PropTypes.bool,
    popupOpen: PropTypes.func,
    panelOpen: PropTypes.func,
    panelClose: PropTypes.func,
    recalculateOtherExpensesHistoryAndDistributions: PropTypes.func,
    requestRecalculatedDistributions: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
    getOtherExpensesList: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props, true);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    const {
      setTitle,
      entry: { generalLedgerAccount: { accountNumber, description } },
    } = props;
    const title = `${ accountNumber || '' } ${ description || '' }`;
    this.init(props);
    setTitle(title);
  }

  init(props, initial) {
    const { editMode, metadata, validationErrors, entry } = props;
    const { onChangeProps } = this.validator;
    onChangeProps({ editMode, metadata, validationErrors, entry });

    this.load(props, initial);
  }

  load(props, force = false) {
    const { otherExpensesId, getOtherExpensesList, isLoading, editMode, scenarioId, history } = props;
    const isNew = isZeroId(otherExpensesId);
    if (!editMode && isNew) {
      history.push(addScenarioIdToRoute(routes.REVENUE_AND_OTHER_EXPENSES.path, scenarioId));
    }
    if (isLoading || isNew) {
      return;
    }
    getOtherExpensesList(otherExpensesId, force);
  }

  @autobind
  onDelete() {
    const {
      popupOpen,
      entry: {
        journal,
      },
      otherExpensesId,
      deleteOtherExpenses,
      scenarioId,
      intl,
    } = this.props;
    const otherExpensesTitle = this.getTitle();
    popupOpen({
      style: 'confirm',
      message: intl.formatMessage({ id: 'other-expenses.delete-confirmation' }, { otherExpensesTitle }),
      actions: [
        { kind: 'cancel' },
        { kind: 'delete', func: deleteOtherExpenses, arg: { otherExpensesId, journal, otherExpensesTitle, scenarioId } },
      ],
    });
  }

  @autobind
  onEdit() {
    const { editStart, otherExpensesId } = this.props;
    editStart(otherExpensesId);
    this.validator.onEdit(this);
  }

  getLastHistoryTotalAmount() {
    const { entry: { history } } = this.props;
    const lastRow = head(history) || { totalAmount: 0 };
    return lastRow.totalAmount;
  }

  @autobind
  onIndexation() {
    const {
      entry,
      scenarioId,
      financialYearId,
      history,
      addOtherExpensesHistoryIndexation,
      getOtherExpensesHistoryMetadata,
      getIndexationPeriods,
    } = this.props;
    const { id } = entry;

    getOtherExpensesHistoryMetadata(id);
    getIndexationPeriods(financialYearId);
    addOtherExpensesHistoryIndexation(this.getLastHistoryTotalAmount());
    history.push(addScenarioAndIdToRoute(routes.OTHER_EXPENSES_INDEXATION.path, scenarioId, id));
  }

  @autobind
  onAdjustment() {
    const { entry, scenarioId, history, addOtherExpensesHistoryAdjustment, getOtherExpensesHistoryMetadata } = this.props;
    const { id } = entry;

    getOtherExpensesHistoryMetadata(id);
    addOtherExpensesHistoryAdjustment(this.getLastHistoryTotalAmount());
    history.push(addScenarioAndIdToRoute(routes.OTHER_EXPENSES_ADJUSTMENT.path, scenarioId, id));
  }

  @autobind
  onCancel() {
    this.validator.onCancel(editCancel(), editContinue());
  }

  @autobind
  onSave() {
    const { editSave, otherExpensesId, entry } = this.props;
    if (this.validator.onSave(this)) {
      editSave(otherExpensesId, entry);
    }
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onChangeHistory() {
    const { recalculateOtherExpensesHistoryAndDistributions, financialYearId, entry, prevHistory, isRecalculating } = this.props;
    const { distributions, distributionType, id, totalAmount, calculationBase, distributionTemplate, amountToBeDistributed, history } = entry;
    if (!isEqual(history, prevHistory) || isRecalculating) {
      const parameters = {
        amountToBeDistributed,
        calculationBase,
        distributionModel: distributionTemplate,
        distributionType,
        financialYearId,
        otherExpensesId: id,
        totalAmount,
      };
      recalculateOtherExpensesHistoryAndDistributions(parameters, normalizeToSave(history, historySchema), distributions, prevHistory);
    }
  }

  @autobind
  onAccountOkClick() {
    const { selectedAccount: { id, accountNumber, description, isFinancial } } = this.props;
    const account = { id, accountNumber, description, isFinancial };
    this.validator.fields.generalLedgerAccount.onChange(account);
  }

  @autobind
  onChangeAccount() {
    const { panelOpen, otherExpensesId } = this.props;
    panelOpen({
      Body: <Account filterByOrganizationId={ isZeroId(otherExpensesId) } />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose },
        { kind: PopupActionKind.ok, func: this.onAccountOkClick },
      ],
    });
  }

  @autobind
  onClearAccount() {
    const generalLedgerAccount = fillDefaults({}, distributionOtherAccountSchema);
    this.validator.setEntryFields({ generalLedgerAccount });
  }

  @autobind
  handleFinancialYearGroupChange(newGroup, index, prevGroup) {
    const newGroupId = newGroup ? newGroup.id : undefined;
    const prevGroupId = prevGroup ? prevGroup.id : undefined;
    if (newGroupId === prevGroupId) {
      return;
    }

    const { calculationBaseEntities } = this.props;
    const amountToBeDistributed = getDefaultValuesToDistribute(newGroup);
    const calculationBase = getDefaultCalculationBase(calculationBaseEntities);

    this.validator.setSubEntry('financialYearGroup', { ...newGroup }, {
      totalAmount: 0,
      amountToBeDistributed,
      calculationBase,
    });
    this.recalculateRevenueAndOtherExpensesHistoryAndDistributions();
  }

  @autobind
  handleAmountToBeDistributedChange() {
    this.recalculateRevenueAndOtherExpensesHistoryAndDistributions();
  }

  @autobind
  handleCalculationBaseChange() {
    this.recalculateRevenueAndOtherExpensesHistoryAndDistributions();
  }

  @autobind
  handleTotalAmountChange() {
    const { entry, editMode } = this.props;
    const { distributionType, totalValue } = entry;

    if (editMode && distributionType && totalValue) {
      this.recalculateRevenueAndOtherExpensesHistoryAndDistributions();
    }
  }

  @autobind
  recalculateRevenueAndOtherExpensesHistoryAndDistributions() {
    const { entry, requestRecalculatedDistributions } = this.props;
    const { amountToBeDistributed, calculationBase, distributionTemplate, distributionType, totalAmount, distributions, financialYearGroup } = entry;

    requestRecalculatedDistributions(RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS, {
      distributions, distributionModel: distributionTemplate, distributionType, totalAmount, calculationBase, amountToBeDistributed, financialYearGroup,
    });
  }

  isCalculationBaseDisabled(calculationBase, financialYearGroup) {
    return calculationBase && calculationBase.codeDescription === CALCULATION_BASE_YEAR_EN && financialYearGroup && financialYearGroup.description;
  }

  renderDetailsTab() {
    const {
      editMode,
      isLoading,
      otherExpensesId,
      year,
      scenarioCode,
      scenarioDescription,
      entry,
      digit2Options,
      historySummaryTable,
      historyTable,
      isMasterDetailViewActive,
    } = this.props;
    const {
      generalLedgerAccount,
      amountToBeDistributed,
      calculationBase,
      totalAmount,
      financialYearGroup,
    } = entry;
    const { fields, tabs: { details: { invalid } } } = this.validator;
    const { flashErrors } = this.state;

    const isPercentageTitleToBeDistributed = isFinancialGroupPercentage(financialYearGroup);
    const tableTitle = this.props.intl.formatMessage({ id: 'other-expenses.history-title' });
    const isNew = isZeroId(otherExpensesId);

    return (
      <Form.Tab
        id='details'
        intlId='other-expenses.details'
        isLoading={ isLoading }
        flashErrors={ flashErrors }
        invalid={ invalid }
      >
        <Form.Row>
          <Form.Column><Field value={ year } labelIntlId='other-expenses.year' /></Form.Column>
          <Form.Column><Field value={ scenarioCode } labelIntlId='other-expenses.scenario' /></Form.Column>
          <Form.Column><Field.Info value={ scenarioDescription } /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            { !isNew &&
              <Field value={ generalLedgerAccount && generalLedgerAccount.accountNumber } labelIntlId='other-expenses.account' />
            }
            { isNew &&
              <Field.InputSearch
                editMode
                value={ generalLedgerAccount && generalLedgerAccount.accountNumber }
                validator={ fields.generalLedgerAccount }
                fieldName='generalLedgerAccount'
                onClick={ this.onChangeAccount }
                onClear={ this.onClearAccount }
                labelIntlId='other-expenses.account'
              />
            }
          </Form.Column>
          <Form.Column2><Field.Info value={ generalLedgerAccount && generalLedgerAccount.description } /></Form.Column2>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            { !isNew &&
              <Field value={ financialYearGroup && financialYearGroup.description } labelIntlId='other-expenses.group' />
            }
            { isNew &&
              <FinancialYearGroup
                editMode
                validator={ fields.financialYearGroup }
                value={ financialYearGroup }
                onChange={ this.handleFinancialYearGroupChange }
                flashErrors={ flashErrors }
              />
            }
          </Form.Column>
          <Form.Column>
            { !isNew &&
              <Field
                value={ formatDigits(amountToBeDistributed, digit2Options) }
                labelIntlId={ isPercentageTitleToBeDistributed ? 'other-expenses.percentage-distributed' : 'other-expenses.amount-distributed' }
              />
            }
            { isNew &&
              <Field.Number2
                editMode
                validator={ fields.amountToBeDistributed }
                value={ amountToBeDistributed }
                labelIntlId={ isPercentageTitleToBeDistributed ? 'other-expenses.percentage-distributed' : 'other-expenses.amount-distributed' }
                onChange={ this.handleAmountToBeDistributedChange }
                flashErrors={ flashErrors }
              />
            }
          </Form.Column>
          <Form.Column>
            { !isNew &&
              <Field value={ calculationBase && calculationBase.longDescription } labelIntlId='other-expenses.calculation-base' />
            }
            { isNew &&
              <CalculationBase
                editMode
                validator={ fields.calculationBase }
                value={ calculationBase }
                disabled={ this.isCalculationBaseDisabled(calculationBase, financialYearGroup) }
                onChange={ this.handleCalculationBaseChange }
                flashErrors={ flashErrors }
              />
            }
          </Form.Column>
          <Form.Column>
            { !isNew &&
              <Field value={ formatDigits(totalAmount, digit2Options) } labelIntlId='other-expenses.total-amount' />
            }
            { isNew &&
              <Field.Number2
                editMode={ false }
                value={ totalAmount }
                onChangeValue={ this.handleTotalAmountChange }
                labelIntlId='other-expenses.total-amount'
                disabled
                flashErrors={ flashErrors }
              />
            }
          </Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ historySummaryTable.rows }
              columns={ historySummaryTable.columns }
              flashErrors={ flashErrors }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          { isMasterDetailViewActive && !editMode &&
            <Form.Column4>
              <OtherExpensesDetails />
            </Form.Column4>
          }
          { !isMasterDetailViewActive &&
            <Form.Column4>
              <div className='other-expenses__table-title'>{ tableTitle }</div>
              <Form.Grid
                editMode={ editMode }
                rows={ historyTable.rows }
                columns={ historyTable.columns }
                pageSize={ historyTable && historyTable.rows && historyTable.rows.length }
                validator={ fields.history }
                entry={ entry }
                canAddRow={ false }
                onChange={ this.onChangeHistory }
                onDeleteRow={ this.onChangeHistory }
                flashErrors={ flashErrors }
              />
            </Form.Column4>
          }
        </Form.Row>
      </Form.Tab>
    );
  }

  renderDistributionsTab() {
    const { editMode, entry, otherExpensesId, tableDistributions, tableNewOtherExpenseDistribution,
      isLoading, intl, validationErrors } = this.props;
    const { tabs: { distributions: { invalid } } } = this.validator;
    const { flashErrors } = this.state;
    const isNew = isZeroId(otherExpensesId);

    return (
      <Form.Tab
        id='distributions'
        intlId='budget-request.distributions'
        isLoading={ isLoading }
        flashErrors={ flashErrors }
        invalid={ invalid }
      >
        <Distributions
          entry={ entry }
          distributions={ entry.distributions }
          tableDistributions={ isNew ? tableNewOtherExpenseDistribution : tableDistributions }
          distributionType={ entry.distributionType }
          distributionTemplate={ entry.distributionTemplate }
          financialYearGroup={ entry.financialYearGroup }
          calculationBase={ entry.calculationBase }
          totalValue={ entry.totalAmount }
          validator={ this.validator }
          editMode={ isNew && editMode }
          isLoading={ !editMode && isLoading }
          recalculationType={ RECALCULATE_REVENUE_AND_OTHER_EXPENSES_DISTRIBUTIONS }
          isNew={ isNew }
          intl={ intl }
          flashErrors={ flashErrors }
          validationErrors={ validationErrors }
        />
      </Form.Tab>
    );
  }

  getTitle(accountNumber, description) {
    const names = [accountNumber, description];
    return names.join(' ');
  }

  render() {
    const {
      editMode,
      isLoading,
      isSaving,
      metadata: {
        isEditable,
        isDeletable,
        isAddIndexationAvailable,
        isAddAdjustmentAvailable,
      },
    } = this.props;

    const {
      generalLedgerAccount: {
        accountNumber,
        description,
      },
    } = this.props.entry;

    const { invalid } = this.validator;
    const { flashErrors } = this.state;

    const addIndexationIsDisabled = isAddIndexationAvailable === false;
    const addAdjustmentIsDisabled = isAddAdjustmentAvailable === false;
    const deleteIsDisabled = isDeletable === false;
    const editIsDisabled = isEditable === false;
    const disabledActions = isLoading || isSaving;

    return (
      <div className='other-expenses'>
        <div className='other-expenses__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='other-expenses__form'>
            <Form
              invalid={ editMode && invalid }
              flashErrors={ flashErrors }
              editMode={ editMode }
            >
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='other-expenses.item-title' message={ this.getTitle(accountNumber, description) } />
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { !editMode && !isLoading && <Form.Action disabled={ addAdjustmentIsDisabled } type='indexation' intlId='other-expenses.adjustment' onClick={ this.onAdjustment } /> }
                  { !editMode && !isLoading && <Form.Action disabled={ addIndexationIsDisabled } type='indexation' intlId='other-expenses.indexation' onClick={ this.onIndexation } /> }
                  { !editMode && !isLoading && <Form.Action disabled={ deleteIsDisabled } type='delete' intlId='action.delete' onClick={ this.onDelete } /> }
                  { !editMode && <Form.Action disabled={ editIsDisabled } type='edit' intlId='action.edit' onClick={ this.onEdit } /> }
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              <Form.Tabs active='details' validator={ this.validator } editMode={ editMode }>
                { this.renderDetailsTab() }
                { this.renderDistributionsTab() }
              </Form.Tabs>
              { editMode &&
                <Form.FooterActions>
                  <Form.Action type='cancel' intlId='action.cancel' disabled={ disabledActions } onClick={ this.onCancel } />
                  <Form.Action type='save' intlId='action.save' disabled={ disabledActions } onClick={ this.onSave } validator={ this.validator } isLast />
                </Form.FooterActions>
              }
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }

}

export default injectIntl(OtherExpenses);
