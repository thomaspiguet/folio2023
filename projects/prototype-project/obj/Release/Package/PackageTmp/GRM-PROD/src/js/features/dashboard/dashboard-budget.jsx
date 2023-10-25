import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { autobind } from 'core-decorators';
import { isEqual } from 'lodash';

import Dropdown from '../../components/controls/dropdown';
import GridLoading from '../../components/general/data-grid/grid-loading';

import './dashboard-budget.scss';

const tableLineHeight = 40;

export default class Budget extends Component {
  static propTypes = {
    intlId: PropTypes.string,
    name: PropTypes.string,
    budgetName: PropTypes.string,
    color: PropTypes.string,
    isLast: PropTypes.bool,
    values: PropTypes.any,
    value: PropTypes.any,
    onChange: PropTypes.func,
    sortDescending: PropTypes.bool,
    isLoading: PropTypes.any,
  };

  static defaultProps = {
    name: 'Current Budget',
    isLast: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {},
    };
  }

  componentWillReceiveProps(props) {
    this.setStyleState();
  }

  getName() {
    return this.props.intlId
      ? <FormattedMessage id={ this.props.intlId } />
      : this.props.name
      ;
  }

  getBudgetName() {
    return this.props.budgetName ? <span>{` - ${ this.props.budgetName }`}</span> : null;
  }

  @autobind
  onRef(node) {
    this.node = node;
    if (node) {
      this.tableNode = node.closest('.ReactTable');
      const oldStyle = this.state.style;
      const style = this.getLoadingRectStyles();
      if (!isEqual(oldStyle, style)) {
        this.setState({ style });
      } else {
        this.tableNode = null;
      }
    }
  }

  setStyleState() {
    if (this.tableNode) {
      const oldStyle = this.state.style;
      const style = this.getLoadingRectStyles();
      if (!isEqual(oldStyle, style)) {
        this.setState({ style });
      }
    }
  }

  getLoadingRectStyles() {
    if (this.node && this.tableNode) {
      const tableRect = this.tableNode.getBoundingClientRect();
      const height = tableRect.bottom - tableRect.top - 2 * tableLineHeight + 14;
      return {
        height: `${ height }px`,
      };
    }

    return {};
  }

  render() {
    return (
      <div className='dashboard-budget' ref={ this.onRef }>
        { this.props.color && <div className='dashboard-budget__icon' style={ { backgroundColor: this.props.color } } /> }
        {
          this.props.values ?
            <Dropdown
              labelClass='dashboard-budget__label'
              valueClass='dashboard-budget__value'
              label={ this.getName() }
              values={ this.props.values }
              value={ this.props.value }
              onChange={ this.props.onChange }
              sortDescending={ this.props.sortDescending }
            />
          :
            <div className='dashboard-budget__name'>
              { this.getName() }
              { this.getBudgetName() }
            </div>
        }
        { !this.props.isLast && <div className='dashboard-budget__delimiter'>vs.</div> }
        { this.props.isLoading && <div
          className='dashboard-budget__loading'
          style={ this.state.style }
        >
          <GridLoading />
        </div>
        }
      </div>
    );
  }
}

