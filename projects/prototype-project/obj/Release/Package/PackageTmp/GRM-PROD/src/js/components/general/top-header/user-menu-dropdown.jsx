import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import { injectIntl, defineMessages } from 'react-intl';

import './user-menu-dropdown.scss';

const MIN_WIDTH = 100;
const BOX_SHIFT = 5;
const BOX_SHIFT_SIDE = 15;

defineMessages({
  profile: {
    id: 'user-menu.profile',
    defaultMessage: 'Profile',
  },
  logout: {
    id: 'user-menu.logout',
    defaultMessage: 'Logout',
  },
});

class UserMenuDropdown extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onLogout: PropTypes.func,
    getStickingNode: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  @autobind
  logout() {
    this.setExpanded(false);
    this.props.onLogout();
  }

  @autobind
  handleClickOutside(e) {
    if (!this.handleClickInside(e) && !this.arrowNode.contains(e.target)) {
      this.setExpanded(false);
    }
  }

  @autobind
  onUnhandledEvent(e) {
    if (!this.popupBoxNode) {
      return;
    }
    if (this.handleClickInside(e)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  handleClickInside(e) {
    const { popupBoxNode } = this;
    return (popupBoxNode && popupBoxNode.contains(e.target));
  }

  @autobind
  onToggle() {
    this.setExpanded(!this.state.expanded);
  }

  @autobind
  setExpanded(expanded) {
    this.setState({ expanded });

    if (expanded) {
      document.addEventListener('click', this.handleClickOutside, true);
      document.addEventListener('dragstart', this.onUnhandledEvent, true);
      document.addEventListener('dragstart', this.onUnhandledEvent, false);
      document.addEventListener('wheel', this.onUnhandledEvent, true);
      document.addEventListener('wheel', this.onUnhandledEvent, false);
      document.addEventListener('scroll', this.onUnhandledEvent, true);
      document.addEventListener('scroll', this.onUnhandledEvent, false);
    } else {
      document.removeEventListener('dragstart', this.onUnhandledEvent, true);
      document.removeEventListener('dragstart', this.onUnhandledEvent, false);
      document.removeEventListener('wheel', this.onUnhandledEvent, true);
      document.removeEventListener('wheel', this.onUnhandledEvent, false);
      document.removeEventListener('scroll', this.onUnhandledEvent, true);
      document.removeEventListener('scroll', this.onUnhandledEvent, false);
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  componentDidUpdate() {
    const stNode = this.props.getStickingNode();
    if (stNode && this.popupBoxNode && this.state.expanded) {
      const { right, bottom } = stNode.getBoundingClientRect();
      const { width: viewWidth, height: viewHeight } = document.body.getBoundingClientRect();
      const { width: optionsWidth, height: optionsHeight } = this.optionsNode.getBoundingClientRect();
      const dropdownWidth = Math.max(optionsWidth, MIN_WIDTH);
      const node = this.popupBoxNode;
      node.style.position = 'fixed';
      node.style.top = `${bottom + BOX_SHIFT}px`;
      node.style.bottom = `${viewHeight - (bottom + BOX_SHIFT) - optionsHeight}px`;
      node.style.right = `${viewWidth - right - BOX_SHIFT_SIDE}px`;
      node.style.left = `${right - dropdownWidth - BOX_SHIFT_SIDE}px`;
    }
  }

  render() {
    const { intl } = this.props;
    const { expanded } = this.state;

    return (
      <div className='user-menu'>
        <div className='user-menu__arrow' onClick={this.onToggle} ref={(node) => { this.arrowNode = node; }} >
          <i className='material-icons small-btn-icons-menu-arrow'>arrow_drop_down</i>
          <div className={classNames('user-menu__select', { 'user-menu__select--expanded': expanded })} >

            {expanded &&
              <div className='user-menu__box' ref={(node) => { this.popupBoxNode = node; }}>
                <div className='user-menu__options' ref={(node) => { this.optionsNode = node; }}>
                  <div className={classNames('user-menu__option', 'user-menu__option--profile')}>
                    <i className='material-icons small-btn-icons-menu-profile'>account_box</i>
                    <span>{intl.formatMessage({ id: 'user-menu.profile' })}</span>
                  </div>
                  <div
                    className={classNames('user-menu__option', 'user-menu__option--logout')}
                    onClick={this.logout}
                  >
                  <i className='material-icons small-btn-icons-menu-profile'>input</i>
                    <span>{intl.formatMessage({ id: 'user-menu.logout' })}</span>
                  </div>
                </div>
              </div>
            }
          </div>

        </div>
      </div>
    );
  }
}

export default injectIntl(UserMenuDropdown);
