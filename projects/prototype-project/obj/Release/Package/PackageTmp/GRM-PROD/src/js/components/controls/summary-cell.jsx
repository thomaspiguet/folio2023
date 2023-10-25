import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import './summary-cell.scss';
import { isEmptyOrDash } from '../../utils/utils';

export default class SummaryCell extends PureComponent {
  static propTypes = {
    row: PropTypes.object,
    onClick: PropTypes.func,
  };

  @autobind
  handleOnClick() {
    const { row, onClick } = this.props;
    if (onClick) {
      onClick(row);
    }
  }

  render() {
    const { row: { value } } = this.props;

    return (
      <div className='summary-cell'>
        <div>{ value }</div>
        { !isEmptyOrDash(value) && <div
          className='summary-cell__icon'
          onClick={ this.handleOnClick }
        /> }
      </div>
    );
  }
}
