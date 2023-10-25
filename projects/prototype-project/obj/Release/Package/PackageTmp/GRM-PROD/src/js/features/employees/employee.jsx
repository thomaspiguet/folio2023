import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { autobind } from 'core-decorators';

import { ScrollBox } from '../../components/general/scroll-box';

import TrackablePage from '../../components/general/trackable-page/trackable-page';
import { getCurrencyOptions } from '../../utils/selectors/currency';
import Form from '../../components/general/form/form';
import Field from '../../components/controls/field';
import Employee from '../../components/controls/employee';
import Checkbox from '../../components/controls/checkbox';

import { getEmployee } from '../../api/actions';
import { setTitle } from '../../components/general/breadcrumbs/actions';
import { extractLevels, extractReplacements } from './selectors';

import '../../../styles/content-gradient.scss';
import './employee.scss';
import { isPartTime } from '../../entities/job-status';

const titleIcon = 'employee';
const JOB_STATUS_FULL_TIME_REGULAR = 'FullTimeRegular';
const JOB_STATUS_FULL_TIME_TEMPORARY = 'FullTimeTemporary';
const JOB_STATUS_PARTIAL_TIME_CASUAL = 'PartialTimeCasual';
const JOB_STATUS_PARTIAL_TIME_REGULAR = 'PartialTimeRegular';
const JOB_STATUS_PARTIAL_TIME_TEMPORARY = 'PartialTimeTemporary';

