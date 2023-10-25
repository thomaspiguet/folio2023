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

import { getParameterByStructure } from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { extractGlobalPremium } from './selectors';
import {
  extractParameterByStructureCalendar,
  extractParametersByStructureOtherNonWorkDays,
} from '../global-parameters/selectors/calendar-and-other-non-work-days';
import { extractReplacementsManagement, extractReplacementsNonManagement } from '../global-parameters/selectors/replacements';
import { AverageHourlyRate } from '../global-parameters/parameters-average-hourly-rate';
import ModelsAndBenefits from './models-and-benefits';
import Replacements from './replacements';

import { formatDigits, getDigit2Options } from '../../utils/selectors/currency';

import './parameters-by-structure.scss';
import '../../../styles/content-gradient.scss';

const titleIcon = 'position';
const GROUP_CODE = {
  UNADMIN: 'UNADMIN',
};

defineMessages({
  title: {
    id: 'parameters-by-structure.item.title',
    defaultMessage: 'Parameters by structure:',
  },
  detailsTabTitle: {
    id: 'parameters-by-structure.item.details',
    defaultMessage: 'Parameters by structure',
  },
  historyTabTitle: {
    id: 'parameters-by-structure.item.benefits',
    defaultMessage: 'Benefits',
  },
  year: {
    id: 'parameters-by-structure.item.year',
    defaultMessage: 'Financial year:',
  },
  group: {
    id: 'parameters-by-structure.item.group',
    defaultMessage: 'Group:',
  },
  code: {
    id: 'parameters-by-structure.item.code',
    defaultMessage: 'Code:',
  },
  vacation: {
    id: 'parameters-by-structure.item.vacation',
    defaultMessage: 'Vacation:',
  },
  holidays: {
    id: 'parameters-by-structure.item.holidays',
    defaultMessage: 'Holidays:',
  },
  sick: {
    id: 'parameters-by-structure.item.sick',
    defaultMessage: 'Sick days:',
  },
  psych: {
    id: 'parameters-by-structure.item.psych',
    defaultMessage: 'Psychiatric leave:',
  },
  calendar: {
    id: 'parameters-by-structure.item.calendar',
    defaultMessage: 'Required attendance',
  },
  hours: {
    id: 'parameters-by-structure.item.hours',
    defaultMessage: 'Hours:',
  },
  amounts: {
    id: 'parameters-by-structure.item.amounts',
    defaultMessage: 'Amounts:',
  },
  replacements: {
    id: 'parameters-by-structure.item.replacements',
    defaultMessage: 'Replacements',
  },
  requestsForReplacements: {
    id: 'parameters-by-structure.item.requests-for-replacements',
    defaultMessage: 'Hourly rate used for replacement',
  },
  vacant: {
    id: 'parameters-by-structure.item.vacant-positions-and-requests',
    defaultMessage: 'Vacant positions and requests',
  },
  averageHourlyRate: {
    id: 'parameters-by-structure.item.average-hourly-rate',
    defaultMessage: 'Average hourly rate',
  },
  globalTab: {
    id: 'parameters-by-structure.item.global-tab',
    defaultMessage: 'Global',
  },
  vacationTitle: {
    id: 'parameters-by-structure.item.vacation-title',
    defaultMessage: 'Vacation',
  },
  holidaysTitle: {
    id: 'parameters-by-structure.item.holidays-title',
    defaultMessage: 'Holidays',
  },
  vacationNumberOfAbsenceDaysPartTime: {
    id: 'parameters-by-structure.item.vacation-number-of-absence-days-part-time',
    defaultMessage: 'Number of absence days - Part-time:',
  },
  holidaysGroupFullTime: {
    id: 'parameters-by-structure.item.holidays-group-full-time',
    defaultMessage: 'Holidays group - Full-time:',
  },
  holidaysNumberOfAbsenceDaysPartTime: {
    id: 'parameters-by-structure.item.holidays-number-of-absence-days-part-time',
    defaultMessage: 'Number of absence days - Part-time:',
  },

  globalSpecificPayrollDeductionsTitle: {
    id: 'parameters-by-structure.item.global-specific-payroll-deductions-title',
    defaultMessage: 'Global specific payroll deductions',
  },
  globalPayrollDeductionTitle: {
    id: 'parameters-by-structure.item.global-payroll-deduction-title',
    defaultMessage: 'Global payroll deduction',
  },
  basedOnGlobalParametersTitle: {
    id: 'parameters-by-structure.item.based-on-global-parameters-title',
    defaultMessage: 'Based on global parameters',
  },
  ifDifferentTitle: {
    id: 'parameters-by-structure.item.if-different-title',
    defaultMessage: 'If different',
  },

  basedOnGlobalParametersWcb: {
    id: 'parameters-by-structure.item.based-on-global-parameters-wcb',
    defaultMessage: 'WCB:',
  },
  ifDifferentWcb: {
    id: 'parameters-by-structure.item.if-different-wcb',
    defaultMessage: 'WCB:',
  },
  defaultGlobalPayrollDeduction: {
    id: 'parameters-by-structure.item.default-global-payroll-deduction',
    defaultMessage: 'Default global payroll deduction:',
  },
  basedOnGlobalParametersPension: {
    id: 'parameters-by-structure.item.based-on-global-parameters-pension',
    defaultMessage: 'Pension:',
  },
  ifDifferentPension: {
    id: 'parameters-by-structure.item.if-different-pension',
    defaultMessage: 'Pension:',
  },
  expectedSickFullTimeManagement: {
    id: 'parameters-by-structure.expected-sick-days-full-time-management',
    defaultMessage: 'Number of days - Full-time management:',
  },
  expectedSickFullTimeNonManagement: {
    id: 'parameters-by-structure.expected-sick-days-full-time-non-management',
    defaultMessage: 'Number of days - Full-time non-management:',
  },
  expectedSickPartTime: {
    id: 'parameters-by-structure.expected-sick-days-part-time',
    defaultMessage: 'Number of days - Part-time:',
  },
  sickDaysTitle: {
    id: 'parameters-by-structure.expected-sick-days-title',
    defaultMessage: 'Expected sick days per employee',
  },
  psychiatricTitle: {
    id: 'parameters-by-structure.psychiatric-title',
    defaultMessage: 'Psychiatric leave',
  },
  psychiatricCalculation: {
    id: 'parameters-by-structure.psychiatric-calculation',
    defaultMessage: 'Psychiatric leave calculation for positions and requests',
  },
  globalPremiumTitle: {
    id: 'parameters-by-structure.item.global-premium-title',
    defaultMessage: 'Global premium',
  },
  fourDaysScheduleTitle: {
    id: 'parameters-by-structure.four-days-schedule.title',
    defaultMessage: '4-day schedule',
  },
  fourDaysVacationFullTime: {
    id: 'parameters-by-structure.four-days-schedule.vacation-days-full-time',
    defaultMessage: 'Number of vacation days - Full-time:',
  },
  fourDaysHolidaysFullTime: {
    id: 'parameters-by-structure.four-days-schedule.holiday-full-time',
    defaultMessage: 'Holidays group - Full-time:',
  },
  fourDaysVacationTitle: {
    id: 'parameters-by-structure.four-days-schedule.vacation-title',
    defaultMessage: 'Vacation',
  },
  fourDaysHolidaysTitle: {
    id: 'parameters-by-structure.four-days-schedule.holidays-title',
    defaultMessage: 'Holidays',
  },
  fourDaysSickDaysTitle: {
    id: 'parameters-by-structure.four-days-schedule.sick-days-title',
    defaultMessage: 'Sick days',
  },
  fourDaysSickDaysFullTimeManagement: {
    id: 'parameters-by-structure.four-days-schedule.sick-days-full-time-management',
    defaultMessage: 'Number of days - Full-time management:',
  },
  fourDaysSickDaysFullTimeNonManagement: {
    id: 'parameters-by-structure.four-days-schedule.sick-days-full-time-non-management',
    defaultMessage: 'Number of days - Full-time non-management:',
  },
  fourDaysSickDaysBank: {
    id: 'parameters-by-structure.four-days-schedule.sick-days-bank',
    defaultMessage: 'Sick days bank:',
  },
});

