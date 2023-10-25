import React, { Component } from 'react';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import CSSTransition from 'react-transition-group/CSSTransition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { map } from 'lodash';
import AnimateHeight from 'react-animate-height';
import { injectIntl } from 'react-intl';

import './products.scss';
import { toggleProductsMenu, toggleDomain } from '../../../features/app/actions';
import { PopupActionKind, PopupStyle } from '../../general/popup/constants';
import { popupOpen } from '../popup/actions';

const TRANSITION_TIMEOUT = 700;

@connect(state => ({
  menuExpanded: state.sideMenu.menuExpanded,
  expanded: state.app.products.expanded,
  productsItems: state.app.productsItems,
  productsExpanded: state.app.productsExpanded,
  editMode: state.app.editMode,
}), (dispatch) => bindActionCreators({
  toggleProductsMenu,
  toggleDomain,
  popupOpen,
}, dispatch))
class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  @autobind
  onTop() {
    const { editMode, intl } = this.props;
    if (editMode) {
      const { popupOpen } = this.props;
      const message = intl.formatMessage({ id: 'required-attendance.disable-change-route' });
      popupOpen({
        style: PopupStyle.confirm,
        message,
        actions: [
          { kind: PopupActionKind.ok },
        ],
      });
      return;
    }
    this.props.toggleProductsMenu();
  }

  @autobind
  onEnteredTransition() {
    this.setState({ expanded: true });
  }

  @autobind
  onExitedTransition() {
    this.setState({ expanded: false });
  }

  @autobind
  onExpand(name) {
    this.props.toggleDomain(name);
  }

  renderApplications(applications, expanded) {
    const apps = map(applications, (app) => {
      const { ApplicationName, ApplicationUrl, Env } = app;
      const name = [ApplicationName, Env].join(' ');
      return (
        <div className='products__application' key={ name } >
          <a
            className='products__application-link'
            href={ ApplicationUrl }
          >
            { name }
          </a>
        </div>
      );
    });

    return (
      <AnimateHeight
        className='products__applications'
        height={ expanded ? 'auto' : 0 }
        duration={ 300 }
      >
        { apps }
      </AnimateHeight>
    );
  }


  renderMenu() {
    const { productsItems, productsExpanded } = this.props;

    const domains = map(productsItems.Domains, (domain) => {
      const { DomainName } = domain;
      const expanded = productsExpanded[DomainName];
      const haveApplications = domain.Applications.length > 1;
      const firstApplication = domain.Applications.length === 1 ? domain.Applications[0] : null;

      return (
        <div className='products__domain' key={ DomainName } >
          <div className='products__domain-menu' >
            <div className={ classNames('products__domain-icon', `products__domain-icon--${ DomainName }`) } />
            { firstApplication ?
              <a
                className='products__application-link products__application-link--domain'
                href={ firstApplication.ApplicationUrl }
              >
                { DomainName }
              </a>
              :
              <div className='products__domain-title' onClick={ this.onExpand.bind(this, DomainName) }>
                { DomainName }
              </div>
            }
            <div
              className={ classNames('products__domain-expander', {
                'products__domain-expander--expanded': expanded,
                'products__domain-expander--visible': haveApplications,
              }) }
              onClick={ this.onExpand.bind(this, DomainName) }
            />
          </div>
          { this.renderApplications(domain.Applications, expanded) }
        </div>
      );
    });

    return (
      <div className={ 'products__domains' } >
        { domains }
      </div>
    );
  }

  render() {
    const { menuExpanded, expanded } = this.props;
    return (
      <div className='products'>
        <div className='products__button' onClick={ this.onTop } >
          <div
            className={ classNames('products__icon', {
              'products__icon--collapsed': !menuExpanded,
              'products__icon--expanded': expanded,
            }) }
          />
        </div>
        <CSSTransition
          in={ expanded }
          timeout={ TRANSITION_TIMEOUT }
          classNames={ {
            enter: 'products__menu--enter',
            enterActive: 'products__menu--enter-active',
            exit: 'products__menu--exit',
            exitActive: 'products__menu--exit-active',
          } }
          onEntered={ this.onEnteredTransition }
          onExited={ this.onExitedTransition }
        >
          <div className={ classNames('products__menu', { 'products__menu--expanded': this.state.expanded }) }>
            { this.renderMenu() }
          </div>
        </CSSTransition>
        <CSSTransition
          in={ expanded }
          timeout={ TRANSITION_TIMEOUT }
          classNames={ {
            enter: 'products__overlay--enter',
            enterActive: 'products__overlay--enter-active',
            exit: 'products__overlay--exit',
            exitActive: 'products__overlay--exit-active',
          } }
        >
          <div
            className={ classNames('products__overlay', { 'products__overlay--expanded': this.state.expanded }) }
            onClick={ this.onTop }
          />
        </CSSTransition>
      </div>
    );
  }
}

export default injectIntl(Products);
