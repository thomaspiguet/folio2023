import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { autobind } from 'core-decorators';

import { ScrollBox } from '../../components/general/scroll-box';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import RadioButton from '../../components/controls/radio-button';
import Employee from '../../components/controls/employee';

import { getPosition } from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import {
  toggleShowOtherPositions,
  toggleOriginOfReplacementsExpand,
} from './actions';
import {
  extractWorkScheduleDays,
  extractWorkScheduleHours,
  extractPremiums,
  extractReplacements,
  extractOtherPositions,
  extractOriginReplacements,
} from './selectors';
import { OtherPositions } from './other-positions';
import { OriginReplacements } from '../required-attendances/origin-of-replacements';
import './position.scss';
import '../../../styles/content-gradient.scss';
import { getDigit1Options, getDigit2Options, formatDigits } from '../../utils/selectors/currency';

const titleIcon = 'position';

defineMessages({
  totalStatus: {
    id: 'position.total-status',
    defaultMessage: 'STATUS',
  },
  totalHoursPer2Weeks: {
    id: 'position.total-hours-per-2-weeks',
    defaultMessage: 'HRS/2 WKS',
  },
  title: {
    id: 'position.title',
    defaultMessage: 'Position',
  },
  fte: {
    id: 'position.total-fte',
    defaultMessage: 'FTE',
  },
  totalDistribute: {
    id: 'position.total-distribute',
    defaultMessage: 'TOTAL DISTRIBUTE',
  },
  totalHoursPerDay: {
    id: 'position.total-hours-per-day',
    defaultMessage: 'HOURS PER DAY',
  },
  totalDays: {
    id: 'position.total-days',
    defaultMessage: 'days',
  },
  totalHours: {
    id: 'position.total-hours',
    defaultMessage: 'hours',
  },
  edit: {
    id: 'position.edit',
    defaultMessage: 'EDIT',
  },
  position: {
    id: 'position.position',
    defaultMessage: 'Position',
  },
  employee: {
    id: 'position.employee',
    defaultMessage: 'Employee',
  },
  workSchedule: {
    id: 'position.work-schedule',
    defaultMessage: 'Work schedule',
  },
  premiums: {
    id: 'position.premiums',
    defaultMessage: 'Premiums',
  },
  replacements: {
    id: 'position.replacements',
    defaultMessage: 'Replacements',
  },
  year: {
    id: 'position.year',
    defaultMessage: 'Financial year:',
  },
  scenario: {
    id: 'position.scenario',
    defaultMessage: 'Scenario:',
  },
  forThisScenario: {
    id: 'position.for-this-scenario',
    defaultMessage: 'For this scenario',
  },
  funcCode: {
    id: 'position.func-code',
    defaultMessage: 'Functional center:',
  },
  number: {
    id: 'position.number',
    defaultMessage: 'Position number:',
  },
  description: {
    id: 'position.description',
    defaultMessage: 'Description:',
  },
  financialYear: {
    id: 'position.financial-year',
    defaultMessage: 'Financial year:',
  },
  startDate: {
    id: 'position.start-date',
    defaultMessage: 'Start:',
  },
  endDate: {
    id: 'position.end-date',
    defaultMessage: 'End:',
  },
  typeActual: {
    id: 'position.type-actual',
    defaultMessage: 'Actual',
  },
  typeVacant: {
    id: 'position.type-vacant',
    defaultMessage: 'Vacant',
  },
  union: {
    id: 'position.union',
    defaultMessage: 'Union:',
  },
  positionType: {
    id: 'position.type',
    defaultMessage: 'Position type:',
  },
  fourDaySchedule: {
    id: 'position.schedule-4-day',
    defaultMessage: '4-day schedule',
  },
  weekend: {
    id: 'position.schedule-weekend',
    defaultMessage: 'Weekend (2 days)',
  },
  jobType: {
    id: 'position.job-type',
    defaultMessage: 'Job type:',
  },
  jobStatus: {
    id: 'position.job-status',
    defaultMessage: 'Job status:',
  },
  jobTitle: {
    id: 'position.job-title',
    defaultMessage: 'Job title:',
  },
  titleForCalculation: {
    id: 'position.title-for-calculation',
    defaultMessage: 'Job title used for calculation:',
  },
  titlePosition: {
    id: 'position.title-position',
    defaultMessage: 'Position',
  },
  titleEmployee: {
    id: 'position.title-employee',
    defaultMessage: 'Employee',
  },
  shift: {
    id: 'position.shift',
    defaultMessage: 'Shift:',
  },
  specificHourlyRate: {
    id: 'position.specific-hourly-rate',
    defaultMessage: 'Specific hourly rate:',
  },
  hoursPerDay: {
    id: 'position.hours-per-day',
    defaultMessage: 'Hours per day:',
  },
  hoursPer2Weeks: {
    id: 'position.hours-per-2-weeks',
    defaultMessage: 'Hours per 2 weeks:',
  },
  taskPercentage: {
    id: 'position.task-percentage',
    defaultMessage: 'Task percentage:',
  },
  fullTimeEquivalent: {
    id: 'position.full-time-equivalent',
    defaultMessage: 'Full-time equivalent:',
  },
  employeeTitle: {
    id: 'position.employee-title',
    defaultMessage: 'EMPLOYEE',
  },
});

