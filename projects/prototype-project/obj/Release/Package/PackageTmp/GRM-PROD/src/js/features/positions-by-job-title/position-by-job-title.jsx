import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';

import { ScrollBox } from '../../components/general/scroll-box';
import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import RadioButton from '../../components/controls/radio-button';

import { getPositionByJobTitle } from '../../api/actions';
import { toggleSuggestedHourlyRateExpand } from './actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';

import './position-by-job-title.scss';
import '../../../styles/content-gradient.scss';
import { formatDigits, formatNumber, getDigit1Options, getDigit2Options } from '../../utils/selectors/currency';
import {
  extractPremiumsByJobTitle,
  extractReplacementsByJobTitle,
  extractWorkScheduleDaysByJobTitle,
  extractWorkScheduleHoursByJobTitle,
} from '../positions/selectors';

import {
  RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE,
  RATE_ORIGIN_UNKNOWN,
  SuggestedHourlyRate,
} from '../../components/business/suggested-hourly-rate/suggested-hourly-rate';

const JOB_STATUS_PARTIAL_TIME_CASUAL = 'PartialTimeCasual';
const JOB_STATUS_PARTIAL_TIME_REGULAR = 'PartialTimeRegular';
const JOB_STATUS_PARTIAL_TIME_TEMPORARY = 'PartialTimeTemporary';

const titleIcon = 'position';

