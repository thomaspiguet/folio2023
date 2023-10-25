import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { injectIntl, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import { PopupAction } from './popup-action';

import './popup-dialog.scss';
import { focusKeyDown } from '../../../utils/components/keyboard';

class PopupDialog extends PureComponent {
  static propTypes = {
    style: PropTypes.string,
    message: PropTypes.string,
    messages: PropTypes.array,
    actions: PropTypes.array,
    onAction: PropTypes.func,
    popupAction: PropTypes.func,
    popupClose: PropTypes.func,
  };

  @autobind
  onAction(action, func, arg) {
    const { popupAction, popupClose } = this.props;
    popupClose();
    if (func) {
      func(arg);
    }
    if (action) {
      popupAction(action);
    }
  }

  componentDidUpdate(prevProps) {
    this.setFirstFocus();
  }

  setFirstFocus() {
    if (this.firstNode) {
      this.firstNode.focus();
    }
  }

  setLastFocus() {
    if (this.lastNode) {
      this.lastNode.focus();
    }
  }

  @autobind
  onFirstRef(node) {
    this.firstNode = node;
  }

  @autobind
  onLastRef(node) {
    this.lastNode = node;
  }

  @autobind
  onLastActionTab(shiftKey) {
    this.setFirstFocus();
  }

  @autobind
  onKeyDown(e) {
    focusKeyDown(e, { onShiftTab: this.setLastFocus });
  }

  render() {
    const { style, actions, message, messages } = this.props.options;

    return (
      <div className='popup-dialog'>
        <div className={ classNames('popup-dialog__header', `popup-dialog__header--${ style }`) }>
          { style && <FormattedMessage id={ `popup.header-${ style }` } /> }
        </div>
        { message &&
        <div className={ classNames('popup-dialog__message', `popup-dialog__message--${ style }`) }>
          { message }
        </div>
        }
        { messages &&
          map(messages, ({ message, intlId, intlIdValues }, key) => (
            <div className={ classNames('popup-dialog__message', 'popup-dialog__message--multi', `popup-dialog__message--${ style }`) } key={ key }>
              { message }
              { intlId && <FormattedMessage id={ intlId } values={ intlIdValues } /> }
            </div>
          ))
        }
        <div
          className='popup-dialog__actions'
          tabIndex='0'
          ref={ this.onFirstRef }
          onKeyDown={ this.onKeyDown }
        >
          { map(actions, (action, index) => {
            const isLast = index === (actions.length - 1);
            return (
              <PopupAction
                action={ action }
                onAction={ this.onAction }
                key={ action.kind }
                onTab={ isLast ? this.onLastActionTab : null }
                onRef={ isLast ? this.onLastRef : null }
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default injectIntl(PopupDialog);
