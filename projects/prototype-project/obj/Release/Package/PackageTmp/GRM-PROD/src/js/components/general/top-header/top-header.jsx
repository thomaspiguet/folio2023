import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import User from './user';
import Products from './products';

import './top-header.scss';

@connect(state => ({
  menuExpanded: state.sideMenu.menuExpanded,
  scenarioId: state.scenario.selectedScenario.scenarioId,
}), (dispatch) => bindActionCreators({
}, dispatch))
export default class TopHeader extends Component {
  render() {
    const logoSvg = ( 
      <object data="/assets/img/logo.svg" type="image/svg+xml" id="img">
        <img src="/assets/img/logo.svg" />
      </object>
    );

    const { menuExpanded, scenarioId } = this.props;

    return (
      <div className='top-header'>
        <div className='top-header__left'>
          <div className={ classNames('top-header__logo', { 'top-header__logo--collapsed': !menuExpanded }) } >
            <Link to={ `/${ scenarioId }/dashboard` }>
              {logoSvg}
            </Link>
          </div>
          <div className={ classNames('top-header__products', { 'top-header__products--collapsed': !menuExpanded }) } >
            <Products />
          </div>
        </div>
        <div className='top-header__right'>
          <div className='top-header__info'>13</div>
          <div className='top-header__delim' />
          <div className='top-header__user'><User /></div>
        </div>
      </div>
    );
  }
}
