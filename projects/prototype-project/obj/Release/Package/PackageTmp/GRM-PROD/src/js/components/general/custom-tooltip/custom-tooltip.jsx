import React, { PureComponent } from 'react';

import './custom-tooltip.scss';

export default class CustomTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooltipWidth: 0,
      leftOffset: 0,
    };

    this.arrowNode = undefined;
    this.tooltipNode = undefined;
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const tooltipRect = this.tooltipNode.getBoundingClientRect();

    this.setState({ tooltipWidth: tooltipRect.width });

    if ((tooltipRect.right - tooltipRect.width / 2) > window.innerWidth) {
      this.setState({ leftOffset: (tooltipRect.right - tooltipRect.width / 2) - window.innerWidth });
    }
  }

  render() {
    const { errorClassName, error, isDataGridField } = this.props;

    return (
      <div>
        <div className='tooltip-arrow' style={ { left: this.props.fieldCenter } } ref={ (node) => { this.arrowNode = node; } } />
        <div className={ errorClassName } aria-label={ error } ref={ (node) => { this.tooltipNode = node; } } style={ { left: this.props.fieldCenter - (this.state.tooltipWidth / 2) - this.state.leftOffset } }>
          { isDataGridField ? null : error }
        </div>
      </div>
    );
  }
}
