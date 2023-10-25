import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';
import { isUndefined } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';
import { benefitsBudgetRequestSchema, modelItemSchema } from '../../entities/benefits';
import { PopupActionKind } from '../../components/general/popup/constants';
import { ScrollBox } from '../../components/general/scroll-box';

import { fillSubEntry, FormValidator } from '../../utils/components/form-validator';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import RadioButton from '../../components/controls/radio-button';

import FunctionalCenter from '../../components/dropdowns/functional-center';
import BudgetRequestType from '../../components/dropdowns/budget-request-type';
import NatureOfExpense from '../../components/dropdowns/nature-of-expense';
import GroupType from '../../components/dropdowns/group-type';
import JobTitle from '../../components/dropdowns/job-title';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import Union from '../../components/dropdowns/union';
import JobStatus from '../../components/dropdowns/job-status';
import JobType from '../../components/dropdowns/job-type';
import SecondaryCode from '../../components/dropdowns/secondary-code';
import CalculationBase, {
  CALCULATION_BASE_SECTION,
  CALCULATION_BASE_YEAR_EN,
  getDefaultCalculationBase,
} from '../../components/dropdowns/calculation-base';
import FinancialYearGroup, {
  getDefaultValuesToDistribute,
  isFinancialGroupPercentage,
} from '../../components/dropdowns/financial-year-group';
import BenefitsModel from '../../components/business/benefits-model/benefits-model';

import {
  getBenefits,
  getBudgetRequest,
  getBudgetRequestFte,
  getBudgetRequestTotals,
  getEndpoint,
  getSuggestedHourlyRate,
} from '../../api/actions';
import {
  deleteBudgetRequest,
  editCancel,
  editContinue,
  editSave,
  editStart,
  setEntry,
  toggleSuggestedHourlyRateExpand,
} from './actions';
import { panelClose, panelOpen, popupClose, popupOpen } from '../../components/general/popup/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { formatDigits, getDigit1Options, getDigit2Options } from '../../utils/selectors/currency';
import { extractDistributions } from '../../components/business/distributions/selectors';
import { editModeStart, editModeEnd } from '../app/actions';
import {
  Distributions,
  RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS,
} from '../../components/business/distributions/distributions';
import { requestRecalculatedDistributions } from '../../components/business/distributions/actions';
import { getEntitiesItems } from '../../components/dropdowns/reducers/entities';
import { addScenarioIdToRoute, isEmptyObject, isZeroId } from '../../utils/utils';

import {
  calculateSuggestedHourlyRate,
} from '../../components/business/suggested-hourly-rate/suggested-hourly-rate';

import SuggestedHourlyRateSection from '../../components/business/suggested-hourly-rate/suggested-hourly-rate-section';

import { formOptions, titleIcon } from './constants';
import { isJobGroupTitleType, isJobTitleType } from '../../entities/suggested-hourly-rate';

import './budget-requests.scss';
import '../../../styles/content-gradient.scss';
import { routes } from '../app/app';

