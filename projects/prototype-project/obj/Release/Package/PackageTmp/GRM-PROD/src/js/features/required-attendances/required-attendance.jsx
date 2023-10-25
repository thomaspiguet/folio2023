import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';
import { get, isEmpty } from 'lodash';
import fillDefaults from 'json-schema-fill-defaults';

import { fillSubEntry, FormValidator } from '../../utils/components/form-validator';
import ReadOnlyDeleteValidator from '../../utils/components/read-only-delete-validator';

import { ScrollBox } from '../../components/general/scroll-box';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import RadioButton from '../../components/controls/radio-button';
import FunctionalCenter from '../../components/dropdowns/functional-center';
import GroupType from '../../components/dropdowns/group-type';
import JobTitle from '../../components/dropdowns/job-title';
import JobTitleGroup from '../../components/dropdowns/job-title-group';
import JobType from '../../components/dropdowns/job-type';
import JobStatus from '../../components/dropdowns/job-status';
import Union from '../../components/dropdowns/union';
import GlobalPayrollDeduction from '../../components/dropdowns/global-payroll-deduction';
import PayrollDeduction from '../../components/dropdowns/payroll-deduction';
import DistributionExpense from './distribution-expense';

import { popupOpen } from '../../components/general/popup/actions';
import { editModeEnd, editModeStart } from '../app/actions';

import {
  getBenefitsDays,
  getBenefitsPercentages,
  getDistributionsList,
  getEndpoint,
  getRequiredAttendance,
  getSuggestedHourlyRate,
  postTotalHoursCalculation,
} from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import {
  deleteRequiredAttendance,
  deleteRequiredAttendanceDistribution,
  editCancel,
  editContinue,
  editSave,
  editStart,
  copyStart,
  setEntry,
  toggleOriginOfReplacementsExpand,
  toggleSuggestedHourlyRateExpand,
} from './actions/required-attendances';
import { createDistributionExpense } from './actions/distribution-expense';
import {
  formatDigits,
  formatNumber,
  getDigit0Options,
  getDigit1Options,
  getDigit2Options,
  unformatNumber,
} from '../../utils/selectors/currency';
import {
  extractDistributionsSelector,
  extractOriginReplacementsSelector,
  extractPremiumsSelector,
  extractReplacementsSelector,
  extractSchedulesSelector,
  extractTemporaryClosuresSelector,
} from './selectors/required-attendances';

import { codeDescriptionSchema } from '../../entities/code-description';

import { jobTitleSchema } from '../../entities/job-title';
import { numberSchema, stringSchema } from '../../entities/base';
import { benefitsSchema } from '../../entities/benefits';
import { levelsSchema } from '../../entities/levels';
import { premiumsSchema } from '../../entities/premiums';
import { replacementsSchema } from '../../entities/replacements';
import { schedulesSchema } from '../../entities/schedule';
import { temporaryClosuresSchema } from '../../entities/temporary-closures';

import './required-attendances.scss';
import '../../../styles/content-gradient.scss';
import '../employees/employee.scss';

import {
  calculateSuggestedHourlyRate,
  isSuggestedHourlyRate,
} from '../../components/business/suggested-hourly-rate/suggested-hourly-rate';
import { OriginReplacements } from './origin-of-replacements';

import { titleIcon } from './constants';
import { isSpecificHoursPerDay } from '../../entities/required-attendance';

import { isJobTitleType } from '../../entities/suggested-hourly-rate';
import { routes } from '../app/app';
import { addScenarioAndIdToRoute, addScenarioIdToRoute, isZeroId } from '../../utils/utils';

import SuggestedHourlyRateSection from '../../components/business/suggested-hourly-rate/suggested-hourly-rate-section';
import {
  HoursPerDaySection,
  predicateHoursPerDaySelected,
  predicateHoursPerDaySpecific,
} from './hours-per-day-section';

