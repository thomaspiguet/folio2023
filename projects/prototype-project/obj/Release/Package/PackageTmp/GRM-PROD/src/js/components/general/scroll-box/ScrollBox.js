import React from 'react';
import {GenericScrollBox} from './GenericScrollBox';

import './scroll-box.scss';

export class ScrollBox extends React.Component {

  render() {
    const disableScrollX = (this.props.disableScrollX !== undefined ? this.props.disableScrollX : true);
    return (
      <GenericScrollBox {...this.props} disableScrollX={ disableScrollX } ref={ this.props.getRef }>
        <div className="scroll-box__viewport">
          {this.props.children}
        </div>
      </GenericScrollBox>
    );
  }
}