export class BudgetRequestBase extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.bool,
    isLoadingDistributions: PropTypes.bool,
    year: PropTypes.number,
    financialYearId: PropTypes.number,
    budgetRequestId: PropTypes.string,
    originRowDetailId: PropTypes.string,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    digit1Options: PropTypes.object,
    digit2Options: PropTypes.object,
    isSuggestedHourlyRateExpanded: PropTypes.bool,
    toggleSuggestedHourlyRateExpand: PropTypes.func,
    getBenefits: PropTypes.func,
    getBudgetRequestTotals: PropTypes.func,
    scenarioId: PropTypes.number,
    getBudgetRequestFte: PropTypes.func,
    panelOpen: PropTypes.func,
    panelClose: PropTypes.func,
    requestRecalculatedDistributions: PropTypes.func,
    selectedModelRow: PropTypes.object,
    tableDistributions: PropTypes.object,
  };

  static defaultProps = {
    editMode: false,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
  }

  componentDidMount() {
    super.componentDidMount();
    this.init(this.props);
    this.validator.onDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.validator.onWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { budgetRequestId, prevBudgetRequestId, editMode, metadata, validationErrors, isLoading, setTitle, entry, scenarioId, history } = props;
    const { number, description } = entry;
    const { onChangeProps } = this.validator;
    const isNew = isZeroId(budgetRequestId);
    if (this.validator.haveChangedEntryProps(props, 'number', 'description')) {
      setTitle(this.getTitle(number, description));
    }
    onChangeProps({ editMode, metadata, validationErrors, entry });
    if (!editMode && isNew) {
      history.push(addScenarioIdToRoute(routes.BUDGET_REQUESTS.path, scenarioId));
    }
    if (budgetRequestId === prevBudgetRequestId || isLoading || isNew) {
      return;
    }
    props.getBudgetRequest(budgetRequestId);
  }

  getTitle(code, description) {
    const names = [code, description];
    return names.join(' ');
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onChangeSuggestedSpecificHourlyRate(newSuggestedHourlyRate, value) {
    const { setEntry, entry } = this.props;
    setEntry(fillSubEntry(entry, 'suggestedHourlyRate', newSuggestedHourlyRate));
  }

  @autobind
  onEdit() {
    const { editStart, budgetRequestId } = this.props;
    editStart(budgetRequestId);
    this.validator.onEdit(this);
  }

  @autobind
  onSave() {
    const { editSave, budgetRequestId, entry } = this.props;
    if (this.validator.onSave(this)) {
      editSave(budgetRequestId, entry);
    }
  }

  @autobind
  onCancel() {
    this.validator.onCancel(editCancel(), editContinue());
  }

  isEditableRequestType(editMode, requestType) {
    if (!editMode) {
      return false;
    }

    if (!requestType) {
      return true;
    }

    switch (requestType.code) {
      case '010':
      case '020':
      case '030':
      case '040':
      case '050':
      case '060':
      case '070':
      case '100':
      case '180':
        return false;
      default:
        return true;
    }
  }

  isVisibleHourlyRate(requestType) {
    return !requestType || requestType.code !== '180';
  }

  @autobind
  requestBenefits() {
    const { financialYearId, getBenefits } = this.props;
    const { jobStatus, union } = this.props.entry;

    const parameters = {
      financialYearId,
      jobStatusId: jobStatus ? jobStatus.id : null,
      unionId: union ? union.id : null,
      loadAdditionalPeriod: true,
    };
    getBenefits(parameters);
  }

  @autobind
  handleGlobalParametersCheckboxChange(value) {
    if (value) {
      this.validator.setSubEntry('benefits', {
        origin: 'Parameters',
      });
      this.requestBenefits();
    } else {
      this.validator.setSubEntry('benefits', {
        origin: 'Specific',
      });
    }
  }

  @autobind
  handleBenefitsModelOkClick(fieldName) {
    const { id, number, name } = this.props.selectedModelRow;
    const { entry } = this.props;
    this.validator.setSubEntry('benefits', {
      models: {
        ...entry.benefits.models,
        [`${ fieldName }`]: {
          id,
          name,
          number,
        },
      },
    });
  }

  @autobind
  openBenefitsModelPanel(fieldName) {
    const { panelOpen } = this.props;
    panelOpen({
      Body: <BenefitsModel />,
      actions: [
        { kind: PopupActionKind.cancel, action: panelClose },
        { kind: PopupActionKind.ok, func: this.handleBenefitsModelOkClick.bind(this, fieldName) },
      ],
    });
  }

  @autobind
  handleModelItemClear(fieldName) {
    const { entry } = this.props;
    this.validator.setSubEntry('benefits', {
      models: {
        ...entry.benefits.models,
        [`${ fieldName }`]: fillDefaults({}, modelItemSchema),
      },
    });
  }

  @autobind
  handleModelVacationChange() {
    this.openBenefitsModelPanel('vacation');
  }

  @autobind
  handleModelHolidaysChange() {
    this.openBenefitsModelPanel('holidays');
  }

  @autobind
  handleModelSickDaysChange() {
    this.openBenefitsModelPanel('sickDays');
  }

  renderBenefitsBlock() {
    const { fields } = this.validator;
    const { editMode, digit2Options, entry } = this.props;
    const { benefits: {
      percenteges: {
        isFinancialYearParameters,
        additionalPeriod4: additionalPeriod4FromProps,
        pctSickDay: pctSickDayFromProps,
        pctHoliday: pctHolidayFromProps,
        pctVacation: pctVacationFromProps,
        pctPsychiatricLeave: pctPsychiatricLeaveFromProps,
      },
    } } = entry;

    let {
      benefits: {
        models: {
          vacation: {
            number: vacationNumber, // eslint-disable-line prefer-const
          },
          holidays: {
            number: holidaysNumber, // eslint-disable-line prefer-const
          },
          sickDays: {
            number: sickDaysNumber, // eslint-disable-line prefer-const
          },
        },
        percenteges: {
          additionalPeriod4,
          pctSickDay,
          pctHoliday,
          pctVacation,
          pctPsychiatricLeave,
        },
        origin,
      },
    } = entry;

    if (!isUndefined(isFinancialYearParameters) && origin !== 'Specific') {
      additionalPeriod4 = additionalPeriod4FromProps;
      pctSickDay = pctSickDayFromProps;
      pctHoliday = pctHolidayFromProps;
      pctVacation = pctVacationFromProps;
      pctPsychiatricLeave = pctPsychiatricLeaveFromProps;

      if (isFinancialYearParameters) {
        origin = 'Parameters';
      } else {
        origin = 'Union';
      }
    }

    const showGlobalParameterValues = origin === 'Parameters' || origin === '' || isUndefined(origin);
    const showUnionParameters = origin === 'Union';
    const showSpecificParameter = origin === 'Specific';

    let globalParameterValueCheckBoxValue;
    if (showGlobalParameterValues) {
      globalParameterValueCheckBoxValue = true;
    } else if (showSpecificParameter) {
      globalParameterValueCheckBoxValue = false;
    }

    const modelsBlockTitle = this.props.intl.formatMessage({ id: 'budget-request.models-block-title' });

    return (
      <div>
        <Form.Row>
          <Form.Column>
            { !showUnionParameters &&
              <Checkbox
                value={ globalParameterValueCheckBoxValue }
                editMode={ editMode }
                onToggle={ this.handleGlobalParametersCheckboxChange }
                single={ true }
                labelIntlId='budget-request.global-parameter-values'
              />
            }
            { showUnionParameters &&
              <Checkbox
                value={ true }
                editMode={ false }
                single={ true }
                labelIntlId='budget-request.union-parameter-values'
              />
            }
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <div className='budget-request__column-header--bold'>
              { showGlobalParameterValues &&
                <FormattedMessage
                  id='budget-request.parameters-title'
                  defaultMessage='Parameters (%)'
                />
              }
              { showUnionParameters &&
                <FormattedMessage
                  id='budget-request.union-title'
                  defaultMessage='Union (%)'
                />
              }
              { showSpecificParameter &&
                <FormattedMessage
                  id='budget-request.specific-title'
                  defaultMessage='Specific (%)'
                />
              }
            </div>
          </Form.Column>
          <Form.Column />
          <Form.Column>
            <div className='budget-request__column-header--bold'>{ modelsBlockTitle }</div>
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            { showSpecificParameter &&
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctVacation }
                value={ pctVacation }
                labelIntlId='budget-request.benefits-vacation-percentage'
              />
            }
            { !showSpecificParameter &&
              <Field value={ formatDigits(pctVacation, digit2Options) } disabled labelIntlId='budget-request.benefits-vacation-percentage' />
            }
          </Form.Column>
          <Form.Column>
            { showSpecificParameter &&
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctHoliday }
                value={ pctHoliday }
                labelIntlId='budget-request.benefits-holidays-percentage'
              />
            }
            { !showSpecificParameter &&
              <Field value={ formatDigits(pctHoliday, digit2Options) } disabled labelIntlId='budget-request.benefits-holidays-percentage' />
            }
          </Form.Column>
          <Form.Column>
            <Field.InputSearch
              editMode={ editMode }
              value={ vacationNumber }
              fieldName='vacation'
              onClick={ editMode ? this.handleModelVacationChange : null }
              onClear={ editMode ? this.handleModelItemClear : null }
              labelIntlId='budget-request.benefits-vacation-model'
            />
          </Form.Column>
          <Form.Column>
            <Field.InputSearch
              editMode={ editMode }
              value={ holidaysNumber }
              fieldName='holidays'
              onClick={ editMode ? this.handleModelHolidaysChange : null }
              onClear={ editMode ? this.handleModelItemClear : null }
              labelIntlId='budget-request.benefits-holidays-model'
            />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            { showSpecificParameter &&
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctSickDay }
                value={ pctSickDay }
                labelIntlId='budget-request.benefits-sick-days-percentage'
              />
            }
            { !showSpecificParameter &&
              <Field value={ formatDigits(pctSickDay, digit2Options) } disabled labelIntlId='budget-request.benefits-sick-days-percentage' />
            }
          </Form.Column>
          <Form.Column>
            { showSpecificParameter &&
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctPsychiatricLeave }
                value={ pctPsychiatricLeave }
                labelIntlId='budget-request.benefits-psychiatric-leave-percentage'
              />
            }
            { !showSpecificParameter &&
              <Field value={ formatDigits(pctPsychiatricLeave, digit2Options) } disabled labelIntlId='budget-request.benefits-psychiatric-leave-percentage' />
            }
          </Form.Column>
          <Form.Column>
            <Field.InputSearch
              editMode={ editMode }
              value={ sickDaysNumber }
              fieldName='sickDays'
              onClick={ editMode ? this.handleModelSickDaysChange : null }
              onClear={ editMode ? this.handleModelItemClear : null }
              labelIntlId='budget-request.benefits-sick-days-model'
            />
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            { showSpecificParameter &&
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.additionalPeriod4 }
                value={ additionalPeriod4 }
                labelIntlId='budget-request.benefits-additional-period-4'
              />
            }
            { !showSpecificParameter &&
              <Field value={ formatDigits(additionalPeriod4, digit2Options) } disabled labelIntlId='budget-request.benefits-additional-period-4' />
            }
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
      </div>
    );
  }

  @autobind
  handleUnionChange() {
    this.validator.setSubEntry('benefits', { origin: undefined });
    this.requestBenefits();
  }

  @autobind
  handleJobStatusChange() {
    this.validator.setSubEntry('benefits', { origin: undefined });
    this.requestBenefits();
  }

  @autobind
  handleCalculatingBenefitsChange(value) {
    const { fields } = this.validator;
    const emptyBenefits = fillDefaults({}, benefitsBudgetRequestSchema);
    if (value) {
      this.validator.setSubEntry('benefits', { origin: '' });
      this.requestBenefits();
      fields.calculateBenefits.onChange(value, undefined, {});
    } else {
      fields.calculateBenefits.onChange(value, undefined, { benefits: emptyBenefits });
    }
  }

  @autobind
  handleIsFteCalculating(value) {
    const { fields } = this.validator;
    const update = { };
    fields.isFteCalculation.onChange(value, undefined, update);
  }

  @autobind
  onChangeJobTitle(value) {
    this.calculateFTEOnChange();
  }

  @autobind
  onChangeJobType(value) {
    this.calculateFTEOnChange();
  }

  calculateFTEOnChange() {
    const {
      isFteCalculation,
    } = this.props.entry;

    if (isFteCalculation === true) {
      this.calculateFTE();
    }
  }

  calculateFTE() {
    const { getBudgetRequestFte, financialYearId, entry } = this.props;
    const { fields } = this.validator;
    const {
      jobTitle,
      jobType,
      totalValue,
    } = entry;

    const { metadata } = fields.fte;
    const url = getEndpoint(metadata);
    if (url) {
      getBudgetRequestFte(url,
        financialYearId,
        jobType ? jobType.id : undefined,
        jobTitle ? jobTitle.id : undefined,
        totalValue);
    }
  }

  @autobind
  handleIsAmountToDistributeChange(value) {
    const { fields } = this.validator;
    const update = {};
    fields.isAmountToDistribute.onChange(value, undefined, update);
    const { isChamMode } = this.props;

    if (!isChamMode) {
      fields.secondaryCode.onChange({}, undefined, update);
    }
  }

  @autobind
  handleGroupTypeChange(value) {
    const { fields } = this.validator;
    const update = {};
    fields.type.onChange(value, undefined, update);
    fields.jobTitle.onChange({}, undefined, update);
    fields.jobTitleGroup.onChange({}, undefined, update);
  }

  isCalculationBaseDisabled(calculationBase, financialYearGroup) {
    return calculationBase && calculationBase.codeDescription === CALCULATION_BASE_YEAR_EN && financialYearGroup && financialYearGroup.description;
  }

  @autobind
  handleFinancialYearGroupChange(newGroup, index, prevGroup) {
    const newGroupId = newGroup ? newGroup.id : undefined;
    const prevGroupId = prevGroup ? prevGroup.id : undefined;
    if (newGroupId === prevGroupId) {
      return;
    }

    const { calculationBaseEntities } = this.props;

    this.validator.setSubEntry('financialYearGroup', { ...newGroup }, {
      totalValue: 0,
      fte: 0,
      valuesToDestribute: getDefaultValuesToDistribute(newGroup),
      calculationBase: getDefaultCalculationBase(calculationBaseEntities),
    });
  }

  @autobind
  calculateTotalHours() {
    const { fields: { totalValue: { metadata } } } = this.validator;
    const { financialYearId, getBudgetRequestTotals, entry } = this.props;
    const url = getEndpoint(metadata);

    const {
      calculationBase,
      valuesToDestribute,
      financialYearGroup,
    } = entry;

    if (!isEmptyObject(financialYearGroup)) {
      return;
    }

    getBudgetRequestTotals(url, calculationBase ? calculationBase.codeDescription : undefined, valuesToDestribute, financialYearId);
  }

  @autobind
  calculateSuggestedHourlyRate(rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue) {
    const { getSuggestedHourlyRate, scenarioId, financialYearId, entry } = this.props;
    const { fields } = this.validator;
    const { metadata } = fields.suggestedHourlyRate.columns.suggestedHourlyRate;
    const url = getEndpoint(metadata);
    const {
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      suggestedHourlyRate,
      type,
      requestType,
    } = entry;
    const context = {
      getSuggestedHourlyRate,
      url,
      scenarioId,
      financialYearId,
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      groupType: type,
      suggestedHourlyRate,
      originType: 'BudgetRequest',
      requestType: requestType && requestType.codeDescription,
    };
    calculateSuggestedHourlyRate(context, rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue);
  }

  @autobind
  handleValuesToDestributeChange() {
    this.calculateTotalHours();
  }

  @autobind
  handleCalculationBaseChange() {
    this.calculateTotalHours();
  }

  @autobind
  handleTotalValueChange() {
    const { entry, editMode, requestRecalculatedDistributions } = this.props;
    const { distributions, distributionType, totalValue, calculationBase, distributionTemplate } = entry;

    if (editMode && distributionType && totalValue) {
      requestRecalculatedDistributions(RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS, {
        distributions,
        distributionModel:
        distributionTemplate,
        distributionType,
        totalValue,
        calculationBase,
      });
      this.calculateFTE();
    }
  }

  @autobind
  onChangeRequestType(value) {
    if (value && value.code === '180') {
      const isAmountToDistribute = true;
      this.validator.setEntryFields({ isAmountToDistribute });
    }
  }

  @autobind
  onDelete() {
    const {
      popupOpen,
      entry: {
        number,
        description,
        journal,
      },
      budgetRequestId,
      deleteBudgetRequest,
      scenarioId,
      intl,
    } = this.props;
    const budgetRequestTitle = this.getTitle(number, description);
    popupOpen({
      style: 'confirm',
      message: intl.formatMessage({ id: 'budget-request.delete-confirmation' }, { budgetRequestTitle }),
      actions: [
        { kind: 'cancel' },
        { kind: 'delete', func: deleteBudgetRequest, arg: { budgetRequestId, journal, budgetRequestTitle, scenarioId } },
      ],
    });
  }

  renderDetailsTab() {
    const { fields, tabs: { detail: { invalid } } } = this.validator;
    const {
      isLoading,
      editMode,
      isSuggestedHourlyRateExpanded,
      toggleSuggestedHourlyRateExpand,
      calculatedSuggestedHourlyRate,
      year,
      scenarioDescription,
      digit2Options,
      originRowDetailId,
      entry,
      intl,
      isChamMode,
      budgetRequestId,
      validationErrors,
    } = this.props;
    const {
      number,
      description,
      isCalclulatedForScenario,
      forThisScenario,
      functionalCenter,
      requestType,
      natureOfExpense,
      jobStatus,
      jobType,
      type,
      jobTitle,
      jobTitleGroup,
      union,
      isAmountToDistribute,
      hourlyFactor,
      isFteCalculation,
      isCalculatingPayrollDeductions,
      isCalculatingBenefits,
      secondaryCode,
      calculationBase,
      valuesToDestribute,
      totalValue,
      financialYearGroup,
      suggestedHourlyRate,
      fte,
    } = entry;
    const { flashErrors } = this.state;

    const isPercentageTitleToBeDistributed = isFinancialGroupPercentage(financialYearGroup);

    const isJobTitle = isJobTitleType(type);
    const isJobGroupTitle = isJobGroupTitleType(type);
    const isNew = isZeroId(budgetRequestId);

    const valuesToDestributeLabel = isPercentageTitleToBeDistributed ? 'budget-request.percentage-to-be-distributed' :
      (isAmountToDistribute ? 'budget-request.amount-to-be-distributed' : 'budget-request.hours-to-be-distributed');

    return (
      <Form.Tab
        id='details'
        intlId='budget-request.details-tab-title'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column>
            <Field value={ year } disabled labelIntlId='budget-request.financial-year-colon' />
          </Form.Column>
          <Form.Column>
            <Field value={ scenarioDescription } disabled labelIntlId='budget-request.selected-scenario' />
          </Form.Column>
          <Form.Column>
            <Checkbox
              value={ forThisScenario }
              editMode={ editMode }
              labelIntlId='budget-request.for-this-scenario'
              onToggle={ fields.forThisScenario.onChange }
            />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <FunctionalCenter
              editMode={ editMode }
              validator={ fields.functionalCenter }
              disabled={ isCalclulatedForScenario }
              value={ functionalCenter }
              labelIntlId='budget-request.functional-center-code'
              placeholderIntlId='budget-request.functional-center-placeholder'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ functionalCenter && functionalCenter.longDescription } /></Form.Column>
          <Form.Column>
            <BudgetRequestType
              editMode={ editMode }
              disabled={ !isNew && !this.isEditableRequestType(editMode, requestType) }
              validator={ fields.requestType }
              value={ requestType }
              parameters={ { action: isNew ? 'Insert' : 'Update' } }
              labelIntlId='budget-request.request-type'
              flashErrors={ flashErrors }
              onChange={ this.onChangeRequestType }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ requestType && requestType.longDescription } /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ number } disabled labelIntlId='budget-request.request-number' /></Form.Column>
          <Form.Column>
            <Field.Input
              editMode={ editMode }
              validator={ fields.description }
              value={ description }
              labelIntlId='budget-request.request-description'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        { isChamMode &&
          <Form.Row>
            <Form.Column>
              <NatureOfExpense
                editMode={ editMode }
                validator={ fields.natureOfExpense }
                queryParameters={ originRowDetailId ? { budgetDetailsId: originRowDetailId } : {} }
                value={ natureOfExpense }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            <Form.Column><Field.Info value={ natureOfExpense && natureOfExpense.longDescription } /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { !isChamMode &&
          <Form.Row>
            <Form.Column>
              <SecondaryCode
                editMode={ editMode }
                validator={ fields.secondaryCode }
                queryParameters={ originRowDetailId ?
                  { budgetDetailsId: originRowDetailId, isAmountToDistribute } : { isAmountToDistribute }
                }
                value={ secondaryCode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            <Form.Column><Field.Info value={ secondaryCode && secondaryCode.longDescription } /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        <Form.Row>
          <Form.Column>
            <GroupType
              editMode={ editMode }
              validator={ fields.type }
              value={ type }
              labelIntlId='budget-request.type-colon'
              onChange={ this.handleGroupTypeChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            { isJobTitle &&
              <JobTitle
                editMode={ editMode }
                validator={ fields.jobTitle }
                value={ jobTitle }
                labelIntlId={ null }
                onChange={ this.onChangeJobTitle }
                flashErrors={ flashErrors }
              />
            }
            { isJobGroupTitle &&
              <JobTitleGroup
                editMode={ editMode }
                validator={ fields.jobTitleGroup }
                value={ jobTitleGroup }
                labelIntlId={ null }
                flashErrors={ flashErrors }
              />
            }
          </Form.Column>
          <Form.Column>
            { isJobTitle &&
              <Field.Info value={ jobTitle && jobTitle.description } />
            }
            { isJobGroupTitle &&
              <Field.Info value={ jobTitleGroup && jobTitleGroup.longDescription } />
            }
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <JobStatus
              editMode={ editMode }
              validator={ fields.jobStatus }
              onChange={ this.handleJobStatusChange }
              value={ jobStatus }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ jobStatus && jobStatus.longDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <JobType editMode={ editMode } validator={ fields.jobType } value={ jobType } onChange={ this.onChangeJobType } />
          </Form.Column>
          <Form.Column>
            <Union
              editMode={ editMode }
              validator={ fields.union }
              onChange={ this.handleUnionChange }
              value={ union }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ union && union.shortDescription } /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        { this.isVisibleHourlyRate(requestType) &&
          <SuggestedHourlyRateSection
            fieldsSuggestedHourlyRate={ fields.suggestedHourlyRate }
            flashErrors={ flashErrors }
            calculateSuggestedHourlyRate={ this.calculateSuggestedHourlyRate }
            onChangeSuggestedSpecific={ this.onChangeSuggestedSpecificHourlyRate }

            editMode={ editMode }
            isSuggestedHourlyRateExpanded={ isSuggestedHourlyRateExpanded }
            toggleSuggestedHourlyRateExpand={ toggleSuggestedHourlyRateExpand }
            calculatedSuggestedHourlyRate={ calculatedSuggestedHourlyRate }
            digit2Options={ digit2Options }
            intl={ intl }
            suggestedHourlyRate={ suggestedHourlyRate }
            jobTitle={ isJobTitle ? jobTitle : null }
            functionalCenter={ functionalCenter }
            formNode={ this.formNode }
            validationErrors={ validationErrors }
          />
        }
        { this.isVisibleHourlyRate(requestType) && <Form.Separator /> }
        <Form.Row>
          <Form.Column>
            <Checkbox
              single={ true }
              value={ isCalculatingBenefits }
              editMode={ editMode }
              onToggle={ this.handleCalculatingBenefitsChange }
              labelIntlId='budget-request.calculate-benefits'
            />
          </Form.Column>
          <Form.Column>
            <Checkbox
              value={ isCalculatingPayrollDeductions }
              editMode={ editMode }
              single={ true }
              labelIntlId='budget-request.calculate-payroll-deductions'
              onToggle={ fields.isCalculatingPayrollDeductions.onChange }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        { isCalculatingBenefits && this.renderBenefitsBlock() }
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <RadioButton
              value={ isAmountToDistribute }
              labelIntlId='budget-request.value-to-be-distributed'
              values={ [
                { value: false, id: 'hours', intlId: 'budget-request.hours' },
                { value: true, id: 'amount', intlId: 'budget-request.amount' },
              ] }
              editMode={ editMode && (!requestType || requestType.code !== '180') }
              twoColumnsWidth
              validator={ fields.isAmountToDistribute }
              onChange={ this.handleIsAmountToDistributeChange }
            />
          </Form.Column2>
          <Form.Column />
          <Form.Column>
            <Checkbox
              single
              value={ isFteCalculation }
              editMode={ editMode }
              onToggle={ this.handleIsFteCalculating }
              labelIntlId='budget-request.calculate-fte'
            />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <FinancialYearGroup
              editMode={ editMode }
              validator={ fields.financialYearGroup }
              value={ financialYearGroup }
              onChange={ this.handleFinancialYearGroupChange }
              labelIntlId='budget-request.group'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.valuesToDestribute }
              value={ valuesToDestribute }
              labelIntlId={ valuesToDestributeLabel }
              onChange={ this.handleValuesToDestributeChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.hourlyFactor }
              value={ hourlyFactor }
              disabled={ this.hourlyFactorDisabled(requestType) }
              labelIntlId='budget-request.hourly-factor'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          { (isFteCalculation ?
            <Form.Column>

              <Field.Number1
                editMode={ editMode }
                validator={ fields.fte }
                value={ fte }
                flashErrors={ flashErrors }
              />

            </Form.Column> :
            <Form.Column />)
          }
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <CalculationBase
              editMode={ editMode }
              validator={ fields.calculationBase }
              value={ calculationBase }
              disabled={ this.isCalculationBaseDisabled(calculationBase, financialYearGroup) }
              onChange={ this.handleCalculationBaseChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <Field.Number2
              value={ totalValue }
              labelIntlId={ isAmountToDistribute ? 'budget-request.amount-total' : 'budget-request.hours-total' }
              editMode={ false }
              onChangeValue={ this.handleTotalValueChange }
              disabled
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  hourlyFactorDisabled(requestType) {
    if (!requestType) {
      return true;
    }
    const { code, attributeCode } = requestType;
    return code === '180' || attributeCode === '40' || attributeCode === '50';
  }

  renderDistributionsTab() {
    const { editMode, entry, budgetRequestId, isLoading, isLoadingDistributions, tableDistributions, intl } = this.props;
    const { tabs: { distributions: { invalid } } } = this.validator;
    const { flashErrors } = this.state;

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
          tableDistributions={ tableDistributions }
          distributionType={ entry.distributionType }
          distributionTemplate={ entry.distributionTemplate }
          financialYearGroup={ entry.financialYearGroup }
          calculationBase={ entry.calculationBase }
          totalValue={ entry.totalValue }
          validator={ this.validator }
          editMode={ editMode }
          isLoading={ !editMode && isLoadingDistributions }
          recalculationType={ RECALCULATE_BUDGET_REQUEST_DISTRIBUTIONS }
          isNew={ isZeroId(budgetRequestId) }
          intl={ intl }
          flashErrors={ flashErrors }
        />
      </Form.Tab>
    );
  }

  renderTabs() {
    const { editMode } = this.props;
    return (
      <Form.Tabs active='details' validator={ this.validator } editMode={ editMode }>
        { this.renderDetailsTab() }
        { this.renderDistributionsTab() }
      </Form.Tabs>
    );
  }

  render() {
    const { editMode, entry, isLoading } = this.props;
    const { number, description, isSpecificRequest } = entry;
    const { invalid } = this.validator;
    const { flashErrors } = this.state;

    return (
      <div className='budget-request' ref={ (node) => { this.formNode = node; } }>
        <div className='budget-request__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='budget-request__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode } >
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='budget-request.title-colon' message={ this.getTitle(number, description) } />
                  { isSpecificRequest && <Form.InfoTitle intlId='budget-request.request-type-specific' /> }
                  { isSpecificRequest === false && <Form.InfoTitle intlId='budget-request.request-type-generated' />}
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { !editMode && !isLoading && <Form.Action type='delete' intlId='action.delete' onClick={ this.onDelete } /> }
                  { !editMode && <Form.Action type='edit' intlId='action.edit' onClick={ this.onEdit } /> }
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              { this.renderTabs() }
              { editMode &&
                <Form.FooterActions>
                  <Form.Action type='cancel' intlId='action.cancel' disabled={ isLoading } onClick={ this.onCancel } />
                  <Form.Action type='save' intlId='action.save' disabled={ isLoading } onClick={ this.onSave } validator={ this.validator } isLast />
                </Form.FooterActions>
              }
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }

}

export default injectIntl(
  connect(state => ({
    entry: state.budgetRequests.entry,
    scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
    year: state.scenario.selectedScenario.year,
    financialYearId: state.scenario.selectedScenario.yearId,
    isLoading: state.budgetRequests.isLoading,
    isLoadingDistributions: state.budgetRequests.isLoadingDistributions,
    prevBudgetRequestId: state.budgetRequests.budgetRequestId,
    digit2Options: getDigit2Options(state),
    digit1Options: getDigit1Options(state),
    isSuggestedHourlyRateExpanded: state.budgetRequests.isSuggestedHourlyRateExpanded,
    editMode: state.budgetRequests.editMode,
    metadata: state.budgetRequests.metadata,
    calculatedSuggestedHourlyRate: state.budgetRequests.calculatedSuggestedHourlyRate,
    validationErrors: state.budgetRequests.validationErrors,
    calculationBaseEntities: getEntitiesItems(state, CALCULATION_BASE_SECTION),
    scenarioId: state.scenario.selectedScenario.scenarioId,
    selectedModelRow: state.benefitsModel.selectedRow,
    tableDistributions: extractDistributions(state),
    isChamMode: state.budgetRequests.isChamMode,
  }), (dispatch) => bindActionCreators({
    getBudgetRequest,
    getBenefits,
    getBudgetRequestFte,
    toggleSuggestedHourlyRateExpand,
    editStart,
    editSave,
    editCancel,
    setEntry,
    deleteBudgetRequest,
    popupOpen,
    popupClose,
    panelOpen,
    panelClose,
    setTitle,
    editModeEnd,
    editModeStart,
    getBudgetRequestTotals,
    getSuggestedHourlyRate,
    requestRecalculatedDistributions,
  }, dispatch))(BudgetRequestBase));
