import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

export default class OptionsListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    itemCode: PropTypes.string,
    itemDescription: PropTypes.string,
    itemClassName: PropTypes.string,
    onItemClick: PropTypes.func.isRequired,
    showDescriptionColumn: PropTypes.bool,
    styleModifier: PropTypes.string,
    setItem: PropTypes.func.isRequired,
    exit: PropTypes.func,
    index: PropTypes.number,
    maxIndex: PropTypes.number,
  };

  static defaultProps = {
    styleModifier: '',
  };

  @autobind
  handleOnClick(e) {
    this.props.onItemClick(this.props.item);
    e.preventDefault();
    e.stopPropagation();
  }

  @autobind
  toShortString(str, num) {
    if (str.length >= num) {
      return `${ str.slice(0, num) }...`;
    }
    return str;
  }

  @autobind
  onMouseEnter(e) {
    const { setItem, index } = this.props;
    setItem(index);
  }

  @autobind
  onKeyDown(e) {
    const { key } = e;
    const { setItem, index, maxIndex, exit, onItemClick, item, pageSize } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (key === 'ArrowDown') {
      setItem(index + 1);
    } else if (key === 'ArrowUp') {
      setItem(index - 1);
    } else if (key === 'Home') {
      setItem(0);
    } else if (key === 'End') {
      setItem(maxIndex);
    } else if (key === 'PageUp') {
      setItem(index - pageSize);
    } else if (key === 'PageDown') {
      setItem(index + pageSize);
    } else if (key === 'Enter') {
      onItemClick(item);
    } else if (key === 'Escape' && exit) {
      exit();
    }
  }

  componentDidUpdate() {
    const { active } = this.props;
    if (active && this.node) {
      this.node.focus();
    }
  }

  render() {
    const { item, itemClassName } = this.props;

    return (
      <div
        className={ itemClassName }
        value={ item }
        key={ item.id }
        onMouseDown={ this.handleOnClick }
        onMouseEnter={ this.onMouseEnter }
        onKeyDown={ this.onKeyDown }
        ref={ (node) => { this.node = node; } }
        tabIndex='0'
      >
        { this.renderCode(item) }
        { this.renderDescription(item) }
      </div>
    );
  }

  renderCode(item) {
    const limitSymbolsCode = 15;

    return (
      <span className={ `dropdown-option__code ${ this.props.styleModifier }__code` }>
        { item[this.props.itemCode] ? this.toShortString(item[this.props.itemCode], limitSymbolsCode) : '' }
      </span>
    );
  }

  renderDescription(item) {
    const limitSymbolsDescr = 30;

    if (this.props.showDescriptionColumn) {
      return (
        <span className={ `dropdown-option__description ${ this.props.styleModifier }__description` }>
          { item[this.props.itemDescription] ? this.toShortString(item[this.props.itemDescription], limitSymbolsDescr) : '' }
        </span>
      );
    }
    return null;
  }
}
