import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl } from 'react-intl';
import { get, map, find } from 'lodash';

import './distribution-expense-details.scss';

import { getHistory } from '../app/app';

import { fillSubEntry, FormValidator } from '../../utils/components/form-validator';
import {
  calculateSuggestedHourlyRate,
  isSuggestedHourlyRate,
} from '../../components/business/suggested-hourly-rate/suggested-hourly-rate';

import BenefitsModel from '../../components/business/benefits-model/benefits-model';
import Checkbox from '../../components/controls/checkbox';
import DistributionExpenseType from '../../components/dropdowns/distribution-expense-type';
import Field from '../../components/controls/field';
import Form from '../../components/general/form/form';
import HolidayGroup from '../../components/dropdowns/holiday-group';
import LongTermLeave from '../../components/dropdowns/long-term-leave';
import NatureOfExpense from '../../components/dropdowns/nature-of-expense';
import RadioButton from '../../components/controls/radio-button';
import SuggestedHourlyRateSection from '../../components/business/suggested-hourly-rate/suggested-hourly-rate-section';

import {
  calculateDistributionExpense,
  getEndpoint,
  getSuggestedHourlyRateForDistributionExpense,
  recalculateDistributionExpenseTotalToBeDistributed,
} from '../../api/actions';
import { deleteRequiredAttendanceDistribution, distributionsDetailClose } from './actions/required-attendances';
import {
  editCancel,
  editSave,
  editStart,
  copyStart,
  setEntry,
  toggleSuggestedHourlyRateExpand,
} from './actions/distribution-expense';
import { extractExpenseDistributionsTable } from './selectors/required-attendances';

import {
  buildDistributionExpenseRecalculationModel,
  buildDistributionTypeItems,
  buildExpenseDescription,
  buildValueToBeDistributedItems,
  DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP,
  DISTRIBUTION_EXPENSE_TYPE_MODEL,
  DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE,
  DISTRIBUTION_EXPENSE_TYPE_SPECIFIC,
  DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY,
  DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS,
  DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES,
  getTotalToBeDistributedLabel,
  isCalculationCheckboxEditable,
  isDistributionAmountEditable,
  isDistributionTypeModel,
  isDistributionTypeSpecific,
  isExpenseEditable,
  isHolidayGroupEditable,
  isHourlyFactorEditable,
  isLongTermLeaveEditable,
  isNatureEditable,
  isTotalToBeDistributedDisabled,
  isTotalToBeDistributedEditable,
  isValueToBeDistributedEditable,
  resetDistributions,
  setDistributionTemplate,
  expenseIsIndependentLabour,
  expenseIsGlobalPayrollDeduction,
  expenseIsOvertimeOrIndependentLabour,
  expenseIsVacationOrHolidayOrSickDayOrPsychLeave,
  expenseIsVacationOrHolidayOrSickDayOrIndependentLabour,
} from '../../entities/distribution';

import { panelClose, panelOpen, popupOpen } from '../../components/general/popup/actions';

import { getDigit2Options } from '../../utils/selectors/currency';
import { PopupActionKind } from '../../components/general/popup/constants';

import { isJobTitleType } from '../../entities/suggested-hourly-rate';

import ModalEventsHandler from '../../utils/components/modal-events-handler';

