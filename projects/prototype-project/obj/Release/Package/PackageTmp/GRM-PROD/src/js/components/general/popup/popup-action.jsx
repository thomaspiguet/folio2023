import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { focusKeyDown } from '../../../utils/components/keyboard';

export class PopupAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouse: false,
    };
  }

  @autobind
  onKeyDown(e) {
    const { onTab, onShiftTab } = this.props;
    focusKeyDown(e, { onTab, onShiftTab, onEnter: this.onAction });
  }

  @autobind
  onAction() {
    const { action: { action, func, arg }, onAction } = this.props;
    onAction(action, func, arg);
  }

  @autobind
  onMouseDown(e) {
    this.setState({ mouse: true });
  }

  @autobind
  onMouseUp(e) {
    this.setState({ mouse: false });
  }

  render() {
    const { action: { kind }, onRef } = this.props;
    const { mouse } = this.state;
    return (
      <div
        className={ classNames('popup-action', `popup-action--${ kind }`, {
          'popup-action--mouse': mouse,
        }) }
        onClick={ this.onAction }
        onKeyDown={ this.onKeyDown }
        tabIndex={ '0' }
        ref={ onRef }
        onMouseDown={ this.onMouseDown }
        onMouseUp={ this.onMouseUp }
      >
        <FormattedMessage id={ `popup.action-${ kind }` } />
      </div>
    );
  }
}
