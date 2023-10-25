import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import InfoCell from './info-cell';

@connect()
export default class DetailsInfoCell extends PureComponent {
  static propTypes = {
    row: PropTypes.object,
    getOtherExpensesHistoryDetails: PropTypes.func,
  };

  @autobind
  handleOnClick(row) {
    const { dispatch, action, id } = this.props;
    dispatch(action(id));
  }

  render() {
    return (
      <InfoCell
        row={ this.props.row }
        onClick={ this.handleOnClick }
      />
    );
  }
}