defineMessages({
  insuranceGeneral: {
    id: 'employee.insurance-general',
    defaultMessage: 'General group insurance:',
  },
  insuranceShortTerm: {
    id: 'employee.insurance-short-term',
    defaultMessage: 'Short-term insurance:',
  },
  insuranceLongTerm: {
    id: 'employee.insurance-long-term',
    defaultMessage: 'Long-term insurance:',
  },
  insuranceGroup1: {
    id: 'employee.insurance-group1',
    defaultMessage: 'Group insurance 1:',
  },
  insuranceGroup2: {
    id: 'employee.insurance-group2',
    defaultMessage: 'Group insurance 2:',
  },
  insuranceGroup3: {
    id: 'employee.insurance-group3',
    defaultMessage: 'Group insurance 3:',
  },
  premiumsDays: {
    id: 'employee.premiums-days',
    defaultMessage: 'day(s)',
  },
  premiumsShift: {
    id: 'employee.premiums-permanent-night-shift-days',
    defaultMessage: 'Permanent night shift (2 weeks)',
  },
  premiumsOthers: {
    id: 'employee.premiums-others',
    defaultMessage: 'Others',
  },
  premiumsSeniority: {
    id: 'employee.premiums-seniority',
    defaultMessage: 'Seniority:',
  },
  payrollFrom: {
    id: 'employee.payroll-from',
    defaultMessage: 'FROM',
  },
  payrollTo: {
    id: 'employee.payroll-to',
    defaultMessage: 'TO',
  },
  payrollTaxableWageAmount: {
    id: 'employee.payroll-calculate-taxable-amount',
    defaultMessage: 'Calculated taxable amount',
  },
  payrollCalculateTaxableAmount: {
    id: 'employee.payroll-taxable-wage-amount',
    defaultMessage: 'Taxable wage amount:',
  },
  payrollSpecificTaxableAmount: {
    id: 'employee.payroll-specific-taxable-amount',
    defaultMessage: 'Specific taxable amount:',
  },
  payrollCpp: {
    id: 'employee.payroll-cpp',
    defaultMessage: 'CPP:',
  },
  payrollWcb: {
    id: 'employee.payroll-wcb',
    defaultMessage: 'WCB:',
  },
  payrollHcp: {
    id: 'employee.payroll-hcp',
    defaultMessage: 'HCP:',
  },
  payrollEI: {
    id: 'employee.payroll-ei',
    defaultMessage: 'EI:',
  },
  payrollPension: {
    id: 'employee.payroll-pension',
    defaultMessage: 'Pension:',
  },
  payrollQpip: {
    id: 'employee.payroll-qpip',
    defaultMessage: 'QPIP:',
  },
  specificPayrollDedaction: {
    id: 'employee.specific-payroll-dedaction',
    defaultMessage: 'Specific payroll deductions',
  },
  hoursPerDay: {
    id: 'employee.hours-per-day',
    defaultMessage: 'Hours per day:',
  },
  ifDifferent: {
    id: 'employee.if-different',
    defaultMessage: 'If different:',
  },
  title: {
    id: 'employee.title',
    defaultMessage: 'Employee',
  },
  employeeTitle: {
    id: 'employee.employee-title',
    defaultMessage: 'EMPLOYEE',
  },
  details: {
    id: 'employee.details',
    defaultMessage: 'Details',
  },
  levels: {
    id: 'employee.levels',
    defaultMessage: 'Levels',
  },
  payrollDeductions: {
    id: 'employee.payroll-deductions',
    defaultMessage: 'Payroll Deductions',
  },
  premiums: {
    id: 'employee.premiums',
    defaultMessage: 'Premiums',
  },
  insurances: {
    id: 'employee.insurances',
    defaultMessage: 'Insurances',
  },
  replacements: {
    id: 'employee.replacements',
    defaultMessage: 'Replacements',
  },
  vacation: {
    id: 'employee.vacation',
    defaultMessage: 'Vacation',
  },
  amountInVacationBank: {
    id: 'employee.amount-in-vacation-bank',
    defaultMessage: 'Amount in vacation bank - Part time:',
  },
  basedOnParameters: {
    id: 'employee.based-on-parameters',
    defaultMessage: 'Based on parameters',
  },
  ifDifferentVacation: {
    id: 'employee.if-different-vacation',
    defaultMessage: 'If different',
  },
  hoursInVacationBank: {
    id: 'employee.hours-in-vacation-bank',
    defaultMessage: 'Number of hours in vacation bank - Part time:',
  },
  numberOfAbsenceDaysPartTime: {
    id: 'employee.number-of-absence-days',
    defaultMessage: 'Number of absence days – Part-time:',
  },
  numberOfVacationDaysFullTime: {
    id: 'employee.number-of-vacation-days-full-time',
    defaultMessage: 'Number of vacation days – Full-time:',
  },
  benefits: {
    id: 'employee.benefits',
    defaultMessage: 'Benefits',
  },
  distributions: {
    id: 'employee.distributions',
    defaultMessage: 'Distributions',
  },
  financialYear: {
    id: 'employee.financial-year',
    defaultMessage: 'Financial year:',
  },
  employeeNumber: {
    id: 'employee.employee-number',
    defaultMessage: 'Employee Number:',
  },
  firstName: {
    id: 'employee.first-name',
    defaultMessage: 'First name:',
  },
  lastName: {
    id: 'employee.last-name',
    defaultMessage: 'Last name:',
  },
  employmentDate: {
    id: 'employee.employment-date',
    defaultMessage: 'Employment date:',
  },
  jobType: {
    id: 'employee.job-type',
    defaultMessage: 'Job type:',
  },
  jobStatus: {
    id: 'employee.job-status',
    defaultMessage: 'Job status:',
  },
  jobTitle: {
    id: 'employee.job-title',
    defaultMessage: 'Job title:',
  },
  group: {
    id: 'employee.group',
    defaultMessage: 'Group:',
  },
  union: {
    id: 'employee.union',
    defaultMessage: 'Union:',
  },
  levelAsOfAprilFirst: {
    id: 'employee.level-as-of-april-first',
    defaultMessage: 'Level as of April 1st',
  },
  parametersTitle: {
    id: 'employee.benefits.parameters-title',
    defaultMessage: 'Parameters',
  },
  specificTitle: {
    id: 'employee.benefits.specific-title',
    defaultMessage: 'Specific',
  },
  unionTitle: {
    id: 'employee.benefits.union-title',
    defaultMessage: 'Union',
  },
  isSpecificsBenefits: {
    id: 'employee.benefits.is-specific-benefits',
    defaultMessage: 'Specific benefits',
  },
  addPer: {
    id: 'employee.benefits.add-per',
    defaultMessage: 'Add per. 4 (%):',
  },
});