const formOptions = {
  tabs: {},
  fields: {
    distributions: {
      path: ['distributions'],
      metadata: 'Distributions',
      columns: [
        {
          path: ['periods', 'period'],
          id: 'period',
        },
        {
          path: ['periods', 'amount'],
          id: 'amount',
          metadata: ['Periods', 'children', 'Amount'],
          editable: isDistributionAmountEditable,
        },
      ],
    },
    distributionType: {
      path: ['distributionType'],
      metadata: 'DistributionType',
      mandatory: true,
    },
    distributionTemplate: {
      path: ['distributionTemplate'],
      tabId: 'distributions',
      mandatory: true,
      predicate: entry => isDistributionTypeModel(get(entry, 'distributionType')),
    },
    suggestedHourlyRate: {
      tabId: 'detail',
      path: ['suggestedHourlyRate'],
      metadata: 'SuggestedHourlyRate',
      mandatory: true,
      columns: [
        {
          path: ['suggestedHourlyRate'],
          id: 'suggestedHourlyRate',
          metadata: ['SuggestedHourlyRate'],
        },
        {
          path: ['rateOriginType'],
          id: 'rateOriginType',
        },
        {
          path: ['specificHourlyRate'],
          id: 'specificHourlyRate',
          mandatory: true,
          metadata: ['SpecificHourlyRate'],
          metadataDefault: {
            maxValue: 99999.99,
            minValue: 0,
          },
          predicate: (entry, instance) => (!isSuggestedHourlyRate(entry.suggestedHourlyRate.rateOriginType)),
        },
        {
          path: ['rateOriginFunctionalCenter'],
          id: 'rateOriginFunctionalCenter',
        },
        {
          path: ['jobGroup'],
          id: 'jobGroup',
        },
        {
          path: ['jobGroupType'],
          id: 'jobGroupType',
          metadata: ['JobGroupType'],
        },
        {
          path: ['jobLevel'],
          id: 'jobLevel',
        },
        {
          path: ['jobLevelType'],
          id: 'jobLevelType',
          metadata: ['JobLevelType'],
        },
      ],
    },
    holidayGroup: {
      path: ['holidayGroup'],
      metadata: 'HolidayGroup',
      mandatory: true,
      predicate: (entry) => isHolidayGroupEditable(get(entry, 'distributionType')),
    },
    longTermLeave: {
      path: ['longTermLeave'],
      metadata: 'LongTermLeave',
      mandatory: true,
      predicate: (entry) => isLongTermLeaveEditable(get(entry, 'expense.codeDescription')),
    },
    valueToBeDistributed: {
      path: ['valueToBeDistributed'],
      metadata: 'ValueToBeDistributed',
    },
    totalToBeDistributed: {
      path: ['totalToBeDistributed'],
      metadata: 'TotalToBeDistributed',
      mandatory: true,
      noZero: true,
      predicate: (entry) => (
        isTotalToBeDistributedEditable(get(entry, 'distributionType'))
        && !isTotalToBeDistributedDisabled(get(entry, 'expense.codeDescription'), get(entry, 'distributionType'))
      ),
    },
    hourlyFactor: {
      path: ['hourlyFactor'],
      metadata: 'HourlyFactor',
      mandatory: false,
      zeroToEmpty: true,
      metadataDefault: {
        maxValue: 99.99,
        minValue: 0,
      },
      predicate: (entry) => isHourlyFactorEditable(get(entry, 'distributionType')),
    },
    nature: {
      path: ['nature'],
      metadata: 'Nature',
      mandatory: true,
      predicate: (entry) => isNatureEditable(get(entry, 'distributionType')),
    },
    expense: {
      path: ['expense'],
      metadata: 'Expense',
      mandatory: true,
      predicate: (entry) => isExpenseEditable(get(entry, 'id')),
    },
    deductFromRegularHour: {
      path: ['deductFromRegularHour'],
    },
    calculationBenefit: {
      path: ['calculationBenefit'],
      predicate: (entry) => isCalculationCheckboxEditable(get(entry, 'expense.codeDescription')),
    },
    calculationPayroll: {
      path: ['calculationPayroll'],
      predicate: (entry) => isCalculationCheckboxEditable(get(entry, 'expense.codeDescription')),
    },
  },
};

