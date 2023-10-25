import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class LeftSideGradient extends Component {
  static propTypes = {
    parentViewClassName: PropTypes.string,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    parentViewClassName: '',
    hidden: false,
  };

  render() {
    const leftSideGradientClassNames = classnames(this.props.parentViewClassName,
      'content-gradient', {
        'content-gradient--hidden': this.props.hidden,
      }
    );

    return (
      <div className={ leftSideGradientClassNames } />
    );
  }
}
