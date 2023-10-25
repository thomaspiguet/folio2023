import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

import { ScrollBox } from '../general/scroll-box';

import OptionsListItem from './options-list-item';

import './styled-dropdown.scss';
import './options-list.scss';

export default class OptionsList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemCode: PropTypes.string,
    itemDescription: PropTypes.string,
    selectedItems: PropTypes.array.isRequired,
    onItemClick: PropTypes.func.isRequired,
    showDescriptionColumn: PropTypes.bool,
    isInputActive: PropTypes.bool,
    uniqueId: PropTypes.string.isRequired,
    styleModifier: PropTypes.string,
  };

  static defaultProps = {
    items: [],
    selectedItems: [],
    itemCode: 'code',
    itemDescription: 'description',
    showDescriptionColumn: true,
    styleModifier: '',
    pageSize: 6,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentItem: 0,
    };
  }

  @autobind
  setItem(currentItem) {
    const { items } = this.props;
    if (currentItem >= items.length) {
      currentItem = items.length - 1;
    }
    if (currentItem < 0) {
      currentItem = 0;
    }
    this.setState({ currentItem });
  }

  render() {
    const { items, selectedItems, onItemClick, itemCode,
      itemDescription, showDescriptionColumn, uniqueId, styleModifier,
      setOptionsNode, exit, pageSize, isInputActive } = this.props;
    const { currentItem } = this.state;

    const listItems = items.map((item, index) => {
      const optionClassName = classNames('dropdown-option', `${ styleModifier }`, {
        'dropdown-option--selectable': true,
        'dropdown-option--selected': selectedItems.find(sel => (sel[uniqueId] === item[uniqueId])),
        'dropdown-option--active': index === currentItem,
      });

      return (
        <OptionsListItem
          key={ item.id || item[itemCode] }
          item={ item }
          active={ !isInputActive && index === currentItem }
          itemCode={ itemCode }
          setItem={ this.setItem }
          exit={ exit }
          index={ index }
          maxIndex={ items.length - 1 }
          itemDescription={ itemDescription }
          itemClassName={ optionClassName }
          onItemClick={ onItemClick }
          showDescriptionColumn={ showDescriptionColumn }
          styleModifier={ styleModifier }
          pageSize={ pageSize }
        />
      );
    });

    return (
      <ScrollBox style={ { height: '200px' } } >
        <div
          className='styled-dropdown__options-list'
          ref={ setOptionsNode }
        >
          { listItems }
        </div>
      </ScrollBox>
    );
  }
}