const formOptions = {
  tabs: {
    detail: {},
    benefits: {},
    levels: {},
    premiums: {},
    replacements: {},
    schedules: {},
    temporaryClosures: {},
    payrollDeductions: {},
  },
  fields: {
    payrollDeduction: {
      path: ['payrollDeduction', 'specificParameters'],
      schema: codeDescriptionSchema,
      tabId: 'payrollDeductions',
      metadata: 'PayrollDeduction',
      columns: [
        {
          id: 'CanadaPensionPlan',
          path: ['CanadaPensionPlan'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
        {
          id: 'WorkersCompensationBoard',
          path: ['WorkersCompensationBoard'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
        {
          id: 'HealthCarePlan',
          path: ['HealthCarePlan'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
        {
          id: 'EmploymentInsurance',
          path: ['EmploymentInsurance'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
        {
          id: 'PensionPlan',
          path: ['PensionPlan'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
        {
          id: 'QuebecParentalInsurancePlan',
          path: ['QuebecParentalInsurancePlan'],
          schema: codeDescriptionSchema,
          metadata: ['SpecificParameters'],
        },
      ],
    },
    globalPayrollDeduction: {
      path: ['globalPayrollDeduction'],
      schema: codeDescriptionSchema,
      tabId: 'payrollDeductions',
      metadata: 'GlobalPayrollDeduction',
    },
    isSpecificPayrollDeduction: {
      path: ['isSpecificPayrollDeduction'],
      tabId: 'payrollDeductions',
    },
    specificPayrollDeductions: {
      path: ['payrollDeduction', 'specificPayrollDeductions'],
      tabId: 'payrollDeductions',
    },
    calculateTaxableAmaunt: {
      path: ['payrollDeduction', 'calculateTaxableAmaunt'],
      tabId: 'payrollDeductions',
    },
    specificAmount: {
      path: ['payrollDeduction', 'specificAmount'],
      tabId: 'payrollDeductions',
      metadata: ['PayrollDeduction', 'SpecificAmount'],
      mandatory: true,
      predicate: entry => (!get(entry, 'payrollDeduction.calculateTaxableAmaunt')),
    },
    functionalCenter: {
      path: ['functionalCenter'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'FunctionalCenter',
    },
    reference: {
      path: ['code'],
      mandatory: true,
      schema: stringSchema,
      tabId: 'detail',
      metadata: 'Code',
    },
    description: {
      path: ['description'],
      mandatory: true,
      schema: stringSchema,
      tabId: 'detail',
      metadata: 'Description',
    },
    type: {
      path: ['groupType'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'GroupType',
    },
    hoursPer2Weeks: {
      path: ['hoursPer2Weeks'],
      mandatory: false,
      schema: numberSchema,
      tabId: 'detail',
    },
    jobTitleGroup: {
      path: ['jobTitleGroup'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobTitleGroup',
      itemValue: 'shortDescription',
      predicate: entry => get(entry, 'groupType.code') === '1',
    },
    jobTitle: {
      path: ['jobTitle'],
      mandatory: true,
      schema: jobTitleSchema,
      tabId: 'detail',
      metadata: 'JobTitle',
      itemValue: 'description',
      predicate: entry => get(entry, 'groupType.code') === '0',
    },
    jobType: {
      path: ['jobType'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobType',
    },
    jobStatus: {
      path: ['jobStatus'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'JobStatus',
    },
    union: {
      path: ['union'],
      mandatory: true,
      schema: codeDescriptionSchema,
      tabId: 'detail',
      metadata: 'Union',
      predicate: entry => get(entry, 'jobType.code') === '2',
    },
    showPercentage: {
      path: ['benefit', 'showPercentage'],
      tabId: 'benefits',
    },
    isSpecificToThisScenario: {
      path: ['isSpecificToThisScenario'],
      tabId: 'detail',
    },
    isHoursCalculationOnly: {
      path: ['isHoursCalculationOnly'],
      tabId: 'detail',
    },
    isFinancialYear: {
      path: ['duration', 'isFinancialYear'],
      tabId: 'detail',
    },
    startDate: {
      path: ['duration', 'startDate'],
      schema: stringSchema,
      tabId: 'detail',
      metadata: 'StartDate',
      endDate: 'endDate',
      isDate: true,
      mandatory: true,
      predicate: entry => get(entry, 'duration.isFinancialYear') === false && isEmpty(get(entry, 'duration.endDate')),
    },
    endDate: {
      path: ['duration', 'endDate'],
      schema: stringSchema,
      tabId: 'detail',
      metadata: 'EndDate',
      isDate: true,
      mandatory: true,
      predicate: entry => get(entry, 'duration.isFinancialYear') === false && isEmpty(get(entry, 'duration.startDate')),
    },
    premiums: {
      path: ['premiums'],
      tabId: 'premiums',
      schema: premiumsSchema,
      confirmDeleteRow: true,
      metadata: 'Premiums',
      columns: [
        {
          path: ['premium'],
          errorPath: ['premium', 'code'],
          id: 'premium',
          mandatory: true,
          metadata: 'Premium',
          itemValue: 'code',
          isUniq: true,
          uniqIntlId: 'required-attendance.premium-exist',
        },
        {
          path: ['start'],
          id: 'start',
          mandatory: true,
          metadata: 'Start',
          endDate: 'end',
        },
        {
          path: ['end'],
          id: 'end',
          metadata: 'End',
        },
        {
          path: ['isInconvenient'],
          id: 'isInconvenient',
        },
      ],
    },
    benefits: {
      path: ['benefit'],
      tabId: 'benefits',
      schema: benefitsSchema,
      metadata: 'Benefit',
      columns: [
        {
          path: ['qtyVacation'],
          id: 'qtyVacation',
          tabId: 'benefits',
          metadata: 'QtyVacation',
        },
        {
          path: ['qtyHoliday'],
          id: 'qtyHoliday',
          tabId: 'benefits',
          metadata: 'QtyHoliday',
        },
        {
          path: ['qtySickDay'],
          id: 'qtySickDay',
          tabId: 'benefits',
          metadata: 'QtySickDay',
        },
        {
          path: ['qtyPsychiatricLeave'],
          id: 'qtyPsychiatricLeave',
          tabId: 'benefits',
          metadata: 'QtyPsychiatricLeave',
        },
        {
          path: ['qtyNightShift'],
          id: 'qtyNightShift',
          tabId: 'benefits',
          metadata: 'QtyNightShift',
        },
        {
          path: ['pctVacation'],
          id: 'pctVacation',
          tabId: 'benefits',
          metadata: 'PctVacation',
        },
        {
          path: ['pctHoliday'],
          id: 'pctHoliday',
          tabId: 'benefits',
          metadata: 'PctHoliday',
        },
        {
          path: ['pctSickDay'],
          id: 'pctSickDay',
          tabId: 'benefits',
          metadata: 'PctSickDay',
        },
        {
          path: ['pctPsychiatricLeave'],
          id: 'pctPsychiatricLeave',
          tabId: 'benefits',
          metadata: 'PctPsychiatricLeave',
        },
        {
          path: ['pctNightShift'],
          id: 'pctNightShift',
          tabId: 'benefits',
          metadata: 'PctNightShift',
        },
      ],
    },
    replacements: {
      path: ['replacements'],
      tabId: 'replacements',
      schema: replacementsSchema,
      confirmDeleteRow: true,
      metadata: 'Replacements',
      columns: [
        {
          path: ['expenseType'],
          id: 'expenseType',
          mandatory: true,
          metadata: 'ExpenseType',
          itemValue: 'code',
          isUniq: true,
          uniqIntlId: 'required-attendance.replacements-type-exist',
        },
        {
          path: ['percentage'],
          id: 'percentage',
          metadata: 'Percentage',
          mandatory: true,
        },
      ],
    },
    level: {
      path: ['level'],
      tabId: 'levels',
      schema: levelsSchema,
      metadata: 'Level',
      mandatory: true,
      columns: [
        {
          path: ['suggestedHourlyRate', 'rateOriginType'],
          id: 'rateOriginType',
        },
        {
          path: ['hoursPerDaySelected'],
          id: 'hoursPerDaySelected',
          mandatory: true,
          predicate: ({ groupType, level: { hoursPerDaySelected, specificHoursPerDay } }) => predicateHoursPerDaySelected(groupType, hoursPerDaySelected, specificHoursPerDay),
          metadata: 'HoursPerDaySelected',
        },
        {
          path: ['specificHoursPerDay'],
          id: 'specificHoursPerDay',
          mandatory: true,
          metadata: 'SpecificHoursPerDay',
          predicate: ({ groupType, level: { hoursPerDaySelected, specificHoursPerDay } }) => predicateHoursPerDaySpecific(groupType, hoursPerDaySelected, specificHoursPerDay),
        },
        {
          path: ['fullTimeEquivalent'],
          id: 'fullTimeEquivalent',
        },
        {
          path: ['suggestedHourlyRate', 'suggestedHourlyRate'],
          id: 'suggestedHourlyRate',
          metadata: ['SuggestedHourlyRate', 'children', 'SuggestedHourlyRate'],
        },
        {
          path: ['suggestedHourlyRate', 'specificHourlyRate'],
          id: 'specificHourlyRate',
          mandatory: true,
          predicate: (entry, instance) => (!isSuggestedHourlyRate(get(entry, 'level.suggestedHourlyRate.rateOriginType'))),
        },
        {
          path: ['suggestedHourlyRate', 'rateOriginFunctionalCenter'],
          id: 'rateOriginFunctionalCenter',
        },
        {
          path: ['totalHours'],
          id: 'totalHours',
          metadata: 'TotalHours',
        },
        {
          path: ['suggestedHourlyRate', 'jobGroup'],
          id: 'jobGroup',
        },
        {
          path: ['suggestedHourlyRate', 'jobGroupType'],
          id: 'jobGroupType',
          metadata: ['SuggestedHourlyRate', 'children', 'JobGroupType'],
        },
        {
          path: ['suggestedHourlyRate', 'jobLevel'],
          id: 'jobLevel',
        },
        {
          path: ['suggestedHourlyRate', 'jobLevelType'],
          id: 'jobLevelType',
          metadata: ['SuggestedHourlyRate', 'children', 'JobLevelType'],
        },
      ],
    },
    schedules: {
      path: ['schedules'],
      tabId: 'schedules',
      schema: schedulesSchema,
      confirmDeleteRow: true,
      metadata: 'Schedules',
      columns: [
        {
          path: ['shift'],
          id: 'shift',
          metadata: 'Shift',
          isUniq: true,
          uniqIntlId: 'required-attendance.work-shift-exist',
        },
        {
          path: ['week', 'Sunday', 'workLoad'],
          id: 'sunday',
          metadata: ['Week', 'children', 'Sunday', 'children', 'WorkLoad'],
        },
        {
          path: ['week', 'Monday', 'workLoad'],
          metadata: ['Week', 'children', 'Monday', 'children', 'WorkLoad'],
          id: 'monday',
        },
        {
          path: ['week', 'Tuesday', 'workLoad'],
          metadata: ['Week', 'children', 'Tuesday', 'children', 'WorkLoad'],
          id: 'tuesday',
        },
        {
          path: ['week', 'Wednesday', 'workLoad'],
          metadata: ['Week', 'children', 'Wednesday', 'children', 'WorkLoad'],
          id: 'wednesday',
        },
        {
          path: ['week', 'Thursday', 'workLoad'],
          metadata: ['Week', 'children', 'Thursday', 'children', 'WorkLoad'],
          id: 'thursday',
        },
        {
          path: ['week', 'Friday', 'workLoad'],
          metadata: ['Week', 'children', 'Friday', 'children', 'WorkLoad'],
          id: 'friday',
        },
        {
          path: ['week', 'Saturday', 'workLoad'],
          metadata: ['Week', 'children', 'Saturday', 'children', 'WorkLoad'],
          id: 'saturday',
        },
        {
          path: ['otherLeave1'],
          metadata: 'OtherLeave1',
          id: 'otherLeave1',
        },
        {
          path: ['otherLeave2'],
          metadata: 'OtherLeave2',
          id: 'otherLeave2',
        },
        {
          path: ['otherLeave3'],
          metadata: 'OtherLeave3',
          id: 'otherLeave3',
        },
      ],
    },
    temporaryClosures: {
      path: ['temporaryClosures'],
      tabId: 'temporaryClosures',
      schema: temporaryClosuresSchema,
      confirmDeleteRow: true,
      metadata: 'TemporaryClosures',
      columns: [
        {
          path: ['sequence'],
          id: 'sequence',
          metadata: 'Sequence',
          isUniq: true,
          mandatory: true,
          uniqIntlId: 'required-attendance.sequence-exist',
        },
        {
          path: ['workShift'],
          id: 'workShift',
          metadata: 'WorkShift',
          clearError: ['startDate', 'endDate'],
        },
        {
          path: ['startDate'],
          id: 'startDate',
          mandatory: true,
          metadata: 'StartDate',
          endDate: 'endDate',
        },
        {
          path: ['endDate'],
          id: 'endDate',
          mandatory: true,
          metadata: 'EndDate',
        },
        {
          path: ['nbDayForSunday'],
          id: 'sunday',
          metadata: ['nbDayForSunday'],
        },
        {
          path: ['nbDayForMonday'],
          metadata: ['nbDayForMonday'],
          id: 'monday',
        },
        {
          path: ['nbDayForTuesday'],
          metadata: ['nbDayForTuesday'],
          id: 'tuesday',
        },
        {
          path: ['nbDayForWednesday'],
          metadata: ['nbDayForWednesday'],
          id: 'wednesday',
        },
        {
          path: ['nbDayForThursday'],
          metadata: ['nbDayForThursday'],
          id: 'thursday',
        },
        {
          path: ['nbDayForFriday'],
          metadata: ['nbDayForFriday'],
          id: 'friday',
        },
        {
          path: ['nbDayForSaturday'],
          metadata: ['nbDayForSaturday'],
          id: 'saturday',
        },
      ],
    },
  },
};

@connect(state => ({
  entry: state.requiredAttendances.entry,
  oldEntry: state.requiredAttendances.oldEntry,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  scenarioId: state.scenario.selectedScenario.scenarioId,
  year: state.scenario.selectedScenario.year,
  menuExpanded: state.sideMenu.menuExpanded,
  financialYearId: state.scenario.selectedScenario.yearId,
  isLoading: state.requiredAttendances.isLoading,
  isDeleting: state.requiredAttendances.isDeleting,
  isLoadingOriginReplacements: state.requiredAttendances.isLoadingOriginReplacements,
  isLoadingDistributionsList: state.requiredAttendances.isLoadingDistributionsList,
  prevRequiredAttendanceId: state.requiredAttendances.requiredAttendanceId,
  digit2Options: getDigit2Options(state),
  digit1Options: getDigit1Options(state),
  digit0Options: getDigit0Options(state),
  isSuggestedHourlyRateExpanded: state.requiredAttendances.isSuggestedHourlyRateExpanded,
  isOriginOfReplacementsExpanded: state.requiredAttendances.isOriginOfReplacementsExpanded,

  distributionsTable: extractDistributionsSelector(state),
  distributions: state.requiredAttendances.distributions,
  originReplacements: extractOriginReplacementsSelector(state),
  premiums: extractPremiumsSelector(state),
  replacements: extractReplacementsSelector(state),
  schedules: extractSchedulesSelector(state),
  temporaryClosures: extractTemporaryClosuresSelector(state),

  editMode: state.requiredAttendances.editMode,
  metadata: state.requiredAttendances.metadata,
  validationErrors: state.requiredAttendances.validationErrors,
  suggestedHourlyRate: state.requiredAttendances.suggestedHourlyRate,
  durationYears: state.scenario.durationYears,

  isMasterDetailViewActive: state.distributionExpense.isMasterDetailViewActive,
}), (dispatch) => bindActionCreators({
  getRequiredAttendance,
  getDistributionsList,
  toggleSuggestedHourlyRateExpand,
  toggleOriginOfReplacementsExpand,
  editStart,
  editSave,
  setEntry,
  deleteRequiredAttendance,
  popupOpen,
  editCancel,
  postTotalHoursCalculation,
  getBenefitsDays,
  getBenefitsPercentages,
  getSuggestedHourlyRate,
  setTitle,
  editModeEnd,
  editModeStart,
  deleteRequiredAttendanceDistribution,
  createDistributionExpense,
  copyStart,
}, dispatch))
class RequiredAttendance extends TrackablePage {
  static propTypes = {
    entry: PropTypes.object,
    isLoading: PropTypes.any,
    scenarioId: PropTypes.number,
    financialYearId: PropTypes.number,
    requiredAttendanceId: PropTypes.string,
    year: PropTypes.number,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    isSuggestedHourlyRateExpanded: PropTypes.bool,
    isOriginOfReplacementsExpanded: PropTypes.bool,
    toggleSuggestedHourlyRateExpand: PropTypes.func,
    toggleOriginOfReplacementsExpand: PropTypes.func,
    history: PropTypes.shape({
      block: PropTypes.func.isRequired,
    }).isRequired,
    postTotalHoursCalculation: PropTypes.func,
    getBenefitsDays: PropTypes.func,
    getBenefitsPercentages: PropTypes.func,
    durationYears: PropTypes.array,
    copyStart: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
    errors: [],
    requiredAttendanceId: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.validator = new FormValidator(this, formOptions, props.intl, props.popupOpen, props.digit2Options);

    const deleteValidatorOpt = {
      deletionRowConfirmMessage: 'required-attendance.delete-distributions-confirmation',
      confirmDeleteRow: true,
      path: 'distributions',
    };
    this.distributionsDeleteValidator = new ReadOnlyDeleteValidator(this, deleteValidatorOpt, props.intl, props.popupOpen);
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
    if (props.editMode && !this.props.editMode) {
      this.benefitsParametersToggle(props.entry.benefit.showPercentage);
    }
  }

  init(props) {
    const { requiredAttendanceId, scenarioId, prevRequiredAttendanceId, isLoading, isDeleting,
      editMode, metadata, validationErrors, setTitle, entry, history } = props;
    const { code, description } = entry;
    if (this.validator.haveChangedEntryProps(props, 'code', 'description')) {
      setTitle(this.getTitle(code, description));
    }
    this.validator.onChangeProps({ editMode, metadata, validationErrors, entry });
    if (!editMode && isZeroId(requiredAttendanceId)) {
      history.push(addScenarioIdToRoute(routes.REQUIRED_ATTENDANCES.path, scenarioId));
    }
    if (requiredAttendanceId === prevRequiredAttendanceId || isLoading || isDeleting || isZeroId(requiredAttendanceId)) {
      return;
    }
    props.getRequiredAttendance(requiredAttendanceId);
    props.getDistributionsList(requiredAttendanceId, scenarioId);
  }

  getTitle(code, description) {
    const names = [code, description];
    return names.join(' ');
  }

  @autobind
  onEdit() {
    const { editStart, requiredAttendanceId } = this.props;
    editStart(requiredAttendanceId);
    this.validator.onEdit(this);
  }

  @autobind
  onCopy() {
    const { copyStart, requiredAttendanceId, entry } = this.props;
    copyStart(requiredAttendanceId, entry);
  }

  @autobind
  onQuery() {
    const { scenarioId, requiredAttendanceId, history } = this.props;
    history.push(addScenarioAndIdToRoute(routes.REQUIRED_ATTENDANCES_QUERY.path, scenarioId, requiredAttendanceId));
  }

  @autobind
  onDelete() {
    const {
      popupOpen,
      entry: {
        code,
        description,
        journal,
      },
      requiredAttendanceId,
      deleteRequiredAttendance,
      scenarioId,
    } = this.props;
    const requiredAttendanceTitle = this.getTitle(code, description);
    popupOpen({
      style: 'confirm',
      message: this.props.intl.formatMessage({ id: 'required-attendance.delete-confirmation' }, { requiredAttendanceTitle }),
      actions: [
        { kind: 'cancel' },
        { kind: 'delete', func: deleteRequiredAttendance, arg: { requiredAttendanceId, journal, requiredAttendanceTitle, scenarioId } },
      ],
    });
  }

  @autobind
  onSave() {
    const { editSave, requiredAttendanceId, entry } = this.props;
    if (this.validator.onSave(this)) {
      editSave(requiredAttendanceId, entry);
    }
  }

  @autobind
  onCancel() {
    this.validator.onCancel(editCancel(), editContinue());
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  handleIsFinancialYearChange(value) {
    const { editMode } = this.props;
    if (editMode) {
      const { fields } = this.validator;
      fields.isFinancialYear.onChange(value, undefined, value ? {
        duration: {
          startDate: '',
          endDate: '',
          isFinancialYear: value,
        },
      } : undefined);
    }
  }

  @autobind
  requestBenefitsDays() {
    const { financialYearId } = this.props;
    const {
      benefit: {
        showPercentage,
      },
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      jobStatus,
      jobType,
      union,
      fourDaySchedule,
    } = this.props.entry;

    const parameters = {
      financialYearId,
      functionalCenterId: functionalCenter ? functionalCenter.id : null,
      showPercentage,
      fourDaySchedule,
      jobStatusId: jobStatus ? jobStatus.id : null,
      jobTypeId: jobType ? jobType.id : null,
      unionId: union ? union.id : null,
    };

    if (jobTitle && jobTitle.id) {
      parameters.jobTitleId = jobTitle.id;
    }
    if (jobTitleGroup && jobTitleGroup.id) {
      parameters.jobTitleGroupId = jobTitleGroup.id;
    }

    this.props.getBenefitsDays(parameters);
  }

  @autobind
  requestBenefitsPercentages() {
    const { financialYearId } = this.props;
    const {
      benefit: {
        showPercentage,
      },
      jobStatus,
        jobType,
        union,
      } = this.props.entry;
    const parameters = {
      showPercentage,
      financialYearId,
      jobStatusId: jobStatus ? jobStatus.id : null,
      jobTypeId: jobType ? jobType.id : null,
      unionId: union ? union.id : null,
      loadAdditionalPeriod: false,
    };
    if (!parameters.jobStatusId || !parameters.jobTypeId) {
      return;
    }

    this.props.getBenefitsDays(parameters);
  }

  @autobind
  requestTotalHoursCalculation(hoursPerDay) {
    const { requiredAttendanceId, financialYearId } = this.props;
    const {
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      schedules,
    } = this.props.entry;

    const calculationParameters = {
      originId: +requiredAttendanceId,
      financialYearId,
      functionalCenterId: functionalCenter ? functionalCenter.id : null,
      hoursPerDay,
      schedules,
    };
    if (jobTitle && jobTitle.id) {
      calculationParameters.jobTitleId = jobTitle.id;
    }
    if (jobTitleGroup && jobTitleGroup.id) {
      calculationParameters.jobTitleGroupId = jobTitleGroup.id;
    }
    this.props.postTotalHoursCalculation(calculationParameters);
  }

  @autobind
  onChangeHoursPerDaySection(value) {
    this.requestTotalHoursCalculation(value);
    this.recalculateHoursPer2Weeks();
  }

  recalculateTotalHours() {
    const { level: { hoursPerDaySelected, specificHoursPerDay } } = this.props.entry;
    const { fields } = this.validator;
    if (isSpecificHoursPerDay(hoursPerDaySelected)) {
      this.requestTotalHoursCalculation(specificHoursPerDay);
      fields.hoursPer2Weeks.onChange(specificHoursPerDay * 10);
    } else {
      this.requestTotalHoursCalculation(hoursPerDaySelected.value);
      fields.hoursPer2Weeks.onChange(hoursPerDaySelected.value * 10);
    }
  }

  recalculateHoursPer2Weeks() {
    const { level: { hoursPerDaySelected, specificHoursPerDay } } = this.props.entry;
    const { fields } = this.validator;
    if (isSpecificHoursPerDay(hoursPerDaySelected)) {
      fields.hoursPer2Weeks.onChange(specificHoursPerDay * 10);
    } else {
      fields.hoursPer2Weeks.onChange(hoursPerDaySelected.value * 10);
    }
  }

  @autobind
  onChangeSchedule() {
    this.recalculateTotalHours();
  }

  @autobind
  benefitsParametersToggle(showPercentage) {
    const { fields } = this.validator;
    fields.showPercentage.onChange(showPercentage);
    if (showPercentage) {
      this.requestBenefitsPercentages();
    } else {
      this.requestBenefitsDays();
    }
  }

  @autobind
  calculateSuggestedHourlyRate(rateType, jobGroupTypeP, jobLevelTypeP, rateOriginFunctionalCenterP, setValue) {
    const { getSuggestedHourlyRate, scenarioId, financialYearId, entry } = this.props;
    const { fields } = this.validator;
    const { metadata } = fields.level.columns.suggestedHourlyRate;
    const url = getEndpoint(metadata);
    const {
      functionalCenter,
      jobTitle,
      jobTitleGroup,
      level: { suggestedHourlyRate },
      groupType,
    } = entry;
    const context = {
      getSuggestedHourlyRate,
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

  calculateSuggestedHourlyRateSetValue() {
    this.calculateSuggestedHourlyRate(undefined, undefined, undefined, undefined, true);
  }

  @autobind
  onChangeJobTitle() {
    this.calculateSuggestedHourlyRateSetValue();
    this.recalculateTotalHours();
  }

  @autobind
  onChangeJobTitleGroup() {
    this.calculateSuggestedHourlyRateSetValue();
    this.recalculateTotalHours();
  }

  @autobind
  onChangeFunctionalCenter() {
    this.calculateSuggestedHourlyRateSetValue();
    this.recalculateTotalHours();
  }

  @autobind
  handleTemporaryClosuresAddRow() {
    const { editMode, digit0Options } = this.props;
    if (editMode) {
      const TEMPORARY_CLOSURE_SEQUENCE_STEP = 10;
      const { temporaryClosures } = this.props.entry;
      const { fields } = this.validator;
      const rowWithMaxSequence = temporaryClosures.reduce((maxRow, currentRow) => {
        const currentRowSequence = unformatNumber(currentRow.sequence, digit0Options);
        const maxRowSequence = unformatNumber(maxRow.sequence, digit0Options);
        return currentRowSequence > maxRowSequence ? currentRow : maxRow;
      }, { sequence: 0 });

      let sequence = TEMPORARY_CLOSURE_SEQUENCE_STEP;
      if (rowWithMaxSequence && rowWithMaxSequence.sequence) {
        sequence = unformatNumber(rowWithMaxSequence.sequence, digit0Options) + TEMPORARY_CLOSURE_SEQUENCE_STEP;
      }
      fields.temporaryClosures.onAddRow({ sequence });
    }
  }

  @autobind
  handleUnionChange() {
    this.requestBenefitsPercentages();
  }

  @autobind
  handleJobStatusChange() {
    this.requestBenefitsPercentages();
  }

  @autobind
  handleJobTypeChange() {
    this.requestBenefitsPercentages();
  }

  renderDetailsTab() {
    const { isLoading, year, scenarioDescription, editMode, intl, entry, durationYears, requiredAttendanceId } = this.props;
    const { fields, tabs: { detail: { invalid } } } = this.validator;
    const {
      code,
      description,
      isSpecificToThisScenario,
      isCalclulatedForScenario,
      isHoursCalculationOnly,
      functionalCenter,
      duration: { isFinancialYear, startDate, endDate },
      jobType,
      groupType,
      jobTitle,
      jobTitleGroup,
      jobStatus,
      union,
    } = entry;
    const { flashErrors } = this.state;
    const useJobTitle = isJobTitleType(groupType);

    const durationTitle = intl.formatMessage({ id: 'required-attendance.duration' });
    const isNew = isZeroId(requiredAttendanceId);

    return (
      <Form.Tab
        id='details'
        intlId='required-attendance.details'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column>
            <Field value={ year } disabled labelIntlId='required-attendance.financial-year-colon' />
          </Form.Column>
          <Form.Column>
            <Field value={ scenarioDescription } disabled labelIntlId='required-attendance.selected-scenario' />
          </Form.Column>
          <Form.Column>
            <Checkbox
              value={ isSpecificToThisScenario }
              editMode={ editMode }
              labelIntlId='required-attendance.specific-to-this-scenario'
              validator={ fields.isSpecificToThisScenario }
              isFirst
            />
          </Form.Column>
          <Form.Column>
            <Checkbox
              value={ isHoursCalculationOnly }
              editMode={ editMode }
              labelIntlId='required-attendance.hours-calculation-only'
              validator={ fields.isHoursCalculationOnly }
            />
          </Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <FunctionalCenter
              editMode={ editMode }
              disabled={ isCalclulatedForScenario }
              validator={ fields.functionalCenter }
              value={ functionalCenter }
              labelIntlId='required-attendance.functional-center-code'
              placeholderIntlId='required-attendance.functional-center-placeholder'
              onChange={ this.onChangeFunctionalCenter }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ functionalCenter && functionalCenter.longDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <GroupType
              editMode={ editMode }
              validator={ fields.type }
              value={ groupType }
              labelIntlId='required-attendance.detail-type'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            { useJobTitle
              ?
                <JobTitle
                  editMode={ editMode }
                  validator={ fields.jobTitle }
                  value={ jobTitle }
                  labelIntlId={ null }
                  onChange={ this.onChangeJobTitle }
                  flashErrors={ flashErrors }
                />
              :
                <JobTitleGroup
                  editMode={ editMode }
                  validator={ fields.jobTitleGroup }
                  value={ jobTitleGroup }
                  onChange={ this.onChangeJobTitleGroup }
                  labelIntlId={ null }
                  flashErrors={ flashErrors }
                />
            }
          </Form.Column>
          <Form.Column>
            {useJobTitle
              ? <Field.Info value={ jobTitle && jobTitle.description } />
              : <Field.Info value={ jobTitleGroup && jobTitleGroup.longDescription } />
            }

          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Field.Input
              editMode={ editMode }
              validator={ fields.reference }
              value={ code }
              labelIntlId='required-attendance.detail-reference'
              confirmModify={ !isNew }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <Field.Input
              editMode={ editMode }
              validator={ fields.description }
              value={ description }
              labelIntlId='required-attendance.detail-reference-description'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div>{ durationTitle }</div>
            <Checkbox
              editMode={ editMode }
              value={ isFinancialYear }
              labelIntlId='required-attendance.duration-financial-year'
              onToggle={ this.handleIsFinancialYearChange }
            />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Field.DatePick
              editMode={ editMode }
              validator={ fields.startDate }
              value={ startDate }
              values={ durationYears }
              pair={ endDate }
              labelIntlId='required-attendance.duration-start-date'
              formNode={ this.formNode }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <Field.DatePick
              editMode={ editMode }
              validator={ fields.endDate }
              value={ endDate }
              values={ durationYears }
              pair={ startDate }
              labelIntlId='required-attendance.duration-end-date'
              formNode={ this.formNode }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <JobType
              editMode={ editMode }
              validator={ fields.jobType }
              value={ jobType }
              onChange={ this.handleJobTypeChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column>
            <JobStatus
              editMode={ editMode }
              validator={ fields.jobStatus }
              value={ jobStatus }
              onChange={ this.handleJobStatusChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ jobStatus && jobStatus.longDescription } /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Union
              editMode={ editMode }
              validator={ fields.union }
              value={ union }
              onChange={ this.handleUnionChange }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column><Field.Info value={ union && union.shortDescription } /></Form.Column>
          <Form.Column />
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  @autobind
  onChangeSuggestedSpecificHourlyRate(suggestedHourlyRate, value) {
    const { setEntry, entry } = this.props;
    setEntry(fillSubEntry(entry, 'level', { suggestedHourlyRate }));
  }

  renderLevelsTab() {
    const { isLoading, editMode, isSuggestedHourlyRateExpanded, digit2Options,
      entry: { level: { totalHours } },
      suggestedHourlyRate: calculatedSuggestedHourlyRate,
      toggleSuggestedHourlyRateExpand, intl, entry } = this.props;
    const { fields, tabs: { levels: { invalid } } } = this.validator;
    const {
      level: {
        hoursPerDaySelected,
        specificHoursPerDay,
        fullTimeEquivalent,
        suggestedHourlyRate,
      },
      groupType,
      jobTitle,
      functionalCenter,
    } = entry;
    const { flashErrors } = this.state;
    const isJobTitle = isJobTitleType(groupType);

    return (
      <Form.Tab
        id='levels'
        intlId='required-attendance.levels'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <SuggestedHourlyRateSection
          fieldsSuggestedHourlyRate={ fields.level }
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
        />
        <Form.Separator />
        <HoursPerDaySection
          editMode={ editMode }
          groupType={ groupType }
          jobTitle={ jobTitle }
          totalHours={ totalHours }
          fullTimeEquivalent={ fullTimeEquivalent }
          selectedValue={ hoursPerDaySelected }
          specificValue={ specificHoursPerDay }
          selectedValidator={ fields.level.columns.hoursPerDaySelected }
          specificValidator={ fields.level.columns.specificHoursPerDay }
          fullTimeEquivalentValidator={ fields.level.columns.fullTimeEquivalent }
          onChange={ this.onChangeHoursPerDaySection }
          flashErrors={ flashErrors }
        />
      </Form.Tab>
    );
  }

  renderBenefitsTab() {
    const { isLoading, editMode, digit2Options,
      entry: {
        benefit: {
          isFinancialYearParameters,
          qtyVacationFromParameter,
          qtyHolidayFromParameter,
          qtySickDayFromParameter,
          qtyPsychiatricLeaveFromParameter,
          qtyNightShiftFromParameter,
          pctVacationFromParameter,
          pctHolidayFromParameter,
          pctSickDayFromParameter,
          pctPsychiatricLeaveFromParameter,
          pctNightShiftFromParameter,
        },
      },
      entry,
    } = this.props;
    const { fields, tabs: { benefits: { invalid } } } = this.validator;
    const {
      benefit: {
        showPercentage,
        qtyVacation,
        qtyHoliday,
        qtySickDay,
        qtyPsychiatricLeave,
        qtyNightShift,
        pctVacation,
        pctHoliday,
        pctSickDay,
        pctPsychiatricLeave,
        pctNightShift,
      },
    } = entry;
    const { flashErrors } = this.state;

    const parametersDays = this.props.intl.formatMessage({ id: 'required-attendance.benefits-parameters-days' });
    const ifDifferent = this.props.intl.formatMessage({ id: 'required-attendance.benefits-if-different' });
    const unionPercentage = this.props.intl.formatMessage({ id: 'required-attendance.benefits-union-percentage' });
    const parametersPercentage = this.props.intl.formatMessage({ id: 'required-attendance.benefits-parameters-percentage' });
    const ifDifferentPercentage = this.props.intl.formatMessage({ id: 'required-attendance.benefits-if-different-percentage' });
    const benefitsAbsences = this.props.intl.formatMessage({ id: 'required-attendance.benefits-absences' });

    return (
      <Form.Tab
        id='benefits'
        intlId='required-attendance.benefits'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column>
            <RadioButton
              value={ showPercentage }
              labelIntlId='required-attendance.benefits-colon'
              values={ [
                  { value: false, id: 'days', intlId: 'required-attendance.benefits-days' },
                  { value: true, id: 'percentages', intlId: 'required-attendance.benefits-percentages' },
              ] }
              editMode={ editMode }
              validator={ fields.showPercentage }
              onChange={ this.benefitsParametersToggle }
            />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <div className='required-attendance__column-header'>{ benefitsAbsences }</div>
        </Form.Row>
        <Form.Row>
          <Form.Column><div className='required-attendance__column-header--bold'>{ parametersDays }</div></Form.Column>
          <Form.Column><div className='required-attendance__column-header--bold'>{ ifDifferent }</div></Form.Column>
          { showPercentage && !isFinancialYearParameters &&
            <Form.Column><div className='required-attendance__column-header--bold'>{ unionPercentage }</div></Form.Column>
            }
          { showPercentage && isFinancialYearParameters &&
            <Form.Column><div className='required-attendance__column-header--bold'>{ parametersPercentage }</div></Form.Column>
            }
          { showPercentage && <Form.Column><div className='required-attendance__column-header--bold'>{ ifDifferentPercentage }</div></Form.Column>
            }
          { !showPercentage && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtyVacationFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-vacation' /></Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.benefits.columns.qtyVacation }
              value={ qtyVacation }
              labelIntlId='required-attendance.benefits-vacation'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          { showPercentage && <Form.Column><Field value={ formatNumber(pctVacationFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-vacation-percentage' /></Form.Column> }
          { showPercentage &&
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctVacation }
                value={ pctVacation }
                labelIntlId='required-attendance.benefits-vacation-percentage'
                flashErrors={ flashErrors }
              />
            </Form.Column> }
          { !showPercentage && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtyHolidayFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-holidays' /></Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.benefits.columns.qtyHoliday }
              value={ qtyHoliday }
              labelIntlId='required-attendance.benefits-holidays'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          { showPercentage && <Form.Column><Field value={ formatNumber(pctHolidayFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-holidays-percentage' /></Form.Column> }
          { showPercentage &&
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctHoliday }
                value={ pctHoliday }
                labelIntlId='required-attendance.benefits-holidays-percentage'
                flashErrors={ flashErrors }
              />
            </Form.Column> }
          { !showPercentage && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtySickDayFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-sick-days' /></Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.benefits.columns.qtySickDay }
              value={ qtySickDay }
              labelIntlId='required-attendance.benefits-sick-days'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          { showPercentage && <Form.Column><Field value={ formatNumber(pctSickDayFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-sick-days-percentage' /></Form.Column> }
          { showPercentage &&
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctSickDay }
                value={ pctSickDay }
                labelIntlId='required-attendance.benefits-sick-days-percentage'
                flashErrors={ flashErrors }
              />
            </Form.Column> }
          { !showPercentage && <Form.Column2 /> }
        </Form.Row>
        { showPercentage ?
          <Form.Row>
            <Form.Column2 />
            <Form.Column > <Field value={ formatNumber(pctPsychiatricLeaveFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-psych-leave-percentage' /></Form.Column>
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctPsychiatricLeave }
                value={ pctPsychiatricLeave }
                labelIntlId='required-attendance.benefits-psych-leave-percentage'
                flashErrors={ flashErrors }
              />
            </Form.Column>
          </Form.Row>
            :
          <Form.Row>
            <Form.Column><Field value={ formatNumber(qtyPsychiatricLeaveFromParameter, digit2Options) } disabled labelIntlId='required-attendance.benefits-psych-leave' /></Form.Column>
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.qtyPsychiatricLeave }
                value={ qtyPsychiatricLeave }
                labelIntlId='required-attendance.benefits-psych-leave'
                flashErrors={ flashErrors }
              />
            </Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { showPercentage ?
          <Form.Row>
            <Form.Column2 />
            <Form.Column>
              <Field
                value={ formatNumber(pctNightShiftFromParameter, digit2Options) }
                disabled
                labelIntlId='required-attendance.benefits-night-shift-percentage'
              />
            </Form.Column>
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.pctNightShift }
                value={ pctNightShift }
                labelIntlId='required-attendance.benefits-night-shift-percentage'
                flashErrors={ flashErrors }
              />
            </Form.Column>
          </Form.Row>
          :
          <Form.Row>
            <Form.Column>
              <Field
                value={ formatNumber(qtyNightShiftFromParameter, digit2Options) }
                disabled
                labelIntlId='required-attendance.benefits-night-shift'
              />
            </Form.Column>
            <Form.Column>
              <Field.Number2
                editMode={ editMode }
                validator={ fields.benefits.columns.qtyNightShift }
                value={ qtyNightShift }
                labelIntlId='required-attendance.benefits-night-shift'
                flashErrors={ flashErrors }
              />
            </Form.Column>
            <Form.Column />
            <Form.Column />
          </Form.Row>
        }
      </Form.Tab>
    );
  }

  makePayrollRange(from, to) {
    const { intl } = this.props;
    const fromLabel = intl.formatMessage({ id: 'required-attendance.payroll-deductions-from' });
    const toLabel = intl.formatMessage({ id: 'required-attendance.payroll-deductions-to' });
    return `${ fromLabel } ${ from } ${ toLabel } ${ to }`;
  }

  @autobind
  onChangeIsSpecificPayrollDeduction(value) {
    if (value) {
      this.validator.setSubEntry('globalPayrollDeduction', fillDefaults({}, codeDescriptionSchema), {
        isSpecificPayrollDeduction: true,
      });
    } else {
      this.validator.setSubEntry('payrollDeduction', {
        calculateTaxableAmaunt: true,
        specificPayrollDeductions: false,
        specificAmount: '',
      }, {
        isSpecificPayrollDeduction: false,
      });
    }
  }

  @autobind
  onChangeSpecificPayrollDeductions(value) {
    if (value) {
      this.validator.setSubEntry('payrollDeduction', {
        specificPayrollDeductions: true,
      }, {
        globalPayrollDeduction: fillDefaults({}, codeDescriptionSchema),
        isSpecificPayrollDeduction: true,
      });
    }
  }

  @autobind
  onChangeGlobalPayrollDeduction(value) {
    const { isSpecificPayrollDeduction } = this.props.entry;
    if (value && value.code && isSpecificPayrollDeduction) {
      this.onChangeIsSpecificPayrollDeduction(false);
    }
  }

  @autobind
  handleCalculateTaxableAmount(value) {
    if (value) {
      this.validator.setSubEntry('payrollDeduction', {
        specificAmount: '',
        calculateTaxableAmaunt: value,
      });
    } else {
      this.validator.setSubEntry('payrollDeduction', {
        calculateTaxableAmaunt: value,
      }, {
        globalPayrollDeduction: fillDefaults({}, codeDescriptionSchema),
        isSpecificPayrollDeduction: true,
      });
    }
  }

  renderPayrollDeductionsTab() {
    const { isLoading, editMode, entry } = this.props;
    const { fields, tabs: { payrollDeductions: { invalid } } } = this.validator;
    const { flashErrors } = this.state;
    const {
      globalPayrollDeduction,
      globalPayrollDeductionParameter,
      payrollDeduction: {
        parameters: {
          CanadaPensionPlan: { code: codeCPP },
          WorkersCompensationBoard: { code: codeWCB },
          HealthCarePlan: { code: codeHCP },
          EmploymentInsurance: { code: codeEI },
          PensionPlan: { code: codePension },
          QuebecParentalInsurancePlan: { code: codeQPIP },
        },
        specificParameters: {
          CanadaPensionPlan,
          WorkersCompensationBoard,
          HealthCarePlan,
          EmploymentInsurance,
          PensionPlan,
          QuebecParentalInsurancePlan,
        },
        calculateTaxableAmaunt,
        dateFrom,
        dateTo,
        amaunt,
        specificAmount,
        specificPayrollDeductions,
      },
      isSpecificPayrollDeduction,
    } = entry;

    const globalPayrollDeductionParameterCode = globalPayrollDeductionParameter && globalPayrollDeductionParameter.code;
    const globalParameters = this.props.intl.formatMessage({ id: 'required-attendance.payroll-deductions-parameters' });
    const customizedParameters = this.props.intl.formatMessage({ id: 'required-attendance.payroll-deductions-customized' });

    return (
      <Form.Tab
        id='payrollDeductions'
        intlId='required-attendance.payroll-deductions'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column>
            <RadioButton
              value={ isSpecificPayrollDeduction }
              labelIntlId='required-attendance.payroll-deductions-colon'
              values={ [
                { value: false, id: 'global', intlId: 'required-attendance.payroll-deductions-global' },
                { value: true, id: 'specific', intlId: 'required-attendance.payroll-deductions-specific' },
              ] }
              editMode={ editMode }
              validator={ fields.isSpecificPayrollDeduction }
              onChange={ this.onChangeIsSpecificPayrollDeduction }
            />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ globalPayrollDeductionParameterCode } disabled labelIntlId='required-attendance.payroll-deductions-global-parameters' /></Form.Column>
          <Form.Column>
            <GlobalPayrollDeduction
              value={ globalPayrollDeduction }
              labelIntlId='required-attendance.payroll-deductions-if-different'
              validator={ fields.globalPayrollDeduction }
              editMode={ editMode }
              onChange={ this.onChangeGlobalPayrollDeduction }
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <Checkbox
              value={ specificPayrollDeductions }
              validator={ fields.specificPayrollDeductions }
              editMode={ editMode }
              single={ true }
              labelIntlId='required-attendance.payroll-deductions-specific-checkbox'
              onChange={ this.onChangeSpecificPayrollDeductions }
            />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><div className='required-attendance__column-header--bold'>{ globalParameters }</div></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <div className='required-attendance__column-header--bold'>{ customizedParameters }</div>
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeCPP } disabled labelIntlId='required-attendance.payroll-deductions-parameters-rrq' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ CanadaPensionPlan }
                labelIntlId='required-attendance.payroll-deductions-parameters-rrq'
                validator={ fields.payrollDeduction.columns.CanadaPensionPlan }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeWCB } disabled labelIntlId='required-attendance.payroll-deductions-parameters-wcb' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ WorkersCompensationBoard }
                labelIntlId='required-attendance.payroll-deductions-parameters-wcb'
                validator={ fields.payrollDeduction.columns.WorkersCompensationBoard }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeHCP } disabled labelIntlId='required-attendance.payroll-deductions-parameters-hcp' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ HealthCarePlan }
                labelIntlId='required-attendance.payroll-deductions-parameters-hcp'
                validator={ fields.payrollDeduction.columns.HealthCarePlan }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeEI } disabled labelIntlId='required-attendance.payroll-deductions-parameters-el' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ EmploymentInsurance }
                labelIntlId='required-attendance.payroll-deductions-parameters-el'
                validator={ fields.payrollDeduction.columns.EmploymentInsurance }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codePension } disabled labelIntlId='required-attendance.payroll-deductions-parameters-pension' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ PensionPlan }
                labelIntlId='required-attendance.payroll-deductions-parameters-pension'
                validator={ fields.payrollDeduction.columns.PensionPlan }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeQPIP } disabled labelIntlId='required-attendance.payroll-deductions-parameters-qpip' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <PayrollDeduction
                value={ QuebecParentalInsurancePlan }
                labelIntlId='required-attendance.payroll-deductions-parameters-qpip'
                validator={ fields.payrollDeduction.columns.QuebecParentalInsurancePlan }
                editMode={ editMode }
                flashErrors={ flashErrors }
              />
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <Checkbox
              value={ calculateTaxableAmaunt }
              labelIntlId='required-attendance.payroll-deductions-calculated-taxable-amount'
              editMode={ editMode }
              single={ true }
              onToggle={ this.handleCalculateTaxableAmount }
            />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number value={ amaunt } disabled labelIntlId='required-attendance.payroll-deductions-taxable-wage-amount' /></Form.Column>
          <Form.Column><Field.Info value={ this.makePayrollRange(dateFrom, dateTo) } disabled /></Form.Column>
          <Form.Column>
            <Field.Number2
              editMode={ editMode }
              validator={ fields.specificAmount }
              value={ specificAmount }
              disabled={ calculateTaxableAmaunt }
              labelIntlId='required-attendance.payroll-deductions-specific-taxable-amount'
              flashErrors={ flashErrors }
            />
          </Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderPremiumsTab() {
    const { isLoading, digit2Options, editMode, entry, premiums } = this.props;
    const { fields, tabs: { premiums: { invalid } } } = this.validator;
    const {
      jobStatus,
      hoursPer2Weeks,
    } = entry;
    const { flashErrors } = this.state;
    return (
      <Form.Tab
        id='premiums'
        intlId='required-attendance.premiums'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column4>
            <div className='required-attendance__premiums-header'>
              <div className='required-attendance__premiums-header--left'>
                <Field small={ true } selected={ true } value={ jobStatus && jobStatus.shortDescription } labelIntlId='required-attendance.total-status' />
              </div>
              <div className='required-attendance__premiums-header--right'>
                <Field small={ true } value={ formatDigits(hoursPer2Weeks, digit2Options) } labelIntlId='required-attendance.total-hours-per-two-weeks' />
              </div>
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              editMode={ editMode }
              rows={ premiums.rows }
              columns={ premiums.columns }
              validator={ fields.premiums }
              flashErrors={ flashErrors }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderReplacementsTab() {
    const { isLoading, editMode, requiredAttendanceId, entry, replacements } = this.props;
    const { fields, tabs: { replacements: { invalid } } } = this.validator;
    const {
      originReplacements,
      isLoadingOriginReplacements,
      isOriginOfReplacementsExpanded,
      toggleOriginOfReplacementsExpand,
    } = this.props;
    const { flashErrors } = this.state;

    const REQUIRED_ATTENDANCE_ORIGIN_TYPE = 'RequiredAttendance';

    return (
      <Form.Tab
        id='replacements'
        intlId='required-attendance.replacements'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ replacements.rows }
              columns={ replacements.columns }
              editMode={ editMode }
              validator={ fields.replacements }
              flashErrors={ flashErrors }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <OriginReplacements
          editMode={ editMode }
          expand={ isOriginOfReplacementsExpanded }
          toggleExpand={ toggleOriginOfReplacementsExpand }
          originReplacements={ originReplacements }
          isLoading={ isLoadingOriginReplacements }
          entry={ /* this.state.newEntry || this.props.entry */ entry }
          originId={ +requiredAttendanceId }
          originType={ REQUIRED_ATTENDANCE_ORIGIN_TYPE }
          flashErrors={ flashErrors }
        />
      </Form.Tab>
    );
  }

  renderScheduleTab() {
    const { isLoading, editMode, schedules } = this.props;
    const { fields, tabs: { schedules: { invalid } } } = this.validator;
    const { flashErrors } = this.state;
    return (
      <Form.Tab
        id='schedules'
        intlId='required-attendance.schedule-required-attendance'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ schedules.rows }
              columns={ schedules.columns }
              editMode={ editMode }
              validator={ fields.schedules }
              onChange={ this.onChangeSchedule }
              flashErrors={ flashErrors }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderTemporaryClosureTab() {
    const { isLoading, editMode, temporaryClosures } = this.props;
    const { fields, tabs: { temporaryClosures: { invalid } } } = this.validator;
    const { flashErrors } = this.state;
    return (
      <Form.Tab
        id='temporaryClosures'
        intlId='required-attendance.temporary-closure'
        isLoading={ isLoading }
        invalid={ editMode && invalid }
        flashErrors={ flashErrors }
      >
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ temporaryClosures.rows }
              columns={ temporaryClosures.columns }
              editMode={ editMode }
              validator={ fields.temporaryClosures }
              onAddRow={ this.handleTemporaryClosuresAddRow }
              flashErrors={ flashErrors }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  @autobind
  onDeleteDistributionsRow(args) {
    const { requiredAttendanceId, scenarioId } = this.props;
    args = {
      ...args,
      requiredAttendanceId,
      scenarioId,
    };
    this.props.deleteRequiredAttendanceDistribution(args);
  }

  @autobind
  onAdd() {
    const { createDistributionExpense, requiredAttendanceId } = this.props;
    createDistributionExpense(requiredAttendanceId);
  }

  renderDistributionsTab() {
    const { isLoadingDistributionsList, isLoading, distributionsTable, isMasterDetailViewActive, editMode } = this.props;
    const showDistributionDetails = isMasterDetailViewActive && !editMode;
    return (
      <Form.Tab
        id='Distributions'
        intlId='required-attendance.distributions'
        isLoading={ isLoading || isLoadingDistributionsList }
      >
        <Form.Actions>
          <Form.ActionsLeft />
          <Form.ActionsRight>
            { !editMode && !isMasterDetailViewActive && <Form.Action type='add' intlId='action.add' onClick={ this.onAdd } /> }
          </Form.ActionsRight>
        </Form.Actions>
        <Form.Row single>
          { showDistributionDetails &&
          <Form.Column4>
            <DistributionExpense />
          </Form.Column4>
          }
          {!showDistributionDetails &&
          <Form.Column4>
            <Form.Grid
              rows={ distributionsTable.rows }
              columns={ distributionsTable.columns }
              editMode={ false }
              validator={ this.distributionsDeleteValidator }
              onDeleteRow={ this.onDeleteDistributionsRow }
              customMessageIntlId={ 'data-grid.no-distributions-data' }
              noNoData={ false }
            />
          </Form.Column4>
          }
        </Form.Row>
      </Form.Tab>
    );
  }

  renderTabs() {
    const { editMode } = this.props;
    return (
      <Form.Tabs active='details' validator={ this.validator } editMode={ editMode }>
        { this.renderDetailsTab() }
        { this.renderLevelsTab() }
        { this.renderBenefitsTab() }
        { this.renderPayrollDeductionsTab() }
        { this.renderPremiumsTab() }
        { this.renderReplacementsTab() }
        { this.renderScheduleTab() }
        { this.renderTemporaryClosureTab() }
        { this.renderDistributionsTab() }
      </Form.Tabs>
    );
  }

  render() {
    const { isLoading, editMode, entry } = this.props;
    const {
      code,
      description,
      isInactive,
      isCalclulatedForScenario,
    } = entry;
    const { invalid } = this.validator;
    const { flashErrors } = this.state;

    return (
      <div className='required-attendance' ref={ (node) => { this.formNode = node; } }>
        <div className='required-attendance__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='required-attendance__form'>
            <Form invalid={ editMode && invalid } flashErrors={ flashErrors } editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='required-attendance.title' message={ this.getTitle(code, description) } />
                  { !isLoading && isInactive &&
                  <div className='position__inactive'>
                    <FormattedMessage id='required-attendance.inactive' defaultMessage='Inactive required attendance' />
                  </div>
                  }
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { !editMode && !isLoading && <Form.Action disabled={ !isCalclulatedForScenario } type='query' intlId='action.query' onClick={ this.onQuery } /> }
                  { !editMode && !isLoading && <Form.Action type='copy' intlId='action.copy' onClick={ this.onCopy } /> }
                  { !editMode && !isLoading && <Form.Action type='delete' intlId='action.delete' onClick={ this.onDelete } /> }
                  { !editMode && !isLoading && <Form.Action type='edit' intlId='action.edit' onClick={ this.onEdit } /> }
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

export default injectIntl(RequiredAttendance);
