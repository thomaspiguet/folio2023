import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './tags.scss';

export default class Tag extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClose = (event) => {
    this.props.onClose(event);
  };

  handleClick = (event) => {
    this.props.onClick(event);
  };

  render() {
    return (
      <div className='tag'>
        <div className='tag__text' onClick={ this.handleClick }>{ this.props.value }</div>
        <div className='tag__close' onClick={ this.handleClose } />
      </div>
    );
  }

}