@connect(state => ({
  entry: state.positions.entry,
  scenarioId: state.scenario.selectedScenario.scenarioId,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  year: state.scenario.selectedScenario.year,
  isLoading: state.positions.isLoading,
  isLoadingOriginReplacements: state.positions.isLoadingOriginReplacements,
  prevPositionId: state.positions.positionId,
  workScheduleDays: extractWorkScheduleDays(state),
  workScheduleHours: extractWorkScheduleHours(state),
  isShowOtherPositions: state.positions.isShowOtherPositions,
  employeeOtherPositions: extractOtherPositions(state),
  premiums: extractPremiums(state),
  replacements: extractReplacements(state),
  isOriginOfReplacementsExpanded: state.positions.isOriginOfReplacementsExpanded,
  originReplacements: extractOriginReplacements(state),
  digit2Options: getDigit2Options(state),
  digit1Options: getDigit1Options(state),
}), (dispatch) => bindActionCreators({
  getPosition,
  toggleShowOtherPositions,
  toggleOriginOfReplacementsExpand,
  setTitle,
}, dispatch))
class Position extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.any,
    isLoadingOriginReplacements: PropTypes.bool,
    scenarioId: PropTypes.number,
    positionId: PropTypes.string,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    isShowOtherPositions: PropTypes.bool,
    toggleShowOtherPositions: PropTypes.func,
    isOriginOfReplacementsExpanded: PropTypes.bool,
    toggleOriginOfReplacementsExpand: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

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
    props.getPosition(positionId);
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
  handleShowOtherPositionsClick() {
    this.props.toggleShowOtherPositions();
  }

  renderReplacements() {
    const {
      isLoading,
      scenarioId,
      editMode,
      positionId,
      replacements,
      originReplacements,
      isLoadingOriginReplacements,
      isOriginOfReplacementsExpanded,
      toggleOriginOfReplacementsExpand,
    } = this.props;
    const {
      employee: { firstName, lastName, employeeNumber, id: employeeId },
      jobStatus: { shortDescription: jobStatusShortDescription },
      hoursPer2Weeks,
    } = this.props.entry;

    const POSITION_ORIGIN_TYPE = 'Position';

    return (
      <Form.Tab id='replacements' intlId='position.replacements' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              labelIntlId='position.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            >
              <Field small={ true } selected={ true } value={ jobStatusShortDescription } labelIntlId='position.total-status' />
              <Field.Number small={ true } value={ hoursPer2Weeks } labelIntlId='position.total-hours-per-2-weeks' />
            </Employee>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ replacements.rows }
              columns={ replacements.columns }
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
          entry={ this.state.newEntry || this.props.entry }
          originId={ +positionId }
          originType={ POSITION_ORIGIN_TYPE }
        />
      </Form.Tab>
    );
  }

  renderPremiums() {
    const { isLoading, premiums, scenarioId } = this.props;
    const {
      employee: { firstName, lastName, employeeNumber, id: employeeId },
      jobStatus: { shortDescription: jobStatusShortDescription },
      hoursPer2Weeks,
    } = this.props.entry;
    return (
      <Form.Tab id='premiums' intlId='position.premiums' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              labelIntlId='position.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            >
              <Field small={ true } selected={ true } value={ jobStatusShortDescription } labelIntlId='position.total-status' />
              <Field.Number small={ true } value={ hoursPer2Weeks } labelIntlId='position.total-hours-per-2-weeks' />
            </Employee>
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

  getTotalDistribute(totalDaysToDistribute, hoursPer2Weeks) {
    const { intl, digit2Options } = this.props;
    const days = formatDigits(totalDaysToDistribute, digit2Options);
    const hours = formatDigits(hoursPer2Weeks, digit2Options);
    const daysMessage = intl.formatMessage({ id: 'position.total-days' });
    const hoursMessage = intl.formatMessage({ id: 'position.total-hours' });
    return `${ days } ${ daysMessage } | ${ hours } ${ hoursMessage }`;
  }

  renderWorkSchedule() {
    const {
      isLoading,
      workScheduleDays,
      workScheduleHours,
      scenarioId,
    } = this.props;
    const {
      employee: { firstName, lastName, employeeNumber, id: employeeId },
      hoursPerDay,
      fullTimeEquivalent,
      totalDaysToDistribute,
      hoursPer2Weeks,
    } = this.props.entry;
    return (
      <Form.Tab id='work-schedule' intlId='position.work-schedule' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              labelIntlId='position.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            >
              <Field.Number small={ true } value={ hoursPerDay } labelIntlId='position.total-hours-per-day' />
              <Field.Number1 small={ true } value={ fullTimeEquivalent } labelIntlId='position.total-fte' />
              <Field
                small={ true }
                value={ this.getTotalDistribute(totalDaysToDistribute, hoursPer2Weeks) }
                labelIntlId='position.total-distribute'
              />
            </Employee>
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

  renderEmployeeTab() {
    const { isLoading, editMode, scenarioId } = this.props;
    const {
      employee: { firstName, lastName, employeeNumber, id: employeeId },
      jobType: { shortDescription: jobTypeShortDescription },
      jobStatus: { shortDescription: jobStatusShortDescription, longDescription: jobStatusLongDescription },
      jobTitle: { description: jobTitleDescription, notaryEmploymentCode },
      isEmployeeJobTitle,
      shift: { shortDescription: shiftShortDescription },
      hoursPerDay,
      hoursPer2Weeks,
      specificHourlyRate,
      taskPercentage,
      fullTimeEquivalent,
      // employeeOtherPositions,
    } = this.props.entry;

    const {
      employeeOtherPositions,
      isShowOtherPositions,
    } = this.props;

    const toggleClassNames = classnames('position__toggle-btn', {
      'position__toggle-btn--expanded': isShowOtherPositions,
    });

    return (
      <Form.Tab id='employee' intlId='position.employee' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              labelIntlId='position.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ jobTypeShortDescription } labelIntlId='position.job-type' /></Form.Column>
          <Form.Column><Field value={ jobStatusShortDescription } labelIntlId='position.job-status' /></Form.Column>
          <Form.Column><Field.Info value={ jobStatusLongDescription } /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ notaryEmploymentCode } labelIntlId='position.job-title' /></Form.Column>
          <Form.Column><Field.Info value={ jobTitleDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <RadioButton
              value={ isEmployeeJobTitle }
              labelIntlId='position.title-for-calculation'
              values={ [
                { value: false, id: 'position', intlId: 'position.title-position' },
                { value: true, id: 'employee', intlId: 'position.title-employee' },
              ] }
              editMode={ editMode }
            />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ shiftShortDescription } labelIntlId='position.shift' /></Form.Column>
          <Form.Column><Field.Number value={ hoursPerDay } labelIntlId='position.hours-per-day' /></Form.Column>
          <Form.Column><Field.Number value={ taskPercentage } labelIntlId='position.task-percentage' /></Form.Column>
          <Form.Column />

        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number value={ specificHourlyRate } labelIntlId='position.specific-hourly-rate' /></Form.Column>
          <Form.Column><Field.Number value={ hoursPer2Weeks } labelIntlId='position.hours-per-2-weeks' /></Form.Column>
          <Form.Column><Field.Number1 value={ fullTimeEquivalent } labelIntlId='position.full-time-equivalent' /></Form.Column>
          <Form.Column />
        </Form.Row>

        <Form.Row>
          <Form.Column4>
            <div
              className={ toggleClassNames }
              onClick={ this.handleShowOtherPositionsClick }
            >
              {
                isShowOtherPositions ?
                  <FormattedMessage
                    id='positions.hide-other-positions-toggle-button'
                    defaultMessage='Hide other positions'
                  />
                  :
                  <FormattedMessage
                    id='positions.show-other-positions-toggle-button'
                    defaultMessage='Show other positions'
                  />
              }
            </div>
          </Form.Column4>
        </Form.Row>
        <OtherPositions
          expand={ isShowOtherPositions }
          employeeOtherPositions={ employeeOtherPositions }
        />
      </Form.Tab>
    );
  }

  renderMainTab() {
    const { isLoading, year, scenarioDescription, editMode } = this.props;
    const {
      description,
      forThisScenario,
      functionalCenter: { code: funcCode, longDescription: funcDescription },
      number,
      positionDuration: { isFinancialYear, startDate, endDate },
      isActualPosition,
      union: { code: unionCode, longDescription: unionDescription },
      fourDaySchedule,
      weekend2Days,
    } = this.props.entry;
    return (
      <Form.Tab id='position' intlId='position.position' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column><Field value={ year } labelIntlId='position.year' /></Form.Column>
          <Form.Column><Field value={ scenarioDescription } labelIntlId='position.scenario' /></Form.Column>
          <Form.Column><Checkbox value={ forThisScenario } editMode={ editMode } labelIntlId='position.for-this-scenario' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ funcCode } labelIntlId='position.func-code' /></Form.Column>
          <Form.Column><Field.Info value={ funcDescription } /></Form.Column>
          <Form.Column><Field value={ number } labelIntlId='position.number' /></Form.Column>
          <Form.Column><Field value={ description } labelIntlId='position.description' /></Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <FormattedMessage id='position.duration' defaultMessage='Position duration:' />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row halfTopMargin>
          <Form.Column>
            <Checkbox single value={ isFinancialYear } editMode={ editMode } labelIntlId='position.financial-year' />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ startDate } labelIntlId='position.start-date' /></Form.Column>
          <Form.Column><Field value={ endDate } labelIntlId='position.end-date' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <RadioButton
              value={ isActualPosition }
              labelIntlId='position.type'
              values={ [
                { value: true, id: 'actual', intlId: 'position.type-actual' },
                { value: false, id: 'vacant', intlId: 'position.type-vacant' },
              ] }
              editMode={ editMode }
            />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ unionCode } labelIntlId='position.union' /></Form.Column>
          <Form.Column><Field.Info value={ unionDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <Checkbox single={ true } value={ fourDaySchedule } editMode={ editMode } labelIntlId='position.schedule-4-day' />
          </Form.Column>
          <Form.Column>
            <Checkbox single={ true } value={ weekend2Days } editMode={ editMode } labelIntlId='position.schedule-weekend' />
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  getTitle(number, description) {
    const names = [number, description];
    return names.join(' ');
  }

  render() {
    const { number, description, isActivePosition = true } = this.props.entry;
    const { isLoading } = this.props;
    return (
      <div className='position'>
        <div className='position__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='position__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='position.title' message={ this.getTitle(number, description) } />
                  { !isLoading && !isActivePosition &&
                    <div className='position__inactive'>
                      <FormattedMessage id='position.inactive' defaultMessage='Inactive position' />
                    </div>
                  }
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              <Form.Tabs active='position'>
                { this.renderMainTab() }
                { this.renderEmployeeTab() }
                { this.renderWorkSchedule() }
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

export default injectIntl(Position);
