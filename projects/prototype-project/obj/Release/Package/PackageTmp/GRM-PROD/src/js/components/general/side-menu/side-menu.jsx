import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

import { ScrollBox } from '../scroll-box/index';
import * as actions from './actions';
import { getBudgetOptions } from '../../../api/actions';
import './side-menu.scss';
import Item from './side-menu-item';
import { buildMenu } from './selectors';

@connect(state => ({
  menu: buildMenu(state),
  selected: state.sideMenu.selected,
  selectedSubItem: state.sideMenu.selectedSubItem,
  menuExpanded: state.sideMenu.menuExpanded,
  budgetOptions: state.dashboard.budgetOptions,
  scenarioId: state.scenario.selectedScenario.scenarioId,
}), (dispatch) => bindActionCreators({
  select: actions.selectSideMenu,
  toggleExpand: actions.toggleExpand,
  toggleExpandMenu: actions.toggleExpandMenu,
  getBudgetOptions,
}, dispatch))
export default class SideMenu extends Component {
  static propTypes = {
    select: PropTypes.func,
    toggleExpand: PropTypes.func,
    menu: PropTypes.object,
    menuExpanded: PropTypes.bool,
    selected: PropTypes.string,
    selectedSubItem: PropTypes.string,
    toggleExpandMenu: PropTypes.func,
    scenarioId: PropTypes.number,
  };

  render() {
    const items = this.props.menu.map((item) => (
      <Item
        item={item}
        key={item.id}
        selected={this.props.selected}
        selectedSubItem={this.props.selectedSubItem}
        select={this.props.select}
        toggleExpand={this.props.toggleExpand}
        menuExpanded={this.props.menuExpanded}
        scenarioId={this.props.scenarioId}
      />
    ));

    const toggleClassNames = classnames('side-menu__toggle', {
      'side-menu__toggle--expanded': this.props.menuExpanded,
    });
    const moduleClassNames = classnames('side-menu__module', {
      'side-menu__module--hidden': !this.props.menuExpanded,
    });
    const moduleMenuClassNames = classnames('side-menu__module-menu', {
      'side-menu__module-menu--hidden': !this.props.menuExpanded,
    });
    const textClassNames = classnames('side-menu__name', {
      'side-menu__name--hidden': !this.props.menuExpanded,
    });

    return (
      <div className={classnames('side-menu', {
        'side-menu--expanded': this.props.menuExpanded,
      })}
      >
        <ScrollBox style={{ height: '100%' }}>
          <div className='side-menu__toggle-block' >
            <div className={moduleClassNames} >
              <i className='material-icons small-btn-icons small-btn-icons-budget'>monetization_on</i>
              <div className={textClassNames}>
                <FormattedMessage id='side-menu.budget' defaultMessage='budget' />
              </div>
            </div>
            <div className={moduleMenuClassNames}>
            {
              moduleMenuClassNames === 'side-menu__module-menu--hidden' ? 
              <i className='material-icons small-btn-icons-arrow-hidden'>arrow_drop_down</i> :
              <i className='material-icons small-btn-icons-arrow'>arrow_drop_down</i>
            }
            </div>

            <div className={toggleClassNames} onClick={() => this.props.toggleExpandMenu()} />
          </div>
          <div className='side-menu__items'>
            {items}
          </div>
        </ScrollBox>
      </div>
    );
  }
}