defineMessages({
  expense: {
    id: 'distribution-expense.expense',
    defaultMessage: 'Expense:',
  },
  distributionType: {
    id: 'distribution-expense.distribution-type',
    defaultMessage: 'Distribution type:',
  },
  holidayGroup: {
    id: 'distribution-expense.holiday-group',
    defaultMessage: 'Holiday group:',
  },
  distributionModel: {
    id: 'distribution-expense.distribution-model',
    defaultMessage: 'Distribution model:',
  },
  longLeave: {
    id: 'distribution-expense.long-leave',
    defaultMessage: 'LT leave expense:',
  },
  deductFromRegularHours: {
    id: 'distribution-expense.deduct-from-regular-hours',
    defaultMessage: 'Deduct from reg. hours',
  },
  calculationBenefit: {
    id: 'distribution-expense.calculation-benefit',
    defaultMessage: 'Calculation of benefits',
  },
  calculationPayroll: {
    id: 'distribution-expense.calculation-payroll',
    defaultMessage: 'Calculation of payroll deduction',
  },
  hourlyfactor: {
    id: 'distribution-expense.hourly-factor',
    defaultMessage: 'Hourly factor:',
  },
  typeDistributionModel: {
    id: 'distribution-expense.distribution-type.distribution-model',
    defaultMessage: 'Distribution model',
  },
  typeSpecificSalue: {
    id: 'distribution-expense.distribution-type.specific-value',
    defaultMessage: 'Specific value',
  },
  typeHolidayGroup: {
    id: 'distribution-expense.distribution-type.holiday-group',
    defaultMessage: 'Holiday group',
  },
  typeNotApplicable: {
    id: 'distribution-expense.distribution-type.not-applicable',
    defaultMessage: 'Not applicable',
  },
  absenceFor: {
    id: 'distribution-expense.absence-for',
    defaultMessage: 'Absences for ...',
  },
  valueToBeDistributed: {
    id: 'distribution-expense.value-to-be-distributed',
    defaultMessage: 'Value to be distributed:',
  },
  hours: {
    id: 'distribution-expense.code-description.hours',
    defaultMessage: 'Hours',
  },
  percentages: {
    id: 'distribution-expense.code-description.percentages',
    defaultMessage: 'Percentages',
  },
  days: {
    id: 'distribution-expense.code-description.days',
    defaultMessage: 'Days',
  },
  totalToBeDistributed: {
    id: 'distribution-expense.total-to-be-distributed',
    defaultMessage: 'Total to be distributed:',
  },
  percentagesToBeDistributed: {
    id: 'distribution-expense.percentages-to-be-distributed',
    defaultMessage: 'Percentages:',
  },
  newDistribution: {
    id: 'distribution-expense.new-distribution',
    defaultMessage: 'New distribution',
  },
});

const DistributionTypeItems = {
  [DISTRIBUTION_EXPENSE_TYPE_MODEL]: {
    value: DISTRIBUTION_EXPENSE_TYPE_MODEL,
    id: 'model',
    intlId: 'distribution-expense.distribution-type.distribution-model',
  },
  [DISTRIBUTION_EXPENSE_TYPE_SPECIFIC]: {
    value: DISTRIBUTION_EXPENSE_TYPE_SPECIFIC,
    id: 'specific',
    intlId: 'distribution-expense.distribution-type.specific-value',
  },
  [DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP]: {
    value: DISTRIBUTION_EXPENSE_TYPE_HOLIDAY_GROUP,
    id: 'holidayGroup',
    intlId: 'distribution-expense.distribution-type.holiday-group',
  },
  [DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE]: {
    value: DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE,
    id: 'notApplicable',
    intlId: 'distribution-expense.distribution-type.not-applicable',
  },
};

const ValueToBeDistributedItems = {
  [DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS]: {
    value: DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS,
    id: 'hours',
    intlId: 'distribution-expense.code-description.hours',
  },
  [DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES]: {
    value: DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES,
    id: 'percentages',
    intlId: 'distribution-expense.code-description.percentages',
  },
  [DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY]: {
    value: DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY,
    id: 'days',
    intlId: 'distribution-expense.code-description.days',
  },
};