@connect(state => ({
  scenarioCode: state.scenario.selectedScenario.scenarioCode,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  year: state.scenario.selectedScenario.year,
  entry: state.parametersByStructure.entry,
  isLoading: state.parametersByStructure.isLoading,
  prevId: state.parametersByStructure.id,
  calendar: extractParameterByStructureCalendar(state),
  otherNonWorkDays: extractParametersByStructureOtherNonWorkDays(state),
  replacementsManagement: extractReplacementsManagement(state),
  replacementsNonManagement: extractReplacementsNonManagement(state),
  globalPremium: extractGlobalPremium(state),
  digit2Options: getDigit2Options(state),
}), (dispatch) => bindActionCreators({
  getParameterByStructure,
  setTitle,
}, dispatch))
class OtherExpenses extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.any,
    id: PropTypes.string,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    super.componentDidMount();
    this.load(this.props);
    this.onChangeProps(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  componentWillReceiveProps(props) {
    this.onChangeProps(props);
  }

  onChangeProps(props) {
    const { code, longDescription } = props.entry.code;
    const { setTitle } = props;
    setTitle(this.getTitle(code, longDescription));
  }

  load(props) {
    const { id, prevId } = props;
    if (id === prevId) {
      return;
    }
    props.getParameterByStructure(id);
  }

  @autobind
  onEdit() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  getTitle(code, description) {
    const names = [code, description];
    return names.join(' ');
  }

  renderGlobalTab() {
    const { isLoading, globalPremium } = this.props;
    const {
      group: { code: groupCode },
      globalPayrollDeduction: {
        code: globalPayrollDeductionCode,
      },
      globalSpecificPayrollDeduction: {
        PensionPlan: { description: globalSpecificPayrollDeductionPensionPlanDescription },
        WorkersCompensationBoard: { description: globalSpecificPayrollDeductionWorkersCompensationBoardDescription },
      },
      globalSpecificPayrollDeductionCustom: {
        PensionPlan: { description: globalSpecificPayrollDeductionCustomPensionPlanDescription },
        WorkersCompensationBoard: { description: globalSpecificPayrollDeductionCustomWorkersCompensationBoardDescription },
      },
    } = this.props.entry;

    const globalSpecificPayrollDeductionsTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.global-specific-payroll-deductions-title' });
    const globalPayrollDeductionTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.global-payroll-deduction-title' });
    const basedOnGlobalParametersTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.based-on-global-parameters-title' });
    const ifDifferentTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.if-different-title' });
    const globalPremiumTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.global-premium-title' });
    const showPremium = groupCode === GROUP_CODE.UNADMIN;

    return (
      <Form.Tab id='global' intlId='parameters-by-structure.item.global-tab' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column2>
            <div className='parameters-by-structure__column-header--bold'>{ globalSpecificPayrollDeductionsTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='parameters-by-structure__column-header--bold'>{ globalPayrollDeductionTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__column-header'>{ basedOnGlobalParametersTitle }</div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__column-header'>{ ifDifferentTitle }</div>
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ globalSpecificPayrollDeductionWorkersCompensationBoardDescription } labelIntlId='parameters-by-structure.item.based-on-global-parameters-wcb' /></Form.Column>
          <Form.Column><Field value={ globalSpecificPayrollDeductionCustomWorkersCompensationBoardDescription } labelIntlId='parameters-by-structure.item.if-different-wcb' /></Form.Column>
          <Form.Column><Field value={ globalPayrollDeductionCode } labelIntlId='parameters-by-structure.item.default-global-payroll-deduction' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ globalSpecificPayrollDeductionPensionPlanDescription } labelIntlId='parameters-by-structure.item.based-on-global-parameters-pension' /></Form.Column>
          <Form.Column><Field value={ globalSpecificPayrollDeductionCustomPensionPlanDescription } labelIntlId='parameters-by-structure.item.if-different-pension' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        {showPremium &&
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__column-header'>{globalPremiumTitle}</div>
          </Form.Column4>
        </Form.Row>
        }
        { showPremium &&
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ globalPremium.rows }
              columns={ globalPremium.columns }
            />
          </Form.Column4>
        </Form.Row>
        }
      </Form.Tab>
    );
  }

  renderFourDaysScheduleTab() {
    const { isLoading, digit2Options } = this.props;
    const {
      fourDaysScheduleVacationDays,
      fourDaysScheduleHolidayGroup: { code: fourDaysScheduleHolidayGroupDescription },
      fourDaysScheduleSickDays: {
        numberOfDaysFullTime: fourDaysScheduleSickDaysNumberOfDaysFullTimeNonManagement,
        numberOfDaysFullTimeManagement: fourDaysScheduleSickDaysNumberOfDaysFullTimeManagement,
        sickLeaveBank: fourDaysScheduleSickDaysBank,
      },
    } = this.props.entry;

    const fourDaysVacationTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.four-days-schedule.vacation-title' });
    const fourDaysHolidaysTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.four-days-schedule.holidays-title' });
    const fourDaysSickDaysTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.four-days-schedule.sick-days-title' });

    return (
      <Form.Tab id='four-days-schedule' intlId='parameters-by-structure.four-days-schedule.title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__column-header--bold'>{ fourDaysVacationTitle }</div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__column-header--bold'>{ fourDaysHolidaysTitle }</div>
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(fourDaysScheduleVacationDays, digit2Options) } labelIntlId='parameters-by-structure.four-days-schedule.vacation-days-full-time' /></Form.Column>
          <Form.Column><Field value={ fourDaysScheduleHolidayGroupDescription } labelIntlId='parameters-by-structure.four-days-schedule.holiday-full-time' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__column-header--bold'>{ fourDaysSickDaysTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(fourDaysScheduleSickDaysNumberOfDaysFullTimeNonManagement, digit2Options) } labelIntlId='parameters-by-structure.four-days-schedule.sick-days-full-time-non-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(fourDaysScheduleSickDaysNumberOfDaysFullTimeManagement, digit2Options) } labelIntlId='parameters-by-structure.four-days-schedule.sick-days-full-time-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(fourDaysScheduleSickDaysBank, digit2Options) } labelIntlId='parameters-by-structure.four-days-schedule.sick-days-bank' /></Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderAverageHourlyRateTab() {
    const { isLoading, editMode } = this.props;
    const {
      replacement: {
        rateOriginType: replacementHourlyRateOriginType,
        jobGroupType: replacementHourlyRateJobGroupType,
        jobGroupValue: replacementHourlyRateJobGroupValue,
        jobLevelType: replacementHourlyRateJobLevelType,
        jobLevelValue: replacementHourlyRateJobLevelValue,
      },
      vacantPositionAndRequest: {
        rateOriginType: vacantHourlyRateOriginType,
        jobGroupType: vacantHourlyRateJobGroupType,
        jobGroupValue: vacantHourlyRateJobGroupValue,
        jobLevelType: vacantHourlyRateJobLevelType,
        jobLevelValue: vacantHourlyRateJobLevelValue,
      },
    } = this.props.entry;

    return (
      <Form.Tab id='average-hourly-rate' intlId='parameters-by-structure.item.average-hourly-rate' isLoading={ isLoading }>
        <AverageHourlyRate
          expand={ true }
          editMode={ editMode }
          labelIntlId='parameters-by-structure.item.requests-for-replacements'
          rateOriginType={ replacementHourlyRateOriginType }
          jobGroup={ replacementHourlyRateJobGroupType }
          jobGroupValue={ replacementHourlyRateJobGroupValue }
          jobLevel={ replacementHourlyRateJobLevelType }
          jobLevelValue={ replacementHourlyRateJobLevelValue }
          haveParameters
        />
        <Form.Separator />
        <AverageHourlyRate
          expand={ true }
          editMode={ editMode }
          labelIntlId='parameters-by-structure.item.vacant-positions-and-requests'
          rateOriginType={ vacantHourlyRateOriginType }
          jobGroup={ vacantHourlyRateJobGroupType }
          jobGroupValue={ vacantHourlyRateJobGroupValue }
          jobLevel={ vacantHourlyRateJobLevelType }
          jobLevelValue={ vacantHourlyRateJobLevelValue }
          haveParameters
        />
      </Form.Tab>
    );
  }

  renderDetailsTab() {
    const { isLoading, digit2Options, editMode, entry } = this.props;
    const {
      financialYear: { code: year },
      group: { shortDescription: group },
      code: { code, longDescription: codeDescription },
      expectedSickDaysPerEmployee: {
        numberOfDaysFullTime: expectedSickFullTimeNonManagement,
        numberOfDaysFullTimeManagement: expectedSickFullTimeManagement,
        numberOfDaysPartTime: expectedSickPartTime,
      },
      psychiatricLeaveCalculation: psychiatricCalculation,
      holidays: {
        holidayGroup: { description: holidaysGroupDescription },
        numberOfDaysPartTime: holidaysNumberOfDaysPartTime,
      },
      vacationNumberOfAbsenceDaysPartTime,
    } = entry;

    const sickDaysTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.expected-sick-days-title' });
    const psychiatricTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.psychiatric-title' });

    const vacationTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.vacation-title' });
    const holidaysTitle = this.props.intl.formatMessage({ id: 'parameters-by-structure.item.holidays-title' });

    return (
      <Form.Tab id='details' intlId='parameters-by-structure.item.details' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column><Field value={ year } labelIntlId='parameters-by-structure.item.year' /></Form.Column>
          <Form.Column><Field value={ group } labelIntlId='parameters-by-structure.item.group' /></Form.Column>
          <Form.Column><Field value={ code } labelIntlId='parameters-by-structure.item.code' /></Form.Column>
          <Form.Column><Field.Info value={ codeDescription } /></Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='parameters-by-structure__column-header--bold'>{ vacationTitle }</div>
          </Form.Column>
          <Form.Column>
            <div className='parameters-by-structure__column-header--bold'>{ holidaysTitle }</div>
          </Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(vacationNumberOfAbsenceDaysPartTime, digit2Options) } labelIntlId='parameters-by-structure.item.vacation-number-of-absence-days-part-time' /></Form.Column>
          <Form.Column><Field value={ holidaysGroupDescription } labelIntlId='parameters-by-structure.item.holidays-group-full-time' /></Form.Column>
          <Form.Column><Field value={ formatDigits(holidaysNumberOfDaysPartTime, digit2Options) } labelIntlId='parameters-by-structure.item.holidays-number-of-absence-days-part-time' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column3>
            <div className='parameters-by-structure__column-header--bold'>{ sickDaysTitle }</div>
          </Form.Column3>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(expectedSickFullTimeNonManagement, digit2Options) } labelIntlId='parameters-by-structure.expected-sick-days-full-time-non-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(expectedSickFullTimeManagement, digit2Options) } labelIntlId='parameters-by-structure.expected-sick-days-full-time-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(expectedSickPartTime, digit2Options) } labelIntlId='parameters-by-structure.expected-sick-days-part-time' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <div className='parameters-by-structure__column-header--bold'>{ psychiatricTitle }</div>
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <Checkbox value={ psychiatricCalculation } editMode={ editMode } labelIntlId='parameters-by-structure.psychiatric-calculation' single={ true } />
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderCalendarTab() {
    const { isLoading, calendar, otherNonWorkDays } = this.props;

    return (
      <Form.Tab id='calendar' intlId='parameters-by-structure.item.calendar' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage id='parameters-by-structure.item.calendar-section' defaultMessage='Calendar' />
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ calendar.rows }
              columns={ calendar.columns }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <div className='parameters-by-structure__subsection'>
              <FormattedMessage id='parameters-by-structure.item.others-section' defaultMessage='Other non-work days' />
            </div>
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              rows={ otherNonWorkDays.rows }
              columns={ otherNonWorkDays.columns }
            />
          </Form.Column4>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderReplacementsTab() {
    const { isLoading, replacementsManagement, replacementsNonManagement } = this.props;
    const props = {
      replacementsManagement,
      replacementsNonManagement,
    };

    return (
      <Form.Tab id='replacements' intlId='parameters-by-structure.item.replacements' isLoading={ isLoading }>
        <Replacements { ...props } />
      </Form.Tab>
    );
  }

  renderBenefitsTab() {
    const { isLoading, entry } = this.props;
    const { modelsAndBenefits, othersRegularNonManagement, othersRegularManagement } = entry;
    const props = { modelsAndBenefits, othersRegularNonManagement, othersRegularManagement };
    return (
      <Form.Tab id='models-benefits' intlId='parameters-by-structure.item.models-benefits' isLoading={ isLoading }>
        <ModelsAndBenefits { ...props } />
      </Form.Tab>
    );
  }

  render() {
    const {
      code: { code, longDescription },
    } = this.props.entry;
    const activeTab = this.props.activeTab ? this.props.activeTab : 'details';

    return (
      <div className='parameters-by-structure'>
        <div className='parameters-by-structure__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='parameters-by-structure__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='parameters-by-structure.item.title' message={ this.getTitle(code, longDescription) } />
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              <Form.Tabs active={ activeTab }>
                { this.renderDetailsTab() }
                { this.renderGlobalTab() }
                { this.renderFourDaysScheduleTab() }
                { this.renderBenefitsTab() }
                { this.renderAverageHourlyRateTab() }
                { this.renderReplacementsTab() }
                { this.renderCalendarTab() }
              </Form.Tabs>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }

}

export default injectIntl(OtherExpenses);
