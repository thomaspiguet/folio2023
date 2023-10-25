import React, { Component } from 'react';
import { isUndefined } from 'lodash';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { defineMessages, injectIntl } from 'react-intl';

import { getRequiredAttendanceQuery } from '../../api/actions';

import {
  extractGeneralBenefitsTab,
  extractHourlyRateTab,
  extractLeavesTab,
  extractOtherInformationTab,
  extractPayrollDeductionsTab,
  extractPremiumsTab,
  extractReplacementsTab,
  extractSpecificBenefitsTab,
  extractSummaryTab,
  extractWorkedTab,
} from './selectors/required-attendance-query';

import { ScrollBox } from '../../components/general/scroll-box/ScrollBox';

import { formatMoney, formatNumber, getCurrencyOptions } from '../../utils/selectors/currency';

import DataGridFixed from '../../components/general/data-grid/data-grid-fixed';
import Field from '../../components/controls/field';
import Form from '../../components/general/form/form';

import { titleIcon } from './constants';

import './required-attendance-query.scss';

defineMessages({
  title: {
    id: 'required-attendance-query.title',
    defaultMessage: 'Query calculated expenses',
  },
  summary: {
    id: 'required-attendance-query.tab.summary',
    defaultMessage: 'Summary',
  },
  worked: {
    id: 'required-attendance-query.tab.worked',
    defaultMessage: 'Worked',
  },
  generalBenefits: {
    id: 'required-attendance-query.tab.general-benefits',
    defaultMessage: 'General benefits',
  },
  specificBenefits: {
    id: 'required-attendance-query.tab.specific-benefits',
    defaultMessage: 'Specific benefits',
  },
  premiums: {
    id: 'required-attendance-query.tab.premiums',
    defaultMessage: 'Premiums',
  },
  payrollDeductions: {
    id: 'required-attendance-query.tab.payroll-deductions',
    defaultMessage: 'Payroll deductions',
  },
  replacements: {
    id: 'required-attendance-query.tab.replacements',
    defaultMessage: 'Replacements',
  },
  hourlyRate: {
    id: 'required-attendance-query.tab.hourly-rate',
    defaultMessage: 'Hourly rate',
  },
  otherInformation: {
    id: 'required-attendance-query.tab.other-information',
    defaultMessage: 'Other information',
  },
  leaves: {
    id: 'required-attendance-query.tab.leaves',
    defaultMessage: 'Leaves',
  },
  days: {
    id: 'required-attendance-query.total.days-label',
    defaultMessage: 'Days:',
  },
  hours: {
    id: 'required-attendance-query.total.hours-label',
    defaultMessage: 'Hours:',
  },
  amount: {
    id: 'required-attendance-query.total.amounts-label',
    defaultMessage: 'Amounts:',
  },
  position: {
    id: 'required-attendance-query.total.position',
    defaultMessage: 'Position:',
  },
});