@connect(state => ({
  entry: state.employees.entry,
  scenarioDescription: state.scenario.selectedScenario.scenarioDescription,
  scenarioId: state.scenario.selectedScenario.scenarioId,
  year: state.scenario.selectedScenario.year,
  isLoading: state.employees.isLoading,
  prevEmployeeId: state.employees.employeeId,
  levels: extractLevels(state),
  replacements: extractReplacements(state),
  currencyOptions: getCurrencyOptions(state),
}), (dispatch) => bindActionCreators({
  getEmployee,
  setTitle,
}, dispatch))
class EmployeeView extends TrackablePage {
  static propTypes = {
    isLoading: PropTypes.any,
    scenarioId: PropTypes.number,
    employeeId: PropTypes.string,
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
    const { firstName, lastName } = props.entry;
    const { setTitle } = props;
    setTitle(this.getFullName(firstName, lastName));
  }

  load(props) {
    const { employeeId, prevEmployeeId, getEmployee, isLoading, scenarioId } = props;
    if (employeeId === prevEmployeeId || isLoading) {
      return;
    }
    getEmployee(employeeId, scenarioId);
  }

  @autobind
  onEdit() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  @autobind
  onMore() {
    console.error('not implemented yet'); // eslint-disable-line no-console
  }

  renderDetailsTab() {
    const { isLoading, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      financialYear: { code: financialYearCode },
      employmentDate,
      jobType: { shortDescription: jobTypeShortDescription },
      jobStatus: { shortDescription: jobStatusShortDescription, longDescription: jobStatusLongDescription },
      jobTitle: { description: jobTitleDescription, notaryEmploymentCode },
      group,
      union: { code: unionCode, shortDescription: unionDescription },
      levelAsOfAprilFirst,
    } = this.props.entry;
    return (
      <Form.Tab id='details' intlId='employee.details' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ financialYearCode } labelIntlId='employee.financial-year' /></Form.Column>
          <Form.Column><Field value={ employeeNumber } labelIntlId='employee.employee-number' /></Form.Column>
          <Form.Column><Field value={ employmentDate } labelIntlId='employee.employment-date' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ firstName } labelIntlId='employee.first-name' /></Form.Column>
          <Form.Column><Field value={ lastName } labelIntlId='employee.last-name' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ jobStatusShortDescription } labelIntlId='employee.job-status' /></Form.Column>
          <Form.Column><Field.Info value={ jobStatusLongDescription } /></Form.Column>
          <Form.Column><Field value={ jobTypeShortDescription } labelIntlId='employee.job-type' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ notaryEmploymentCode } labelIntlId='employee.job-title' /></Form.Column>
          <Form.Column><Field.Info value={ jobTitleDescription } /></Form.Column>
          <Form.Column><Field value={ group } labelIntlId='employee.group' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ unionCode } labelIntlId='employee.union' /></Form.Column>
          <Form.Column><Field.Info value={ unionDescription } /></Form.Column>
          <Form.Column><Field value={ levelAsOfAprilFirst } labelIntlId='employee.level-as-of-april-first' /></Form.Column>
          <Form.Column />
        </Form.Row>
        <Form.Separator />
      </Form.Tab>
    );
  }

  renderLevelsTab() {
    const { isLoading, levels, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      hoursPerDay: { value: valueHoursPerDay },
      hoursPerDayIfDifferent,
    } = this.props.entry;
    return (
      <Form.Tab id='employee' intlId='employee.levels' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column>
            <FormattedMessage id='employee.salaries' defaultMessage='Salaries' />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column4>
            <Form.Grid
              { ...levels }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number value={ valueHoursPerDay } labelIntlId='employee.hours-per-day' /></Form.Column>
          <Form.Column><Field.Number value={ hoursPerDayIfDifferent } labelIntlId='employee.if-different' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
      </Form.Tab>
    );
  }

  renderPayrollDeductionsTab() {
    const { isLoading, editMode, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      payrollDeduction: {
        specificPayrolDedactionId,
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
    } = this.props.entry;
    const isHidden = specificPayrolDedactionId > 0;
    return (
      <Form.Tab id='payroll-deductions' intlId='employee.payroll-deductions' isLoading={ isLoading } isHidden={ isHidden || isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Checkbox single={ true } value={ specificPayrollDeductions } editMode={ editMode } labelIntlId='employee.specific-payroll-dedaction' /></Form.Column>
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
                <FormattedMessage id='employee.title-specific' defaultMessage='Specific' />
              </div>
            </Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeCPP } labelIntlId='employee.payroll-cpp' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeCPP } labelIntlId='employee.payroll-cpp' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeWCB } labelIntlId='employee.payroll-wcb' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeWCB } labelIntlId='employee.payroll-wcb' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeHCP } labelIntlId='employee.payroll-hcp' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeHCP } labelIntlId='employee.payroll-hcp' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeEI } labelIntlId='employee.payroll-ei' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeEI } labelIntlId='employee.payroll-ei' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codePension } labelIntlId='employee.payroll-pension' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodePension } labelIntlId='employee.payroll-pension' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeQPIP } labelIntlId='employee.payroll-qpip' /></Form.Column>
          { specificPayrollDeductions ?
            <Form.Column><Field value={ scodeQPIP } labelIntlId='employee.payroll-qpip' /></Form.Column>
            : <Form.Column /> }
          <Form.Column2 />
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Checkbox single={ true } value={ calculateTaxableAmaunt } editMode={ editMode } labelIntlId='employee.payroll-calculate-taxable-amount' /></Form.Column>
          <Form.Column3 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number value={ amaunt } labelIntlId='employee.payroll-taxable-wage-amount' /></Form.Column>
          <Form.Column><Field.Info value={ this.makePayrollRange(dateFrom, dateTo) } /></Form.Column>
          <Form.Column><Field.Number value={ specificAmount } labelIntlId='employee.payroll-specific-taxable-amount' /></Form.Column>
          <Form.Column />
        </Form.Row>
      </Form.Tab>
    );
  }

  makePayrollRange(from, to) {
    const { intl } = this.props;
    const fromLabel = intl.formatMessage({ id: 'employee.payroll-from' });
    const toLabel = intl.formatMessage({ id: 'employee.payroll-to' });
    return `${ fromLabel } ${ from } ${ toLabel } ${ to }`;
  }

  renderPremiumsTab() {
    const { isLoading, intl, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      permanentNightShiftDays,
      premiums: {
        seniority: { code: seniorityCode, description: seniorityDescription },
        others1: { code: others1Code, description: others1Description },
        others2: { code: others2Code, description: others2Description },
        others3: { code: others3Code, description: others3Description },
        others4: { code: others4Code, description: others4Description },
      },
    } = this.props.entry;
    return (
      <Form.Tab id='premiums' intlId='employee.premiums' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ seniorityCode } labelIntlId='employee.premiums-seniority' /></Form.Column>
          <Form.Column><Field.Info value={ seniorityDescription } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ others1Code } labelIntlId='employee.premiums-others' /></Form.Column>
          <Form.Column><Field.Info value={ others1Description } /></Form.Column>
          <Form.Column><Field value={ others2Code } /></Form.Column>
          <Form.Column><Field.Info value={ others2Description } /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ others3Code } /></Form.Column>
          <Form.Column><Field.Info value={ others3Description } /></Form.Column>
          <Form.Column><Field value={ others4Code } /></Form.Column>
          <Form.Column><Field.Info value={ others4Description } /></Form.Column>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field.Number value={ permanentNightShiftDays } labelIntlId='employee.premiums-permanent-night-shift-days' /></Form.Column>
          <Form.Column><Field.Info value={ intl.formatMessage({ id: 'employee.premiums-days' }) } /></Form.Column>
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderEnsurancesTab() {
    const { isLoading, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      insurances: {
        General: { code: codeGeneral, description: descriptionGeneral },
        ShortTerm: { code: codeShortTerm, description: descriptionShortTerm },
        LongTerm: { code: codeLongTerm, description: descriptionLongTerm },
        Group1: { code: codeGroup1, description: descriptionGroup1 },
        Group2: { code: codeGroup2, description: descriptionGroup2 },
        Group3: { code: codeGroup3, description: descriptionGroup3 },
      },
    } = this.props.entry;
    return (
      <Form.Tab id='insurances' intlId='employee.insurances' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><Field value={ codeGeneral } labelIntlId='employee.insurance-general' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionGeneral } /></Form.Column>
          <Form.Column><Field value={ codeShortTerm } labelIntlId='employee.insurance-short-term' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionShortTerm } /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeLongTerm } labelIntlId='employee.insurance-long-term' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionLongTerm } /></Form.Column>
          <Form.Column><Field value={ codeGroup1 } labelIntlId='employee.insurance-group1' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionGroup1 } /></Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column><Field value={ codeGroup2 } labelIntlId='employee.insurance-group2' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionGroup2 } /></Form.Column>
          <Form.Column><Field value={ codeGroup3 } labelIntlId='employee.insurance-group3' /></Form.Column>
          <Form.Column><Field.Info value={ descriptionGroup3 } /></Form.Column>
        </Form.Row>
      </Form.Tab>
    );
  }

  renderReplacementsTab() {
    const { isLoading, replacements, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
    } = this.props.entry;
    return (
      <Form.Tab id='replacements' intlId='employee.replacements' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
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

  renderVacationTab() {
    const { isLoading, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      jobStatus: { codeDescription },
      vacation: {
        basedOnParametersVacationDays,
        ifDifferentAmountInVacationBank,
        ifDifferentHoursInVacationBank,
        ifDifferentVacationDays,
      },
    } = this.props.entry;
    const basedOnParameters = this.props.intl.formatMessage({ id: 'employee.based-on-parameters' });
    const ifDifferent = this.props.intl.formatMessage({ id: 'employee.if-different-vacation' });
    const fullTimeView = codeDescription === JOB_STATUS_FULL_TIME_REGULAR || codeDescription === JOB_STATUS_FULL_TIME_TEMPORARY;
    const partTimeView = codeDescription === JOB_STATUS_PARTIAL_TIME_REGULAR ||
      codeDescription === JOB_STATUS_PARTIAL_TIME_TEMPORARY ||
      codeDescription === JOB_STATUS_PARTIAL_TIME_CASUAL;

    return (
      <Form.Tab id='vacation' intlId='employee.vacation' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Form.Column><div className='employee-view__column-header'>{ basedOnParameters }</div></Form.Column>
          <Form.Column><div className='employee-view__column-header'>{ ifDifferent }</div></Form.Column>
          <Form.Column2 />
        </Form.Row>
        { fullTimeView &&
          <Form.Row>
            <Form.Column><Field value={ basedOnParametersVacationDays } labelIntlId='employee.number-of-vacation-days-full-time' /></Form.Column>
            <Form.Column><Field value={ ifDifferentVacationDays } labelIntlId='employee.number-of-vacation-days-full-time' /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { partTimeView &&
          <Form.Row>
            <Form.Column><Field value={ basedOnParametersVacationDays } labelIntlId='employee.number-of-absence-days' /></Form.Column>
            <Form.Column><Field value={ ifDifferentVacationDays } labelIntlId='employee.number-of-absence-days' /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { partTimeView &&
          <Form.Row>
            <Form.Column />
            <Form.Column><Field value={ ifDifferentAmountInVacationBank } labelIntlId='employee.amount-in-vacation-bank' /></Form.Column>
            <Form.Column2 />
          </Form.Row>
        }
        { partTimeView &&
        <Form.Row>
          <Form.Column />
          <Form.Column><Field value={ ifDifferentHoursInVacationBank } labelIntlId='employee.hours-in-vacation-bank' /></Form.Column>
          <Form.Column2 />
        </Form.Row>
        }
      </Form.Tab>
    );
  }

  renderBenefitsTab() {
    const { jobStatus } = this.props.entry;
    if (!isPartTime(jobStatus)) {
      return null;
    }

    const { isLoading, editMode, scenarioId } = this.props;
    const {
      firstName,
      lastName,
      employeeNumber,
      id: employeeId,
      isSpecificsBenefits,
      benefits: {
        additionalPeriod4,
        pctHoliday,
        pctPsychiatricLeave,
        pctSickDay,
        pctVacation,
      },
      specificsBenefits: {
        additionalPeriod4: specificAdditionalPeriod4,
        pctHoliday: specificPctHoliday,
        pctPsychiatricLeave: specificPctPsychiatricLeave,
        pctSickDay: specificPctSickDay,
        pctVacation: specificPctVacation,
      },
      union: {
        code: unionCode,
      },
    } = this.props.entry;

    const parametersTitle = this.props.intl.formatMessage({ id: 'employee.benefits.parameters-title' });
    const unionTitle = this.props.intl.formatMessage({ id: 'employee.benefits.union-title' });
    const specificTitle = this.props.intl.formatMessage({ id: 'employee.benefits.specific-title' });

    const isUnionType = unionCode === '20';

    return (
      <Form.Tab id='benefits' intlId='employee.benefits' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            <Employee
              large={ true }
              labelIntlId='employee.employee-title'
              number={ employeeNumber }
              firstName={ firstName }
              lastName={ lastName }
              employeeId={ employeeId }
              scenarioId={ scenarioId }
            />
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
        <Form.Row>
          <Checkbox single={ true } value={ isSpecificsBenefits } editMode={ editMode } labelIntlId='employee.benefits.is-specific-benefits' />
        </Form.Row>
        <Form.Row>
          <Form.Column><div className='employee-view__column-header'>{ isUnionType ? unionTitle : parametersTitle }</div></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><div className='employee-view__column-header'>{ specificTitle }</div></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ pctVacation } labelIntlId='position-by-job-title.benefits-vacation-percentage' /></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><Field.Number2 value={ specificPctVacation } labelIntlId='position-by-job-title.benefits-vacation-percentage' /></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ pctHoliday } labelIntlId='position-by-job-title.benefits-holidays-percentage' /></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><Field.Number2 value={ specificPctHoliday } labelIntlId='position-by-job-title.benefits-holidays-percentage' /></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ pctSickDay } labelIntlId='position-by-job-title.benefits-sick-days-percentage' /></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><Field.Number2 value={ specificPctSickDay } labelIntlId='position-by-job-title.benefits-sick-days-percentage' /></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ pctPsychiatricLeave } labelIntlId='position-by-job-title.benefits-psych-leave-percentage' /></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><Field.Number2 value={ specificPctPsychiatricLeave } labelIntlId='position-by-job-title.benefits-psych-leave-percentage' /></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
        <Form.Row>
          <Form.Column><Field.Number2 value={ additionalPeriod4 } labelIntlId='employee.benefits.add-per' /></Form.Column>
          { isSpecificsBenefits ?
            <Form.Column><Field.Number2 value={ specificAdditionalPeriod4 } labelIntlId='employee.benefits.add-per' /></Form.Column> :
            <Form.Column />
          }
          <Form.Column2 />
        </Form.Row>
      </Form.Tab>
    );
  }

  renderDistributionsTab() {
    const { isLoading } = this.props;
    return (
      <Form.Tab id='distributions' intlId='employee.distributions' isLoading={ isLoading }>
        <Form.Row>
          <Form.Column4>
            distributions
          </Form.Column4>
        </Form.Row>
        <Form.Separator />
      </Form.Tab>
    );
  }

  getFullName(firstName, lastName) {
    const names = [firstName, lastName];
    return names.join(' ');
  }

  render() {
    const { firstName, lastName } = this.props.entry;
    return (
      <div className='employee-view'>
        <div className='base-list__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } } >
          <div className='employee-view__form'>
            <Form>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='employee.title' message={ this.getFullName(firstName, lastName) } />
                </Form.ActionsLeft>
                <Form.ActionsRight>
                  { false && <Form.Action type='more' onClick={ this.onMore } /> }
                </Form.ActionsRight>
              </Form.Actions>
              <Form.Tabs active='details'>
                { this.renderDetailsTab() }
                { this.renderLevelsTab() }
                { this.renderPayrollDeductionsTab() }
                { this.renderPremiumsTab() }
                { this.renderEnsurancesTab() }
                { this.renderVacationTab() }
                { this.renderReplacementsTab() }
                { this.renderBenefitsTab() }
                { /* GRFWEB-6472: hide distributions in Employee view */ }
                { false && this.renderDistributionsTab() }
              </Form.Tabs>
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(EmployeeView);
