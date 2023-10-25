import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { ScrollBox } from '../../components/general/scroll-box';
import TrackablePage from '../../components/general/trackable-page/trackable-page';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Checkbox from '../../components/controls/checkbox';
import RadioButton from '../../components/controls/radio-button';
import { AverageHourlyRate } from './parameters-average-hourly-rate';
import ModelsAndBenefits from '../parameters-by-structure/models-and-benefits';
import Replacements from '../parameters-by-structure/replacements';

import { getGlobalParameters } from '../../api/actions';
import {
  extractGlobalParametersCalendar,
  extractGlobalParametersOtherNonWorkDays,
} from './selectors/calendar-and-other-non-work-days';
import {
  extractReplacementsManagementGlobal,
  extractReplacementsNonManagementGlobal,
} from './selectors/replacements';
import { getDigit2Options, formatDigits } from '../../utils/selectors/currency';

import './global-parameters.scss';
import '../../../styles/content-gradient.scss';

const titleIcon = 'position';

defineMessages({
  globalParametersTitle: {
    id: 'global-parameters.title',
    defaultMessage: 'Global Parameters',
  },
  parametersTabTitle: {
    id: 'global-parameters.parameters-tab-title',
    defaultMessage: 'Parameters',
  },
  globalTabTitle: {
    id: 'global-parameters.global-tab-title',
    defaultMessage: 'Global',
  },
  benefitsTabTitle: {
    id: 'global-parameters.benefits-tab-title',
    defaultMessage: 'Benefits',
  },
  specificTabTitle: {
    id: 'global-parameters.specific-tab-title',
    defaultMessage: 'Specific',
  },
  fourDayScheduleTabTitle: {
    id: 'global-parameters.four-day-schedule-tab-title',
    defaultMessage: '4-days schedule',
  },
  modelsTabTitle: {
    id: 'global-parameters.models-tab-title',
    defaultMessage: 'Models',
  },
  averageHourlyRateTabTitle: {
    id: 'global-parameters.average-hourly-rate-tab-title',
    defaultMessage: 'Average hourly rate',
  },
  replacementsTabTitle: {
    id: 'global-parameters.replacements-tab-title',
    defaultMessage: 'Replacements',
  },
  requiredAttendanceTabTitle: {
    id: 'global-parameters.required-attendance-tab-title',
    defaultMessage: 'Required attendance',
  },
  dashboardTabTitle: {
    id: 'global-parameters.dashboard-tab-title',
    defaultMessage: 'Dashboard',
  },
  financialYear: {
    id: 'global-parameters.financial-year',
    defaultMessage: 'Financial year:',
  },
  defaultPeriodForActualDate: {
    id: 'global-parameters.default-period-for-actual-date',
    defaultMessage: 'Default period for actual date:',
  },
  salaryTitle: {
    id: 'global-parameters.salary-title',
    defaultMessage: 'Salary',
  },
  budgetEqualsActualTitle: {
    id: 'global-parameters.budget-equals-actual-title',
    defaultMessage: 'Budget equals actual',
  },
  calculationBase: {
    id: 'global-parameters.calculation-base',
    defaultMessage: 'Calculation base:',
  },
  numberOfPayPeriodsYear: {
    id: 'global-parameters.number-of-pay-periods-year',
    defaultMessage: 'Number of pay periods/year:',
  },
  defaultPeriod: {
    id: 'global-parameters.default-period',
    defaultMessage: 'Default period:',
  },
  vacationTitle: {
    id: 'global-parameters.vacation-title',
    defaultMessage: 'Vacation',
  },
  holidaysTitle: {
    id: 'global-parameters.holidays-title',
    defaultMessage: 'Holidays',
  },
  vacationFullTimeNonManagement: {
    id: 'global-parameters.vacation-full-time-non-management',
    defaultMessage: 'Number of vacation days - Full-time non-management:',
  },
  vacationFullTimeManagement: {
    id: 'global-parameters.vacation-full-time-management',
    defaultMessage: 'Number of vacation days - Full-time management:',
  },
  vacationNumberOfAbsenceDaysPartTime: {
    id: 'global-parameters.vacation-number-of-absence-days-part-time',
    defaultMessage: 'Number of absence days - Part-time:',
  },
  holidaysGroupFullTime: {
    id: 'global-parameters.holidays-group-full-time',
    defaultMessage: 'Holiday group - Full-time:',
  },
  holidaysNumberOfAbsenceDaysPartTime: {
    id: 'global-parameters.holidays-number-of-absence-days-part-time',
    defaultMessage: 'Number of absence days - Part-time:',
  },
  expectedSickDaysPerEmployeeTitle: {
    id: 'global-parameters.expected-sick-days-per-employee-title',
    defaultMessage: 'Expected sick days per employee',
  },
  expectedSickDaysFullTimeManagement: {
    id: 'global-parameters.expected-sick-days-full-time-management',
    defaultMessage: 'Number of days - Full-time management:',
  },
  expectedSickDaysFullTimeNonManagement: {
    id: 'global-parameters.expected-sick-days-full-time-non-management',
    defaultMessage: 'Number of days - Full-time non-management:',
  },
  expectedSickDaysPartTime: {
    id: 'global-parameters.expected-sick-days-part-time',
    defaultMessage: 'Number of days - Part-time:',
  },
  sickBankTitle: {
    id: 'global-parameters.sick-bank-title',
    defaultMessage: 'Sick bank',
  },
  sickBankFinancialPeriodOfEmployeePay: {
    id: 'global-parameters.sick-bank-financial-period-of-employee-pay',
    defaultMessage: 'Financial period of employee\'s pay:',
  },
  sickBankIncludeUnusedSickDdaysInCalculations: {
    id: 'global-parameters.sick-bank-include-unused-sick-days-in-calculations',
    defaultMessage: 'Include unused sick days in calculations',
  },
  psychiatricLeaveTitle: {
    id: 'global-parameters.psychiatric-leave-title',
    defaultMessage: 'Psychiatric leave',
  },
  psychiatricLeaveFullTimeEmployee: {
    id: 'global-parameters.psychiatric-leave-full-time-employee',
    defaultMessage: 'Number of days - Full-time employee:',
  },
  globalPayrollDeductionTitle: {
    id: 'global-parameters.global-payroll-deduction-title',
    defaultMessage: 'Global payroll deduction',
  },
  globalDefaultPayrollDeduction: {
    id: 'global-parameters.global-default-payroll-deduction',
    defaultMessage: 'Default payroll deduction:',
  },
  globalAssignCalculationToSingleAccount: {
    id: 'global-parameters.global-assign-calculation-to-single-account',
    defaultMessage: 'Assign calculation to a single account',
  },
  globalFTECalculationBaseNonUnionTitle: {
    id: 'global-parameters.global-fte-calculation-base-non-union-title',
    defaultMessage: 'FTE calculation base - Non-union',
  },
  globalFteCalculationFullTimeEquivalent: {
    id: 'global-parameters.global-fte-calculation-full-time-equivalent',
    defaultMessage: 'Full-time equivalent:',
  },
  globalPremiumTitle: {
    id: 'global-parameters.global-premium-title',
    defaultMessage: 'Global premium',
  },
  globalCalculateGlobalPremium: {
    id: 'global-parameters.global-calculate-global-premium',
    defaultMessage: 'Calculate global premium',
  },
  globalDistributionModel: {
    id: 'global-parameters.global-distribution-model',
    defaultMessage: 'Distribution model:',
  },
  globalPremiumNature: {
    id: 'global-parameters.global-premium-nature',
    defaultMessage: 'Global premium nature:',
  },
  globalGroupInsuranceTaxTitle: {
    id: 'global-parameters.global-group-insurance-tax-title',
    defaultMessage: 'Group insurance tax',
  },
  globalGroupInsuranceTaxCodeTitle: {
    id: 'global-parameters.global-group-insurance-tax-code-title',
    defaultMessage: 'Code',
  },
  globalGroupInsuranceTaxRateTitle: {
    id: 'global-parameters.global-group-insurance-tax-rate-title',
    defaultMessage: 'Rate',
  },
  globalGroupInsuranceTaxCodeFederal: {
    id: 'global-parameters.global-group-insurance-tax-code-federal',
    defaultMessage: 'Federal:',
  },
  globalGroupInsuranceTaxRateFederal: {
    id: 'global-parameters.global-group-insurance-tax-rate-federal-percent',
    defaultMessage: 'Federal (%):',
  },
  globalGroupInsuranceTaxCodeProvincial: {
    id: 'global-parameters.global-group-insurance-tax-code-provincial',
    defaultMessage: 'Provincial:',
  },
  globalGroupInsuranceTaxRateProvincial: {
    id: 'global-parameters.global-group-insurance-tax-rate-provincial-percent',
    defaultMessage: 'Provincial (%):',
  },
  averageHourlyRateUsedForReplacement: {
    id: 'global-parameters.global-average-hourly-rate-used-for-replacement',
    defaultMessage: 'Hourly rate used for replacement',
  },
  suggestedHourlyRateVacantPositionsAndRequests: {
    id: 'global-parameters.global-suggested-hourly-rate-vacant-positions-and-requests',
    defaultMessage: 'Vacant positions and requests',
  },
  averageHourlyRateJobTitle: {
    id: 'global-parameters.global-average-hourly-rate-job-title',
    defaultMessage: 'Average hourly rate - Job title used in the functional center',
  },
  averageHourlyRateSalaryScaleOfJobTitle: {
    id: 'global-parameters.global-average-hourly-rate-salary-scale-of-job-title',
    defaultMessage: 'Average hourly rate - Salary scale of the job title',
  },
  averageHourlyRateSpecificGroupAndLevel: {
    id: 'global-parameters.global-average-hourly-rate-specific-group-and-level',
    defaultMessage: 'Specific group and level - Salary scale of the job title',
  },
  averageHourlyRateSpecificGroup: {
    id: 'global-parameters.global-average-hourly-rate-specific-group',
    defaultMessage: 'Group:',
  },
  averageHourlyRateSpecificLevel: {
    id: 'global-parameters.global-average-hourly-rate-specific-level',
    defaultMessage: 'Level:',
  },
  parametersByFinancialYear: {
    id: 'global-parameters.hourly-rate-average-parameters-salary-scale',
    defaultMessage: 'Parameters by financial year',
  },
  specificFirstPayOfTheYearTitle: {
    id: 'global-parameters.global-specific-first-pay-of-the-year-title',
    defaultMessage: 'First pay of the year {year}:',
  },
  automaticCalculationOfTaxableAmount: {
    id: 'global-parameters.global-specific-automatic-calculation-of-taxable-amount',
    defaultMessage: 'Automatic calculation of taxable amount',
  },
  globalSpecificRQQ: {
    id: 'global-parameters.global-specific-rqq',
    defaultMessage: 'RQQ:',
  },
  globalSpecificWCB: {
    id: 'global-parameters.global-specific-wcb',
    defaultMessage: 'WCB:',
  },
  globalSpecificHCP: {
    id: 'global-parameters.global-specific-hcp',
    defaultMessage: 'HCP:',
  },
  globalSpecificEI: {
    id: 'global-parameters.global-specific-ei',
    defaultMessage: 'EI:',
  },
  globalSpecificPension: {
    id: 'global-parameters.global-specific-pension',
    defaultMessage: 'Pension:',
  },
  globalSpecificQPIP: {
    id: 'global-parameters.global-specific-qpip',
    defaultMessage: 'QPIP:',
  },
  benefitsDefaultPercentagesForNonUnionRequestsTitle: {
    id: 'global-parameters.global-benefits-default-percentages-for-non-union-requests-title',
    defaultMessage: 'Default percentages for non union requests',
  },
  benefitsVacationPercentage: {
    id: 'global-parameters.global-benefits-vacation-percentage',
    defaultMessage: 'Vacation (%):',
  },
  benefitsHolidaysPercentage: {
    id: 'global-parameters.global-benefits-holidays-percentage',
    defaultMessage: 'Holidays (%):',
  },
  benefitsSickDaysPercentage: {
    id: 'global-parameters.global-benefits-sick-days-percentage',
    defaultMessage: 'Sick days (%):',
  },
  benefitsPsychiatricLeavePercentage: {
    id: 'global-parameters.global-benefits-psychiatric-leave-percentage',
    defaultMessage: 'Psychiatric leave (%):',
  },
  benefitsAdditionalPeriod4Percentage: {
    id: 'global-parameters.global-benefits-additional-period-percentage',
    defaultMessage: 'Additional period 4 (%):',
  },
  fourDaysScheduleVacationTitle: {
    id: 'global-parameters.global-four-days-schedule-vacation-title',
    defaultMessage: 'Vacation',
  },
  fourDaysScheduleHolidaysTitle: {
    id: 'global-parameters.global-four-days-schedule-holidays-title',
    defaultMessage: 'Holidays',
  },
  fourDaysScheduleFTECalculationBaseNonUnionTitle: {
    id: 'global-parameters.global-four-days-schedule-fte-calculation-base-non-union-title',
    defaultMessage: 'FTE calculation base - Non-union',
  },
  fourDaysScheduleSickDaysTitle: {
    id: 'global-parameters.global-four-days-schedule-sick-days-title',
    defaultMessage: 'Sick days',
  },
  fourDaysScheduleNumOfVacationDaysFullTime: {
    id: 'global-parameters.global-four-days-schedule-num-of-vacation-days-full-time',
    defaultMessage: 'Num. of vacation days - Full-time:',
  },
  fourDaysScheduleHolidayGroupFullTime: {
    id: 'global-parameters.global-four-days-schedule-holiday-group-full-time',
    defaultMessage: 'Holiday group - Full-time:',
  },
  fourDaysScheduleFullTimeEquivalent: {
    id: 'global-parameters.global-four-days-schedule-full-time-equivalent',
    defaultMessage: 'Full-time equivalent:',
  },
  fourDaysScheduleFullTimeManagement: {
    id: 'global-parameters.global-four-days-schedule-full-time-management',
    defaultMessage: 'Full-time management:',
  },
  fourDaysScheduleFullTimeNonManagement: {
    id: 'global-parameters.global-four-days-schedule-full-time-non-management',
    defaultMessage: 'Full-time non-management:',
  },
  fourDaysScheduleSickLeaveBan: {
    id: 'global-parameters.global-four-days-schedule-sick-leave-bank',
    defaultMessage: 'Sick leave bank:',
  },

  globalDashboardTitle: {
    id: 'global-parameters.global-dashboard-title',
    defaultMessage: 'Dashboard',
  },
  globalScenarioOtherThanOneTitle: {
    id: 'global-parameters.global-scenario-other-than-one-title',
    defaultMessage: 'Scenario other than current one to display in dashboard',
  },
  globalTargetBudgetTitle: {
    id: 'global-parameters.global-target-budget-title',
    defaultMessage: 'Target budget',
  },
  globalDashboardMaximumBudget: {
    id: 'global-parameters.global-dashboard-maximum-budget',
    defaultMessage: 'Maximal budget',
  },
  globalDashboardTargetScenario: {
    id: 'global-parameters.global-dashboard-target-scenario',
    defaultMessage: 'Target scenario',
  },
  calendar: {
    id: 'global-parameters.calendar-title',
    defaultMessage: 'Calendar',
  },
  globalNightShift: {
    id: 'global-parameters.models.night-shift',
    defaultMessage: 'Night shift:',
  },
  globalFullTimeTitle: {
    id: 'global-parameters.models.full-time-title',
    defaultMessage: 'Full time',
  },
});