@connect((state, props) => ({
  currencyOptions: getCurrencyOptions(state),
  data: state.requiredAttendanceQuery.data,
  isLoading: state.requiredAttendanceQuery.isLoading,
  scenarioId: state.scenario.selectedScenario.scenarioId,

  generalBenefitsTabTable: extractGeneralBenefitsTab(state, props),
  hourlyRateTabTable: extractHourlyRateTab(state, props),
  leavesTabTable: extractLeavesTab(state, props),
  otherInformationTabTable: extractOtherInformationTab(state, props),
  payrollDeductionsTabTable: extractPayrollDeductionsTab(state, props),
  premiumsTabTable: extractPremiumsTab(state, props),
  replacementsTabTable: extractReplacementsTab(state, props),
  specificBenefitsTabTable: extractSpecificBenefitsTab(state, props),
  summaryTabTable: extractSummaryTab(state, props),
  workedTabTable: extractWorkedTab(state, props),
}), (dispatch) => bindActionCreators({
  getRequiredAttendanceQuery,
}, dispatch))
class RequiredAttendanceQuery extends Component {
  static propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
    getRequiredAttendanceQuery: PropTypes.func,
    requiredAttendanceId: PropTypes.string,
    scenarioId: PropTypes.number,
  };

  componentDidMount() {
    this.init(this.props);
  }

  init(props) {
    const { requiredAttendanceId, scenarioId } = props;
    props.getRequiredAttendanceQuery(requiredAttendanceId, scenarioId);
  }

  renderSummaryChain(totalHour, totalAmount, totalDay, position, currencyOptions) {
    return (totalHour || totalAmount || totalDay) ? (
      <Form.Row>
        <Form.Column4>
          <Form.Chain>
            { isUndefined(position) ? null : <Field
              value={ position }
              labelIntlId='required-attendance-query.total.position'
            />
            }
            { isUndefined(totalDay) ? null : <Field
              value={ formatNumber(totalDay, currencyOptions) }
              labelIntlId='required-attendance-query.total.days-label'
            />
            }
            { isUndefined(totalHour) ? null : <Field
              value={ formatNumber(totalHour, currencyOptions) }
              labelIntlId='required-attendance-query.total.hours-label'
            />
            }
            { isUndefined(totalAmount) ? null : <Field
              value={ formatMoney(totalAmount, currencyOptions) }
              labelIntlId='required-attendance-query.total.amounts-label'
            />
            }
          </Form.Chain>
        </Form.Column4>
      </Form.Row>
    ) : null;
  }

  renderExpenses(isLoading, totalHour, totalAmount, totalDay, position, table, currencyOptions, tabId, tabIntlId) {
    return (
      <Form.Tab
        id={ tabId }
        intlId={ tabIntlId }
        isLoading={ isLoading }
      >
        { this.renderSummaryChain(totalHour, totalAmount, totalDay, position, currencyOptions) }
        { table.rows.length && <Form.Row>
          <Form.Column4>
            <DataGridFixed
              rows={ table.rows }
              columnsFixed={ table.columnsFixed }
              columnsScrolled={ table.columnsScrolled }
              isLoading={ isLoading }
              expandable={ false }
              noPadding
              noPaging
            />
          </Form.Column4>
        </Form.Row> }
      </Form.Tab>
    );
  }

  renderGeneralBenefitsTab() {
    const { currencyOptions, data: { generalBenefits }, isLoading, generalBenefitsTabTable: table } = this.props;
    const { totalHour, totalAmount } = generalBenefits;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, totalAmount, undefined, undefined, table, currencyOptions, 'general-benefits', 'required-attendance-query.tab.general-benefits')
      : null;
  }

  renderHourlyRateTab() {
    const { currencyOptions, isLoading, hourlyRateTabTable: table } = this.props;

    return table.rows.length ?
      this.renderExpenses(isLoading, undefined, undefined, undefined, undefined, table, currencyOptions, 'hourly-rate', 'required-attendance-query.tab.hourly-rate')
      : null;
  }

  renderLeavesTab() {
    const { currencyOptions, data: { leaves }, isLoading, leavesTabTable: table } = this.props;
    const { totalHour } = leaves;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, undefined, undefined, undefined, table, currencyOptions, 'leaves', 'required-attendance-query.tab.leaves')
      : null;
  }

  renderOtherInformationTab() {
    const { currencyOptions, data: { otherInformation }, isLoading, otherInformationTabTable: table } = this.props;
    const { totalAmount, totalHour, totalDay } = otherInformation;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, totalAmount, totalDay, undefined, table, currencyOptions, 'other-information', 'required-attendance-query.tab.other-information')
      : null;
  }

  renderPayrollDeductionsTab() {
    const { currencyOptions, data: { payrollDeductions }, isLoading, payrollDeductionsTabTable: table } = this.props;
    const { totalAmount } = payrollDeductions;

    return table.rows.length ?
      this.renderExpenses(isLoading, undefined, totalAmount, undefined, undefined, table, currencyOptions, 'payroll-deductions', 'required-attendance-query.tab.payroll-deductions')
      : null;
  }

  renderPremiumsTab() {
    const { currencyOptions, data: { premiums }, isLoading, premiumsTabTable: table } = this.props;
    const { totalAmount } = premiums;

    return table.rows.length ?
      this.renderExpenses(isLoading, undefined, totalAmount, undefined, undefined, table, currencyOptions, 'premiums', 'required-attendance-query.tab.premiums')
      : null;
  }

  renderReplacementsTab() {
    const { currencyOptions, data: { replacements }, isLoading, replacementsTabTable: table } = this.props;
    const { totalHour } = replacements;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, undefined, undefined, undefined, table, currencyOptions, 'replacements', 'required-attendance-query.tab.replacements')
      : null;
  }

  renderSpecificBenefitsTab() {
    const { currencyOptions, data: { specialBenefits }, isLoading, specificBenefitsTabTable: table } = this.props;
    const { totalHour, totalAmount } = specialBenefits;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, totalAmount, undefined, undefined, table, currencyOptions, 'specific-benefits', 'required-attendance-query.tab.specific-benefits')
      : null;
  }

  renderSummaryTab() {
    const { currencyOptions, data: { summary }, isLoading, summaryTabTable: table } = this.props;
    const { totalHour, totalAmount, position } = summary;

    return this.renderExpenses(isLoading, totalHour, totalAmount, undefined, position, table, currencyOptions, 'summary', 'required-attendance-query.tab.summary');
  }

  renderWorkedTab() {
    const { currencyOptions, data: { worked }, isLoading, workedTabTable: table } = this.props;
    const { totalHour, totalAmount } = worked;

    return table.rows.length ?
      this.renderExpenses(isLoading, totalHour, totalAmount, undefined, undefined, table, currencyOptions, 'worked', 'required-attendance-query.tab.worked')
      : null;
  }

  renderTabs() {
    const { editMode } = this.props;

    return (
      <Form.Tabs active='summary' editMode={ editMode }>
        { this.renderSummaryTab() }
        { this.renderWorkedTab() }
        { this.renderGeneralBenefitsTab() }
        { this.renderSpecificBenefitsTab() }
        { this.renderPremiumsTab() }
        { this.renderPayrollDeductionsTab() }
        { this.renderReplacementsTab() }
        { this.renderHourlyRateTab() }
        { this.renderLeavesTab() }
        { this.renderOtherInformationTab() }
      </Form.Tabs>
    );
  }

  render() {
    const { editMode } = this.props;

    return (
      <div className='required-attendance' ref={ (node) => { this.formNode = node; } }>
        <div className='required-attendance__gradient content-gradient' />
        <ScrollBox style={ { height: '100%' } }>
          <div className='required-attendance__form'>
            <Form editMode={ editMode }>
              <Form.Actions>
                <Form.ActionsLeft>
                  <Form.Title icon={ titleIcon } intlId='required-attendance-query.title' />
                </Form.ActionsLeft>
                <Form.ActionsRight />
              </Form.Actions>
              { this.renderTabs() }
            </Form>
          </div>
        </ScrollBox>
      </div>
    );
  }
}

export default injectIntl(RequiredAttendanceQuery);
