import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defineMessages } from 'react-intl';

import UserMenuDropdown from './user-menu-dropdown';
import { doLogout } from '../../../features/app/actions';
import { popupOpen } from '../popup/actions';
import { PopupType } from '../popup/constants';

import './user.scss';

defineMessages({
  signout: {
    id: 'user-menu.signingout',
    defaultMessage: 'Signing out...',
  },
});

@connect(state => ({
  user: state.app.user,
}), (dispatch) => bindActionCreators({
  popupOpen,
}, dispatch))
export default class User extends Component {
  static propTypes = {
    name: PropTypes.string,
    jobTitle: PropTypes.string,
    initials: PropTypes.string,
  };

  static defaultProps = {
    name: 'Grace Strokes',
    jobTitle: 'Manager',
    initials: 'GS',
  };

  @autobind
  getStickingNode() {
    return this.menuNode;
  }

  @autobind
  logout() {
    const { popupOpen } = this.props;
    const options = {
      message: 'user-menu.signingout',
    };
    popupOpen(options, PopupType.spinner);
    doLogout(null, false);
  }

  render() {
    return (
      <div className='user' ref={ (node) => { this.menuNode = node; } }>
        <div className='user__photo'>
          <div className='user__img'>{ this.props.user.initials }</div>
        </div>
        <div className='user__info'>
          <div className='user__name'>{ this.props.user.displayName }</div>
          <div className='user__job-title'>{ this.props.jobTitle }</div>
        </div>
        <UserMenuDropdown getStickingNode={ this.getStickingNode } onLogout={ this.logout } />
      </div>
    );
  }
}
