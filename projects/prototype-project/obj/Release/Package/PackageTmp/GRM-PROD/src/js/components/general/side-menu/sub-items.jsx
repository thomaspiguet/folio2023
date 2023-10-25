import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';

import SubItem from './sub-item';

export default class SubItems extends Component {
  static propTypes = {
    item: PropTypes.object,
    selected: PropTypes.string,
    selectedSubItem: PropTypes.string,
    select: PropTypes.func,
    menuExpanded: PropTypes.bool,
    scenarioId: PropTypes.number,
  };

  render() {
    const item = this.props.item;
    return (
      <AnimateHeight
        className='side-menu__subitems'
        height={ item.expanded && this.props.menuExpanded ? 'auto' : 0 }
        duration={ 300 }
      >
        {
          item.items ? item.items.map((subItem) => (
            <SubItem
              item={ subItem }
              key={ subItem.id }
              parentId={ item.id }
              selected={ this.props.selected }
              selectedSubItem={ this.props.selectedSubItem }
              select={ this.props.select }
              menuExpanded={ this.props.menuExpanded }
              scenarioId={ this.props.scenarioId }
            />))
            : <div />
        }
      </AnimateHeight>
    );
  }
}