defineMessages({
  workScheduleFourDaySchedule: {
    id: 'position-by-job-title.work-schedule.four-day-schedule',
    defaultMessage: '4-day schedule',
  },
  totalDistribute: {
    id: 'position-by-job-title.work-schedule.total-distribute',
    defaultMessage: 'TOTAL DISTRIBUTE',
  },
  fte: {
    id: 'position-by-job-title.work-schedule.total-fte',
    defaultMessage: 'FTE',
  },
  totalHoursPerDay: {
    id: 'position-by-job-title.work-schedule.total-hours-per-day',
    defaultMessage: 'HOURS PER DAY',
  },
  totalDays: {
    id: 'position-by-job-title.work-schedule.total-days',
    defaultMessage: 'days',
  },
  totalHours: {
    id: 'position-by-job-title.work-schedule.total-hours',
    defaultMessage: 'hours',
  },
  deductionsTitle: {
    id: 'position-by-job-title.payroll-deductions.title',
    defaultMessage: 'Payroll deductions:',
  },
  totalStatus: {
    id: 'position-by-job-title.payroll-deductions.total-status',
    defaultMessage: 'STATUS',
  },
  totalHoursPer2Weeks: {
    id: 'position-by-job-title.payroll-deductions.total-hours-per-2-weeks',
    defaultMessage: 'HRS/2 WKS',
  },
  payrollFrom: {
    id: 'position-by-job-title.payroll-deductions.from',
    defaultMessage: 'FROM',
  },
  payrollTo: {
    id: 'position-by-job-title.payroll-deductions.to',
    defaultMessage: 'TO',
  },
  payrollTaxableWageAmount: {
    id: 'position-by-job-title.payroll-deductions.calculate-taxable-amount',
    defaultMessage: 'Calculated taxable amount',
  },
  payrollCalculateTaxableAmount: {
    id: 'position-by-job-title.payroll-deductions.taxable-wage-amount',
    defaultMessage: 'Taxable wage amount:',
  },
  payrollSpecificTaxableAmount: {
    id: 'position-by-job-title.payroll-deductions.specific-taxable-amount',
    defaultMessage: 'Specific taxable amount:',
  },
  payrollCpp: {
    id: 'position-by-job-title.payroll-deductions.cpp',
    defaultMessage: 'CPP:',
  },
  payrollWcb: {
    id: 'position-by-job-title.payroll-deductions.wcb',
    defaultMessage: 'WCB:',
  },
  payrollHcp: {
    id: 'position-by-job-title.payroll-deductions.hcp',
    defaultMessage: 'HCP:',
  },
  payrollEI: {
    id: 'position-by-job-title.payroll-deductions.ei',
    defaultMessage: 'EI:',
  },
  payrollPension: {
    id: 'position-by-job-title.payroll-deductions.pension',
    defaultMessage: 'Pension:',
  },
  payrollQpip: {
    id: 'position-by-job-title.payroll-deductions.qpip',
    defaultMessage: 'QPIP:',
  },
  specificPayrollDedaction: {
    id: 'position-by-job-title.payroll-deductions.customized',
    defaultMessage: 'Customized payroll deductions',
  },
  payrollDeductionsGlobalParameters: {
    id: 'position-by-job-title.payroll-deductions.global-parameters',
    defaultMessage: 'Global payroll deductions parameters:',
  },
  payrollDeductionsIfDifferent: {
    id: 'position-by-job-title.payroll-deductions.if-different',
    defaultMessage: 'If different:',
  },
  payrollDeductionsGlobal: {
    id: 'position-by-job-title.payroll-deductions.global',
    defaultMessage: 'Global:',
  },
  payrollDeductionsSpecific: {
    id: 'position-by-job-title.payroll-deductions.specific',
    defaultMessage: 'Specific:',
  },
  benefitsAbsences: {
    id: 'position-by-job-title.benefits-absences',
    defaultMessage: 'Absences:',
  },
  benefitsColon: {
    id: 'position-by-job-title.benefits-colon',
    defaultMessage: 'Benefits:',
  },
  benefitsDays: {
    id: 'position-by-job-title.benefits-days',
    defaultMessage: 'Days',
  },
  benefitsPercentages: {
    id: 'position-by-job-title.benefits-percentages',
    defaultMessage: 'Percentages',
  },
  benefitsParametersDays: {
    id: 'position-by-job-title.benefits-parameters-days',
    defaultMessage: 'Parameters (days)',
  },
  benefitsIfDifferent: {
    id: 'position-by-job-title.benefits-if-different',
    defaultMessage: 'If different',
  },
  benefitsUnionPercentage: {
    id: 'position-by-job-title.benefits-union-percentage',
    defaultMessage: 'Union (%)',
  },
  benefitsParametersPercentage: {
    id: 'position-by-job-title.benefits-parameters-percentage',
    defaultMessage: 'Parameters (%)',
  },
  benefitsIfDifferentPercentage: {
    id: 'position-by-job-title.benefits-if-different-percentage',
    defaultMessage: 'If different (%)',
  },
  benefitsVacation: {
    id: 'position-by-job-title.benefits-vacation',
    defaultMessage: 'Vacation:',
  },
  benefitsVacationPercentage: {
    id: 'position-by-job-title.benefits-vacation-percentage',
    defaultMessage: 'Vacation (%):',
  },
  benefitsHolidays: {
    id: 'position-by-job-title.benefits-holidays',
    defaultMessage: 'Holidays:',
  },
  benefitsHolidaysPercentage: {
    id: 'position-by-job-title.benefits-holidays-percentage',
    defaultMessage: 'Holidays (%):',
  },
  benefitsSickDays: {
    id: 'position-by-job-title.benefits-sick-days',
    defaultMessage: 'Sick days:',
  },
  benefitsSickDaysPercentage: {
    id: 'position-by-job-title.benefits-sick-days-percentage',
    defaultMessage: 'Sick days (%):',
  },
  benefitsPsychLeave: {
    id: 'position-by-job-title.benefits-psych-leave',
    defaultMessage: 'Psych. leave:',
  },
  benefitsPsychLeavePercentage: {
    id: 'position-by-job-title.benefits-psych-leave-percentage',
    defaultMessage: 'Psych. leave (%):',
  },
  benefitsNightShift: {
    id: 'position-by-job-title.benefits-night-shift',
    defaultMessage: 'Night shift:',
  },
  benefitsNightShiftPercentage: {
    id: 'position-by-job-title.benefits-night-shift-percentage',
    defaultMessage: 'Night shift (%):',
  },
  shift: {
    id: 'position-by-job-title.shift',
    defaultMessage: 'Shift:',
  },
  hourlyRate: {
    id: 'position-by-job-title.hourly-rate',
    defaultMessage: 'Hourly rate:',
  },
  fullTimeEquivalent: {
    id: 'position-by-job-title.full-time-equivalent',
    defaultMessage: 'Full-time equivalent:',
  },
  hoursPer2Weeks: {
    id: 'position-by-job-title.hours-per-two-weeks',
    defaultMessage: 'Hours per 2 weeks:',
  },
  hoursPerDay: {
    id: 'position-by-job-title.hours-per-day',
    defaultMessage: 'Hours per day:',
  },
  fourDaySchedule: {
    id: 'position-by-job-title.four-day-schedule',
    defaultMessage: '4-day schedule',
  },
  functionalCenter: {
    id: 'position-by-job-title.functional-center',
    defaultMessage: 'Functional center:',
  },
  hourlyRateSuggested: {
    id: 'position-by-job-title.hourly-rate-suggested',
    defaultMessage: 'Suggested:',
  },
  hourlyRateSpecific: {
    id: 'position-by-job-title.hourly-rate-specific',
    defaultMessage: 'Specific:',
  },
  union: {
    id: 'position-by-job-title.union',
    defaultMessage: 'Union:',
  },
  jobType: {
    id: 'position-by-job-title.job-type',
    defaultMessage: 'Job type:',
  },
  jobStatus: {
    id: 'position-by-job-title.job-status',
    defaultMessage: 'Job status:',
  },
  financialYear: {
    id: 'position-by-job-title.financial-year',
    defaultMessage: 'Financial year',
  },
  startDate: {
    id: 'position-by-job-title.start-date',
    defaultMessage: 'Start:',
  },
  endDate: {
    id: 'position-by-job-title.end-date',
    defaultMessage: 'End:',
  },
  jobTitle: {
    id: 'position-by-job-title.job-title',
    defaultMessage: 'Job title:',
  },
  year: {
    id: 'position-by-job-title.year',
    defaultMessage: 'Financial year:',
  },
  scenario: {
    id: 'position-by-job-title.scenario',
    defaultMessage: 'Scenario:',
  },
  forThisScenario: {
    id: 'position-by-job-title.for-this-scenario',
    defaultMessage: 'For this scenario',
  },
  funcCode: {
    id: 'position-by-job-title.func-code',
    defaultMessage: 'Functional center:',
  },
  number: {
    id: 'position-by-job-title.number',
    defaultMessage: 'Position number:',
  },
  description: {
    id: 'position-by-job-title.description',
    defaultMessage: 'Description:',
  },
  numberOfPositions: {
    id: 'position-by-job-title.number-of-positions',
    defaultMessage: 'Number of positions:',
  },
  title: {
    id: 'position-by-job-title.title',
    defaultMessage: 'Position by job title:',
  },
  position: {
    id: 'position-by-job-title.position',
    defaultMessage: 'Position by job title',
  },
  levels: {
    id: 'position-by-job-title.levels',
    defaultMessage: 'Levels',
  },
  workSchedule: {
    id: 'position-by-job-title.work-schedule',
    defaultMessage: 'Work schedule',
  },
  benefits: {
    id: 'position-by-job-title.benefits',
    defaultMessage: 'Benefits',
  },
  payrollDeductions: {
    id: 'position-by-job-title.payroll-deductions',
    defaultMessage: 'Payroll Deductions',
  },
  premiums: {
    id: 'position-by-job-title.premiums',
    defaultMessage: 'Premiums',
  },
  replacements: {
    id: 'position-by-job-title.replacements',
    defaultMessage: 'Replacements',
  },

});

