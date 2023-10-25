import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { map, last, keys } from 'lodash';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormattedMessage } from 'react-intl';
import currencyFormatter from 'currency-formatter';

import { toggleExpandChart } from './actions';

import Budget from './dashboard-budget';

import './dashboard-chart.scss';

import { extractBudgetsAmount } from '../../../selectors/dashboard';

const getPath = (x, y, width, height) => {
  return `M${ x },${ y + height - width / 2 }
          a${ width / 2 },${ width / 2 },0,0,0,${ width },0
          l0,-${ height }
          a${ width / 2 },${ width / 2 },0,0,0,-${ width },0
          Z`;
};

const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={ getPath(x, y, width, height) } stroke='none' fill={ fill } />;
};

@connect(state => ({
  chartExpanded: state.dashboard.chartExpanded,
  locale: state.app.locale,
  data: state.dashboard.data,
  budgets: state.dashboard.budgets,
  amounts: extractBudgetsAmount(state),
}), (dispatch) => bindActionCreators({
  toggleExpandChart,
}, dispatch))
export default class DashboardChart extends Component {
  static propTypes = {
    budgets: PropTypes.object,
    amounts: PropTypes.object,
    locale: PropTypes.string,
    chartExpanded: PropTypes.bool,
    toggleExpandChart: PropTypes.func,
  };

  handleShowChart =() => {
    this.props.toggleExpandChart();
  };

  render() {
    const toggleClassNames = classnames('dashboard-chart__title-icon', {
      'dashboard-chart__title-icon--expanded': this.props.chartExpanded,
    });

    return (
      <div className='dashboard-chart'>
        <div className='dashboard-chart__title'>
          <div className={ toggleClassNames } onClick={ this.handleShowChart } />
          <div className='dashboard-chart__title-text'>
            <FormattedMessage id='dashboard.avgBudget' defaultMessage='Avg. Budget' />
          </div>
        </div>
        { this.renderChartBudget() }
        { this.renderChartVisualisation() }
      </div>
    );
  }

  renderChartBudget() {
    if (this.props.chartExpanded) {
      const lastBudgetId = last(keys(this.props.budgets));
      return (
        <div className='dashboard-chart__budgets'>
          {
            map(this.props.budgets, (budget, id) => (
              <div className='dashboard-chart__budget-title' key={ id }>
                <Budget name={ budget.title } color={ budget.color } isLast={ id === lastBudgetId } />
              </div>
            ))
          }
          <input className='dashboard-chart__add-budget' type='button' value='+Add budget' />
          <div className='dashboard-chart__filler' />
        </div>
      );
    }
    return null;
  }

  renderChartVisualisation() {
    if (this.props.chartExpanded) {
      return (
        <div className='dashboard-chart__visualisation'>
          <ResponsiveContainer height={ 350 } >
            <BarChart
              data={ this.props.amounts }
              margin={ { top: 20, right: 30, left: 20, bottom: 5 } }
              barCategoryGap={ '40%' }
            >
              <XAxis
                dataKey='month'
                axisLine={ { stroke: '#ccc' } }
                tick={ { fontSize: '12px' } }
              />
              <YAxis
                axisLine={ { stroke: '#ccc' } }
                tickFormatter={ (text) => currencyFormatter.format(text, { locale: this.props.locale }) }
              />
              <CartesianGrid strokeDasharray='5 0' stroke='#eee' vertical={ false } />
              <Tooltip />
              <Legend />
              {
                map(this.props.budgets, (budget, id) => (
                  <Bar
                    dataKey={ id }
                    name={ budget.title }
                    key={ id }
                    fill={ this.props.budgets[id].color }
                    shape={ <RoundedBar /> }
                  />
                ))
              }
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return null;
  }

}
