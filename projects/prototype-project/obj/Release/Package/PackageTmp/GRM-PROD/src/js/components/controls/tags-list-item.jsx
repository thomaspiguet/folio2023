import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Tag from './tag';

export default class TagsListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    itemCode: PropTypes.string,
    itemValue: PropTypes.string,
    itemDescription: PropTypes.string,
    singleItemSelected: PropTypes.bool,
    single: PropTypes.bool,
    onItemClick: PropTypes.func,
    onItemClose: PropTypes.func,
  };

  static defaultProps = {
    itemCode: 'code',
    itemDescription: 'description',
  };

  @autobind
  handleOnClick() {
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.item);
    }
  }

  @autobind
  handleOnClose() {
    if (this.props.onItemClose) {
      this.props.onItemClose(this.props.item);
    }
  }

  render() {
    const { single, singleItemSelected, item, itemDescription, itemCode, itemValue } = this.props;
    const itemText = (!single && singleItemSelected && item[itemDescription])
      ? `${ item[itemCode] } | ${ item[itemDescription] }`
      : (itemValue ? item[itemValue] : item[itemCode]);

    return (
      <Tag
        value={ itemText }
        onClick={ this.handleOnClick }
        onClose={ this.handleOnClose }
      />
    );
  }
}