@connect(state => ({
  entry: state.positionsByJobTitle.entry,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  year: state.scenario.selectedScenario.year,
  isLoading: state.positionsByJobTitle.isLoading,
  prevPositionId: state.positionsByJobTitle.positionId,
  isSuggestedHourlyRateExpanded: state.positionsByJobTitle.isSuggestedHourlyRateExpanded,
  digit2Options: getDigit2Options(state),
  digit1Options: getDigit1Options(state),
  workScheduleDays: extractWorkScheduleDaysByJobTitle(state),
  workScheduleHours: extractWorkScheduleHoursByJobTitle(state),
  premiums: extractPremiumsByJobTitle(state),
  replacements: extractReplacementsByJobTitle(state),
}), (dispatch) => bindActionCreators({
  getPositionByJobTitle,
  toggleSuggestedHourlyRateExpand,
  setTitle,
}, dispatch))
class PositionByJobTitle extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.any,
    positionId: PropTypes.string,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    isSuggestedHourlyRateExpanded: PropTypes.bool,
    toggleSuggestedHourlyRateExpand: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    this.load(this.props);
    this.onChangeProps(this.props);
  }

  componentWillReceiveProps(props) {
    this.onChangeProps(props);
  }

  onChangeProps(props) {
    const { number, description } = props.entry;
    const { setTitle } = props;
    setTitle(this.getTitle(number, description));
  }

  load(props) {
    const { positionId, prevPositionId } = props;
    if (positionId === prevPositionId) {
      return;
    }
    props.getPositionByJobTitle(positionId);
  }

  @autobind
  onEdit() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onSuggestedHourlyRate() {
    const { rateOriginType } = this.props.entry;

    if (rateOriginType !== RATE_ORIGIN_UNKNOWN) {
      this.props.toggleSuggestedHourlyRateExpand();
    }
  }

  renderMainTab() {
    const { isLoading, year, scenarioDescription, editMode } = this.props;
    const {
      description,
      forThisScenario,
      functionalCenter: { code: funcCode, longDescription: funcDescription },
      number,
      jobTitle: { description: jobTitleDescription, notaryEmploymentCode },
      numberOfPositions,
      positionDuration: { isFinancialYear, startDate, endDate },
      jobType: { shortDescription: jobTypeShortDescription },
      jobStatus: { shortDescription: jobStatusShortDescription, longDescription: jobStatusLongDescription },
      union: { code: unionCode, longDescription: unionDescription },
    } = this.props.entry;
    return (
      <Form.Tab id='position' intlId='position-by-job-title.position' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column><Field value={ year } labelIntlId='position-by-job-title.year' /></Form.Column>
          <Form.Column><Field value={ scenarioDescription } labelIntlId='position-by-job-title.scenario' /></Form.Column>
          <Form.Column><Checkbox value={ forThisScenario } editMode={ editMode } labelIntlId='position-by-job-title.for-this-scenario' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ funcCode } labelIntlId='position-by-job-title.func-code' /></Form.Column>
          <Form.Column><Field.Info value={ funcDescription } /></Form.Column>
          <Form.Column><Field value={ notaryEmploymentCode } labelIntlId='position-by-job-title.job-title' /></Form.Column>
          <Form.Column><Field.Info value={ jobTitleDescription } /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ number } labelIntlId='position-by-job-title.number' /></Form.Column>
          <Form.Column><Field value={ description } labelIntlId='position-by-job-title.description' /></Form.Column>
          <Form.Column><Field value={ numberOfPositions } labelIntlId='position-by-job-title.number-of-positions' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <FormattedMessage id='position-by-job-title.duration' defaultMessage='Position duration:' />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row halfTopMargin>
          <Form.Column>
            <Checkbox single value={ isFinancialYear } editMode={ editMode } labelIntlId='position-by-job-title.financial-year' />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ startDate } labelIntlId='position-by-job-title.start-date' /></Form.Column>
          <Form.Column><Field value={ endDate } labelIntlId='position-by-job-title.end-date' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ jobTypeShortDescription } labelIntlId='position-by-job-title.job-type' /></Form.Column>
          <Form.Column><Field value={ jobStatusShortDescription } labelIntlId='position-by-job-title.job-status' /></Form.Column>
          <Form.Column><Field.Info value={ jobStatusLongDescription } /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ unionCode } labelIntlId='position-by-job-title.union' /></Form.Column>
          <Form.Column><Field.Info value={ unionDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderLevelsTab() {
    const { isLoading, editMode, digit2Options, isSuggestedHourlyRateExpanded, toggleSuggestedHourlyRateExpand } = this.props;
    const {
      suggestedHourlyRate,
      specificHourlyRate,
      rateOriginType,
      rateOriginDescription,
      rateOriginFunctionalCenter,
      fourDaySchedule,
      shift: { shortDescription: shiftDescription },
      hoursPerDay,
      hoursPer2Weeks,
      fullTimeEquivalent,
      jobGroup,
      jobLevel,
    } = this.props.entry;

    const rateOriginFuncCode =
      (rateOriginType === RATE_ORIGIN_FUNCTIONAL_CENTER_AVERAGE) ?
        rateOriginFunctionalCenter.code :
        undefined;

    return (
      <Form.Tab id='levels' intlId='position-by-job-title.levels' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column2>
            <RadioButton
              value={ rateOriginType !== RATE_ORIGIN_UNKNOWN }
              labelIntlId='position-by-job-title.hourly-rate'
              values={ [
                { value: true, id: 'suggested', intlId: 'position-by-job-title.hourly-rate-suggested' },
                { value: false, id: 'specific', intlId: 'position-by-job-title.hourly-rate-specific' },
              ] }
              editMode={ editMode }
              twoColumnsWidth
            />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Field.Ellipsis
              value={ formatNumber(suggestedHourlyRate, digit2Options) }
              onClick={ this.onSuggestedHourlyRate }
              hideTitle={ true }
            />
          </Form.Column>
          <Form.Column>
            <Field.Number value={ specificHourlyRate } hideTitle />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <SuggestedHourlyRate
          expand={ isSuggestedHourlyRateExpanded }
          toggleExpand={ toggleSuggestedHourlyRateExpand }
          editMode={ editMode }
          rateOriginType={ rateOriginType }
          suggestedHourlyRate={ suggestedHourlyRate }
          jobGroup={ jobGroup }
          jobLevel={ jobLevel }
        />
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ rateOriginDescription } labelIntlId='required-attendance.rate-origin' /></Form.Column>
          <Form.Column><Field value={ rateOriginFuncCode } labelIntlId='position-by-job-title.functional-center' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Checkbox value={ fourDaySchedule } editMode={ editMode } labelIntlId='position-by-job-title.four-day-schedule' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Field value={ shiftDescription } labelIntlId='position-by-job-title.shift' />
          </Form.Column>
          <Form.Column>
            <Field.Number value={ hoursPerDay } labelIntlId='position-by-job-title.hours-per-day' />
          </Form.Column>
          <Form.Column>
            <Field.Number value={ hoursPer2Weeks } labelIntlId='position-by-job-title.hours-per-two-weeks' />
          </Form.Column>
          <Form.Column>
            <Field.Number1 value={ fullTimeEquivalent } labelIntlId='position-by-job-title.full-time-equivalent' />
          </Form.Column>
        </Form.Row>
      </Form.Tab>
    );
  }

  getTotalDistribute(totalDaysToDistribute, hoursPer2Weeks) {
    const { intl, digit2Options } = this.props;
    const days = formatDigits(totalDaysToDistribute, digit2Options);
    const hours = formatDigits(hoursPer2Weeks, digit2Options);
    const daysMessage = intl.formatMessage({ id: 'position-by-job-title.work-schedule.total-days' });
    const hoursMessage = intl.formatMessage({ id: 'position-by-job-title.work-schedule.total-hours' });
    return `${ days } ${ daysMessage } | ${ hours } ${ hoursMessage }`;
  }

  renderWorkSchedule() {
    const {
      isLoading,
      editMode,
      workScheduleDays,
      workScheduleHours,
    } = this.props;
    const {
      hoursPerDay,
      fullTimeEquivalent,
      totalDaysToDistribute,
      totalHoursToDistribute,
      fourDaySchedule,
    } = this.props.entry;
    return (
      <Form.Tab id='work-schedule' intlId='position-by-job-title.work-schedule' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Form.Box>
              <Form.Group>
                <Field.Number small={ true } value={ hoursPerDay } labelIntlId='position-by-job-title.work-schedule.total-hours-per-day' />
                <Field.Number1 small={ true } value={ fullTimeEquivalent } labelIntlId='position-by-job-title.work-schedule.total-fte' />
                <Checkbox value={ fourDaySchedule } editMode={ editMode } labelIntlId='position-by-job-title.work-schedule.four-day-schedule' />
              </Form.Group>
              <Form.Group>
                <Field
                  small={ true }
                  value={ this.getTotalDistribute(totalDaysToDistribute, totalHoursToDistribute) }
                  labelIntlId='position-by-job-title.work-schedule.total-distribute'
                />
              </Form.Group>
            </Form.Box>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ workScheduleDays.rows }
              columns={ workScheduleDays.columns }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ workScheduleHours.rows }
              columns={ workScheduleHours.columns }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderBenefits() {
    const { isLoading, digit2Options } = this.props;
    const {
      benefit: {
        qtyVacation,
        qtyHoliday,
        qtySickDay,
        qtyPsychiatricLeave,
        qtyNightShift,
        qtyVacationFromParameter,
        qtyHolidayFromParameter,
        qtySickDayFromParameter,
        qtyPsychiatricLeaveFromParameter,
        qtyNightShiftFromParameter,
        pctVacation,
        pctHoliday,
        pctSickDay,
        pctPsychiatricLeave,
        pctNightShift,
        pctVacationFromParameter,
        pctHolidayFromParameter,
        pctSickDayFromParameter,
        pctPsychiatricLeaveFromParameter,
        pctNightShiftFromParameter,
      },
      jobStatus: { codeDescription },
      union: { code: unionCode },
    } = this.props.entry;
    const parametersDays = this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-parameters-days' });
    const ifDifferent = this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-if-different' });
    const unionPercentage = (unionCode
        ? this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-union-percentage' })
        : this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-parameters-percentage' })
    );
    const ifDifferentPercentage = this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-if-different-percentage' });
    const benefitsAbsences = this.props.intl.formatMessage({ id: 'position-by-job-title.benefits-absences' });
    const isPartialStatus = (codeDescription === JOB_STATUS_PARTIAL_TIME_REGULAR ||
      codeDescription === JOB_STATUS_PARTIAL_TIME_TEMPORARY || codeDescription === JOB_STATUS_PARTIAL_TIME_CASUAL);

    return (
      <Form.Tab id='benefits' intlId='position-by-job-title.benefits' isLoading={ isLoading }>
        { isPartialStatus && <Form.Row><div className='required-attendance__column-header'>{ benefitsAbsences }</div></Form.Row> }
        <Form.Row>
          <Form.Column><div className='required-attendance__column-header--bold'>{ parametersDays }</div></Form.Column>
          <Form.Column><div className='required-attendance__column-header--bold'>{ ifDifferent }</div></Form.Column>
          { isPartialStatus && <Form.Column><div className='required-attendance__column-header--bold'>{ unionPercentage }</div></Form.Column> }
          { isPartialStatus && <Form.Column><div className='required-attendance__column-header--bold'>{ ifDifferentPercentage }</div></Form.Column> }
          { !isPartialStatus && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtyVacationFromParameter, digit2Options) } labelIntlId='position-by-job-title.benefits-vacation' /></Form.Column>
          <Form.Column><Field value={ formatNumber(qtyVacation, digit2Options) } /></Form.Column>
          { isPartialStatus && <Form.Column><Field.Number value={ pctVacationFromParameter } labelIntlId='position-by-job-title.benefits-vacation-percentage' /></Form.Column> }
          { isPartialStatus && <Form.Column><Field.Number value={ pctVacation } /></Form.Column> }
          { !isPartialStatus && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtyHolidayFromParameter, digit2Options) } labelIntlId='position-by-job-title.benefits-holidays' /></Form.Column>
          <Form.Column><Field value={ formatNumber(qtyHoliday, digit2Options) } /></Form.Column>
          { isPartialStatus && <Form.Column><Field.Number value={ pctHolidayFromParameter } labelIntlId='position-by-job-title.benefits-holidays-percentage' /></Form.Column> }
          { isPartialStatus && <Form.Column><Field.Number value={ pctHoliday } /></Form.Column> }
          { !isPartialStatus && <Form.Column2 /> }
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatNumber(qtySickDayFromParameter, digit2Options) } labelIntlId='position-by-job-title.benefits-sick-days' /></Form.Column>
          <Form.Column><Field value={ formatNumber(qtySickDay, digit2Options) } /></Form.Column>
          { isPartialStatus && <Form.Column><Field.Number value={ pctSickDayFromParameter } labelIntlId='position-by-job-title.benefits-sick-days-percentage' /></Form.Column> }
          { isPartialStatus && <Form.Column><Field.Number value={ pctSickDay } /></Form.Column> }
          { !isPartialStatus && <Form.Column2 /> }
        </Form.Row>
        { isPartialStatus ?
          <Form.Row>
            <Form.Column2 />
            <Form.Column><Field.Number value={ pctPsychiatricLeaveFromParameter } labelIntlId='position-by-job-title.benefits-psych-leave-percentage' /></Form.Column>
            <Form.Column><Field.Number value={ pctPsychiatricLeave } /></Form.Column>
          </Form.Row>
          :
          <Form.Row>
            <Form.Column><Field value={ formatNumber(qtyPsychiatricLeaveFromParameter, digit2Options) } labelIntlId='position-by-job-title.benefits-psych-leave' /></Form.Column>
            <Form.Column><Field value={ formatNumber(qtyPsychiatricLeave, digit2Options) } /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { isPartialStatus ?
          <Form.Row>
            <Form.Column2 />
            <Form.Column><Field.Number value={ pctNightShiftFromParameter } labelIntlId='position-by-job-title.benefits-night-shift-percentage' /></Form.Column>
            <Form.Column><Field.Number value={ pctNightShift } /></Form.Column>
          </Form.Row>
          :
          <Form.Row>
            <Form.Column><Field value={ formatNumber(qtyNightShiftFromParameter, digit2Options) } labelIntlId='position-by-job-title.benefits-night-shift' /></Form.Column>
            <Form.Column><Field value={ formatNumber(qtyNightShift, digit2Options) } /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
      </Form.Tab>
    );
  }

  renderPayrollDeduction() {
    const { isLoading, editMode } = this.props;
    const {
      globalPayrollDeduction: {
        code: globalPayrollDeductionCode,
      },
      globalPayrollDeductionParameter: {
        code: globalPayrollDeductionParameterCode,
      },
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
          CanadaPensionPlan: { code: scodeCPP },
          WorkersCompensationBoard: { code: scodeWCB },
          HealthCarePlan: { code: scodeHCP },
          EmploymentInsurance: { code: scodeEI },
          PensionPlan: { code: scodePension },
          QuebecParentalInsurancePlan: { code: scodeQPIP },
        },
        calculateTaxableAmaunt,
        dateFrom,
        dateTo,
        amaunt,
        specificAmount,
        specificPayrollDeductions,
      },
      isSpecificPayrollDeduction,
    } = this.props.entry;
    return (
      <Form.Tab id='payroll-deduction' intlId='position-by-job-title.payroll-deductions' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column2>
            <RadioButton
              value={ !!isSpecificPayrollDeduction }
              labelIntlId='position-by-job-title.payroll-deductions.title'
              values={ [
                { value: false, id: 'global', intlId: 'position-by-job-title.payroll-deductions.global' },
                { value: true, id: 'specific', intlId: 'position-by-job-title.payroll-deductions.specific' },
              ] }
              editMode={ editMode }
              twoColumnsWidth
            />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ globalPayrollDeductionParameterCode } labelIntlId='position-by-job-title.payroll-deductions.global-parameters' /></Form.Column>
          <Form.Column><Field value={ globalPayrollDeductionCode } labelIntlId='position-by-job-title.payroll-deductions.if-different' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Checkbox single={ true } value={ specificPayrollDeductions } editMode={ editMode } labelIntlId='position-by-job-title.payroll-deductions.customized' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <div className='employee-view__column-title'>
              <FormattedMessage id='employee.title-parameters' defaultMessage='Parameters' />
            </div>
          </Form.Column>
          { specificPayrollDeductions ?
            <Form.Column>
              <div className='employee-view__column-title'>
                <FormattedMessage id='employee.title-specific' defaultMessage='Customized' />
              </div>
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeCPP } labelIntlId='position-by-job-title.payroll-deductions.cpp' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeCPP } labelIntlId='position-by-job-title.payroll-deductions.cpp' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeWCB } labelIntlId='position-by-job-title.payroll-deductions.wcb' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeWCB } labelIntlId='position-by-job-title.payroll-deductions.wcb' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeHCP } labelIntlId='position-by-job-title.payroll-deductions.hcp' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeHCP } labelIntlId='position-by-job-title.payroll-deductions.hcp' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeEI } labelIntlId='position-by-job-title.payroll-deductions.ei' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeEI } labelIntlId='position-by-job-title.payroll-deductions.ei' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codePension } labelIntlId='position-by-job-title.payroll-deductions.pension' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodePension } labelIntlId='position-by-job-title.payroll-deductions.pension' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeQPIP } labelIntlId='position-by-job-title.payroll-deductions.qpip' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeQPIP } labelIntlId='position-by-job-title.payroll-deductions.qpip' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Checkbox single={ true } value={ calculateTaxableAmaunt } editMode={ editMode } labelIntlId='position-by-job-title.payroll-deductions.calculate-taxable-amount' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number value={ amaunt } labelIntlId='position-by-job-title.payroll-deductions.taxable-wage-amount' /></Form.Column>
          <Form.Column><Field.Info value={ this.makePayrollRange(dateFrom, dateTo) } /></Form.Column>
          <Form.Column><Field.Number value={ specificAmount } labelIntlId='position-by-job-title.payroll-deductions.specific-taxable-amount' /></Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  makePayrollRange(from, to) {
    const { intl } = this.props;
    const fromLabel = intl.formatMessage({ id: 'position-by-job-title.payroll-deductions.from' });
    const toLabel = intl.formatMessage({ id: 'position-by-job-title.payroll-deductions.to' });
    return `${ fromLabel } ${ from } ${ toLabel } ${ to }`;
  }

  renderPremiums() {
    const {
      isLoading,
      premiums,
    } = this.props;
    const {
      jobStatus: { shortDescription: jobStatusShortDescription },
      hoursPer2Weeks,
    } = this.props.entry;
    return (
      <Form.Tab id='premiums' intlId='position-by-job-title.premiums' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Form.Box>
              <Form.Group>
                <Field small={ true } selected={ true } value={ jobStatusShortDescription } labelIntlId='position-by-job-title.payroll-deductions.total-status' />
              </Form.Group>
              <Form.Group>
                <Field.Number small={ true } value={ hoursPer2Weeks } labelIntlId='position-by-job-title.payroll-deductions.total-hours-per-2-weeks' />
              </Form.Group>
            </Form.Box>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ premiums.rows }
              columns={ premiums.columns }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderReplacements() {
    const { isLoading, replacements } = this.props;
    return (
      <Form.Tab id='replacements' intlId='position-by-job-title.replacements' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ replacements.rows }
              columns={ replacements.columns }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  getTitle(number, description) {
    const names = [number, description];
    return names.join(' ');
  }

  render() {
    const { number, description, isActivePositionByJobTitle = true } = this.props.entry;
    const { isLoading } = this.props;
    return (
      <div className='position-by-job-title'>
        <div className='position-by-job-title__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='position-by-job-title__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='position-by-job-title.title' message={ this.getTitle(number, description) } />
                  { !isLoading && !isActivePositionByJobTitle &&
                    <div className='position-by-job-title__inactive'>
                      <FormattedMessage id='position-by-job-title.inactive' defaultMessage='Inactive position' />
                    </div>
                  }
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              <Form.Tabs active='position'>
                { this.renderMainTab() }
                { this.renderLevelsTab() }
                { this.renderWorkSchedule() }
                { this.renderBenefits() }
                { this.renderPayrollDeduction() }
                { this.renderPremiums() }
                { this.renderReplacements() }
              </Form.Tabs>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(PositionByJobTitle);
