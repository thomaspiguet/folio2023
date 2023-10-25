import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import { panelClose, popupAction } from './actions';
import { PopupAction } from './popup-action';

import './panel.scss';
import { focusKeyDown } from '../../../utils/components/keyboard';

@connect(state => ({
  options: state.popup.options,
  show: state.popup.showPanel,
}), (dispatch) => bindActionCreators({
  panelClose,
  popupAction,
}, dispatch))
class Panel extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    style: PropTypes.string,
    message: PropTypes.string,
    actions: PropTypes.array,
    onAction: PropTypes.func,
  };

  static defaultProps = {
    show: false,
  };

  @autobind
  onAction(action, func, arg) {
    const { popupAction, panelClose } = this.props;
    panelClose();
    if (action) {
      popupAction(action);
    }
    if (func) {
      func(arg);
    }
  }

  @autobind
  onShaderClick(event) {
    const { panelClose } = this.props;
    if (!this.isEventInBox(event)) {
      panelClose();
    }
  }

  isEventInBox(event) {
    const { firstNode } = this;
    if (!firstNode) {
      return false;
    }

    if (firstNode.contains(event.target)) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show && this.firstNode) {
      this.firstNode.focus();
    }
  }

  @autobind
  setFirstFocus() {
    if (this.firstNode) {
      this.firstNode.focus();
    }
  }

  @autobind
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
  onLastActionTab() {
    this.setFirstFocus();
  }

  @autobind
  onKeyDown(e) {
    focusKeyDown(e, { onShiftTab: this.setLastFocus });
  }

  render() {
    const { show, options: { actions, Body } } = this.props;

    return (
      <div className={ classNames('panel', { 'panel--show': show }) }>
        { show &&
          <div className='panel__paper' onClick={ this.onShaderClick }>
            <div className='panel__gradient' />
            <div
              className={ classNames('panel__box', { 'panel__box--show': show }) }
              tabIndex='0'
              ref={ this.onFirstRef }
              onKeyDown={ this.onKeyDown }
            >
              <div className={ 'panel__body' }>
                { Body }
              </div>
              <div className='panel__actions'>
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
          </div>
        }
      </div>
    );
  }
}

export default injectIntl(Panel);
