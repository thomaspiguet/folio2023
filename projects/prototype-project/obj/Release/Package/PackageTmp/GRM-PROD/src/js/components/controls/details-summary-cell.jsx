import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import SummaryCell from './summary-cell';

@connect()
export default class DetailsSummaryCell extends PureComponent {
  static propTypes = {
    row: PropTypes.object,
    action: PropTypes.func,
  };

  @autobind
  handleOnClick() {
    const { dispatch, action, otherExpensesId, financialYearId, row: { original: { description } } } = this.props;
    dispatch(action(otherExpensesId, financialYearId, description));
  }

  render() {
    return (
      <SummaryCell
        row={ this.props.row }
        onClick={ this.handleOnClick }
      />
    );
  }
}
