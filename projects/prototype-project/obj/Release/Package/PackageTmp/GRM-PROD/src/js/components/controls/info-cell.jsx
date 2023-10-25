import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import './info-cell.scss';

export default class InfoCell extends PureComponent {
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
    return (
      <div className='info-cell'>
        <div
          className='info-cell__icon'
          onClick={ this.handleOnClick }
        />
      </div>
    );
  }
}
