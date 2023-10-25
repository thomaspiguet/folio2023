import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

export default class RelativePortal extends Component {
  static propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    height: PropTypes.number,
    offset: PropTypes.number,
    zIndex: PropTypes.number,
    onTop: PropTypes.bool,
    onBottom: PropTypes.bool,
  };

  static defaultProps = {
    top: 0,
    left: 0,
    height: 0,
    offset: 40,
    zIndex: 3,
  };

  constructor(props) {
    super(props);
    this.node = document.createElement('div');
    document.body.appendChild(this.node);
    this.state = {
      top: 0,
      left: 0,
    };
  }

  componentDidMount() {
    this.handleResize = () => {
      const { height, offset, onTop, onBottom } = this.props;
      const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      const left = window.scrollX + rect.left;
      const viewHeight = window.innerHeight;
      const topMargin = window.scrollY + rect.top;
      const isOnBottom = onTop ? false : (onBottom ? true : topMargin + height < viewHeight);
      const top = isOnBottom ? topMargin : topMargin - height - offset;

      if (top !== this.state.top || left !== this.state.left) {
        this.setState({ left, top });
      }
    };

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.body.removeChild(this.node);
  }

  render() {
    return <div />;
  }

  componentDidUpdate() {
    ReactDOM.render(
      <div
        { ...omit(this.props, ['zIndex', 'onTop', 'onBottom']) }
        style={ {
          position: 'absolute',
          top: this.state.top + this.props.top,
          left: this.state.left + this.props.left,
          zIndex: this.props.zIndex,
        } }
      />,
      this.node
    );
  }

}