@connect(state => ({
  selectedDistributions: state.requiredAttendances.selectedDistributions,
  isLoadingDetails: state.distributionExpense.isLoadingDetails,
  isNew: state.distributionExpense.isNew,
  baseEntry: state.requiredAttendances.entry,
  entry: state.distributionExpense.entry,
  id: state.distributionExpense.id,
  financialYearId: state.scenario.selectedScenario.yearId,
  validationErrors: state.distributionExpense.validationErrors,
  editMode: state.distributionExpense.editMode,
  isSaving: state.distributionExpense.isSaving,
  distributionsTable: extractExpenseDistributionsTable(state),
  digit2Options: getDigit2Options(state),
  history: getHistory(),
  scenarioId: state.scenario.selectedScenario.scenarioId,
  requiredAttendanceId: state.requiredAttendances.requiredAttendanceId,
  selectedModel: state.benefitsModel.selectedRow,
  metadata: state.distributionExpense.metadata,
  isSuggestedHourlyRateExpanded: state.distributionExpense.isSuggestedHourlyRateExpanded,
  calculatedSuggestedHourlyRate: state.distributionExpense.calculatedSuggestedHourlyRate,
  previousValueToBeDistributed: state.distributionExpense.previousValueToBeDistributed,
}), (dispatch) => bindActionCreators({
  distributionsDetailClose,
  popupOpen,
  setEntry,
  editStart,
  editSave,
  copyStart,
  deleteRequiredAttendanceDistribution,
  panelOpen,
  toggleSuggestedHourlyRateExpand,
  recalculateDistributionExpenseTotalToBeDistributed,
  getSuggestedHourlyRateForDistributionExpense,
  calculateDistributionExpense,
}, dispatch))
class DistributionExpenseDetails extends Component {
  static propTypes = {
    recalculateDistributionExpenseTotalToBeDistributed: PropTypes.func,
    isLoadingDetails: PropTypes.bool,
    baseEntry: PropTypes.object,
    entry: PropTypes.object,
    id: PropTypes.number,
    financialYearId: PropTypes.number,
    editMode: PropTypes.bool,
    isSaving: PropTypes.bool,
    validationErrors: PropTypes.object,
    distributionsTable: PropTypes.object,
    selectedDistributions: PropTypes.object,
    digit2Options: PropTypes.object,
    scenarioId: PropTypes.number,
    requiredAttendanceId: PropTypes.number,
    selectedModel: PropTypes.object,
    metadata: PropTypes.object,
    isSuggestedHourlyRateExpanded: PropTypes.bool,
    calculatedSuggestedHourlyRate: PropTypes.number,
    previousValueToBeDistributed: PropTypes.number,
    copyStart: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);
    this.modalHandler = new ModalEventsHandler(this.getNode, {
      onClickOutside: this.onClickOutside,
      onWheelEvent: () => {},
    });
  }

  componentDidMount() {
    this.modalHandler.onMount();
  }

  componentWillUnmount() {
    this.modalHandler.onUnmount();
  }

  @autobind
  onClickOutside() {
    const { editMode } = this.props;
    if (editMode) {
      this.validator.confirmChangeRoute();
    }
  }

  @autobind
  getNode() {
    return this.formNode;
  }

  componentWillReceiveProps(props) {
    this.init(props);
  }

  init(props) {
    const { metadata, validationErrors, entry, editMode } = props;
    this.modalHandler.block(editMode);
    const { onChangeProps } = this.validator;
    onChangeProps({ editMode, metadata, validationErrors, entry });
  }

  @autobind
  onDetailsCloseClick() {
    this.props.distributionsDetailClose();
  }

  buildDistributionTypeList(isBenefitPercentage, expenseCodeDescription) {
    const list = buildDistributionTypeItems(isBenefitPercentage, expenseCodeDescription);
    return map(list, (type) => DistributionTypeItems[type]);
  }

  buildValueToBeDistributedList(expenseCodeDescription) {
    const list = buildValueToBeDistributedItems(expenseCodeDescription);
    return map(list, (type) => ValueToBeDistributedItems[type]);
  }

  @autobind
  onEdit() {
    const { editStart, id } = this.props;
    editStart(id);
    this.validator.onEdit(this);
  }

  @autobind
  onCopy() {
    const { copyStart, requiredAttendanceId, entry } = this.props;
    copyStart(requiredAttendanceId, entry);
  }

  @autobind
  onCancel() {
    const { id } = this.props;
    this.validator.onCancel(editCancel(id));
  }

  @autobind
  onSave() {
    if (this.validator.onSave(this)) {
      const { editSave, id } = this.props;
      editSave(id);
    }
  }

  @autobind
  onDelete() {
    const {
      popupOpen,
      entry,
      requiredAttendanceId,
      deleteRequiredAttendanceDistribution,
      scenarioId,
    } = this.props;
    const args = {
      ...entry,
      requiredAttendanceId,
      scenarioId,
    };
    popupOpen({
      style: 'confirm',
      message: this.props.intl.formatMessage({ id: 'required-attendance.delete-distributions-confirmation' }),
      actions: [
        { kind: 'cancel' },
        { kind: 'delete', func: deleteRequiredAttendanceDistribution, arg: args },
      ],
    });
  }

  @autobind
  onDistributionTemplateOk() {
    const { selectedModel } = this.props;
    const model = { ...selectedModel };
    this.onChangeDistributionTemplate(model);
  }

  @autobind
  onClickDistributionTemplate() {
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
    this.onChangeDistributionTemplate({});
  }

  @autobind
  onChangeDistributionTemplate(distributionTemplate) {
    const { entry, setEntry } = this.props;
    const newEntry = { ...entry };
    setDistributionTemplate(newEntry, distributionTemplate);
    setEntry(newEntry);
    this.calculateDistributions({ distributionTemplate });
  }

  @autobind
  buildDistributionsModel(context = {}) {
    const {
      entry,
      financialYearId,
    } = this.props;
    return buildDistributionExpenseRecalculationModel(financialYearId, entry, context);
  }

  @autobind
  calculateDistributions(context = {}) {
    const data = this.buildDistributionsModel(context);

    this.props.calculateDistributionExpense(data);
  }

  setNotApplicableDistributionType(newEntry) {
    newEntry.distributionType = DISTRIBUTION_EXPENSE_TYPE_NOT_APPLICABLE;
    newEntry.holidayGroup = {};
  }

  @autobind
  onChangeExpense(expense) {
    const { entry, setEntry, recalculateDistributionExpenseTotalToBeDistributed, previousValueToBeDistributed, requiredAttendanceId, baseEntry } = this.props;
    const newEntry = { ...entry, expense, previousValueToBeDistributed };
    const { benefit: { showPercentage: isBenefitPercentage } } = baseEntry;
    if (expense && expense.codeDescription) {
      if (expenseIsVacationOrHolidayOrSickDayOrPsychLeave(expense.codeDescription)) {
        if (isBenefitPercentage) {
          newEntry.valueToBeDistributed = DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES;
        } else {
          newEntry.valueToBeDistributed = DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_DAY;
        }
      } else if (expenseIsGlobalPayrollDeduction(expense.codeDescription)) {
        newEntry.valueToBeDistributed = DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_PERCENTAGES;
      } else {
        newEntry.valueToBeDistributed = DISTRIBUTION_VALUE_TO_BE_DISTRIBUTED_HOURS;
      }
      newEntry.deductFromRegularHour = expenseIsOvertimeOrIndependentLabour(expense.codeDescription);
      newEntry.calculationBenefit = expenseIsIndependentLabour(expense.codeDescription);
      newEntry.calculationPayroll = expenseIsVacationOrHolidayOrSickDayOrIndependentLabour(expense.codeDescription);

      // check that selected distribution type is accessible from Distribution type items, set to NOT APPLICABLE if it's not
      if (newEntry.distributionType) {
        const distributionTypeList = this.buildDistributionTypeList(isBenefitPercentage, expense.codeDescription);
        const isSelectedDistributionTypeAvailable = find(distributionTypeList, item => item.value === newEntry.distributionType);
        if (!isSelectedDistributionTypeAvailable) {
          this.setNotApplicableDistributionType(newEntry);
        }
      }
    } else {
      // no distribution expense selected
      this.setNotApplicableDistributionType(newEntry);
    }

    setEntry(newEntry);
    recalculateDistributionExpenseTotalToBeDistributed(newEntry, requiredAttendanceId);
  }

  @autobind
  onChangeDistributionType(distributionType) {
    const { entry, setEntry, recalculateDistributionExpenseTotalToBeDistributed, previousValueToBeDistributed, requiredAttendanceId } = this.props;
    const newEntry = { ...entry, distributionType, previousValueToBeDistributed };
    if (!isDistributionTypeModel(distributionType)) {
      setDistributionTemplate(newEntry, {});
    }
    if (!isHolidayGroupEditable(distributionType)) {
      newEntry.holidayGroup = {};
    }
    if (!isHourlyFactorEditable(distributionType)) {
      newEntry.hourlyFactor = '';
    }
    if (!isNatureEditable(distributionType)) {
      newEntry.nature = {};
    }
    if (isDistributionTypeSpecific(distributionType)) {
      resetDistributions(newEntry.distributions);
    }

    setEntry(newEntry);

    recalculateDistributionExpenseTotalToBeDistributed(newEntry, requiredAttendanceId);
  }

  @autobind
  onChangeHolidayGroup() {
    const { entry, requiredAttendanceId, recalculateDistributionExpenseTotalToBeDistributed, previousValueToBeDistributed } = this.props;
    const newEntry = { ...entry, previousValueToBeDistributed };

    recalculateDistributionExpenseTotalToBeDistributed(newEntry, requiredAttendanceId);
  }

  @autobind
  onChangeValueToBeDistributed() {
    const { entry, requiredAttendanceId, recalculateDistributionExpenseTotalToBeDistributed, previousValueToBeDistributed } = this.props;
    const newEntry = { ...entry, previousValueToBeDistributed };

    recalculateDistributionExpenseTotalToBeDistributed(newEntry, requiredAttendanceId);
  }

  @autobind
  onDistributionsChange() {
    const { entry: { distributionType } } = this.props;
    if (isDistributionTypeSpecific(distributionType)) {
      this.calculateDistributions();
    }
  }

  @autobind
  calculateSuggestedHourlyRate(rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue) {
    const { getSuggestedHourlyRateForDistributionExpense, scenarioId, financialYearId, baseEntry, entry: { suggestedHourlyRate } } = this.props;
    const { fields } = this.validator;
    const { metadata } = fields.suggestedHourlyRate.columns.suggestedHourlyRate;
    const url = getEndpoint(metadata);
    const {
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      groupType,
    } = baseEntry;

    const context = {
      getSuggestedHourlyRate: getSuggestedHourlyRateForDistributionExpense,
      url,
      scenarioId,
      financialYearId,
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      groupType,
      suggestedHourlyRate,
      originType: 'RequiredAttendance',
      requestType: undefined,
    };
    calculateSuggestedHourlyRate(context, rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue);
  }

  @autobind
  onChangeSuggestedSpecificHourlyRate(newSuggestedHourlyRate, value) {
    const { setEntry, entry } = this.props;
    setEntry(fillSubEntry(entry, 'suggestedHourlyRate', newSuggestedHourlyRate));
  }

  @autobind
  getTitle() {
    const { isNew, selectedDistributions, intl } = this.props;
    return isNew
      ? intl.formatMessage({ id: 'distribution-expense.new-distribution' })
      : get(selectedDistributions, 'expense.longDescription');
  }

  render() {
    const {
      entry,
      baseEntry,
      isLoadingDetails,
      distributionsTable,
      editMode,
      isSaving,
      intl,
      digit2Options,
      isSuggestedHourlyRateExpanded,
      toggleSuggestedHourlyRateExpand,
      calculatedSuggestedHourlyRate,
    } = this.props;
    const {
      id,
      expense = {},
      holidayGroup,
      distributionTemplate: { number: modelShortDescription, name: modelLongDescription },
      longTermLeave,
      nature,
      hourlyFactor,
      deductFromRegularHour,
      calculationBenefit,
      calculationPayroll,
      distributionType,
      totalToBeDistributed,
      valueToBeDistributed,
      suggestedHourlyRate,
    } = entry;
    const { longDescription: expenseLongDescription, codeDescription: expenseCodeDescription } = expense;
    const {
      benefit: {
        showPercentage: isBenefitPercentage,
      },
      functionalCenter,
      groupType,
      jobTitle,
    } = baseEntry;
    const { invalid, fields } = this.validator;
    const { flashErrors } = this.state;

    const isJobTitle = isJobTitleType(groupType);
    const description = this.getTitle();

    return (
      <div className='distribution-expense-details' ref={ (node) => { this.formNode = node; } }>

        <Form
          invalid={ invalid }
          flashErrors={ flashErrors }
          editMode
        >
          <Form.Actions>
            <Form.ActionsLeft>
              <Form.Title
                message={ description }
              />
            </Form.ActionsLeft>
            <Form.ActionsRight>
              { !editMode && !isLoadingDetails && <Form.Action type='copy' intlId='action.copy' onClick={ this.onCopy } /> }
              { !editMode && !isLoadingDetails && <Form.Action type='delete' intlId='action.delete' onClick={ this.onDelete } /> }
              { !editMode && !isLoadingDetails && <Form.Action type='edit' intlId='action.edit' onClick={ this.onEdit } /> }
              { !editMode && <div className='distribution-expense-details__close' onClick={ this.onDetailsCloseClick } /> }
            </Form.ActionsRight>
          </Form.Actions>

          <div className='distribution-expense-details__body'>
            <div className='distribution-expense-details__left'>
              <Form.Row noTopMargin>
                <Form.Column2>
                  <DistributionExpenseType
                    editMode={ editMode && isExpenseEditable(id) }
                    validator={ fields.expense }
                    value={ expense }
                    flashErrors={ flashErrors }
                    onChange={ this.onChangeExpense }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Info value={ buildExpenseDescription(intl, {
                    isBenefitPercentage,
                    expenseCodeDescription,
                    valueToBeDistributed,
                    expenseLongDescription,
                  }) }
                  />
                </Form.Column2>
              </Form.Row>
              <Form.Separator />
              <Form.Row>
                <Form.Column4>
                  <RadioButton
                    value={ distributionType }
                    editMode={ editMode }
                    className='distribution-expense-details__radio-section'
                    verticalAligned
                    labelIntlId='distribution-expense.distribution-type'
                    values={ this.buildDistributionTypeList(isBenefitPercentage, expenseCodeDescription) }
                    onChange={ this.onChangeDistributionType }
                  />
                </Form.Column4>
              </Form.Row>
              <Form.Separator />
              <Form.Row>
                <Form.Column2>
                  <HolidayGroup
                    editMode={ editMode }
                    validator={ fields.holidayGroup }
                    value={ holidayGroup }
                    labelIntlId='distribution-expense.holiday-group'
                    flashErrors={ flashErrors }
                    disabled={ editMode && !isHolidayGroupEditable(distributionType) }
                    onChange={ this.onChangeHolidayGroup }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Info value={ holidayGroup && holidayGroup.description } />
                </Form.Column2>
              </Form.Row>
              <Form.Row>
                <Form.Column2>
                  <Field.InputSearch
                    editMode={ editMode }
                    value={ modelShortDescription }
                    validator={ fields.distributionTemplate }
                    fieldName='distributionTemplate'
                    onClick={ this.onClickDistributionTemplate }
                    onClear={ this.onClearDistributionTemplate }
                    labelIntlId='distribution-expense.distribution-model'
                    disabled={ editMode && !isDistributionTypeModel(distributionType) }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Info value={ modelLongDescription } />
                </Form.Column2>
              </Form.Row>
              <Form.Row>
                <Form.Column2>
                  <LongTermLeave
                    editMode={ editMode }
                    validator={ fields.longTermLeave }
                    value={ longTermLeave }
                    labelIntlId='distribution-expense.long-leave'
                    flashErrors={ flashErrors }
                    disabled={ editMode && !isLongTermLeaveEditable(expenseCodeDescription) }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Info value={ longTermLeave && longTermLeave.description } />
                </Form.Column2>
              </Form.Row>
              <Form.Separator />
              <Form.Row>
                <Form.Column2>
                  <RadioButton
                    value={ valueToBeDistributed }
                    validator={ fields.valueToBeDistributed }
                    editMode={ editMode }
                    className='distribution-expense-details__radio-section'
                    verticalAligned
                    labelIntlId='distribution-expense.value-to-be-distributed'
                    values={ this.buildValueToBeDistributedList(expenseCodeDescription) }
                    disabled={ editMode && !isValueToBeDistributedEditable(isBenefitPercentage, expenseCodeDescription) }
                    onChange={ this.onChangeValueToBeDistributed }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Checkbox
                    value={ deductFromRegularHour }
                    validator={ fields.deductFromRegularHour }
                    labelIntlId='distribution-expense.deduct-from-regular-hours'
                    editMode={ editMode }
                    single
                    vertical
                  />
                  <Checkbox
                    value={ calculationBenefit }
                    validator={ fields.calculationBenefit }
                    labelIntlId='distribution-expense.calculation-benefit'
                    disabled={ editMode && !isCalculationCheckboxEditable(expenseCodeDescription) }
                    editMode={ editMode }
                    single
                    vertical
                  />
                  <Checkbox
                    value={ calculationPayroll }
                    validator={ fields.calculationPayroll }
                    labelIntlId='distribution-expense.calculation-payroll'
                    disabled={ editMode && !isCalculationCheckboxEditable(expenseCodeDescription) }
                    editMode={ editMode }
                    single
                    vertical
                  />
                </Form.Column2>
              </Form.Row>
              <Form.Separator />
              <Form.Row>
                <Form.Column2>
                  <Field.Number2
                    value={ totalToBeDistributed }
                    validator={ fields.totalToBeDistributed }
                    editMode={ editMode }
                    disabled={ editMode && isTotalToBeDistributedDisabled(expenseCodeDescription, distributionType) }
                    labelIntlId={ getTotalToBeDistributedLabel(valueToBeDistributed) }
                    flashErrors={ flashErrors }
                    onChange={ this.calculateDistributions }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Number2
                    value={ hourlyFactor }
                    validator={ fields.hourlyFactor }
                    editMode={ editMode }
                    disabled={ editMode && !isHourlyFactorEditable(distributionType) }
                    labelIntlId='distribution-expense.hourly-factor'
                    flashErrors={ flashErrors }
                  />
                </Form.Column2>
              </Form.Row>
              <Form.Row>
                <Form.Column2>
                  <NatureOfExpense
                    editMode={ editMode }
                    validator={ fields.nature }
                    value={ nature }
                    flashErrors={ flashErrors }
                    disabled={ editMode && !isNatureEditable(distributionType) }
                  />
                </Form.Column2>
                <Form.Column2>
                  <Field.Info value={ nature && nature.longDescription } />
                </Form.Column2>
              </Form.Row>
              <Form.Separator />
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
                wide
              />
            </div>
            <div className='distribution-expense-details__right'>
              <Form.Grid
                entry={ entry }
                editMode={ editMode }
                rows={ distributionsTable.rows }
                columns={ distributionsTable.columns }
                isLoading={ isLoadingDetails }
                canRemoveRow={ false }
                canAddRow={ false }
                validator={ fields.distributions }
                onChangeValue={ this.onDistributionsChange }
              />
            </div>
          </div>
          <Form.FooterActions>
            { editMode && <Form.Action type='cancel' disabled={ isSaving } intlId='action.cancel' onClick={ this.onCancel } /> }
            { editMode && <Form.Action type='save' disabled={ isSaving } intlId='action.save' onClick={ this.onSave } validator={ this.validator } isLast /> }
          </Form.FooterActions>
        </Form>
      </div>
    );
  }
}

export default injectIntl(DistributionExpenseDetails);