@connect(state => ({
  scenarioId: state.scenario.selectedScenario.scenarioId,
  scenarioYearId: state.scenario.selectedScenario.yearId,
  previousScenarioYearId: state.globalParameters.options.yearId,
  digit2Options: getDigit2Options(state),
  entry: state.globalParameters.entry,
  calendar: extractGlobalParametersCalendar(state),
  otherNonWorkDays: extractGlobalParametersOtherNonWorkDays(state),
  isLoading: state.globalParameters.isLoading,
  replacementsManagement: extractReplacementsManagementGlobal(state),
  replacementsNonManagement: extractReplacementsNonManagementGlobal(state),
}), (dispatch) => bindActionCreators({
  getGlobalParameters,
}, dispatch))
class GlobalParameters extends TrackablePage {
  static propTypes = {
    scenarioId: PropTypes.number,
    scenarioYearId: PropTypes.number,
    previousScenarioYearId: PropTypes.number,
    isLoading: PropTypes.any,
    editMode: PropTypes.bool,
    intl: PropTypes.object,
    digit2Options: PropTypes.object,
    getGlobalParameters: PropTypes.func,
  };

  static defaultProps = {
    editMode: false,
  };

  componentDidMount() {
    super.componentDidMount();
    this.load(this.props);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  load(props, pageNo, pageSize) {
    const { scenarioYearId, previousScenarioYearId } = props;
    if (scenarioYearId === previousScenarioYearId) {
      return;
    }
    props.getGlobalParameters(scenarioYearId);
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  renderParametersTab() {
    const { isLoading, editMode, digit2Options } = this.props;
    const {
      financialYear: { code: financialYearCode },
      defaultPeriodForActualToDate,
      salaryCalculationBase: { shortDescription: salaryCalculationBaseDescription },
      budgetEqualsActualDefaultPeriod,
      salaryNumberOfPayPeriodsYear,
      vacation: {
        numberOfDaysFullTime: vacationNumberOfDaysFullTime,
        numberOfDaysFullTimeManagement: vacationNumberOfDaysFullTimeManagement,
        numberOfDaysPartTime: vacationNumberOfDaysPartTime,
      },
      holidays: {
        holidayGroup: { code: holidaysGroupCode },
        numberOfDaysPartTime: holidaysNumberOfDaysPartTime,
      },
      expectedSickDaysPerEmployee: {
        numberOfDaysFullTime: expectedSickDaysNumberOfDaysFullTime,
        numberOfDaysFullTimeManagement: expectedSickDaysNumberOfDaysFullTimeManagement,
        numberOfDaysPartTime: expectedSickDaysNumberOfDaysPartTime,
      },
      financialPeriodOfEmployeesPay: {
        code: financialPeriodOfEmployeesPayCode,
        // id: undefined,
        // isCurrent: undefined,
      },
      includeUnusedSickDaysInCalculations,
      psychiatricLeaveNumberOfDaysFullTime,
    } = this.props.entry;

    const salaryTitle = this.props.intl.formatMessage({ id: 'global-parameters.salary-title' });
    const budgetEqualsActualTitle = this.props.intl.formatMessage({ id: 'global-parameters.budget-equals-actual-title' });
    const vacationTitle = this.props.intl.formatMessage({ id: 'global-parameters.vacation-title' });
    const holidaysTitle = this.props.intl.formatMessage({ id: 'global-parameters.holidays-title' });
    const expectedSickDaysPerEmployeeTitle = this.props.intl.formatMessage({ id: 'global-parameters.expected-sick-days-per-employee-title' });
    const sickBankTitle = this.props.intl.formatMessage({ id: 'global-parameters.sick-bank-title' });
    const psychiatricLeaveTitle = this.props.intl.formatMessage({ id: 'global-parameters.psychiatric-leave-title' });

    return (
      <Form.Tab id='parameters' intlId='global-parameters.parameters-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column><Field value={ financialYearCode } labelIntlId='global-parameters.financial-year' /></Form.Column>
          <Form.Column><Field value={ defaultPeriodForActualToDate } labelIntlId='global-parameters.default-period-for-actual-date' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ salaryTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ budgetEqualsActualTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ salaryCalculationBaseDescription } labelIntlId='global-parameters.calculation-base' /></Form.Column>
          <Form.Column><Field value={ salaryNumberOfPayPeriodsYear } labelIntlId='global-parameters.number-of-pay-periods-year' /></Form.Column>
          <Form.Column><Field value={ budgetEqualsActualDefaultPeriod } labelIntlId='global-parameters.default-period' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ vacationTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ holidaysTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ vacationNumberOfDaysFullTimeManagement } labelIntlId='global-parameters.vacation-full-time-management' /></Form.Column>
          <Form.Column><Field value={ vacationNumberOfDaysFullTime } labelIntlId='global-parameters.vacation-full-time-non-management' /></Form.Column>
          <Form.Column><Field value={ holidaysGroupCode } labelIntlId='global-parameters.holidays-group-full-time' /></Form.Column>
          <Form.Column><Field value={ formatDigits(holidaysNumberOfDaysPartTime, digit2Options) } labelIntlId='global-parameters.holidays-number-of-absence-days-part-time' /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(vacationNumberOfDaysPartTime, digit2Options) } labelIntlId='global-parameters.vacation-number-of-absence-days-part-time' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ expectedSickDaysPerEmployeeTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(expectedSickDaysNumberOfDaysFullTimeManagement, digit2Options) } labelIntlId='global-parameters.expected-sick-days-full-time-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(expectedSickDaysNumberOfDaysFullTime, digit2Options) } labelIntlId='global-parameters.expected-sick-days-full-time-non-management' /></Form.Column>
          <Form.Column><Field value={ formatDigits(expectedSickDaysNumberOfDaysPartTime, digit2Options) } labelIntlId='global-parameters.expected-sick-days-part-time' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ sickBankTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ psychiatricLeaveTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ financialPeriodOfEmployeesPayCode } labelIntlId='global-parameters.sick-bank-financial-period-of-employee-pay' /></Form.Column>
          <Form.Column>
            <Checkbox value={ includeUnusedSickDaysInCalculations } editMode={ editMode } labelIntlId='global-parameters.sick-bank-include-unused-sick-days-in-calculations' />
          </Form.Column>
          <Form.Column><Field value={ formatDigits(psychiatricLeaveNumberOfDaysFullTime, digit2Options) } labelIntlId='global-parameters.psychiatric-leave-full-time-employee' /></Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderGlobalTab() {
    const { isLoading, editMode, digit2Options } = this.props;
    const {
      payrollDeductionGlobal: {
        defaultPayrollDeduction: {
          // code: defaultPayrollDeductionCode,
          description: defaultPayrollDeductionDescription,
        },
        assignCalculationToSingleAccount: payrollDeductionGlobalAssignCalculationToSingleAccount,
        generalLedgerAccount: {
          // id: undefined,
          accountNumber: generalLedgerAccountNumber,
          // description: generalLedgerAccountDescription,
          // isFinancial: undefined,
        },
      },
      fteCalculationBaseNonUnion,
      calculateGlobalPremium,
      globalPremiumDistributionModel,
      globalPremiumNature: {
        shortDescription: globalPremiumNatureDescription,
        // longDescription: undefined,
        // code: undefined,
        // id: undefined,
        // codeDescription: undefined,
      },
      federalInsuranceTaxModel: {
        // id: undefinded,
        code: federalInsuranceTaxModelCode,
        rate: federalInsuranceTaxModelRate,
      },
      provincialInsuranceTaxModel: {
        // id: undefined,
        code: provincialInsuranceTaxModelCode,
        rate: provincialInsuranceTaxModelRate,
      },
      isTargetScenario,
      otherScenario: { code: otherScenarioCode },
      targetScenario: { code: targetScenarioCode },
    } = this.props.entry;

    const globalPayrollDeductionTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-payroll-deduction-title' });
    const globalFTECalculationBaseNonUnionTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-fte-calculation-base-non-union-title' });
    const globalPremiumTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-premium-title' });
    const groupInsuranceTaxTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-group-insurance-tax-title' });
    const groupInsuranceTaxCodeTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-group-insurance-tax-code-title' });
    const groupInsuranceTaxRateTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-group-insurance-tax-rate-title' });
    const dashboardTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-dashboard-title' });
    const scenarioOtherThanCurrentOneTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-scenario-other-than-one-title' });
    const targetBudgetTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-target-budget-title' });

    return (
      <Form.Tab id='global' intlId='global-parameters.global-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ globalPayrollDeductionTitle }</div>
          </Form.Column>
          <Form.Column />
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ globalFTECalculationBaseNonUnionTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row flexEnd>
          <Form.Column>
            <Field value={ defaultPayrollDeductionDescription } labelIntlId='global-parameters.global-default-payroll-deduction' />
          </Form.Column>
          <Form.Column>
            <Field
              labelComponent={
                <Checkbox
                  single={ true }
                  value={ payrollDeductionGlobalAssignCalculationToSingleAccount }
                  editMode={ editMode }
                  labelIntlId='global-parameters.global-assign-calculation-to-single-account'
                />
              }
              value={ generalLedgerAccountNumber }
            />
          </Form.Column>
          <Form.Column>
            <Field value={ formatDigits(fteCalculationBaseNonUnion, digit2Options) } labelIntlId='global-parameters.global-fte-calculation-full-time-equivalent' />
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ globalPremiumTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <Checkbox single={ true } value={ calculateGlobalPremium } editMode={ editMode } labelIntlId='global-parameters.global-calculate-global-premium' />
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ globalPremiumDistributionModel } labelIntlId='global-parameters.global-distribution-model' /></Form.Column>
          <Form.Column><Field value={ globalPremiumNatureDescription } labelIntlId='global-parameters.global-premium-nature' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ groupInsuranceTaxTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header'>{ groupInsuranceTaxCodeTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='global-parameters__column-header'>{ groupInsuranceTaxRateTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ federalInsuranceTaxModelCode } labelIntlId='global-parameters.global-group-insurance-tax-code-federal' /></Form.Column>
          <Form.Column><Field value={ provincialInsuranceTaxModelCode } labelIntlId='global-parameters.global-group-insurance-tax-code-provincial' /></Form.Column>
          <Form.Column><Field value={ federalInsuranceTaxModelRate } labelIntlId='global-parameters.global-group-insurance-tax-rate-federal-percent' /></Form.Column>
          <Form.Column><Field value={ provincialInsuranceTaxModelRate } labelIntlId='global-parameters.global-group-insurance-tax-rate-provincial-percent' /></Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold-title'>{ dashboardTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ scenarioOtherThanCurrentOneTitle }</div>
          </Form.Column2>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ targetBudgetTitle }</div>
          </Form.Column2>
        </Form.Row>
        <Form.Row halfTopMargin >
          <Form.Column2 />
          <Form.Column2>
            <RadioButton
              value={ isTargetScenario }
              values={ [
                { value: false, id: 'maximum-budget', intlId: 'global-parameters.global-dashboard-maximum-budget' },
                { value: true, id: 'target-scenario', intlId: 'global-parameters.global-dashboard-target-scenario' },
              ] }
              editMode={ editMode }
              twoColumnsWidth
            />
          </Form.Column2>
        </Form.Row>
        <Form.Row halfTopMargin >
          <Form.Column><Field value={ otherScenarioCode } hideTitle /></Form.Column>
          <Form.Column />
          <Form.Column />
          <Form.Column><Field value={ targetScenarioCode } hideTitle /></Form.Column>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderBenefitsTab() {
    const { isLoading, digit2Options } = this.props;
    const {
      defaultBenefitForNonUnionRequests: {
        additionalPeriod4: defaultBenefitAdditionalPeriod4,
        pctHoliday: defaultBenefitHoliday,
        pctPsychiatricLeave: defaultBenefitPsychiatricLeave,
        pctSickDay: defaultBenefitSickDay,
        pctVacation: defaultBenefitVacation,
      },
    } = this.props.entry;

    const defaultPercentagesForNonUnionRequestTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-benefits-default-percentages-for-non-union-requests-title' });

    return (
      <Form.Tab id='benefits' intlId='global-parameters.benefits-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column2>
            <div className='global-parameters__column-header--bold'>{ defaultPercentagesForNonUnionRequestTitle }</div>
          </Form.Column2>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(defaultBenefitVacation, digit2Options) } labelIntlId='global-parameters.global-benefits-vacation-percentage' /></Form.Column>
          <Form.Column><Field value={ formatDigits(defaultBenefitHoliday, digit2Options) } labelIntlId='global-parameters.global-benefits-holidays-percentage' /></Form.Column>
          <Form.Column><Field value={ formatDigits(defaultBenefitSickDay, digit2Options) } labelIntlId='global-parameters.global-benefits-sick-days-percentage' /></Form.Column>
          <Form.Column><Field value={ formatDigits(defaultBenefitPsychiatricLeave, digit2Options) } labelIntlId='global-parameters.global-benefits-psychiatric-leave-percentage' /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ formatDigits(defaultBenefitAdditionalPeriod4, digit2Options) } labelIntlId='global-parameters.global-benefits-additional-period-percentage' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderSpecificTab() {
    const { isLoading, editMode } = this.props;
    const {
      financialYear: { code: financialYearCode },
      automaticCalculationOfTaxableAmount,
      theFirstPayOfThePreviousYear,
      theFirstPayOfTheCurrentYear,
      previousFinancialYear,
      globalSpecificPayrollDeduction: {
        CanadaPensionPlan: { code: codeCPP, description: descriptionCPP },
        WorkersCompensationBoard: { code: codeWCB, description: descriptionWCB },
        HealthCarePlan: { code: codeHCP, description: descriptionHCP },
        EmploymentInsurance: { code: codeEI, description: descriptionEI },
        PensionPlan: { code: codePension, description: descriptionPension },
        QuebecParentalInsurancePlan: { code: codeQPIP, description: descriptionQPIP },
      },
    } = this.props.entry;

    return (
      <Form.Tab id='specific' intlId='global-parameters.specific-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column>
            <Field
              value={ theFirstPayOfThePreviousYear }
              labelIntlId='global-parameters.global-specific-first-pay-of-the-year-title'
              labelIntlValues={ { year: `${ previousFinancialYear }` } }
            />
          </Form.Column>
          <Form.Column>
            <Field
              value={ theFirstPayOfTheCurrentYear }
              labelIntlId='global-parameters.global-specific-first-pay-of-the-year-title'
              labelIntlValues={ { year: `${ financialYearCode }` } }
            />
          </Form.Column>
          <Form.Column>
            <Checkbox value={ automaticCalculationOfTaxableAmount } editMode={ editMode } labelIntlId='global-parameters.global-specific-automatic-calculation-of-taxable-amount' />
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ codeCPP } labelIntlId='global-parameters.global-specific-rqq' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionCPP } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeWCB } labelIntlId='global-parameters.global-specific-wcb' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionWCB } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeHCP } labelIntlId='global-parameters.global-specific-hcp' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionHCP } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeEI } labelIntlId='global-parameters.global-specific-ei' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionEI } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codePension } labelIntlId='global-parameters.global-specific-pension' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionPension } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeQPIP } labelIntlId='global-parameters.global-specific-qpip' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionQPIP } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderFourDaysScheduleTab() {
    const { isLoading, entry } = this.props;
    const {
      fourDaysScheduleFteCalculationBaseNonUnion,
      fourDaysScheduleHolidayGroup: { code: holidayGroupFullTime },
      fourDaysScheduleSickDays: {
        numberOfDaysFullTime,
        numberOfDaysFullTimeManagement,
        sickLeaveBank,
      },
      fourDaysScheduleVacationDays,
    } = entry;

    const vacationTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-four-days-schedule-vacation-title' });
    const holidaysTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-four-days-schedule-holidays-title' });
    const globalFTECalculationBaseNonUnionTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-four-days-schedule-fte-calculation-base-non-union-title' });
    const sickDaysTitle = this.props.intl.formatMessage({ id: 'global-parameters.global-four-days-schedule-sick-days-title' });

    return (
      <Form.Tab id='four-day-schedule' intlId='global-parameters.four-day-schedule-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ vacationTitle }</div>
          </Form.Column>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ holidaysTitle }</div>
          </Form.Column>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ globalFTECalculationBaseNonUnionTitle }</div>
          </Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ fourDaysScheduleVacationDays } labelIntlId='global-parameters.global-four-days-schedule-num-of-vacation-days-full-time' /></Form.Column>
          <Form.Column><Field value={ holidayGroupFullTime } labelIntlId='global-parameters.global-four-days-schedule-holiday-group-full-time' /></Form.Column>
          <Form.Column><Field.Number2 value={ fourDaysScheduleFteCalculationBaseNonUnion } labelIntlId='global-parameters.global-four-days-schedule-full-time-equivalent' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ sickDaysTitle }</div>
          </Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ numberOfDaysFullTime } labelIntlId='global-parameters.global-four-days-schedule-full-time-non-management' /></Form.Column>
          <Form.Column><Field.Number2 value={ numberOfDaysFullTimeManagement } labelIntlId='global-parameters.global-four-days-schedule-full-time-management' /></Form.Column>
          <Form.Column><Field.Number2 value={ sickLeaveBank } labelIntlId='global-parameters.global-four-days-schedule-sick-leave-bank' /></Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderModelsTab() {
    const { isLoading, entry } = this.props;
    const {
      modelsAndBenefits,
      othersRegularNonManagement,
      othersRegularManagement,
      othersFullTimeNightShift,
    } = entry;
    const props = {
      modelsAndBenefits,
      othersRegularNonManagement,
      othersRegularManagement,
      othersFullTimeNightShift,
    };

    return (
      <Form.Tab id='models' intlId='global-parameters.models-tab-title' isLoading={ isLoading }>
        <ModelsAndBenefits { ...props } />
      </Form.Tab>
    );
  }

  renderAverageHourlyRateTab() {
    const { isLoading, editMode } = this.props;
    const {
      replacementHourlyRate: {
        rateOriginType: replacementHourlyRateOriginType,
        jobGroupType: replacementHourlyRateJobGroupType,
        jobGroupValue: replacementHourlyRateJobGroupValue,
        jobLevelType: replacementHourlyRateJobLevelType,
        jobLevelValue: replacementHourlyRateJobLevelValue,
      },
      vacantPositionAndRequest: {
        rateOriginType: vacantPositionAndRequestOriginType,
        jobGroupType: vacantPositionAndRequestJobGroupType,
        jobGroupValue: vacantPositionAndRequestJobGroupValue,
        jobLevelType: vacantPositionAndRequestJobLevelType,
        jobLevelValue: vacantPositionAndRequestJobLevelValue,
      },
    } = this.props.entry;

    return (
      <Form.Tab id='average-hourly-rate' intlId='global-parameters.average-hourly-rate-tab-title' isLoading={ isLoading }>
        <AverageHourlyRate
          expand={ true }
          editMode={ editMode }
          labelIntlId='global-parameters.global-average-hourly-rate-used-for-replacement'
          rateOriginType={ replacementHourlyRateOriginType }
          jobGroup={ replacementHourlyRateJobGroupType }
          jobGroupValue={ replacementHourlyRateJobGroupValue }
          jobLevel={ replacementHourlyRateJobLevelType }
          jobLevelValue={ replacementHourlyRateJobLevelValue }
        />
        <Form.Separator />
        <AverageHourlyRate
          expand={ true }
          editMode={ editMode }
          labelIntlId='global-parameters.global-suggested-hourly-rate-vacant-positions-and-requests'
          rateOriginType={ vacantPositionAndRequestOriginType }
          jobGroup={ vacantPositionAndRequestJobGroupType }
          jobGroupValue={ vacantPositionAndRequestJobGroupValue }
          jobLevel={ vacantPositionAndRequestJobLevelType }
          jobLevelValue={ vacantPositionAndRequestJobLevelValue }
        />
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

  renderRequiredAttendaceTab() {
    const { isLoading, calendar, otherNonWorkDays } = this.props;

    const globalParametersCalendarTitle = this.props.intl.formatMessage({ id: 'global-parameters.calendar-title' });

    return (
      <Form.Tab id='required-attendance' intlId='global-parameters.required-attendance-tab-title' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column>
            <div className='global-parameters__column-header--bold'>{ globalParametersCalendarTitle }</div>
          </Form.Column>
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

  renderTabs() {
    const activeTab = this.props.activeTab ? this.props.activeTab : 'parameters';
    return (
      <Form.Tabs active={ activeTab }>
        { this.renderParametersTab() }
        { this.renderGlobalTab() }
        { this.renderBenefitsTab() }
        { this.renderSpecificTab() }
        { this.renderFourDaysScheduleTab() }
        { this.renderModelsTab() }
        { this.renderAverageHourlyRateTab() }
        { this.renderReplacementsTab() }
        { this.renderRequiredAttendaceTab() }
      </Form.Tabs>
    );
  }

  render() {
    return (
      <div className='global-parameters'>
        <div className='global-parameters__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='global-parameters__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='global-parameters.title' />
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              { this.renderTabs() }
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(GlobalParameters);
